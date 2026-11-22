const crypto = require('crypto');

const SITE_URL = (process.env.SITE_URL || 'https://jsinnovia.com').replace(/\/$/, '');
const COCKPIT_COMMERCE_URL = (process.env.COCKPIT_COMMERCE_URL || 'https://cockpit.jsinnovia.com/api/commerce').replace(/\/$/, '');
const COMMERCE_BRIDGE_KEY = process.env.COMMERCE_BRIDGE_KEY || '';
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
const STRIPE_API_VERSION = '2026-06-24.dahlia';
const checkoutRateLimits = new Map();

// Catalogue Signelya : les prix sont retrouvés dans Stripe par lookup_key
// (créés le 22/11/2026). Les montants restent gérés dans Stripe.
const PLANS = ['affichage', 'crea4', 'crea10', 'crea20', 'crea30'];
const BILLINGS = ['year', 'month'];
const LOOKUP = {
  plan: (plan, billing) => `signelya_${plan}_${billing === 'year' ? 'yearly' : 'monthly'}`,
  security: (billing) => `signelya_securite_${billing === 'year' ? 'yearly' : 'monthly'}`,
  securitySetup: 'signelya_setup_securite_241',
  setupMonthly: 'signelya_setup_449',
  setupYearly: 'signelya_setup_yearly_199',
  player: 'signelya_player_49',
};
// Offre de lancement : mise en service offerte en annuel jusqu'à la date indiquée,
// ou jusqu'à ce que SIGNELYA_LAUNCH_OFFER=off soit défini (après les 10 premiers clients).
const LAUNCH_OFFER_END = process.env.SIGNELYA_LAUNCH_OFFER_END || '2027-04-01T00:00:00+02:00';
function launchOfferActive(now = new Date()) {
  if (String(process.env.SIGNELYA_LAUNCH_OFFER || '').toLowerCase() === 'off') return false;
  return now < new Date(LAUNCH_OFFER_END);
}

function lineItemLookups({ plan, billing, security }) {
  const keys = [LOOKUP.plan(plan, billing)];
  if (billing === 'month') keys.push(LOOKUP.setupMonthly, LOOKUP.player);
  else if (!launchOfferActive()) keys.push(LOOKUP.setupYearly);
  if (security) keys.push(LOOKUP.security(billing), LOOKUP.securitySetup);
  return keys;
}

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
  const plan = String(input.plan || 'affichage');
  const billing = String(input.billing || 'year');
  if (!PLANS.includes(plan)) throw new Error('Offre inconnue');
  if (!BILLINGS.includes(billing)) throw new Error('Mode de paiement inconnu');
  const security = input.security === true || input.packageId === 'signage-surveillance';
  // packageId conservé pour le cockpit : signage ou signage-surveillance
  const packageId = security ? 'signage-surveillance' : 'signage';
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
    plan,
    billing,
    security,
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

let priceCache = { at: 0, byKey: new Map() };
async function resolvePrices(keys) {
  const fresh = Date.now() - priceCache.at < 10 * 60 * 1000;
  const missing = keys.filter((key) => !fresh || !priceCache.byKey.has(key));
  if (missing.length) {
    if (!fresh) priceCache = { at: Date.now(), byKey: new Map() };
    // Stripe accepte au maximum 10 lookup_keys par requête
    for (let start = 0; start < missing.length; start += 10) {
      const query = new URLSearchParams({ active: 'true', limit: '100' });
      missing.slice(start, start + 10).forEach((key) => query.append('lookup_keys[]', key));
      const list = await stripeGet(`prices?${query.toString()}`);
      for (const price of list.data || []) priceCache.byKey.set(price.lookup_key, { id: price.id, amount: price.unit_amount, interval: price.recurring?.interval || null });
    }
  }
  const resolved = keys.map((key) => priceCache.byKey.get(key));
  if (resolved.some((price) => !price)) return null;
  return resolved;
}

async function handlePricing(req, res) {
  try {
    const keys = [
      ...PLANS.flatMap((plan) => BILLINGS.map((billing) => LOOKUP.plan(plan, billing))),
      LOOKUP.security('year'), LOOKUP.security('month'), LOOKUP.securitySetup, LOOKUP.setupMonthly, LOOKUP.setupYearly, LOOKUP.player,
    ];
    const resolved = await resolvePrices(keys);
    if (!resolved) return json(res, 503, { ready: false });
    const amounts = Object.fromEntries(keys.map((key, i) => [key, resolved[i].amount / 100]));
    return json(res, 200, { ready: true, launchOffer: launchOfferActive(), amounts });
  } catch (error) {
    return json(res, 503, { ready: false, error: error.message });
  }
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
    const prices = await resolvePrices(lineItemLookups(questionnaire));
    if (!prices) return json(res, 503, { error: 'Tarification Stripe en cours de configuration. Le paiement ne peut pas encore être lancé.' });
    const lineItems = {};
    prices.forEach((price, index) => {
      lineItems[`line_items[${index}][price]`] = price.id;
      lineItems[`line_items[${index}][quantity]`] = 1;
    });

    const intake = await cockpitPost('/intake', { questionnaire, source: 'jsinnovia-site', submittedAt: new Date().toISOString() });
    const orderId = intake.orderId;
    if (!orderId) throw new Error('Référence de commande non générée');

    const session = await stripeRequest('checkout/sessions', {
      mode: 'subscription',
      integration_identifier: integrationIdentifier(),
      customer_email: questionnaire.email,
      ...lineItems,
      success_url: `${SITE_URL}/digital-signage/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/digital-signage?checkout=cancelled`,
      client_reference_id: orderId,
      'metadata[commerce_order_id]': orderId,
      'metadata[package_id]': questionnaire.packageId,
      'metadata[plan]': questionnaire.plan,
      'metadata[billing]': questionnaire.billing,
      'metadata[security]': String(questionnaire.security),
      'subscription_data[metadata][commerce_order_id]': orderId,
      'subscription_data[metadata][package_id]': questionnaire.packageId,
      'subscription_data[metadata][plan]': questionnaire.plan,
      'subscription_data[metadata][billing]': questionnaire.billing,
      'tax_id_collection[enabled]': 'true',
      billing_address_collection: 'required',
      allow_promotion_codes: 'true',
    }, `signage-checkout-${orderId}`);

    await cockpitPost('/checkout-created', { orderId, checkoutSessionId: session.id, packageId: questionnaire.packageId, plan: questionnaire.plan, billing: questionnaire.billing, security: questionnaire.security });
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
  if (req.method === 'GET' && pathname === '/api/signage/pricing') {
    await handlePricing(req, res);
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

