export const COMMERCIAL_GATES = [
  'name',
  'brand',
  'offer',
  'legal',
  'security',
  'tests',
  'billing',
  'deployment',
];

const pendingGates = (approved = {}) => Object.fromEntries(
  COMMERCIAL_GATES.map((gate) => [gate, approved[gate] ?? null]),
);

export const PRODUCT_PORTFOLIO = [
  {
    id: 'hainoflow',
    name: 'HainoFlow',
    signature: 'HainoFlow — by JS‑Innov.IA',
    model: 'standalone-and-bundle',
    repository: 'Julien218/facturapro',
    visibility: 'draft',
    gates: pendingGates({ name: true, brand: true, offer: true, legal: false, security: false, tests: false, billing: false, deployment: false }),
    blockers: ['Audit de sécurité et dépendances', 'Validation fonctionnelle/Peppol', 'CGV, DPA et politique de confidentialité', 'Stripe et déploiement de production'],
  },
  {
    id: 'facturapro',
    name: 'FacturaPro',
    signature: 'FacturaPro — module HainoFlow by JS‑Innov.IA',
    model: 'module',
    parentProductId: 'hainoflow',
    repository: 'Julien218/facturapro',
    visibility: 'internal',
    gates: pendingGates({ name: true, brand: true, offer: true }),
    blockers: ['Ne pas commercialiser comme produit concurrent de HainoFlow'],
  },
  {
    id: 'signage',
    name: 'Solution d’affichage dynamique',
    signature: 'Nom commercial à définir — by JS‑Innov.IA',
    model: 'standalone-and-bundle',
    repository: 'Julien218/js-innov.ia',
    visibility: 'pilot',
    gates: pendingGates({ name: false, brand: false, offer: true, legal: false, security: false, tests: false, billing: null, deployment: false }),
    blockers: ['Nom distinctif à choisir', 'Secrets à révoquer et déplacer', 'CI pilote, APK, Electron et Dropbox à stabiliser', 'Plan de rollback et rétention à valider'],
  },
  {
    id: 'ville-connect',
    name: 'Ville Connect OS',
    signature: 'Ville Connect OS — by JS‑Innov.IA',
    model: 'standalone-and-white-label',
    repository: 'Julien218/villeconnect',
    visibility: 'pilot',
    gates: pendingGates({ name: false, brand: false, offer: false, legal: false, security: null, tests: null, billing: false, deployment: null }),
    blockers: ['Audit de nom BOIP/EUIPO', 'Pilote et modèle économique à valider', 'Cadre RGPD collectivités/commerçants'],
  },
  {
    id: 'cockpit',
    name: 'Cockpit JS‑Innov.IA',
    signature: 'Cockpit JS‑Innov.IA',
    model: 'internal-platform',
    repository: 'Julien218/js-innov.ia-cockpit',
    visibility: 'private',
    gates: pendingGates({ name: true, brand: true, offer: false, legal: false, security: false, tests: false, billing: null, deployment: false }),
    blockers: ['Isolation des conversations et authentification', 'Secrets Docker à révoquer', 'CI et emails officiels à réparer'],
  },
  {
    id: 'marketing-local',
    name: 'Projet Marketing Local IA',
    candidateName: 'Locelya',
    signature: null,
    model: 'on-hold',
    repository: null,
    visibility: 'internal',
    gates: pendingGates({ name: false }),
    blockers: ['Locelya n’est pas un nom officiel', 'Aucun catalogue, domaine, Stripe, logo ou bible avant validation définitive'],
  },
  {
    id: 'pageant-white-label',
    name: 'Moteur concours & événements',
    signature: 'Propulsé par JS‑Innov.IA',
    model: 'white-label',
    repository: 'Julien218/miss-mister-dour-web',
    visibility: 'internal',
    gates: pendingGates({ name: true, brand: true, offer: false, legal: false, security: null, tests: null, billing: false, deployment: null }),
    blockers: ['Rendre couleurs, domaines, menus, modules et coordonnées configurables', 'Séparer la marque client du moteur'],
  },
  {
    id: 'website-white-label',
    name: 'Moteur site intelligent',
    signature: 'Propulsé par JS‑Innov.IA',
    model: 'white-label',
    repository: 'Julien218/oliviertrevis-site',
    visibility: 'internal',
    gates: pendingGates({ name: true, brand: true, offer: true, legal: false, security: null, tests: null, billing: false, deployment: null }),
    blockers: ['Questionnaire d’ADN et adaptation automatique à industrialiser', 'Provisionnement domaine/client à automatiser'],
  },
  {
    id: 'adn-studio',
    name: 'ADN Studio',
    signature: 'ADN Studio — by JS‑Innov.IA',
    model: 'candidate-standalone',
    repository: 'Julien218/ADN-Studio-By-Js-Innov.IA',
    visibility: 'internal',
    gates: pendingGates({ name: false, brand: false, offer: false, legal: false, security: null, tests: null, billing: false, deployment: null }),
    blockers: ['Audit du nom et preuve de valeur commerciale', 'Offre et tarification à formaliser'],
  },
  {
    id: 'artisprint-ai',
    name: 'ArtisPrint AI',
    signature: 'ArtisPrint AI — by JS‑Innov.IA',
    model: 'candidate-standalone',
    repository: 'Julien218/artisprint-ai',
    visibility: 'internal',
    gates: pendingGates({ name: false, brand: false, offer: false, legal: false, security: null, tests: null, billing: false, deployment: null }),
    blockers: ['Audit du nom', 'MVP, coûts de génération et droits des contenus à valider'],
  },
  {
    id: 'voiced',
    name: 'Voiced',
    signature: 'Voiced — by JS‑Innov.IA',
    model: 'candidate-standalone',
    repository: 'Julien218/voiced',
    visibility: 'internal',
    gates: pendingGates({ name: false, brand: false, offer: false, legal: false, security: null, tests: null, billing: false, deployment: null }),
    blockers: ['Audit du nom', 'Conformité voix, consentement et données personnelles'],
  },
  {
    id: 'assurix-voice',
    name: 'Assurix Voice',
    signature: 'Assurix Voice — by JS‑Innov.IA',
    model: 'vertical-pilot',
    repository: null,
    visibility: 'pilot',
    gates: pendingGates({ name: null, brand: true, offer: false, legal: false, security: false, tests: true, billing: false, deployment: false }),
    blockers: ['Twilio non configuré', 'PR non fusionnée', 'Cadre assurance, consentement et journalisation à valider'],
  },
  {
    id: 'qr',
    name: 'QR — by JS‑Innov.IA',
    signature: 'QR — by JS‑Innov.IA',
    model: 'module',
    repository: 'Julien218/qr-by-js-innov.ia',
    visibility: 'internal',
    gates: pendingGates({ name: true, brand: true, offer: false, legal: null, security: null, tests: null, billing: false, deployment: null }),
    blockers: ['Consolider les dépôts QR en une source canonique', 'Vendre comme module tant que la demande autonome n’est pas prouvée'],
  },
  {
    id: 'agents-metier',
    name: 'Agents IA par métier',
    signature: 'Agents IA par métier — by JS‑Innov.IA',
    model: 'module-family',
    repository: 'Julien218/Agents-IA-par-metier',
    visibility: 'internal',
    gates: pendingGates({ name: true, brand: true, offer: false, legal: false, security: null, tests: null, billing: false, deployment: null }),
    blockers: ['Définir un périmètre et une responsabilité par agent', 'Tests métier et confirmations humaines obligatoires'],
  },
  {
    id: 'pdf-studio',
    name: 'PDF Studio JS‑Innov.IA',
    signature: 'PDF Studio — by JS‑Innov.IA',
    model: 'module',
    repository: 'Julien218/pdf-studio-jsinnovia',
    visibility: 'internal',
    gates: pendingGates({ name: false, brand: true, offer: false, legal: false, security: null, tests: null, billing: false, deployment: null }),
    blockers: ['Nom descriptif à conserver comme module', 'Validation documents, stockage et données personnelles'],
  },
  {
    id: 'viral-montage',
    name: 'Montage vidéo automatisé',
    signature: 'Montage vidéo automatisé — by JS‑Innov.IA',
    model: 'module',
    repository: 'Julien218/agent-montage-viral',
    visibility: 'internal',
    gates: pendingGates({ name: true, brand: true, offer: false, legal: false, security: null, tests: null, billing: false, deployment: null }),
    blockers: ['Droits médias, musique et visages', 'Coût par rendu et limites de service à mesurer'],
  },
];

export const RETIRED_PUBLIC_NAMES = ['WebOS', 'NexusAI', 'LeadFinder Pro'];

export function getCommercialStatus(product) {
  if (product.model === 'on-hold') return 'on-hold';
  if (product.model === 'internal-platform') return 'internal';

  const values = COMMERCIAL_GATES.map((gate) => product.gates[gate]);
  if (values.every((value) => value === true)) return 'commercial-ready';
  if (values.some((value) => value === false)) return 'blocked';
  return 'audit-required';
}

export function getPortfolioSummary() {
  return PRODUCT_PORTFOLIO.reduce((summary, product) => {
    const status = getCommercialStatus(product);
    summary[status] = (summary[status] ?? 0) + 1;
    return summary;
  }, {});
}
