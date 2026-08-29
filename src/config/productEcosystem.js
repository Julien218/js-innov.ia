export const PRODUCT_DOMAINS = [
  {
    id: 'main',
    name: 'JS‑Innov.IA',
    hostname: 'www.jsinnovia.com',
    aliases: ['jsinnovia.com', 'www.js-innov-ia.com'],
    route: '/',
    kind: 'brand',
    status: 'active',
    hostRoutingEnabled: true,
  },
  {
    id: 'hainoflow',
    name: 'HainoFlow',
    hostname: 'hainoflow.jsinnovia.com',
    aliases: [],
    route: '/hainoflow',
    kind: 'software',
    status: 'active',
    hostRoutingEnabled: true,
  },
  {
    id: 'signage',
    name: 'Signelya',
    hostname: 'signelya.jsinnovia.com',
    aliases: ['signage.jsinnovia.com'],
    route: '/ecran',
    kind: 'software',
    status: 'active-pilot',
    hostRoutingEnabled: false,
  },
  {
    id: 'cockpit',
    name: 'Cockpit JS‑Innov.IA',
    hostname: 'cockpit.jsinnovia.com',
    aliases: [],
    route: '/cockpit',
    kind: 'private-app',
    status: 'reserved',
    hostRoutingEnabled: true,
  },
];

export const SERVICE_ROUTES = [
  { id: 'sites-web', label: 'Sites web intelligents', route: '/services/sites-web' },
  { id: 'automatisation', label: 'Automatisation', route: '/services/automatisation' },
  { id: 'agents-ia', label: 'Agents IA', route: '/services/agents-ia' },
];

export function normalizeHostname(hostname = '') {
  return hostname.trim().toLowerCase().replace(/:\d+$/, '');
}

export function findProductByHostname(hostname) {
  const normalized = normalizeHostname(hostname);
  return PRODUCT_DOMAINS.find((product) =>
    product.hostname === normalized || product.aliases.includes(normalized)
  ) ?? null;
}
