const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('la landing Signelya reste limitée à son domaine et Pixelium demeure la page par défaut', () => {
  const app = read('src/App.jsx');
  const server = read('server.mjs');

  assert.match(app, /hostname === 'signelya\.jsinnovia\.com'/);
  assert.match(app, /isSignelyaDomain \? <SignelyaLanding \/> : <EcranLed \/>/);
  assert.match(server, /isSignelyaHost \? 'signelya\.html' : 'index\.html'/);
  assert.match(server, /response\.setHeader\('Vary', 'Host'\)/);
});

test('la landing ouvre l’application existante sans embarquer ni remplacer son code', () => {
  const landing = read('src/pages/signelya/SignelyaLanding.jsx');

  assert.match(landing, /olivier-signage-cockpit-production\.up\.railway\.app\/ecran-geant/);
  assert.doesNotMatch(landing, /serviceWorker\.register/);
  assert.doesNotMatch(landing, /manifest\.json/);
});

test('les coques HTML Signelya et Pixelium sont compilées séparément', () => {
  const vite = read('vite.config.js');
  const signelyaShell = read('signelya.html');

  assert.match(vite, /main:.*index\.html/);
  assert.match(vite, /signelya:.*signelya\.html/);
  assert.match(signelyaShell, /SIGNELYA by JS-Innov\.IA/);
  assert.doesNotMatch(signelyaShell, /rel="manifest"/);
});
