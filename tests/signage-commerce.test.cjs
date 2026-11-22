const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const server = fs.readFileSync(path.join(__dirname, '..', 'server.cjs'), 'utf8');
const mainServer = fs.readFileSync(path.join(__dirname, '..', 'server.mjs'), 'utf8');

test('Stripe Checkout uses subscription mode, Prices and dynamic payment methods', () => {
  assert.match(server, /mode: 'subscription'/);
  assert.match(server, /line_items\[\$\{index\}\]\[price\]/);
  assert.match(server, /lookup_keys\[\]/);
  assert.doesNotMatch(server, /payment_method_types/);
  assert.match(server, /integration_identifier/);
  assert.match(server, /2026-06-24\.dahlia/);
  assert.match(server, /tax_id_collection\[enabled\]/);
  assert.match(server, /allow_promotion_codes/);
});

test('Stripe secrets stay server-side and requests have timeouts', () => {
  assert.match(server, /process\.env\.STRIPE_SECRET_KEY/);
  assert.doesNotMatch(server, /VITE_STRIPE_SECRET/);
  assert.match(server, /AbortSignal\.timeout/);
  assert.match(server, /checkoutAllowed/);
});

test('webhook verifies signatures and forwards asynchronous payment outcomes', () => {
  assert.match(server, /verifyStripeSignature/);
  assert.match(server, /timingSafeEqual/);
  assert.match(server, /checkout\.session\.async_payment_succeeded/);
  assert.match(server, /checkout\.session\.async_payment_failed/);
  assert.match(server, /x-commerce-key/);
});

test('commerce is mounted in the current NOVA server and API errors stay JSON', () => {
  assert.match(mainServer, /handleCommerceRequest/);
  assert.match(mainServer, /pathname\.startsWith\('\/api\/'\)/);
  assert.match(mainServer, /Route API inconnue/);
});


test('la grille Signelya résout ses prix Stripe par lookup_key et respecte l’offre de lancement', () => {
  assert.match(server, /signelya_\$\{plan\}_\$\{billing === 'year' \? 'yearly' : 'monthly'\}/);
  assert.match(server, /signelya_setup_449/);
  assert.match(server, /signelya_player_49/);
  assert.match(server, /SIGNELYA_LAUNCH_OFFER/);
  assert.match(server, /\/api\/signage\/pricing/);
});
