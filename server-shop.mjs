// Boutique Js-Innov.IA : paiement Stripe Checkout, facture automatique et
// transmission de la commande au Cockpit. Aucune dépendance : appels REST Stripe.
import { createHmac, timingSafeEqual, randomUUID } from 'node:crypto';
import { buildCheckoutPlan } from './src/config/offers.js';

const STRIPE_API = 'https://api.stripe.com/v1';
const SIGNATURE_TOLERANCE_S = 300;
const FORWARDED_EVENTS = new Set([
  'checkout.session.completed',
  'checkout.session.async_payment_succeeded',
  'checkout.session.async_payment_failed',
  'invoice.paid',
  'invoice.payment_failed',
  'customer.subscription.deleted',
]);

export class ShopError extends Error {
  constructor(message, statusCode = 400) { super(message); this.statusCode = statusCode; }
}

const config = () => ({
  secretKey: process.env.STRIPE_SECRET_KEY || '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  siteUrl: (process.env.PUBLIC_SITE_URL || 'https://www.jsinnovia.com').replace(/\/$/, ''),
  automaticTax: process.env.STRIPE_AUTOMATIC_TAX !== 'false',
  cockpitUrl: (process.env.COCKPIT_ORDER_WEBHOOK_URL || '').trim(),
  cockpitSecret: process.env.COCKPIT_ORDER_WEBHOOK_SECRET || '',
});

export const shopStatus = () => {
  const { secretKey, webhookSecret, cockpitUrl, cockpitSecret } = config();
  return { payments: Boolean(secretKey), webhook: Boolean(webhookSecret), cockpit: Boolean(cockpitUrl && cockpitSecret.length >= 32) };
};

// Encodage application/x-www-form-urlencoded avec la notation imbriquée de Stripe.
export function encodeStripeForm(value, prefix = '', pairs = []) {
  if (value === undefined || value === null) return pairs;
  if (Array.isArray(value)) value.forEach((item, index) => encodeStripeForm(item, `${prefix}[${index}]`, pairs));
  else if (typeof value === 'object') Object.entries(value).forEach(([key, item]) => encodeStripeForm(item, prefix ? `${prefix}[${key}]` : key, pairs));
  else pairs.push(`${encodeURIComponent(prefix)}=${encodeURIComponent(String(value))}`);
  return pairs;
}

const stripe = async (method, path, params) => {
  const { secretKey } = config();
  if (!secretKey) throw new ShopError('Le paiement en ligne n’est pas encore activé.', 503);
  const body = params && method !== 'GET' ? encodeStripeForm(params).join('&') : undefined;
  const query = params && method === 'GET' ? `?${encodeStripeForm(params).join('&')}` : '';
  const response = await fetch(`${STRIPE_API}${path}${query}`, {
    method,
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Stripe-Version': '2024-06-20',
      ...(method === 'POST' ? { 'Idempotency-Key': randomUUID() } : {}),
    },
    body,
    signal: AbortSignal.timeout(20_000),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error('[shop] Stripe', response.status, data?.error?.code || '', data?.error?.message || '');
    throw new ShopError('Le paiement est momentanément indisponible.', 502);
  }
  return data;
};

const resolvePrices = async (lookupKeys) => {
  const data = await stripe('GET', '/prices', { lookup_keys: lookupKeys, active: 'true', limit: 20 });
  const byKey = new Map((data.data || []).map((price) => [price.lookup_key, price]));
  const missing = lookupKeys.filter((key) => !byKey.has(key));
  if (missing.length) {
    console.error('[shop] prix Stripe introuvables :', missing.join(', '));
    throw new ShopError('Cette offre n’est pas disponible au paiement en ligne pour le moment.', 503);
  }
  return byKey;
};

export async function createCheckoutSession(body = {}) {
  const offerId = String(body.offerId || '');
  const billing = String(body.billing || 'monthly');
  if (body.acceptTerms !== true) throw new ShopError('Veuillez accepter les conditions générales de vente.');

  let plan;
  try { plan = buildCheckoutPlan(offerId, billing, body.quantity ?? 1); }
  catch { throw new ShopError('Offre ou formule invalide.'); }

  const prices = await resolvePrices([...new Set(plan.items.map((item) => item.lookupKey))]);
  const { siteUrl, automaticTax } = config();
  const metadata = { offer_id: plan.offer.id, offer_name: plan.offer.name, billing: plan.billing, source: 'jsinnovia.com', terms_version: 'cgv-2026-11' };
  const email = String(body.email || '').trim();

  const params = {
    mode: plan.mode,
    line_items: plan.items.map((item) => ({ price: prices.get(item.lookupKey).id, quantity: item.quantity })),
    success_url: `${siteUrl}/paiement-reussi?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/offres?annule=${encodeURIComponent(plan.offer.id)}`,
    locale: 'fr',
    billing_address_collection: 'required',
    tax_id_collection: { enabled: true },
    phone_number_collection: { enabled: true },
    allow_promotion_codes: true,
    automatic_tax: { enabled: automaticTax },
    metadata,
    ...(email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254 ? { customer_email: email } : {}),
  };
  if (plan.mode === 'payment') {
    params.customer_creation = 'always';
    params.invoice_creation = { enabled: true, invoice_data: { metadata, footer: 'Js-Innov.IA — Intelligence artificielle amplifiée par l’humain' } };
  } else {
    params.subscription_data = { metadata };
  }

  const session = await stripe('POST', '/checkout/sessions', params);
  return { url: session.url, id: session.id };
}

export async function getCheckoutSummary(sessionId) {
  if (!/^cs_(test|live)_[A-Za-z0-9]{10,200}$/.test(sessionId)) throw new ShopError('Référence de paiement invalide.');
  const session = await stripe('GET', `/checkout/sessions/${sessionId}`, { expand: ['invoice', 'subscription.latest_invoice'] });
  const invoice = session.invoice || session.subscription?.latest_invoice || null;
  return {
    status: session.status,
    paymentStatus: session.payment_status,
    offerName: session.metadata?.offer_name || '',
    email: session.customer_details?.email || '',
    amountTotal: session.amount_total,
    currency: session.currency,
    invoiceUrl: invoice && typeof invoice === 'object' ? invoice.hosted_invoice_url || null : null,
    invoicePdf: invoice && typeof invoice === 'object' ? invoice.invoice_pdf || null : null,
  };
}

// Vérification de la signature Stripe (schéma v1, HMAC SHA-256).
export function verifyStripeSignature(rawBody, header, secret, now = Math.floor(Date.now() / 1000)) {
  if (!secret || !header) return false;
  const parts = {};
  const signatures = [];
  for (const part of String(header).split(',')) {
    const [key, value] = part.split('=');
    if (key === 't') parts.t = value;
    if (key === 'v1' && value) signatures.push(value);
  }
  const timestamp = Number.parseInt(parts.t, 10);
  if (!Number.isFinite(timestamp) || Math.abs(now - timestamp) > SIGNATURE_TOLERANCE_S || !signatures.length) return false;
  const expected = Buffer.from(createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest('hex'));
  return signatures.some((signature) => {
    const candidate = Buffer.from(signature);
    return candidate.length === expected.length && timingSafeEqual(candidate, expected);
  });
}

export function signCockpitPayload(body, secret, timestamp = Math.floor(Date.now() / 1000)) {
  return `t=${timestamp},v1=${createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex')}`;
}

// Résumé transmis au Cockpit : uniquement ce qu'il faut pour créer client, commande et facture.
export function orderFromEvent(event) {
  const object = event?.data?.object || {};
  const details = object.customer_details || {};
  return {
    event_id: event.id,
    event_type: event.type,
    created: event.created,
    livemode: event.livemode === true,
    offer_id: object.metadata?.offer_id || object.subscription_details?.metadata?.offer_id || object.parent?.subscription_details?.metadata?.offer_id || null,
    billing: object.metadata?.billing || null,
    // 'paid' | 'unpaid' | 'no_payment_required' : le Cockpit ne livre que si le paiement est acquis.
    payment_status: object.object === 'checkout.session' ? object.payment_status || null : (object.object === 'invoice' ? (object.status === 'paid' ? 'paid' : 'unpaid') : null),
    fulfill: event.type === 'checkout.session.async_payment_succeeded' || event.type === 'invoice.paid'
      || (event.type === 'checkout.session.completed' && ['paid', 'no_payment_required'].includes(object.payment_status)),
    stripe: {
      checkout_session: object.object === 'checkout.session' ? object.id : null,
      invoice: object.object === 'invoice' ? object.id : (typeof object.invoice === 'string' ? object.invoice : null),
      subscription: typeof object.subscription === 'string' ? object.subscription : (object.object === 'subscription' ? object.id : null),
      customer: typeof object.customer === 'string' ? object.customer : null,
    },
    customer: {
      email: details.email || object.customer_email || null,
      name: details.name || object.customer_name || null,
      phone: details.phone || null,
      address: details.address || object.customer_address || null,
      tax_ids: details.tax_ids || object.customer_tax_ids || [],
    },
    amount: { total: object.amount_total ?? object.amount_paid ?? null, tax: object.total_details?.amount_tax ?? object.tax ?? null, currency: object.currency || 'eur' },
    invoice_url: object.hosted_invoice_url || null,
    invoice_pdf: object.invoice_pdf || null,
  };
}

export async function handleStripeWebhook(rawBody, signatureHeader) {
  const { webhookSecret, cockpitUrl, cockpitSecret } = config();
  if (!webhookSecret) throw new ShopError('Webhook non configuré', 503);
  if (!verifyStripeSignature(rawBody, signatureHeader, webhookSecret)) throw new ShopError('Signature invalide', 400);
  const event = JSON.parse(rawBody);
  if (!FORWARDED_EVENTS.has(event.type)) return { received: true, forwarded: false };

  const order = orderFromEvent(event);
  if (!cockpitUrl || cockpitSecret.length < 32) {
    // Ne jamais acquitter une commande non transmise : Stripe relivrera l'événement
    // (jusqu'à 3 jours) une fois le Cockpit configuré.
    console.error('[shop] commande non transmise, Cockpit non configuré :', event.type, event.id);
    throw new ShopError('Cockpit non configuré', 503);
  }
  const payload = JSON.stringify(order);
  const upstream = await fetch(cockpitUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-jsinnovia-signature': signCockpitPayload(payload, cockpitSecret), 'Idempotency-Key': event.id },
    body: payload,
    signal: AbortSignal.timeout(15_000),
  });
  // Un échec renvoie 502 : Stripe relivrera l'événement (jusqu'à 3 jours).
  if (!upstream.ok) throw new ShopError(`Cockpit indisponible (${upstream.status})`, 502);
  return { received: true, forwarded: true };
}
