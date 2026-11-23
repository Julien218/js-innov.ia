const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');

test('Signelya public prices match the live Stripe grid (Nov 2026)', async () => {
  const { findOffer, firstPaymentAmount } = await import('../src/config/offers.js');
  const expected = {
    'signelya-affichage': [69, 828], 'signelya-crea-4': [119, 1428], 'signelya-crea-10': [179, 2148],
    'signelya-crea-20': [279, 3348], 'signelya-crea-30': [359, 4308], 'signelya-securite': [60, 720],
  };
  for (const [id, [monthly, yearly]] of Object.entries(expected)) {
    const offer = findOffer(id);
    assert.equal(offer.prices.monthly, monthly, id);
    assert.equal(offer.prices.yearly, yearly, id);
    assert.equal(yearly, monthly * 12, `${id} annual = 12 months`);
  }
  // Annuel : mise en service 199, Player offert. Mensuel : 449 + Player 49.
  assert.equal(firstPaymentAmount('signelya-crea-10', 'yearly'), 2148 + 199);
  assert.equal(firstPaymentAmount('signelya-crea-10', 'monthly'), 179 + 449 + 49);
  assert.equal(firstPaymentAmount('signelya-securite', 'monthly'), 60 + 241);
  assert.equal(firstPaymentAmount('signelya-spot', 'one_time', 3), 57);
});

test('checkout plans only use known Stripe lookup keys and reject unpriced offers', async () => {
  const { buildCheckoutPlan, OFFERS } = await import('../src/config/offers.js');
  const yearly = buildCheckoutPlan('signelya-crea-4', 'yearly');
  assert.equal(yearly.mode, 'subscription');
  assert.deepEqual(yearly.items.map((item) => item.lookupKey), ['signelya_crea4_yearly', 'signelya_setup_yearly_199']);
  const monthly = buildCheckoutPlan('signelya-affichage', 'monthly');
  assert.deepEqual(monthly.items.map((item) => item.lookupKey), ['signelya_affichage_monthly', 'signelya_setup_449', 'signelya_player_49']);
  const spot = buildCheckoutPlan('signelya-spot', 'ignored', 5);
  assert.equal(spot.mode, 'payment');
  assert.equal(spot.items[0].quantity, 5);

  assert.throws(() => buildCheckoutPlan('signelya-spot', 'one_time', 0));
  assert.throws(() => buildCheckoutPlan('signelya-spot', 'one_time', 999));
  assert.throws(() => buildCheckoutPlan('signelya-crea-4', 'weekly'));
  assert.throws(() => buildCheckoutPlan('video-reels', 'monthly'), /offer-not-payable/);
  assert.throws(() => buildCheckoutPlan('pack-business', 'monthly'), /offer-not-payable/);
  assert.throws(() => buildCheckoutPlan('hainoflow-pro', 'monthly'), /offer-not-payable/);

  const ids = OFFERS.map((offer) => offer.id);
  assert.equal(new Set(ids).size, ids.length, 'offer ids are unique');
  assert.ok(!JSON.stringify(OFFERS).match(/Locelya|WebOS|NexusAI|LeadFinder/));
});

test('Stripe webhook signatures are verified with timestamp tolerance', async () => {
  const { verifyStripeSignature, signCockpitPayload } = await import('../server-shop.mjs');
  const secret = 'whsec_test_secret';
  const body = JSON.stringify({ id: 'evt_1', type: 'checkout.session.completed' });
  const now = 1_800_000_000;
  const sig = crypto.createHmac('sha256', secret).update(`${now}.${body}`).digest('hex');
  assert.equal(verifyStripeSignature(body, `t=${now},v1=${sig}`, secret, now), true);
  assert.equal(verifyStripeSignature(body, `t=${now},v1=${sig}`, secret, now + 301), false);
  assert.equal(verifyStripeSignature(`${body} `, `t=${now},v1=${sig}`, secret, now), false);
  assert.equal(verifyStripeSignature(body, `t=${now},v1=${sig}`, 'other', now), false);
  assert.equal(verifyStripeSignature(body, '', secret, now), false);
  assert.match(signCockpitPayload('{}', 'x'.repeat(32), now), /^t=1800000000,v1=[0-9a-f]{64}$/);
});

test('checkout refuses missing terms acceptance before any Stripe call', async () => {
  const { createCheckoutSession } = await import('../server-shop.mjs');
  await assert.rejects(() => createCheckoutSession({ offerId: 'signelya-crea-4', billing: 'yearly' }), /conditions générales/);
  await assert.rejects(() => createCheckoutSession({ offerId: 'video-reels', acceptTerms: true }), /Offre ou formule invalide/);
});

test('Stripe form encoding uses bracket notation for nested params', async () => {
  const { encodeStripeForm } = await import('../server-shop.mjs');
  const encoded = decodeURIComponent(encodeStripeForm({ line_items: [{ price: 'p', quantity: 1 }], automatic_tax: { enabled: true } }).join('&'));
  assert.equal(encoded, 'line_items[0][price]=p&line_items[0][quantity]=1&automatic_tax[enabled]=true');
});

test('orders keep payment status and are never acknowledged without the Cockpit', async () => {
  const { orderFromEvent, handleStripeWebhook } = await import('../server-shop.mjs');
  const pending = orderFromEvent({ id: 'evt_1', type: 'checkout.session.completed', data: { object: { object: 'checkout.session', id: 'cs_1', payment_status: 'unpaid', metadata: { offer_id: 'signelya-crea-4' } } } });
  assert.equal(pending.payment_status, 'unpaid');
  assert.equal(pending.fulfill, false);
  const paid = orderFromEvent({ id: 'evt_2', type: 'checkout.session.completed', data: { object: { object: 'checkout.session', id: 'cs_2', payment_status: 'paid' } } });
  assert.equal(paid.fulfill, true);
  assert.equal(orderFromEvent({ id: 'evt_3', type: 'checkout.session.async_payment_succeeded', data: { object: { object: 'checkout.session', payment_status: 'paid' } } }).fulfill, true);

  const secret = 'whsec_unit';
  process.env.STRIPE_WEBHOOK_SECRET = secret;
  delete process.env.COCKPIT_ORDER_WEBHOOK_URL;
  const body = JSON.stringify({ id: 'evt_4', type: 'checkout.session.completed', data: { object: { object: 'checkout.session', payment_status: 'paid' } } });
  const t = Math.floor(Date.now() / 1000);
  const sig = crypto.createHmac('sha256', secret).update(`${t}.${body}`).digest('hex');
  await assert.rejects(() => handleStripeWebhook(body, `t=${t},v1=${sig}`), (error) => error.statusCode === 503);
  delete process.env.STRIPE_WEBHOOK_SECRET;
});
