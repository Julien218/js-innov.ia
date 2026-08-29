const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const packs = fs.readFileSync(path.join(root, 'src/pages/saas/SaasPacks.jsx'), 'utf8');
const app = fs.readFileSync(path.join(root, 'src/App.jsx'), 'utf8');

test('pack CTAs use implemented public routes instead of a missing Stripe function', () => {
  assert.doesNotMatch(packs, /createStripeSession/);
  assert.doesNotMatch(packs, /Payer maintenant/);
  assert.match(packs, /saas-contact\?pack=/);
  assert.match(packs, /\/saas-analyse/);
  assert.match(app, /path="\/saas-contact"/);
  assert.match(app, /path="\/saas-analyse"/);
});
