// Catalogue public « Offres & tarifs » de Js-Innov.IA.
// Source unique pour la page /offres et pour le serveur de paiement (server-shop.mjs).
// Les montants affichés reprennent les prix actifs dans Stripe (compte Jsinnovia, live).
// Le serveur ne fait jamais confiance au navigateur : il retrouve les prix Stripe
// par leur lookup_key ou leur identifiant à partir de l'offerId reçu.
// Une offre sans `checkout` est vendue sur devis (aucun paiement en ligne).

export const BRAND = {
  name: 'Js-Innov.IA',
  slogan: 'Intelligence artificielle amplifiée par l’humain',
  email: 'info@jsinnovia.store',
  phone: '+32 494 11 90 90',
  whatsapp: 'https://wa.me/32494119090',
};

export const OFFER_FAMILIES = [
  {
    id: 'video',
    label: 'Studio vidéo réseaux sociaux',
    kicker: 'Vidéos & réseaux sociaux',
    color: '#FF5A8A',
    description:
      'Vous nous envoyez vos photos et vidéos. Le studio Js-Innov.IA crée vos Reels à l’image de votre marque (sous-titres, musique, générique), vous les validez sur WhatsApp, puis nous les publions pour vous sur Facebook et Instagram.',
    steps: ['Dépôt de vos rushs', 'Création à votre image', 'Validation sur WhatsApp', 'Publication programmée'],
  },
  {
    id: 'signelya',
    label: 'Signelya — affichage dynamique',
    kicker: 'Écrans & spots publicitaires',
    color: '#E7B14A',
    description:
      'Pilotez vos écrans depuis votre téléphone ou votre ordinateur : médiathèque, playlists, programmation et Player hors connexion. Avec les Packs Créa, nous créons chaque mois vos spots vidéo de 7 secondes.',
    url: 'https://signelya.jsinnovia.com',
  },
  {
    id: 'hainoflow',
    label: 'HainoFlow — facturation',
    kicker: 'Logiciel de gestion',
    color: '#16D5FF',
    description: 'Devis, factures, relances et suivi client pour indépendants et PME belges.',
    url: 'https://hainoflow.jsinnovia.com',
  },
  {
    id: 'web',
    label: 'Sites & automatisations',
    kicker: 'Création sur mesure',
    color: '#8449FF',
    description: 'Sites intelligents, chatbots, CRM et workflows conçus autour de votre activité. Prix de création HTVA, suivi mensuel optionnel.',
  },
];

// billing: 'monthly' = mensuel sans engagement ; 'yearly' = engagement 12 mois payé à l'année.
export const OFFERS = [
  // ── Studio vidéo : prix à valider, vendus sur devis tant qu'aucun prix Stripe n'existe.
  {
    id: 'video-reels',
    family: 'video',
    name: 'Reels pour vos réseaux',
    tagline: 'Création + publication Facebook / Instagram',
    features: [
      'Vos vidéos montées selon l’ADN de votre marque',
      'Sous-titres dynamiques, musique, générique',
      'Textes des posts et premier commentaire rédigés',
      'Validation par lien WhatsApp avant publication',
      'Publication immédiate ou programmée par nos soins',
    ],
    priceLabel: 'Sur devis',
  },
  {
    id: 'video-ecran',
    family: 'video',
    name: 'Spots pour écrans LED',
    tagline: '7 s en 1920 × 1080, 3 versions au choix',
    features: ['Vos photos mises en mouvement', 'Logo, accroches et prix posés à l’écran', 'Diffusion directe sur Signelya'],
    priceLabel: 'Inclus dans les Packs Créa Signelya',
    linkFamily: 'signelya',
  },

  // ── Signelya (grille validée en novembre 2026, prix Stripe live).
  {
    id: 'signelya-affichage',
    family: 'signelya',
    name: 'Affichage',
    tagline: 'Le logiciel de pilotage d’écrans',
    features: ['Médiathèque, playlists et programmation', 'Player hors connexion', 'Cockpit mobile et ordinateur'],
    prices: { monthly: 69, yearly: 828 },
    checkout: { monthly: 'signelya_affichage_monthly', yearly: 'signelya_affichage_yearly' },
  },
  {
    id: 'signelya-crea-4',
    family: 'signelya',
    name: 'Pack Créa 4',
    tagline: 'Affichage + 4 spots vidéo créés par mois',
    features: ['Tout Affichage', '4 spots de 7 s par mois', 'Spot supplémentaire : 19 €'],
    prices: { monthly: 119, yearly: 1428 },
    checkout: { monthly: 'signelya_crea4_monthly', yearly: 'signelya_crea4_yearly' },
  },
  {
    id: 'signelya-crea-10',
    family: 'signelya',
    name: 'Pack Créa 10',
    tagline: 'Affichage + 10 spots vidéo créés par mois',
    features: ['Tout Affichage', '10 spots de 7 s par mois', 'Spot supplémentaire : 19 €'],
    prices: { monthly: 179, yearly: 2148 },
    checkout: { monthly: 'signelya_crea10_monthly', yearly: 'signelya_crea10_yearly' },
    popular: true,
  },
  {
    id: 'signelya-crea-20',
    family: 'signelya',
    name: 'Pack Créa 20',
    tagline: 'Affichage + 20 spots vidéo créés par mois',
    features: ['Tout Affichage', '20 spots de 7 s par mois', 'Spot supplémentaire : 19 €'],
    prices: { monthly: 279, yearly: 3348 },
    checkout: { monthly: 'signelya_crea20_monthly', yearly: 'signelya_crea20_yearly' },
  },
  {
    id: 'signelya-crea-30',
    family: 'signelya',
    name: 'Pack Créa 30',
    tagline: 'Affichage + 30 spots vidéo créés par mois',
    features: ['Tout Affichage', '30 spots de 7 s par mois', 'Spot supplémentaire : 19 €'],
    prices: { monthly: 359, yearly: 4308 },
    checkout: { monthly: 'signelya_crea30_monthly', yearly: 'signelya_crea30_yearly' },
  },
  {
    id: 'signelya-securite',
    family: 'signelya',
    name: 'Option Sécurité',
    tagline: 'Vidéosurveillance dans Signelya',
    features: ['Vue multi-caméras', 'Historique et archivage', 'Alertes', 'Caméras non incluses'],
    prices: { monthly: 60, yearly: 720 },
    checkout: { monthly: 'signelya_securite_monthly', yearly: 'signelya_securite_yearly' },
    setup: { lookupKey: 'signelya_setup_securite_241', amount: 241, label: 'Mise en service Option Sécurité' },
    addon: true,
  },
  {
    id: 'signelya-spot',
    family: 'signelya',
    name: 'Spot vidéo supplémentaire',
    tagline: 'Un spot de 7 s en plus de votre pack',
    features: ['Créé par le studio Js-Innov.IA', 'Livré dans votre médiathèque Signelya'],
    oneTime: 19,
    checkout: { oneTime: 'signelya_spot_19' },
    quantity: { min: 1, max: 30 },
    addon: true,
  },

  // ── HainoFlow : l'inscription et le paiement se font sur l'application elle-même.
  ...[
    ['starter', 'Starter', 19, 'Indépendants et petites activités', ['Factures et devis', 'Relances simples', 'Export comptable']],
    ['pro', 'Pro', 39, 'PME et facturation récurrente', ['Tout Starter', 'Factures récurrentes', 'Relances automatisées', 'Portail client']],
    ['business', 'Business', 79, 'Équipes et automatisations avancées', ['Tout Pro', 'Workflows avancés', 'API et intégrations', 'Support prioritaire']],
  ].map(([plan, name, monthly, tagline, features]) => ({
    id: `hainoflow-${plan}`,
    family: 'hainoflow',
    name,
    tagline,
    features,
    prices: { monthly },
    externalUrl: 'https://hainoflow.jsinnovia.com',
    popular: plan === 'pro',
  })),

  // ── Packs de création (prix approuvés, réalisés sur devis).
  {
    id: 'pack-starter',
    family: 'web',
    name: 'Pack Starter',
    tagline: 'Site vitrine pro, prêt à générer des contacts',
    features: ['3 à 5 pages', 'Formulaire et WhatsApp', 'SEO de base', 'Google Business Profile'],
    fromPrice: 790,
    recurringLabel: 'Maintenance optionnelle : 79 €/mois',
  },
  {
    id: 'pack-business',
    family: 'web',
    name: 'Pack Business',
    tagline: 'Site, chatbot, CRM et automatisations',
    features: ['Jusqu’à 8 pages', 'Chatbot de qualification', 'CRM prospects', 'Séquences e-mail'],
    fromPrice: 1790,
    recurringLabel: 'Suivi optionnel : 129 €/mois',
    popular: true,
  },
  {
    id: 'pack-automation',
    family: 'web',
    name: 'Pack Automation',
    tagline: 'Supprimez vos tâches répétitives',
    features: ['Analyse des processus', 'Workflows sur mesure', 'Tableau de bord', 'WhatsApp et e-mail'],
    fromPrice: 2990,
    recurringLabel: 'Supervision optionnelle : 199 €/mois',
  },
];

// Mise en service ajoutée automatiquement aux abonnements Signelya (hors options).
export const SIGNELYA_SETUP = {
  monthly: { lookupKey: 'signelya_setup_449', amount: 449, label: 'Mise en service' },
  yearly: { lookupKey: 'signelya_setup_yearly_199', amount: 199, label: 'Mise en service (offre annuelle)' },
};
// Le Player est offert avec l'engagement annuel ; facturé 49 € en formule mensuelle.
export const SIGNELYA_PLAYER = { lookupKey: 'signelya_player_49', amount: 49, label: 'Player Signelya' };

export const BILLING_LABELS = {
  monthly: 'Mensuel sans engagement',
  yearly: 'Annuel — 12 mois, Player offert',
};

export function findOffer(id) {
  return OFFERS.find((offer) => offer.id === id) ?? null;
}

export function isPayableOnline(offer) {
  return Boolean(offer?.checkout);
}

// Construit la liste des lookup_keys Stripe d'une commande. Lève une erreur si la
// combinaison demandée n'existe pas : le serveur ne crée jamais de prix à la volée.
export function buildCheckoutPlan(offerId, billing = 'monthly', quantity = 1) {
  const offer = findOffer(offerId);
  if (!offer || !isPayableOnline(offer)) throw new Error('offer-not-payable');

  if (offer.checkout.oneTime) {
    const min = offer.quantity?.min ?? 1;
    const max = offer.quantity?.max ?? 1;
    const qty = Number.parseInt(quantity, 10);
    if (!Number.isInteger(qty) || qty < min || qty > max) throw new Error('quantity-invalid');
    return { offer, mode: 'payment', billing: 'one_time', items: [{ lookupKey: offer.checkout.oneTime, quantity: qty }] };
  }

  if (!['monthly', 'yearly'].includes(billing) || !offer.checkout[billing]) throw new Error('billing-invalid');
  const items = [{ lookupKey: offer.checkout[billing], quantity: 1 }];
  if (offer.setup) {
    items.push({ lookupKey: offer.setup.lookupKey, quantity: 1 });
  } else if (offer.family === 'signelya') {
    items.push({ lookupKey: SIGNELYA_SETUP[billing].lookupKey, quantity: 1 });
    if (billing === 'monthly') items.push({ lookupKey: SIGNELYA_PLAYER.lookupKey, quantity: 1 });
  }
  return { offer, mode: 'subscription', billing, items };
}

// Montant HTVA dû à la commande (affichage uniquement ; Stripe reste la référence).
export function firstPaymentAmount(offerId, billing = 'monthly', quantity = 1) {
  const offer = findOffer(offerId);
  if (!offer) return null;
  if (offer.oneTime) return offer.oneTime * quantity;
  const recurring = offer.prices?.[billing];
  if (recurring == null) return null;
  let total = recurring;
  if (offer.setup) total += offer.setup.amount;
  else if (offer.family === 'signelya') {
    total += SIGNELYA_SETUP[billing].amount;
    if (billing === 'monthly') total += SIGNELYA_PLAYER.amount;
  }
  return total;
}

export function formatPrice(value) {
  return new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
}
