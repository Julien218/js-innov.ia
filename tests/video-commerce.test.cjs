const test = require('node:test');
const assert = require('node:assert/strict');
const { mkdtempSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { createServer } = require('node:http');
test('video lifecycle: trusted prices, private media, signed paid webhook, internal/client approval and durable isolation', async (t) => {
  const { createCommerce } = await import('../server-commerce.mjs');
  const Stripe = (await import('stripe')).default;
  const secret = 'whsec_fixture';
  const signer = new Stripe('sk_test_fixture');
  let captured;
  let payments = 0;
  const stripe = {
    checkout: {
      sessions: {
        create: async (data) => {
          captured = data;
          payments++;
          return {
            id: 'cs_test_fixture',
            url: 'https://checkout.stripe.com/c/pay/cs_test_fixture',
            livemode: false,
            expires_at: Math.floor(Date.now() / 1000) + 3600,
          };
        },
      },
    },
    webhooks: signer.webhooks,
  };
  const dir = mkdtempSync(join(tmpdir(), 'video-commerce-'));
  const env = {
    VIDEO_COMMERCE_TEST: 'true',
    VIDEO_DATA_DIR: dir,
    VIDEO_PUBLIC_ORIGIN: 'http://localhost',
    VIDEO_INTERNAL_KEY: 'internal-test-access-key-over-32-characters',
    STRIPE_TEST_WEBHOOK_SECRET: secret,
  };
  const handler = createCommerce({ env, stripeClient: stripe });
  const server = createServer((req, res) =>
    handler(req, res, new URL(req.url, 'http://localhost').pathname),
  );
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  t.after(() => {
    server.close(); /* SQLite is process-owned; temporary fixture is outside repository. */
  });
  const base = `http://127.0.0.1:${server.address().port}/api/video/`;
  const request = async (
    path,
    { token, admin, method = 'GET', body, raw, headers = {} } = {},
  ) => {
    const r = await fetch(base + path, {
      method,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(admin ? { Authorization: `Bearer ${env.VIDEO_INTERNAL_KEY}` } : {}),
        ...headers,
      },
      body: raw || (body ? JSON.stringify(body) : undefined),
    });
    return {
      status: r.status,
      data: (r.headers.get('content-type') || '').includes('json')
        ? await r.json()
        : Buffer.from(await r.arrayBuffer()),
    };
  };
  const brief = {
    offer: 'video-1',
    name: 'Client Test',
    email: 'client@example.test',
    event: 'Mariage',
    mood: 'Émotion',
    format: '16:9',
    brief: 'Une histoire avec nos photos de démonstration.',
    consent: true,
    amount: 1,
  };
  assert.equal(
    (
      await request('orders', {
        method: 'POST',
        body: { ...brief, offer: 'video-5' },
      })
    ).status,
    400,
  );
  const a = await request('orders', { method: 'POST', body: brief });
  assert.equal(a.status, 201);
  const { id, token } = a.data;
  const path = `orders/${id}`;
  assert.equal((await request(path)).status, 403);
  assert.equal((await request(path, { token: 'wrong' })).status, 403);
  assert.equal(
    (await request(path + '/checkout', { token, method: 'POST' })).status,
    409,
  );
  assert.equal(
    (
      await request(path + '/files', {
        token,
        method: 'POST',
        raw: Buffer.from('<script>'),
      })
    ).status,
    400,
  );
  const png = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0]);
  assert.equal(
    (await request(path + '/files', { token, method: 'POST', raw: png }))
      .status,
    201,
  );
  await request(path + '/complete', { token, method: 'POST' });
  assert.equal(
    (await request(path + '/files', { token, method: 'POST', raw: png }))
      .status,
    409,
  );
  assert.equal(
    (await request(path + '/checkout', { token, method: 'POST' })).status,
    200,
  );
  await request(path + '/checkout', { token, method: 'POST' });
  assert.equal(payments, 1);
  assert.equal(captured.line_items[0].price_data.unit_amount, 4999);
  assert.equal(captured.mode, 'payment');
  assert.equal(
    (await request(`internal/${id}/claim`, { admin: true, method: 'POST' }))
      .status,
    409,
  );
  async function webhook(
    type = 'checkout.session.completed',
    patch = {},
    eid = 'evt_test_paid',
  ) {
    const payload = JSON.stringify({
      id: eid,
      type,
      livemode: false,
      data: {
        object: {
          id: 'cs_test_fixture',
          client_reference_id: id,
          amount_total: 4999,
          currency: 'eur',
          metadata: { order_id: id },
          payment_status: 'paid',
          ...patch,
        },
      },
    });
    return request('webhook', {
      method: 'POST',
      raw: payload,
      headers: {
        'stripe-signature': signer.webhooks.generateTestHeaderString({
          payload,
          secret,
        }),
      },
    });
  }
  assert.equal(
    (
      await request('webhook', {
        method: 'POST',
        raw: '{}',
        headers: { 'stripe-signature': 'bad' },
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await webhook(
        'checkout.session.completed',
        { amount_total: 1 },
        'evt_wrong_amount',
      )
    ).status,
    400,
  );
  await webhook(
    'checkout.session.completed',
    { payment_status: 'unpaid' },
    'evt_pending',
  );
  assert.equal((await request(path, { token })).data.payment, 'unpaid');
  assert.equal(
    (await webhook('checkout.session.async_payment_succeeded')).status,
    200,
  );
  assert.equal(
    (await webhook('checkout.session.async_payment_succeeded')).status,
    200,
  );
  assert.equal((await request(path, { token })).data.payment, 'paid');
  assert.equal(
    (await request(`internal/${id}/claim`, { admin: true, method: 'POST' }))
      .status,
    200,
  );
  assert.equal((await request(path + '/download', { token })).status, 403);
  const mp4 = Buffer.from('0000ftypisom-demo');
  assert.equal(
    (
      await request(`internal/${id}/result`, {
        admin: true,
        method: 'POST',
        raw: mp4,
      })
    ).status,
    201,
  );
  assert.equal((await request(path + '/download', { token })).status, 403);
  assert.equal(
    (
      await request(path + '/review', {
        token,
        method: 'POST',
        body: { decision: 'approve' },
      })
    ).status,
    409,
  );
  assert.equal(
    (await request(`internal/${id}/approve`, { admin: true, method: 'POST' }))
      .status,
    200,
  );
  assert.equal((await request(path + '/download', { token })).status, 200);
  assert.equal(
    (
      await request(path + '/review', {
        token,
        method: 'POST',
        body: { decision: 'changes', feedback: 'Modifier le dernier titre.' },
      })
    ).data.status,
    'revision_requested',
  );
  assert.equal((await request(path + '/download', { token })).status, 403);
  await request(`internal/${id}/claim`, { admin: true, method: 'POST' });
  await request(`internal/${id}/result`, {
    admin: true,
    method: 'POST',
    raw: mp4,
  });
  await request(`internal/${id}/approve`, { admin: true, method: 'POST' });
  assert.equal(
    (
      await request(path + '/review', {
        token,
        method: 'POST',
        body: { decision: 'approve' },
      })
    ).data.status,
    'delivered',
  );
  assert.equal((await request('internal/orders')).status, 403);
  const o2 = await request('orders', {
    method: 'POST',
    body: { ...brief, offer: 'video-3' },
  });
  assert.equal(o2.data.offer.amount, 10000);
  assert.equal((await request(path, { token: o2.data.token })).status, 403);
  assert.equal(
    (
      await request(path, {
        token,
        headers: { Origin: 'https://evil.example' },
      })
    ).status,
    403,
  );
  assert.throws(
    () =>
      createCommerce({
        env: { ...env, STRIPE_TEST_SECRET_KEY: 'sk_live_forbidden' },
      }),
    /forbidden/,
  );
  const persisted = createCommerce({ env, stripeClient: stripe });
  const restoredResponse = {
    setHeader() {},
    writeHead(status) { this.status = status; },
    end(data) { this.data = JSON.parse(data); },
  };
  await persisted({method:'GET',headers:{authorization:`Bearer ${token}`}},restoredResponse,'/api/video/'+path);
  assert.equal(restoredResponse.status,200);
  assert.equal(restoredResponse.data.status,'delivered');
});
