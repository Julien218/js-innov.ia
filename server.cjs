const crypto = require('crypto');

const SITE_URL = (process.env.SITE_URL || 'https://jsinnovia.com').replace(/\/$/, '');
const COCKPIT_COMMERCE_URL = (process.env.COCKPIT_COMMERCE_URL || 'https://cockpit.jsinnovia.com/api/commerce').replace(/\/$/, '');
const COMMERCE_BRIDGE_KEY = process.env.COMMERCE_BRIDGE_KEY || '';
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
const STRIPE_API_VERSION = '2026-06-24.dahlia';
const checkoutRateLimits = new Map();

const PRICE_MAP = {
  signage: {
    monthly: process.env.STRIPE_PRICE_SIGNAGE_MONTHLY || '',
    setup: process.env.STRIPE_PRICE_SIGNAGE_SETUP || process.env.STRIPE_PRICE_INSTALLATION || '',
  },
  'signage-surveillance': {
    monthly: process.env.STRIPE_PRICE_SIGNAGE_SURVEILLANCE_MONTHLY || '',
    setup: process.env.STRIPE_PRICE_SIGNAGE_SURVEILLANCE_SETUP || process.env.STRIPE_PRICE_INSTALLATION || '',
  },
};

function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
}

function checkoutAllowed(req) {
  const ip = String(req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').split(',')[0].trim();
  const now = Date.now(), windowMs = 15 * 60 * 1000, current = checkoutRateLimits.get(ip);
  if (!current || now - current.startedAt > windowMs) { checkoutRateLimits.set(ip, { startedAt: now, count: 1 }); return true; }
  current.count += 1;
  return current.count <= 5;
}

function integrationIdentifier() {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const bytes = crypto.randomBytes(8);
  return `jsinnovia_${Array.from(bytes, value => alphabet[value % alphabet.length]).join('')}`;
}

function readBody(req, max = 256 * 1024) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > max) {
        reject(new Error('Payload trop volumineux'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function validateQuestionnaire(input) {
  const packageId = String(input.packageId || '');
  if (!PRICE_MAP[packageId]) throw new Error('Offre inconnue');
  for (const key of ['company', 'contactName', 'email', 'phone', 'installationAddress']) {
    if (!String(input[key] || '').trim()) throw new Error(`Champ requis : ${key}`);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(input.email))) throw new Error('Email invalide');
  if (input.privacyAccepted !== true) throw new Error('Consentement requis');
  const screenCount = Number(input.screenCount || 0);
  if (!Number.isInteger(screenCount) || screenCount < 1 || screenCount > 50) throw new Error('Nombre d’écrans invalide');
  if (packageId === 'signage-surveillance') {
    const cameraCount = Number(input.cameraCount || 0);
    if (!Number.isInteger(cameraCount) || cameraCount < 1 || cameraCount > 64) throw new Error('Nombre de caméras invalide');
  }
  return {
    ...input,
    packageId,
    company: String(input.company).trim().slice(0, 160),
    contactName: String(input.contactName).trim().slice(0, 160),
    email: String(input.email).trim().toLowerCase().slice(0, 254),
    phone: String(input.phone).trim().slice(0, 60),
    installationAddress: String(input.installationAddress).trim().slice(0, 300),
    screenCount,
    cameraCount: Number(input.cameraCount || 0),
  };
}

async function cockpitPost(endpoint, payload) {
  if (!COMMERCE_BRIDGE_KEY) throw new Error('Passerelle cockpit non configurée');
  const response = await fetch(`${COCKPIT_COMMERCE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-commerce-key': COMMERCE_BRIDGE_KEY },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15000),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Cockpit HTTP ${response.status}`);
  return data;
}

async function stripeRequest(resource, params, idempotencyKey) {
  if (!STRIPE_SECRET_KEY) throw new Error('Stripe non configuré');
  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    body.append(key, String(value));
  }
  const response = await fetch(`https://api.stripe.com/v1/${resource}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Stripe-Version': STRIPE_API_VERSION,
      ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
    },
    body,
    signal: AbortSignal.timeout(20000),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error?.message || `Stripe HTTP ${response.status}`);
  return data;
}

async function stripeGet(resource) {
  if (!STRIPE_SECRET_KEY) throw new Error('Stripe non configuré');
  const response = await fetch(`https://api.stripe.com/v1/${resource}`, {
    headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}`, 'Stripe-Version': STRIPE_API_VERSION },
    signal: AbortSignal.timeout(20000),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error?.message || `Stripe HTTP ${response.status}`);
  return data;
}

function verifyStripeSignature(rawBody, header) {
  if (!STRIPE_WEBHOOK_SECRET) return false;
  const parts = String(header || '').split(',').map((p) => p.split('='));
  const timestamp = parts.find(([k]) => k === 't')?.[1];
  const signatures = parts.filter(([k]) => k === 'v1').map(([, v]) => v);
  if (!timestamp || signatures.length === 0) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
  const expected = crypto.createHmac('sha256', STRIPE_WEBHOOK_SECRET).update(`${timestamp}.${rawBody.toString('utf8')}`).digest('hex');
  return signatures.some((sig) => {
    try {
      const a = Buffer.from(sig, 'hex');
      const b = Buffer.from(expected, 'hex');
      return a.length === b.length && crypto.timingSafeEqual(a, b);
    } catch { return false; }
  });
}

async function handleCheckout(req, res) {
  try {
    if (!checkoutAllowed(req)) return json(res, 429, { error: 'Trop de tentatives. Réessayez dans 15 minutes.' });
    const raw = await readBody(req);
    const questionnaire = validateQuestionnaire(JSON.parse(raw.toString('utf8') || '{}'));
    const prices = PRICE_MAP[questionnaire.packageId];
    if (!prices.monthly || !prices.setup) return json(res, 503, { error: 'Tarification Stripe en cours de configuration. Votre demande peut déjà être enregistrée, mais le paiement ne peut pas encore être lancé.' });

    const intake = await cockpitPost('/intake', { questionnaire, source: 'jsinnovia-site', submittedAt: new Date().toISOString() });
    const orderId = intake.orderId;
    if (!orderId) throw new Error('Référence de commande non générée');

    const session = await stripeRequest('checkout/sessions', {
      mode: 'subscription',
      integration_identifier: integrationIdentifier(),
      customer_email: questionnaire.email,
      'line_items[0][price]': prices.monthly,
      'line_items[0][quantity]': 1,
      'line_items[1][price]': prices.setup,
      'line_items[1][quantity]': 1,
      success_url: `${SITE_URL}/digital-signage/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/digital-signage?checkout=cancelled`,
      client_reference_id: orderId,
      'metadata[commerce_order_id]': orderId,
      'metadata[package_id]': questionnaire.packageId,
      'subscription_data[metadata][commerce_order_id]': orderId,
      'subscription_data[metadata][package_id]': questionnaire.packageId,
      'tax_id_collection[enabled]': 'true',
      billing_address_collection: 'required',
      allow_promotion_codes: 'true',
    }, `signage-checkout-${orderId}`);

    await cockpitPost('/checkout-created', { orderId, checkoutSessionId: session.id, packageId: questionnaire.packageId });
    return json(res, 201, { url: session.url, orderId });
  } catch (error) {
    console.error('[signage checkout]', error.message);
    return json(res, 400, { error: error.message });
  }
}

async function handleSession(req, res, url) {
  try {
    const sessionId = url.searchParams.get('session_id') || '';
    if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) return json(res, 400, { error: 'Session invalide' });
    const session = await stripeGet(`checkout/sessions/${encodeURIComponent(sessionId)}`);
    const confirmed = session.status === 'complete' && ['paid', 'no_payment_required'].includes(session.payment_status);
    return json(res, 200, { confirmed, customerEmail: session.customer_details?.email || session.customer_email || null, orderId: session.client_reference_id || null });
  } catch (error) {
    return json(res, 503, { error: error.message });
  }
}

async function handleWebhook(req, res) {
  try {
    const raw = await readBody(req, 1024 * 1024);
    if (!verifyStripeSignature(raw, req.headers['stripe-signature'])) return json(res, 400, { error: 'Signature Stripe invalide' });
    const event = JSON.parse(raw.toString('utf8'));
    const supported = new Set(['checkout.session.completed', 'checkout.session.async_payment_succeeded', 'checkout.session.async_payment_failed', 'invoice.paid', 'invoice.payment_failed', 'customer.subscription.updated', 'customer.subscription.deleted', 'charge.refunded']);
    if (supported.has(event.type)) {
      await cockpitPost('/stripe-event', {
        eventId: event.id,
        eventType: event.type,
        created: event.created,
        livemode: Boolean(event.livemode),
        object: event.data?.object || null,
      });
    }
    return json(res, 200, { received: true });
  } catch (error) {
    console.error('[stripe webhook]', error.message);
    return json(res, 500, { error: 'Webhook non traité' });
  }
}

async function handleCommerceRequest(req, res, pathname, url) {
  if (req.method === 'POST' && pathname === '/api/signage/checkout') {
    await handleCheckout(req, res);
    return true;
  }
  if (req.method === 'GET' && pathname === '/api/signage/session') {
    await handleSession(req, res, url);
    return true;
  }
  if (req.method === 'POST' && pathname === '/api/stripe/webhook') {
    await handleWebhook(req, res);
    return true;
  }
  return false;
}

module.exports = { handleCommerceRequest };

