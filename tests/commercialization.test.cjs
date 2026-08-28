const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

test('a product is commercial-ready only after every mandatory gate is approved', async () => {
  const { COMMERCIAL_GATES, PRODUCT_PORTFOLIO, getCommercialStatus } = await import('../src/config/commercialization.js');

  for (const product of PRODUCT_PORTFOLIO) {
    if (getCommercialStatus(product) === 'commercial-ready') {
      assert.ok(COMMERCIAL_GATES.every((gate) => product.gates[gate] === true));
    }
  }
});

test('HainoFlow remains distinct from service packs and FacturaPro remains its module', async () => {
  const { PRODUCT_PORTFOLIO } = await import('../src/config/commercialization.js');
  const { HAINOFLOW_PLANS, SERVICE_PACKS } = await import('../src/config/catalog.js');
  const facturaPro = PRODUCT_PORTFOLIO.find((product) => product.id === 'facturapro');

  assert.deepEqual(HAINOFLOW_PLANS.map((plan) => plan.monthlyPrice), [19, 39, 79]);
  assert.deepEqual(SERVICE_PACKS.map((pack) => pack.price), [790, 1790, 2990]);
  assert.equal(facturaPro.parentProductId, 'hainoflow');
  assert.equal(facturaPro.model, 'module');
});

test('Locelya is only an internal candidate and has no public commercial identity', async () => {
  const { PRODUCT_PORTFOLIO, getCommercialStatus } = await import('../src/config/commercialization.js');
  const project = PRODUCT_PORTFOLIO.find((product) => product.id === 'marketing-local');

  assert.equal(project.name, 'Projet Marketing Local IA');
  assert.equal(project.candidateName, 'Locelya');
  assert.equal(project.visibility, 'internal');
  assert.equal(project.signature, null);
  assert.equal(getCommercialStatus(project), 'on-hold');
});

test('retired names cannot be active portfolio identities', async () => {
  const { PRODUCT_PORTFOLIO, RETIRED_PUBLIC_NAMES } = await import('../src/config/commercialization.js');
  const activeNames = PRODUCT_PORTFOLIO.map((product) => product.name.toLowerCase());

  for (const retiredName of RETIRED_PUBLIC_NAMES) {
    assert.equal(activeNames.includes(retiredName.toLowerCase()), false);
  }
});

test('every externally branded product carries the JS-Innov.IA endorsement', async () => {
  const { PRODUCT_PORTFOLIO } = await import('../src/config/commercialization.js');
  const endorsedModels = new Set(['standalone-and-bundle', 'standalone-and-white-label', 'candidate-standalone', 'vertical-pilot', 'module', 'module-family']);

  for (const product of PRODUCT_PORTFOLIO.filter((item) => endorsedModels.has(item.model) && item.signature)) {
    assert.match(product.signature, /JS[‑-]Innov\.IA/i);
  }
});

test('draft commercial pages are protected against search indexing at server and browser level', () => {
  const server = fs.readFileSync(path.join(root, 'server.mjs'), 'utf8');
  const catalogue = fs.readFileSync(path.join(root, 'src/pages/CataloguePricingDraft.jsx'), 'utf8');
  const hainoFlow = fs.readFileSync(path.join(root, 'src/pages/HainoFlowLanding.jsx'), 'utf8');
  const hook = fs.readFileSync(path.join(root, 'src/lib/useDraftPageMeta.js'), 'utf8');

  assert.match(server, /X-Robots-Tag.*noindex, nofollow, noarchive/s);
  assert.match(server, /catalogue-tarifs-brouillon/);
  assert.match(server, /hainoflow/);
  assert.match(catalogue, /useDraftPageMeta/);
  assert.match(hainoFlow, /useDraftPageMeta/);
  assert.match(hook, /noindex,nofollow,noarchive/);
});

test('secondary pages remain code-split for a fast mobile-first initial load', () => {
  const app = fs.readFileSync(path.join(root, 'src/App.jsx'), 'utf8');
  const pagesConfig = fs.readFileSync(path.join(root, 'src/config/lazyPages.js'), 'utf8');

  assert.match(app, /Suspense/);
  assert.match(app, /lazy\(\(\) => import\('\.\/pages\/HainoFlowLanding'\)\)/);
  assert.match(pagesConfig, /lazy\(\(\) => import\('\.\.\/pages\/Home'\)\)/);
  assert.doesNotMatch(pagesConfig, /^import Home from '\.\.\/pages\/Home'/m);
});
