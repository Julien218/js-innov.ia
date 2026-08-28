export const SERVICE_PACKS = [
  {
    id: 'starter',
    name: 'Pack Starter',
    icon: 'globe',
    color: '#16D5FF',
    price: 790,
    recurringLabel: 'Maintenance : 79 €/mois',
    description: 'Un site vitrine professionnel, mobile-first et prêt à générer des contacts.',
    features: ['3 à 5 pages', 'Formulaire et WhatsApp', 'SEO de base', 'Google Business Profile'],
    publicStatus: 'approved-price-draft-page',
  },
  {
    id: 'business',
    name: 'Pack Business',
    icon: 'trending-up',
    color: '#E7B14A',
    price: 1790,
    recurringLabel: 'Suivi : 129 €/mois',
    popular: true,
    description: 'Un système d’acquisition complet avec site, chatbot, CRM et automatisations.',
    features: ['Jusqu’à 8 pages', 'Chatbot de qualification', 'CRM prospects', 'Séquences email'],
    publicStatus: 'approved-price-draft-page',
  },
  {
    id: 'automation',
    name: 'Pack Automation',
    icon: 'zap',
    color: '#8449FF',
    price: 2990,
    recurringLabel: 'Supervision : 199 €/mois',
    description: 'Des workflows et tableaux de bord conçus pour supprimer les tâches répétitives.',
    features: ['Analyse des processus', 'Workflows sur mesure', 'Dashboard', 'WhatsApp et email'],
    publicStatus: 'approved-price-draft-page',
  },
];

export const HAINOFLOW_PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    color: '#06B6D4',
    monthlyPrice: 19,
    yearlyPrice: 190,
    bundledMonthlyPrice: 17,
    target: 'Indépendants et petites activités',
    features: ['Factures et devis', 'Facturation structurée', 'Relances simples', 'Export comptable'],
    publicStatus: 'draft',
  },
  {
    id: 'pro',
    name: 'Pro',
    color: '#D4AF37',
    monthlyPrice: 39,
    yearlyPrice: 390,
    bundledMonthlyPrice: 35,
    target: 'PME et facturation récurrente',
    features: ['Tout Starter', 'Factures récurrentes', 'Relances automatisées', 'Portail et suivi client'],
    publicStatus: 'draft',
  },
  {
    id: 'business',
    name: 'Business',
    color: '#8B5CF6',
    monthlyPrice: 79,
    yearlyPrice: 790,
    bundledMonthlyPrice: 69,
    target: 'Équipes et automatisations avancées',
    features: ['Tout Pro', 'Workflows avancés', 'API et intégrations', 'Support prioritaire'],
    publicStatus: 'draft',
  },
];

export function formatEuro(value) {
  return new Intl.NumberFormat('fr-BE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}
