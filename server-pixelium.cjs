const DEFAULT_PIXELIUM_API = 'https://olivier-signage-cockpit-production.up.railway.app/api/pixelium';
const PIXELIUM_API_URL = String(process.env.PIXELIUM_QUOTE_API_URL || DEFAULT_PIXELIUM_API).replace(/\/$/, '');
const COMMERCE_BRIDGE_KEY = process.env.COMMERCE_BRIDGE_KEY || '';
const DEFAULT_COMMERCIAL_CODE = String(process.env.PIXELIUM_PAGE_COMMERCIAL_CODE || 'JP').trim().toUpperCase();
const requestLimits = new Map();

function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
}

function allowed(req) {
  const ip = String(req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').split(',')[0].trim();
  const now = Date.now();
  const current = requestLimits.get(ip);
  if (!current || current.resetAt <= now) {
    requestLimits.set(ip, { count: 1, resetAt: now + 15 * 60_000 });
    return true;
  }
  current.count += 1;
  return current.count <= 8;
}

async function readBody(req, max = 128 * 1024) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > max) throw new Error('Payload trop volumineux');
    chunks.push(chunk);
  }
  return chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {};
}

function clean(value, max = 255) {
  return String(value || '').trim().slice(0, max);
}

function normalize(body, req) {
  const firstName = clean(body.firstName || body.prenom, 120);
  const lastName = clean(body.lastName || body.nom, 120);
  const email = clean(body.email, 254).toLowerCase();
  const phone = clean(body.phone || body.telephone, 80);
  if (!firstName || !lastName || !email || !phone) throw new Error('Coordonnées incomplètes');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Adresse e-mail invalide');

  const need = clean(body.need, 180).toLowerCase();
  const rawPack = clean(body.pack || body.offerCode || body.offer, 40).toLowerCase();
  const legacyPack = rawPack || (need.includes('festival') ? 'festival' : 'annual');
  const offerCode = legacyPack === 'festival' ? 'festival' : 'annual';
  let billingMode = clean(body.billingMode, 40).toLowerCase();
  if (!billingMode) billingMode = offerCode === 'festival' ? 'one_off' : 'monthly';

  const message = clean(body.message, 4000);
  const visualCreation = body.visualCreation === true || body.creationVisuelle === true || message.includes('Création Visuelle Animée demandée');
  const rgpdAccepted = body.rgpdAccepted === true || body.rgpd === true || body.consentRgpd === true;
  const externalId = clean(body.externalId || body.submissionId, 120);

  return {
    externalId,
    firstName,
    lastName,
    company: clean(body.company || body.entreprise, 180),
    email,
    phone,
    message,
    offerCode,
    billingMode,
    visualCreation,
    rgpdAccepted,
    commercialCode: DEFAULT_COMMERCIAL_CODE,
    page: '/#devis',
    referral: 'pixelium-espace-c',
    userAgent: clean(req.headers['user-agent'], 500),
  };
}

async function handlePixeliumRequest(req, res, pathname) {
  if (req.method !== 'POST' || pathname !== '/api/pixelium/quote-request') return false;
  try {
    if (!allowed(req)) return json(res, 429, { error: 'Trop de demandes. Réessayez dans quelques minutes.' }), true;
    if (!COMMERCE_BRIDGE_KEY) return json(res, 503, { error: 'Passerelle de devis non configurée' }), true;
    const body = normalize(await readBody(req), req);
    if (!body.rgpdAccepted) return json(res, 400, { error: 'Consentement RGPD requis' }), true;

    const upstream = await fetch(`${PIXELIUM_API_URL}/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-commerce-key': COMMERCE_BRIDGE_KEY,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15_000),
    });
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) throw new Error(data.error || `Cockpit Pixelium HTTP ${upstream.status}`);
    return json(res, 201, {
      success: true,
      reference: data.reference,
      quoteSendAt: data.quoteSendAt,
    }), true;
  } catch (error) {
    console.error('[pixelium quote request]', error.message);
    return json(res, 503, { error: 'Votre demande n’a pas pu être enregistrée. Merci de réessayer.' }), true;
  }
}

module.exports = { handlePixeliumRequest };