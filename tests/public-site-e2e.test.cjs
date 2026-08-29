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
  assert.match(server, /\/api\/platform\/functions\/publicChat/);
  assert.match(server, /cockpit\.jsinnovia\.com\/api\/public\/elynea\/chat/);
  assert.match(server, /source: upstream\.ok \? 'nova' : 'guided-fallback'/);
  assert.match(server, /INTERNAL_DETAILS/);
  const publicChatBlock = server.slice(server.indexOf("pathname === '/api/platform/functions/publicChat'"), server.indexOf("pathname === '/api/platform/functions/receiveLead'"));
  assert.doesNotMatch(publicChatBlock, /agentFetch|x-agent-key|agentKey/);
});

test('Elynea handoff is server-only and requires Cockpit proof before success', () => {
  const server = read('server.mjs');
  const client = read('src/components/chatbot/AIChatbot.jsx');
  assert.match(server, /ELYNEA_SITE_KEY/);
  assert.match(server, /x-elynea-site-key/);
  assert.match(server, /data\.transmitted !== true \|\| data\.verified !== true/);
  assert.match(server, /request_id/);
  assert.match(server, /journal_id/);
  assert.doesNotMatch(client, /ELYNEA_SITE_KEY|x-elynea-site-key/);
  assert.match(client, /submitElyneaRequest/);
  assert.match(client, /Transmettre ma demande/);
  assert.match(client, /Aucun devis, e-mail ou rendez-vous n’a été créé automatiquement/);
});

test('Elynea never displays a false transmission confirmation', () => {
  const client = read('src/components/chatbot/AIChatbot.jsx');
  const submitBlock = client.slice(client.indexOf('async function submitHandoff'), client.indexOf('function sendMessage'));
  assert.match(submitBlock, /proof\?\.transmitted !== true/);
  assert.match(submitBlock, /proof\?\.verified !== true/);
  assert.match(submitBlock, /!proof\?\.request_id \|\| !proof\?\.journal_id/);
  assert.match(submitBlock, /La demande n’a pas été transmise/);
});
