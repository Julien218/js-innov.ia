const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('Pixelium quote form never opens a mail client on submission failure', () => {
  const source = read('src/pages/saas/EcranLed.jsx');
  const start = source.indexOf('const handleSubmit = async');
  const end = source.indexOf('const goToSummary', start);
  assert.ok(start >= 0 && end > start, 'handleSubmit block must exist');
  const submit = source.slice(start, end);
  assert.doesNotMatch(submit, /mailto:/i);
  assert.doesNotMatch(submit, /window\.location\.href/);
  assert.match(submit, /setError\("Votre demande n'a pas pu être enregistrée/);
});

test('Espace C leads are routed through the server-side Pixelium quote endpoint', () => {
  const client = read('src/api/platformClient.js');
  assert.match(client, /payload\?\.source === 'ecran-led'/);
  assert.match(client, /\/api\/pixelium\/quote-request/);
  assert.match(client, /pixelium_quote_outbox_v1/);
  assert.match(client, /submissionId/);
});

test('commercial attribution for this page is server controlled and defaults to Julien P code JP', () => {
  const bridge = read('server-pixelium.cjs');
  assert.match(bridge, /PIXELIUM_PAGE_COMMERCIAL_CODE \|\| 'JP'/);
  assert.match(bridge, /commercialCode: DEFAULT_COMMERCIAL_CODE/);
  assert.match(bridge, /x-commerce-key/);
  assert.doesNotMatch(bridge, /VITE_.*COMMERCE_BRIDGE_KEY/);
});

test('Pixelium quote bridge preserves the submission id for idempotent retries', () => {
  const bridge = read('server-pixelium.cjs');
  assert.match(bridge, /body\.externalId \|\| body\.submissionId/);
  assert.match(bridge, /externalId,/);
});
