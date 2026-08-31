const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('chaque consentement envoyé porte une preuve versionnée unique', async () => {
  const privacy = await import(pathToFileURL(path.join(root, 'privacy-consent.mjs')).href);
  const client = read('src/api/platformClient.js');
  assert.equal(privacy.PRIVACY_NOTICE_VERSION, '2026-09-01');
  assert.match(privacy.PRIVACY_CONSENT_TEXT, /retirer mon consentement à tout moment/);
  assert.match(client, /globalThis\.crypto\.randomUUID\(\)/);
  assert.match(client, /create: \(data\).*withPrivacyProof\(data\)/);
  assert.match(client, /JSON\.stringify\(withPrivacyProof\(payload\)\)/);
  assert.match(read('Dockerfile'), /privacy-consent\.mjs/);
});

test('le serveur inscrit la preuve au registre avant de créer le contact', () => {
  const server = read('server.mjs');
  assert.match(server, /await recordPrivacyConsent\(body, request\);\s*body = withoutPrivacyProof\(body\)/);
  assert.match(server, /await recordPrivacyConsent\(body, request\);\s*const upstream = await agentFetch\('\/data\/Contact'/);
  assert.match(server, /privacy-proof-invalid/);
  assert.match(server, /processing_activity_id/);
});

test('les formulaires affichent le texte enregistré et donnent accès à la politique', () => {
  const notice = read('src/components/legal/PrivacyConsentNotice.jsx');
  assert.match(notice, /PRIVACY_CONSENT_TEXT/);
  assert.match(notice, /PRIVACY_POLICY_PATH/);
  for (const file of [
    'src/components/landing/LandingContactForm.jsx',
    'src/components/chatbot/AIChatbot.jsx',
    'src/pages/saas/SaasAnalyse.jsx',
    'src/pages/saas/SaasChatbot.jsx',
    'src/pages/saas/SaasContact.jsx',
    'src/pages/saas/SaasDevis.jsx',
    'src/pages/saas/SaasProjet.jsx',
    'src/pages/saas/EcranLed.jsx',
  ]) assert.match(read(file), /PrivacyConsentNotice/);
  assert.doesNotMatch(read('src/pages/saas/EcranLed.jsx'), /window\.location\.href = `mailto:/);
});

test('la politique publique couvre les informations RGPD et la durée comptable belge', () => {
  const legal = read('src/pages/saas/SaasLegal.jsx');
  for (const expected of [
    'Finalités et bases juridiques', 'Données obligatoires ou facultatives',
    'Destinataires et sous-traitants', 'Transferts hors Espace économique européen',
    'Consentement et retrait', 'Vos droits et réclamation', 'Décisions automatisées',
    '10 ans à partir du 1er janvier', 'prolongé de deux mois',
  ]) assert.ok(legal.includes(expected), `mention manquante: ${expected}`);
  assert.doesNotMatch(legal, /Données de facturation : 7 ans/);

  const layout = read('src/components/saas/SaasLayout.jsx');
  assert.match(layout, /to="\/saas-confidentialite"/);
  assert.match(layout, /to="\/saas-mentions"/);
  assert.match(layout, /to="\/saas-cgv"/);
});

test('les promesses publiques de conformité absolue ont été retirées', () => {
  const sources = [
    'src/components/landing/LandingContactForm.jsx',
    'src/components/landing/LandingHero.jsx',
    'src/components/landing/LandingDifferentiator.jsx',
    'src/components/landing/LandingCTA.jsx',
    'src/pages/saas/SaasProjet.jsx',
  ].map(read).join('\n');
  assert.doesNotMatch(sources, /RGPD conforme|RGPD natif|Conformité RGPD garantie/i);
});
