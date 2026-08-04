const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const client = fs.readFileSync(path.join(root, 'src/components/chatbot/AIChatbot.jsx'), 'utf8');
const endpoint = fs.readFileSync(path.join(root, 'base44/functions/publicChat/entry.ts'), 'utf8');
const app = fs.readFileSync(path.join(root, 'src/App.jsx'), 'utf8');

test('the browser delegates AI requests to the server function', () => {
  assert.match(client, /functions\.invoke\('publicChat'/);
  assert.doesNotMatch(client, /integrations\.Core\.InvokeLLM/);
});

test('the branded companion is mounted on the active SaaS landing routes', () => {
  assert.match(app, /SaasChatbot from '.\/components\/chatbot\/AIChatbot'/);
  assert.match(app, /<SaasChatbot\s*\/>/);
});

test('the public endpoint bounds input and rate limits requests', () => {
  assert.match(endpoint, /slice\(-10\)/);
  assert.match(endpoint, /slice\(0, 1000\)/);
  assert.match(endpoint, /RATE_MAX/);
  assert.match(endpoint, /, 429/);
});

test('the public assistant is explicitly isolated from the cockpit', () => {
  assert.match(endpoint, /assistant public/);
  assert.match(endpoint, /ne prétends pas accéder au cockpit/);
});
