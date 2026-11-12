import { readFileSync } from 'node:fs';

// Keep route discovery aligned with the router; unknown URLs must not return 200.
const app = readFileSync(new URL('./src/App.jsx', import.meta.url), 'utf8');
const lazy = readFileSync(new URL('./src/config/lazyPages.js', import.meta.url), 'utf8');
const routes = new Set([
  ...[...app.matchAll(/<Route path="([^"]+)"/g)].map(m => m[1]),
  ...[...lazy.matchAll(/^  (\w+): lazy/gm)].map(m => `/${m[1]}`),
]);
const privatePath = /(?:admin|dashboard|checkout|payment|confirmation|catalogue-tarifs-brouillon|\/CRM$|\/ContentStudio$|\/FormBuilder$|\/PageManager$|\/PublicForm$|\/saas-client$)/i;
const descriptions = {
  '/': ['JS-Innov.IA | L’IA amplifiée par l’humain', 'Sites, automatisations et créations numériques avec un accompagnement humain en Belgique.'],
  '/CreativeStudio': ['Studio créatif | JS-Innov.IA', 'Découvrez les créations vidéo et les services du studio JS-Innov.IA. Contactez-nous pour votre projet.'],
  '/Showcase': ['Réalisations | JS-Innov.IA', 'Découvrez une sélection des réalisations de JS-Innov.IA.'],
  '/saas-contact': ['Contact | JS-Innov.IA', 'Présentez votre projet au studio JS-Innov.IA.'],
  '/web-studio': ['Web Studio | JS-Innov.IA', 'Explorez les expériences web proposées par JS-Innov.IA.'],
};
const origin = 'https://jsinnovia.com';
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
export function routeInfo(pathname) {
  const requested = pathname === '/index.html' ? '/' : pathname;
  const path = [...routes].find(route => route.toLowerCase() === requested.toLowerCase()) || requested;
  const known = routes.has(path) || /^\/page\/[^/]+$/.test(path);
  const indexable = known && !privatePath.test(path) && !path.startsWith('/page/');
  const [title, description] = descriptions[path] || [
    known ? `${path.slice(1).replaceAll('-', ' ')} | JS-Innov.IA` : 'Page introuvable | JS-Innov.IA',
    'JS-Innov.IA — L’IA amplifiée par l’humain. Découvrez nos services et contactez le studio.',
  ];
  return {known, indexable, canonical: origin + path, title, description};
}
export function renderMetadata(html, pathname) {
  const info = routeInfo(pathname);
  return html
    .replace(/<title>[\s\S]*?<\/title>/i, () => `<title>${escape(info.title)}</title>`)
    .replace(/(<link\s+rel="canonical"\s+href=")[^"]*"/i, (_, prefix) => `${prefix}${escape(info.canonical)}"`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*"/i, (_, prefix) => `${prefix}${escape(info.description)}"`)
    .replace(/(<meta\s+property="og:url"\s+content=")[^"]*"/i, (_, prefix) => `${prefix}${escape(info.canonical)}"`)
    .replace(/(<meta\s+property="og:title"\s+content=")[^"]*"/i, (_, prefix) => `${prefix}${escape(info.title)}"`)
    .replace(/(<meta\s+property="og:description"\s+content=")[^"]*"/i, (_, prefix) => `${prefix}${escape(info.description)}"`)
    .replace(/(<meta\s+name="robots"\s+content=")[^"]*"/i, (_, prefix) => `${prefix}${info.indexable ? 'index, follow' : 'noindex, nofollow'}"`);
}
export const robots = `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`;
// Curated commercial pages only: administrative and transactional routes are excluded.
export const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/', '/CreativeStudio', '/Showcase', '/web-studio', '/saas-contact', '/saas-packs', '/saas-mentions', '/saas-confidentialite', '/saas-cgv'].map(path => `<url><loc>${origin}${path}</loc></url>`).join('')}</urlset>`;
