import { DatabaseSync } from 'node:sqlite';
import {
  randomBytes,
  randomUUID,
  createHash,
  timingSafeEqual,
} from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';
import Stripe from 'stripe';

export const OFFERS = Object.freeze({
  'video-1': { name: 'Film Essentiel · 1 minute', amount: 4999, duration: 60 },
  'video-3': {
    name: 'Film Signature · 3 minutes',
    amount: 10000,
    duration: 180,
  },
});
const hash = (value) => createHash('sha256').update(value).digest('hex');
const equal = (a, b) =>
  typeof a === 'string' &&
  typeof b === 'string' &&
  a.length === b.length &&
  timingSafeEqual(Buffer.from(a), Buffer.from(b));
const fail = (status, message) => Object.assign(new Error(message), { status });
async function body(req, max = 16000) {
  const chunks = [];
  let size = 0;
  for await (const part of req) {
    size += part.length;
    if (size > max) throw fail(413, 'Fichier ou demande trop volumineux.');
    chunks.push(part);
  }
  return Buffer.concat(chunks);
}
const jsonBody = async (req) => {
  try {
    return JSON.parse((await body(req)).toString());
  } catch (e) {
    if (e.status) throw e;
    throw fail(400, 'Demande invalide.');
  }
};
const send = (res, code, data) => {
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Robots-Tag': 'noindex',
  });
  res.end(JSON.stringify(data));
};
export function createCommerce({ env = process.env, stripeClient } = {}) {
  const enabled = env.VIDEO_COMMERCE_TEST === 'true';
  let db;
  const dir = resolve(env.VIDEO_DATA_DIR || '.private-video-test');
  if (enabled) {
    if (/^(sk|rk|rkcs)_live_/.test(env.STRIPE_TEST_SECRET_KEY || ''))
      throw new Error('Live payments are forbidden');
    if (!relative(resolve('dist'), dir).startsWith('..'))
      throw new Error('Private storage must be outside dist');
    mkdirSync(join(dir, 'media'), { recursive: true });
    db = new DatabaseSync(join(dir, 'orders.sqlite'));
    db.exec(
      'PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, token TEXT NOT NULL, data TEXT NOT NULL); CREATE TABLE IF NOT EXISTS events (id TEXT PRIMARY KEY);',
    );
  }
  const stripe =
    stripeClient ||
    (enabled && /^(sk|rk|rkcs)_test_/.test(env.STRIPE_TEST_SECRET_KEY || '')
      ? new Stripe(env.STRIPE_TEST_SECRET_KEY, {
          maxNetworkRetries: 2,
          timeout: 15000,
        })
      : null);
  const get = (id) => {
    const row = db.prepare('SELECT * FROM orders WHERE id=?').get(id);
    if (!row) throw fail(404, 'Commande introuvable.');
    return { ...JSON.parse(row.data), tokenHash: row.token };
  };
  const save = (order) => {
    const { tokenHash, ...data } = order;
    db.prepare('INSERT OR REPLACE INTO orders VALUES (?,?,?)').run(
      order.id,
      tokenHash,
      JSON.stringify(data),
    );
  };
  const all = () =>
    db
      .prepare('SELECT id FROM orders')
      .all()
      .map((row) => get(row.id));
  const auth = (req, order) => {
    const token = String(req.headers.authorization || '').replace(
      /^Bearer /,
      '',
    );
    if (!equal(hash(token), order.tokenHash))
      throw fail(403, 'Accès privé invalide.');
  };
  const admin = (req) => {
    if (
      !env.VIDEO_INTERNAL_KEY ||
      env.VIDEO_INTERNAL_KEY.length < 32 ||
      !equal(req.headers.authorization, `Bearer ${env.VIDEO_INTERNAL_KEY}`)
    )
      throw fail(403, 'Accès réservé.');
  };
  const publicOrder = (o) => ({
    id: o.id,
    offer: OFFERS[o.offer],
    status: o.status,
    payment: o.payment,
    created: o.created,
    complete: !!o.completeAt,
    files: o.files.map(({ id, name, size }) => ({ id, name, size })),
    downloadable:
      ['client_review', 'delivered'].includes(o.status) && !!o.result,
    feedback: o.feedback || '',
    deadline: null,
  });
  const eligible = (o) =>
    o.payment === 'paid' &&
    o.files.length > 0 &&
    ['paid', 'collecting', 'revision_requested'].includes(o.status);
  return async (req, res, pathname) => {
    if (!pathname.startsWith('/api/video/')) return false;
    res.setHeader('Referrer-Policy', 'no-referrer');
    try {
      if (pathname === '/api/video/catalog' && req.method === 'GET') {
        send(res, 200, {
          offers: OFFERS,
          test: true,
          enabled,
          checkoutReady: !!stripe,
          promise24h: false,
        });
        return true;
      }
      if (!enabled)
        throw fail(
          503,
          'Les commandes sont en préparation. Contactez le studio.',
        );
      const origin = req.headers.origin;
      if (origin && origin !== env.VIDEO_PUBLIC_ORIGIN)
        throw fail(403, 'Origine non autorisée.');
      if (pathname === '/api/video/orders' && req.method === 'POST') {
        const b = await jsonBody(req);
        if (
          !OFFERS[b.offer] ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email || '') ||
          String(b.email).length > 254 ||
          typeof b.name !== 'string' ||
          !b.name.trim() ||
          b.name.length > 100 ||
          ![
            'Mariage',
            'Anniversaire',
            'Baptême / communion',
            'Événement professionnel',
            'Autre',
          ].includes(b.event) ||
          !['Émotion', 'Dynamique', 'Cinéma'].includes(b.mood) ||
          !['16:9', '9:16', '1:1'].includes(b.format) ||
          typeof b.brief !== 'string' ||
          b.brief.length < 10 ||
          b.brief.length > 4000 ||
          b.consent !== true
        )
          throw fail(400, 'Complétez le brief et les autorisations.');
        const token = randomBytes(32).toString('hex');
        const o = {
          id: randomUUID(),
          tokenHash: hash(token),
          offer: b.offer,
          customer: { name: b.name.trim(), email: b.email },
          brief: b.brief,
          event: b.event,
          mood: b.mood,
          format: b.format,
          consentAt: new Date().toISOString(),
          consentVersion: 'video-test-2026-11-12',
          created: new Date().toISOString(),
          files: [],
          payment: 'unpaid',
          status: 'collecting',
          revision: 0,
        };
        save(o);
        send(res, 201, { ...publicOrder(o), token });
        return true;
      }
      if (pathname === '/api/video/webhook' && req.method === 'POST') {
        if (!stripe || !env.STRIPE_TEST_WEBHOOK_SECRET)
          throw fail(503, 'Webhook non configuré.');
        const raw = await body(req, 1000000);
        let event;
        try {
          event = stripe.webhooks.constructEvent(
            raw,
            req.headers['stripe-signature'],
            env.STRIPE_TEST_WEBHOOK_SECRET,
          );
        } catch {
          throw fail(400, 'Signature invalide.');
        }
        if (event.livemode !== false) throw fail(400, 'Événement réel refusé.');
        if (db.prepare('SELECT id FROM events WHERE id=?').get(event.id)) {
          send(res, 200, { received: true });
          return true;
        }
        const session = event.data.object;
        if (
          [
            'checkout.session.completed',
            'checkout.session.async_payment_succeeded',
            'checkout.session.async_payment_failed',
            'checkout.session.expired',
          ].includes(event.type)
        ) {
          const o = get(session.client_reference_id);
          if (
            session.id !== o.sessionId ||
            session.currency !== 'eur' ||
            session.amount_total !== OFFERS[o.offer].amount ||
            session.metadata?.order_id !== o.id
          )
            throw fail(400, 'Paiement incohérent.');
          db.exec('BEGIN IMMEDIATE');
          try {
            if (
              [
                'checkout.session.completed',
                'checkout.session.async_payment_succeeded',
              ].includes(event.type) &&
              session.payment_status === 'paid'
            ) {
              o.payment = 'paid';
              if (o.status === 'collecting') o.status = 'paid';
            } else if (
              o.payment !== 'paid' &&
              event.type === 'checkout.session.async_payment_failed'
            )
              o.payment = 'failed';
            else if (
              o.payment !== 'paid' &&
              event.type === 'checkout.session.expired'
            )
              o.payment = 'expired';
            save(o);
            db.prepare('INSERT INTO events VALUES (?)').run(event.id);
            db.exec('COMMIT');
          } catch (e) {
            db.exec('ROLLBACK');
            throw e;
          }
        }
        send(res, 200, { received: true });
        return true;
      }
      if (pathname === '/api/video/internal/orders' && req.method === 'GET') {
        admin(req);
        send(
          res,
          200,
          all().map((o) => ({
            ...publicOrder(o),
            customer: o.customer,
            brief: o.brief,
            event: o.event,
            mood: o.mood,
            format: o.format,
            eligible: eligible(o),
          })),
        );
        return true;
      }
      const match = pathname.match(
        /^\/api\/video\/(orders|internal)\/([a-f0-9-]{36})(?:\/(checkout|files|complete|review|download|claim|result|approve))?(?:\/([a-f0-9-]{36}))?$/,
      );
      if (!match) throw fail(404, 'Ressource introuvable.');
      const [, scope, id, action, fileId] = match;
      let o = get(id);
      if (scope === 'internal') admin(req);
      else auth(req, o);
      if (!action && req.method === 'GET' && scope === 'orders') {
        send(res, 200, publicOrder(o));
        return true;
      }
      if (
        action === 'checkout' &&
        req.method === 'POST' &&
        scope === 'orders'
      ) {
        if (!stripe || !env.VIDEO_PUBLIC_ORIGIN)
          throw fail(
            503,
            'Paiement de test indisponible. Votre brief est conservé.',
          );
        if (!o.files.length || !o.completeAt)
          throw fail(409, 'Transmettez vos médias et confirmez votre brief.');
        if (o.payment === 'paid')
          throw fail(409, 'Cette commande est déjà réglée.');
        if (
          o.sessionId &&
          o.sessionExpires * 1000 > Date.now() &&
          !['failed', 'expired'].includes(o.payment)
        ) {
          send(res, 200, { url: o.checkoutUrl });
          return true;
        }
        const attempt = o.attempt || 0;
        const session = await stripe.checkout.sessions.create(
          {
            mode: 'payment',
            customer_email: o.customer.email,
            client_reference_id: o.id,
            metadata: { order_id: o.id },
            line_items: [
              {
                quantity: 1,
                price_data: {
                  currency: 'eur',
                  unit_amount: OFFERS[o.offer].amount,
                  product_data: { name: OFFERS[o.offer].name },
                },
              },
            ],
            success_url: `${env.VIDEO_PUBLIC_ORIGIN}/espace-video?retour=paiement`,
            cancel_url: `${env.VIDEO_PUBLIC_ORIGIN}/espace-video?retour=annulation`,
          },
          { idempotencyKey: `video-${o.id}-${attempt}` },
        );
        if (
          session.livemode !== false ||
          !session.url?.startsWith('https://checkout.stripe.com/')
        )
          throw fail(502, 'Session de test invalide.');
        o = get(id);
        o.sessionId = session.id;
        o.checkoutUrl = session.url;
        o.sessionExpires = session.expires_at;
        o.attempt = attempt + 1;
        save(o);
        send(res, 200, { url: session.url });
        return true;
      }
      if (
        ((action === 'files' && scope === 'orders') ||
          (action === 'result' && scope === 'internal')) &&
        req.method === 'POST'
      ) {
        if (action === 'files' && (o.completeAt || o.files.length >= 30))
          throw fail(409, 'Dossier complet ou limite de 30 fichiers atteinte.');
        if (
          action === 'result' &&
          !['production', 'revision_requested', 'internal_review'].includes(
            o.status,
          )
        )
          throw fail(409, 'Production non ouverte.');
        const bytes = await body(req, 64 * 1024 * 1024);
        const type = bytes.subarray(0, 3).equals(Buffer.from([255, 216, 255]))
          ? 'image/jpeg'
          : bytes
                .subarray(0, 8)
                .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
            ? 'image/png'
            : bytes.subarray(4, 8).toString() === 'ftyp'
              ? 'video/mp4'
              : null;
        if (!type || (action === 'result' && type !== 'video/mp4'))
          throw fail(400, 'Formats acceptés : JPEG, PNG et MP4.');
        o = get(id);
        if (
          action === 'files' &&
          (o.completeAt ||
            o.files.length >= 30 ||
            o.files.reduce((n, f) => n + f.size, 0) + bytes.length >
              512 * 1024 * 1024)
        )
          throw fail(
            409,
            'Limite du dossier atteinte ou dossier déjà confirmé.',
          );
        const fid = randomUUID();
        const name = String(req.headers['x-file-name'] || 'media')
          .replace(/[^a-zA-Z0-9._ -]/g, '_')
          .slice(0, 120);
        writeFileSync(join(dir, 'media', fid), bytes, {
          flag: 'wx',
          mode: 0o600,
        });
        const file = { id: fid, name, size: bytes.length, type };
        try {
          if (action === 'result') {
            o.result = file;
            o.status = 'internal_review';
            o.revision += 1;
          } else o.files.push(file);
          save(o);
        } catch (e) {
          unlinkSync(join(dir, 'media', fid));
          throw e;
        }
        send(res, 201, { id: fid });
        return true;
      }
      if (
        action === 'complete' &&
        req.method === 'POST' &&
        scope === 'orders'
      ) {
        if (!o.files.length) throw fail(409, 'Ajoutez au moins un média.');
        o.completeAt ||= new Date().toISOString();
        save(o);
        send(res, 200, publicOrder(o));
        return true;
      }
      if (action === 'claim' && req.method === 'POST' && scope === 'internal') {
        if (!o.completeAt || !eligible(o))
          throw fail(409, 'Commande non éligible.');
        o.status = 'production';
        save(o);
        send(res, 200, {
          ...publicOrder(o),
          brief: o.brief,
          event: o.event,
          mood: o.mood,
          format: o.format,
        });
        return true;
      }
      if (
        action === 'approve' &&
        req.method === 'POST' &&
        scope === 'internal'
      ) {
        if (o.status !== 'internal_review' || !o.result)
          throw fail(409, 'Validation interne requise.');
        o.status = 'client_review';
        o.approvedRevision = o.revision;
        save(o);
        send(res, 200, { approved: true });
        return true;
      }
      if (action === 'review' && req.method === 'POST' && scope === 'orders') {
        const b = await jsonBody(req);
        if (o.status !== 'client_review' || o.approvedRevision !== o.revision)
          throw fail(409, 'Version non disponible à la validation.');
        if (b.decision === 'approve') o.status = 'delivered';
        else if (
          b.decision === 'changes' &&
          typeof b.feedback === 'string' &&
          b.feedback.trim().length >= 5 &&
          b.feedback.length <= 2000
        ) {
          o.status = 'revision_requested';
          o.feedback = b.feedback.trim();
        } else throw fail(400, 'Précisez votre demande.');
        save(o);
        send(res, 200, publicOrder(o));
        return true;
      }
      if (
        (action === 'download' || (action === 'files' && fileId)) &&
        req.method === 'GET'
      ) {
        if (
          scope === 'orders' &&
          (action !== 'download' ||
            !['client_review', 'delivered'].includes(o.status) ||
            o.approvedRevision !== o.revision)
        )
          throw fail(403, 'Version en cours de préparation.');
        const file =
          action === 'files' ? o.files.find((f) => f.id === fileId) : o.result;
        if (!file) throw fail(404, 'Fichier introuvable.');
        const bytes = readFileSync(join(dir, 'media', file.id));
        res.writeHead(200, {
          'Content-Type': file.type,
          'Content-Length': bytes.length,
          'Content-Disposition': `attachment; filename="${action === 'download' ? 'JS-InnovIA-film.mp4' : file.name}"`,
          'Cache-Control': 'no-store',
        });
        res.end(bytes);
        return true;
      }
      throw fail(405, 'Action non autorisée.');
    } catch (e) {
      send(res, e.status || 503, {
        error: e.status
          ? e.message
          : 'Service temporairement indisponible. Réessayez.',
      });
      return true;
    }
  };
}
