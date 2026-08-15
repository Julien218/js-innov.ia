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

test('the premium local visual pack is used instead of a remote mascot', () => {
  assert.match(client, /\/brand\/companion\/companion-avatar-256\.webp/);
  assert.match(avatar, /\/brand\/companion\/companion-launcher-256\.webp/);
  assert.equal(manifest.assistant, 'Compagnon JS-Innov.IA');
  assert.equal(manifest.version, '1.0.0');
});

test('the chat remains accessible and respects reduced motion', () => {
  assert.match(client, /aria-modal="true"/);
  assert.match(client, /event\.key === 'Escape'/);
  assert.match(client, /useReducedMotion/);
  assert.match(avatar, /useReducedMotion/);
});
