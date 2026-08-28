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

test('unvalidated product subdomains cannot activate a public experience', async () => {
  const { resolveProductExperience } = await import('../src/lib/productHostRouter.js');

  assert.equal(resolveProductExperience('hainoflow.jsinnovia.com'), 'main');
  assert.equal(resolveProductExperience('signage.jsinnovia.com'), 'main');
  assert.equal(resolveProductExperience('cockpit.jsinnovia.com'), 'cockpit');
});

test('retired or conflicting product names are not reserved as public subdomains', async () => {
  const { PRODUCT_DOMAINS } = await import('../src/config/productEcosystem.js');
  const searchable = JSON.stringify(PRODUCT_DOMAINS).toLowerCase();

  assert.equal(searchable.includes('webos'), false);
  assert.equal(searchable.includes('nexusai'), false);
  assert.equal(searchable.includes('leadfinder pro'), false);
  assert.equal(searchable.includes('locelya'), false);
});

test('services remain routes on the main domain instead of separate subdomains', async () => {
  const { SERVICE_ROUTES } = await import('../src/config/productEcosystem.js');

  assert.ok(SERVICE_ROUTES.length >= 3);
  assert.ok(SERVICE_ROUTES.every((service) => service.route.startsWith('/services/')));
});
