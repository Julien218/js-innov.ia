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
  const server = read('server.mjs');
  const client = read('src/components/chatbot/AIChatbot.jsx');
  const submitBlock = client.slice(client.indexOf('async function submitHandoff'), client.indexOf('function sendMessage'));
  assert.match(submitBlock, /proof\?\.transmitted !== true/);
  assert.match(submitBlock, /proof\?\.verified !== true/);
  assert.match(submitBlock, /!proof\?\.request_id \|\| !proof\?\.journal_id/);
  assert.match(submitBlock, /La demande n’a pas été transmise/);
  assert.match(server, /PREMATURE_HANDOFF/);
  assert.match(server, /pris\(\?:e\)\? en \(\?:charge\|compte\)/);
  assert.match(server, /reviendra\|recontactera\|contactera/);
  assert.match(server, /référence Cockpit affichée après l’envoi/);
  assert.match(server, /safeCommercialMessage\(upstream\.ok \? data\.message : '', messages, qualification\)/);
});

test('the secure form opens and scrolls into view as soon as the request is qualified', () => {
  const client = read('src/components/chatbot/AIChatbot.jsx');
  assert.match(client, /if \(nextQualification\.can_submit\) setHandoffOpen\(true\)/);
  assert.match(client, /const handoffRef = useRef\(null\)/);
  assert.match(client, /ref=\{handoffRef\}/);
  assert.match(client, /qualification\.can_submit && !transmission \? handoffRef\.current : endRef\.current/);
  assert.match(client, /Votre demande n’est pas encore transmise/);
  assert.match(client, /Formulaire sécurisé de transmission/);
});

test('a visitor declining the handoff gets a truthful closure', () => {
  const server = read('server.mjs');
  assert.match(server, /DECLINE_HANDOFF/);
  assert.match(server, /non merci\|pas maintenant\|plus tard/);
  assert.match(server, /Aucune demande n’a été transmise/);
  assert.doesNotMatch(server.slice(server.indexOf('const commercialFallback'), server.indexOf('const safeCommercialMessage')), /environnement interne/);
});

test('public LLM proxy has its own quota that a spoofed X-Forwarded-For cannot bypass', async () => {
  const http = require('node:http');
  const { spawn } = require('node:child_process');
  let agentCalls = 0;
  const agent = http.createServer((req, res) => {
    agentCalls += 1;
    req.resume();
    req.on('end', () => { res.setHeader('content-type', 'application/json'); res.end('{"response":"ok"}'); });
  });
  await new Promise((resolve) => agent.listen(0, '127.0.0.1', resolve));
  const port = 20000 + Math.floor(Math.random() * 20000);
  const child = spawn(process.execPath, ['server.mjs'], {
    cwd: root,
    env: { ...process.env, PORT: String(port), JSINNOVIA_AGENT_URL: `http://127.0.0.1:${agent.address().port}`, AGENT_API_KEY: 'test' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  try {
    await new Promise((resolve, reject) => {
      child.stdout.on('data', (chunk) => { if (String(chunk).includes('listening')) resolve(); });
      child.on('exit', () => reject(new Error('server exited')));
    });
    const call = (prompt, spoofed) => fetch(`http://127.0.0.1:${port}/api/platform/llm`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': `${spoofed}, 203.0.113.7` },
      body: JSON.stringify({ prompt }),
    });
    assert.equal((await call('', '198.51.100.1')).status, 400);
    assert.equal((await call('x'.repeat(8001), '198.51.100.2')).status, 413);
    const statuses = [];
    // 10 demandes par fenêtre, les deux refus ci-dessus compris.
    for (let i = 0; i < 9; i += 1) statuses.push((await call('Bonjour', `198.51.100.${10 + i}`)).status);
    assert.deepEqual(statuses.slice(0, 8), Array(8).fill(200));
    assert.equal(statuses[8], 429);
    assert.equal(agentCalls, 8);
  } finally {
    child.kill();
    await new Promise((resolve) => agent.close(resolve));
  }
});

test('cockpit lead form goes through the server with RGPD consent, never browser storage', () => {
  const source = read('src/pages/CockpitConnectedSite.jsx');
  assert.match(source, /functions\.invoke\('receiveLead'/);
  assert.match(source, /consentRgpd/);
  assert.match(source, /PrivacyConsentNotice/);
  assert.doesNotMatch(source, /localStorage|VITE_COCKPIT_API_KEY/);
  assert.equal(fs.existsSync(path.join(root, 'src/lib/cockpitClient.js')), false);
});
