const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('public client area redirects to the secure Cockpit', () => {
  const source = read('src/pages/saas/SaasClientDashboard.jsx');
  assert.match(source, /cockpit\.jsinnovia\.com/);
  assert.doesNotMatch(source, /ClientOrder/);
  assert.doesNotMatch(source, /platform\.entities/);
});

test('public voice launcher exposes no browser agent credential', () => {
  const source = read('src/components/voice/VoiceButton.jsx');
  assert.doesNotMatch(source, /VITE_AGENT_KEY/);
  assert.doesNotMatch(source, /x-agent-key/);
  assert.match(source, /return null/);
});

test('landing portfolio cards link to the real public projects', () => {
  const source = read('src/components/landing/LandingProof.jsx');
  for (const url of [
    'https://www.synergiedour.be',
    'https://www.oliviertrevis.be',
    'https://www.missetmisterdour.be',
    'https://www.fashionistartdour.be',
  ]) assert.ok(source.includes(url), `missing project URL: ${url}`);
  assert.match(source, /target="_blank"/);
  assert.match(source, /rel="noopener noreferrer"/);
});

test('public chatbot is proxied server-side to NOVA', () => {
  const server = read('server.mjs');
  assert.match(server, /JSINNOVIA_AGENT_KEY/);
  assert.match(server, /\/api\/platform\/functions\/publicChat/);
  assert.match(server, /x-agent-key/);
  assert.match(server, /security:\s*\{\s*assistant:\s*'public',\s*actions:\s*false\s*\}/);
});
