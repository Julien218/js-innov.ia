const test = require('node:test');
const assert = require('node:assert/strict');

test('product subdomains resolve to one unique product', async () => {
  const { PRODUCT_DOMAINS, findProductByHostname } = await import('../src/config/productEcosystem.js');
  const hostnames = PRODUCT_DOMAINS.map((product) => product.hostname);

  assert.equal(new Set(hostnames).size, hostnames.length);
  assert.equal(findProductByHostname('hainoflow.jsinnovia.com')?.id, 'hainoflow');
  assert.equal(findProductByHostname('SIGNAGE.JSINNOVIA.COM')?.id, 'signage');
});

test('hostname normalization removes whitespace and development ports', async () => {
  const { normalizeHostname } = await import('../src/config/productEcosystem.js');

  assert.equal(normalizeHostname('  HainoFlow.JSInnovia.com:443  '), 'hainoflow.jsinnovia.com');
  assert.equal(normalizeHostname('localhost:5173'), 'localhost');
});

test('unknown domains safely fall back to the main experience', async () => {
  const { findProductByHostname } = await import('../src/config/productEcosystem.js');

  assert.equal(findProductByHostname('preview.example.test'), null);
});

test('services remain routes on the main domain instead of separate subdomains', async () => {
  const { SERVICE_ROUTES } = await import('../src/config/productEcosystem.js');

  assert.ok(SERVICE_ROUTES.length >= 3);
  assert.ok(SERVICE_ROUTES.every((service) => service.route.startsWith('/services/')));
});
