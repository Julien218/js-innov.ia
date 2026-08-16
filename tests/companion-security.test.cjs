const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const client = fs.readFileSync(path.join(root, 'src/components/chatbot/AIChatbot.jsx'), 'utf8');
const avatar = fs.readFileSync(path.join(root, 'src/components/chatbot/AIAvatar.jsx'), 'utf8');
const endpoint = fs.readFileSync(path.join(root, 'server.mjs'), 'utf8');
const platformClient = fs.readFileSync(path.join(root, 'src/api/platformClient.js'), 'utf8');
const app = fs.readFileSync(path.join(root, 'src/App.jsx'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'public/brand/companion/manifest.json'), 'utf8'));

test('the browser delegates AI requests to the server function', () => {
  assert.match(client, /functions\.invoke\('publicChat'/);
  assert.doesNotMatch(client, /integrations\.Core\.InvokeLLM/);
  assert.match(platformClient, /\/api\/platform\/functions/);
});

test('the branded companion is mounted on the active SaaS landing routes', () => {
  assert.match(app, /SaasChatbot from '.\/components\/chatbot\/AIChatbot'/);
  assert.match(app, /<SaasChatbot\s*\/>/);
});

test('the public endpoint bounds input and rate limits requests', () => {
  assert.match(endpoint, /slice\(-10\)/);
  assert.match(endpoint, /slice\(0, 1000\)/);
  assert.match(endpoint, /current\.count <= 30/);
  assert.match(endpoint, /response, 429/);
  assert.match(endpoint, /MAX_RATE_LIMIT_CLIENTS/);
  assert.match(endpoint, /AbortSignal\.timeout\(AGENT_TIMEOUT_MS\)/);
});

test('the public server applies baseline security headers and rejects unsupported methods', () => {
  assert.match(endpoint, /X-Content-Type-Options', 'nosniff/);
  assert.match(endpoint, /X-Frame-Options', 'DENY/);
  assert.match(endpoint, /Strict-Transport-Security/);
  assert.match(endpoint, /response, 405/);
});

test('the public assistant is explicitly isolated from the cockpit', () => {
  assert.match(endpoint, /compagnon public/);
  assert.match(endpoint, /Ne révèle aucune donnée interne/);
});

test('the application has no runtime dependency on Base44', () => {
  const packageJson = fs.readFileSync(path.join(root, 'package.json'), 'utf8');
  const viteConfig = fs.readFileSync(path.join(root, 'vite.config.js'), 'utf8');
  assert.doesNotMatch(packageJson, /@base44/);
  assert.doesNotMatch(viteConfig, /base44/i);
  assert.equal(fs.existsSync(path.join(root, 'src/api/base44Client.js')), false);
});

test('Elyna keeps the premium local visual pack as a production fallback', () => {
  assert.match(client, /\/brand\/companion\/companion-avatar-256\.webp/);
  assert.match(avatar, /\/brand\/companion\/companion-launcher-256\.webp/);
  assert.equal(manifest.assistant, 'Elyna');
  assert.equal(manifest.role, 'Compagnon JS-Innov.IA');
  assert.equal(manifest.version, '1.1.0');
  assert.equal(manifest.threeD.enabled, false);
  assert.equal(manifest.threeD.format, 'vrm');
  assert.equal(manifest.threeD.fallbackRequired, true);
  assert.deepEqual(manifest.threeD.states, ['idle', 'listening', 'thinking', 'speaking', 'success', 'error']);
  assert.match(avatar, /Elyna/);
});

test('the chat remains accessible and respects reduced motion', () => {
  assert.match(client, /aria-modal="true"/);
  assert.match(client, /event\.key === 'Escape'/);
  assert.match(client, /useReducedMotion/);
  assert.match(avatar, /useReducedMotion/);
});
