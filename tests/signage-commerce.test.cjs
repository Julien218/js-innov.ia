const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const server = fs.readFileSync(path.join(__dirname, '..', 'server.cjs'), 'utf8');

test('Stripe Checkout uses subscription mode, Prices and dynamic payment methods', () => {
  assert.match(server, /mode: 'subscription'/);
  assert.match(server, /line_items\[0\]\[price\]/);
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

