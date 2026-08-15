export const PRODUCT_DOMAINS = [
  {
    id: 'main',
    name: 'JS‑Innov.IA',
    hostname: 'www.jsinnovia.com',
    aliases: ['jsinnovia.com', 'www.js-innov-ia.com'],
    route: '/',
    kind: 'brand',
    status: 'active',
  },
  {
    id: 'hainoflow',
    name: 'HainoFlow',
    hostname: 'hainoflow.jsinnovia.com',
    aliases: [],
    route: '/hainoflow',
    kind: 'software',
    status: 'draft',
  },
  {
    id: 'signage',
    name: 'JS‑Innov.IA Signage',
    hostname: 'signage.jsinnovia.com',
    aliases: [],
    route: '/ecran',
    kind: 'software',
    status: 'draft',
  },
  {
    id: 'webos',
    name: 'WebOS',
    hostname: 'webos.jsinnovia.com',
    aliases: [],
    route: '/webos',
    kind: 'software',
    status: 'draft',
  },
  {
    id: 'cockpit',
    name: 'Cockpit JS‑Innov.IA',
    hostname: 'cockpit.jsinnovia.com',
    aliases: [],
    route: '/cockpit',
    kind: 'private-app',
    status: 'reserved',
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
