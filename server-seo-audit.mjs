import { randomUUID } from 'node:crypto';
import { lookup } from 'node:dns/promises';
import { request as httpRequest } from 'node:http';
import { request as httpsRequest } from 'node:https';
import { isIP } from 'node:net';

const MAX_HTML_BYTES = 2_000_000;
const MAX_AUXILIARY_BYTES = 250_000;
const MAX_REDIRECTS = 5;
const REQUEST_TIMEOUT_MS = 15_000;

export class SeoAuditError extends Error {
  constructor(message, statusCode = 422) {
    super(message);
    this.name = 'SeoAuditError';
    this.statusCode = statusCode;
  }
}

export const normalizePublicUrl = (value) => {
  const input = String(value || '').trim();
  if (!input) throw new SeoAuditError('URL requise', 400);
  const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(input) ? input : `https://${input}`;
  let url;
  try { url = new URL(candidate); }
  catch { throw new SeoAuditError('URL invalide', 400); }
  if (!['http:', 'https:'].includes(url.protocol)) throw new SeoAuditError('Seules les URL HTTP et HTTPS publiques sont autorisées', 400);
  if (url.username || url.password) throw new SeoAuditError('Les URL contenant des identifiants ne sont pas autorisées', 400);
  if (url.port && !['80', '443'].includes(url.port)) throw new SeoAuditError('Seuls les ports web publics 80 et 443 sont autorisés', 400);
  url.hash = '';
  return url;
};

export const isPrivateAddress = (address) => {
  const normalized = String(address || '').toLowerCase().split('%')[0];
  if (normalized.startsWith('::ffff:')) return isPrivateAddress(normalized.slice(7));
  const family = isIP(normalized);
  if (family === 4) {
    const parts = normalized.split('.').map(Number);
    const [a, b, c] = parts;
    return a === 0 || a === 10 || a === 127 || a >= 224
      || (a === 100 && b >= 64 && b <= 127)
      || (a === 169 && b === 254)
      || (a === 172 && b >= 16 && b <= 31)
      || (a === 192 && b === 168)
      || (a === 192 && b === 0 && (c === 0 || c === 2))
      || (a === 192 && b === 88 && c === 99)
      || (a === 198 && (b === 18 || b === 19))
      || (a === 198 && b === 51 && c === 100)
      || (a === 203 && b === 0 && c === 113);
  }
  if (family === 6) {
    return normalized === '::' || normalized === '::1'
      || normalized.startsWith('fc') || normalized.startsWith('fd')
      || /^fe[89ab]/.test(normalized)
      || normalized.startsWith('2001:db8:');
  }
  return true;
};

const resolveSafeHost = async (url) => {
  const hostname = url.hostname.toLowerCase().replace(/\.$/, '');
  if (hostname === 'localhost' || hostname.endsWith('.localhost') || hostname.endsWith('.local')) {
    throw new SeoAuditError('Les adresses locales ou privées ne peuvent pas être analysées', 400);
  }
  if (isIP(hostname)) {
    if (isPrivateAddress(hostname)) throw new SeoAuditError('Les adresses locales ou privées ne peuvent pas être analysées', 400);
    return { address: hostname, family: isIP(hostname) };
  }
  let addresses;
  try { addresses = await lookup(hostname, { all: true, verbatim: true }); }
  catch { throw new SeoAuditError('Le nom de domaine ne peut pas être résolu'); }
  if (!addresses.length || addresses.some(({ address }) => isPrivateAddress(address))) {
    throw new SeoAuditError('Le domaine ne pointe pas vers une adresse web publique', 400);
  }
  return addresses[0];
};

const requestUrl = async (input, { maxBytes, timeoutMs = REQUEST_TIMEOUT_MS, redirects = 0 } = {}) => {
  const url = input instanceof URL ? input : normalizePublicUrl(input);
  const resolved = await resolveSafeHost(url);
  const startedAt = Date.now();
  const transport = url.protocol === 'https:' ? httpsRequest : httpRequest;
  const result = await new Promise((resolve, reject) => {
    const request = transport(url, {
      method: 'GET',
      headers: {
        Accept: 'text/html,application/xhtml+xml,text/plain;q=0.8,*/*;q=0.1',
        'Accept-Encoding': 'identity',
        'User-Agent': 'JS-Innov.IA-SEO-Audit/1.0 (+https://www.jsinnovia.com)',
      },
      lookup: (_hostname, options, callback) => {
        const done = typeof options === 'function' ? options : callback;
        if (typeof options === 'object' && options.all) done(null, [resolved]);
        else done(null, resolved.address, resolved.family);
      },
    }, (response) => {
      const chunks = [];
      let size = 0;
      response.on('data', (chunk) => {
        size += chunk.length;
        if (size > maxBytes) {
          request.destroy(new SeoAuditError(`La réponse dépasse la limite de ${Math.round(maxBytes / 1_000_000)} Mo`));
          return;
        }
        chunks.push(chunk);
      });
      response.on('end', () => resolve({
        status: response.statusCode || 0,
        headers: response.headers,
        body: Buffer.concat(chunks),
        durationMs: Date.now() - startedAt,
      }));
    });
    request.setTimeout(timeoutMs, () => request.destroy(new SeoAuditError('Le site ne répond pas dans le délai imparti')));
    request.on('error', (error) => reject(error instanceof SeoAuditError ? error : new SeoAuditError(`Connexion impossible : ${error.message}`)));
    request.end();
  });

  if ([301, 302, 303, 307, 308].includes(result.status) && result.headers.location) {
    if (redirects >= MAX_REDIRECTS) throw new SeoAuditError('Trop de redirections');
    let destination;
    try { destination = new URL(result.headers.location, url); }
    catch { throw new SeoAuditError('Le site renvoie une redirection invalide'); }
    const safeDestination = normalizePublicUrl(destination.href);
    return requestUrl(safeDestination, { maxBytes, timeoutMs, redirects: redirects + 1 });
  }
  return { ...result, finalUrl: url.href, redirects };
};

const decodeEntities = (value = '') => String(value)
  .replace(/&nbsp;/gi, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/&quot;/gi, '"')
  .replace(/&#39;|&apos;/gi, "'")
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>')
  .replace(/&#(\d+);/g, (_match, code) => String.fromCodePoint(Number(code)))
  .replace(/&#x([\da-f]+);/gi, (_match, code) => String.fromCodePoint(Number.parseInt(code, 16)));

const plainText = (html = '') => decodeEntities(String(html)
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' '))
  .replace(/\s+/g, ' ')
  .trim();

const attributes = (tag = '') => {
  const result = {};
  const pattern = /([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let match;
  while ((match = pattern.exec(tag))) result[match[1].toLowerCase()] = decodeEntities(match[2] ?? match[3] ?? match[4] ?? '');
  return result;
};

const tags = (html, name) => [...String(html).matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map(([tag]) => ({ tag, attrs: attributes(tag) }));
const tagTexts = (html, name) => [...String(html).matchAll(new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)<\\/${name}>`, 'gi'))].map(([, value]) => plainText(value));
const metaValue = (html, key, value) => tags(html, 'meta').find(({ attrs }) => String(attrs[key] || '').toLowerCase() === value.toLowerCase())?.attrs.content || '';

export const analyzeHtml = (html, { finalUrl, status = 200, durationMs = 0, byteSize, robotsStatus = 0, sitemapStatus = 0 } = {}) => {
  const baseUrl = normalizePublicUrl(finalUrl || 'https://example.com/');
  const source = String(html || '');
  const title = plainText(source.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '');
  const description = metaValue(source, 'name', 'description');
  const canonical = tags(source, 'link').find(({ attrs }) => String(attrs.rel || '').toLowerCase().split(/\s+/).includes('canonical'))?.attrs.href || '';
  const htmlLang = tags(source, 'html')[0]?.attrs.lang || '';
  const viewport = metaValue(source, 'name', 'viewport');
  const h1 = tagTexts(source, 'h1');
  const h2 = tagTexts(source, 'h2');
  const h3 = tagTexts(source, 'h3');
  const images = tags(source, 'img');
  const imagesWithAlt = images.filter(({ attrs }) => typeof attrs.alt === 'string' && attrs.alt.trim()).length;
  const links = tags(source, 'a').map(({ attrs }) => attrs.href).filter(Boolean);
  let internalLinks = 0;
  let externalLinks = 0;
  for (const href of links) {
    try {
      const target = new URL(href, baseUrl);
      if (!['http:', 'https:'].includes(target.protocol)) continue;
      if (target.hostname === baseUrl.hostname) internalLinks += 1;
      else externalLinks += 1;
    } catch { /* URL relative ou invalide ignorée */ }
  }
  const jsonLdCount = tags(source, 'script').filter(({ attrs }) => String(attrs.type || '').toLowerCase() === 'application/ld+json').length;
  const openGraphCount = tags(source, 'meta').filter(({ attrs }) => String(attrs.property || '').toLowerCase().startsWith('og:') && attrs.content).length;
  const body = source.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] || source;
  const words = plainText(body).split(/\s+/).filter(Boolean).length;
  return {
    status,
    https: baseUrl.protocol === 'https:',
    title,
    title_length: title.length,
    meta_description: description,
    meta_description_length: description.length,
    canonical,
    lang: htmlLang,
    viewport: Boolean(viewport),
    h1_count: h1.length,
    h1: h1.slice(0, 3),
    h2_count: h2.length,
    h3_count: h3.length,
    image_count: images.length,
    images_with_alt: imagesWithAlt,
    image_alt_ratio: images.length ? Math.round((imagesWithAlt / images.length) * 100) : 100,
    internal_links: internalLinks,
    external_links: externalLinks,
    json_ld_count: jsonLdCount,
    open_graph_count: openGraphCount,
    word_count: words,
    response_ms: durationMs,
    html_bytes: Number.isFinite(byteSize) ? byteSize : Buffer.byteLength(source),
    robots_status: robotsStatus,
    sitemap_status: sitemapStatus,
  };
};

const bounded = (value) => Math.max(0, Math.min(100, Math.round(value)));

export const calculateScores = (measurements) => {
  const ok = measurements.status >= 200 && measurements.status < 300;
  const technique = bounded(
    (measurements.https ? 20 : 0) + (ok ? 20 : 0)
    + (measurements.robots_status >= 200 && measurements.robots_status < 400 ? 15 : 0)
    + (measurements.sitemap_status >= 200 && measurements.sitemap_status < 400 ? 15 : 0)
    + (measurements.canonical ? 10 : 0) + (measurements.lang ? 10 : 0) + (measurements.viewport ? 10 : 0)
  );
  const titleOptimal = measurements.title_length >= 30 && measurements.title_length <= 65;
  const descriptionOptimal = measurements.meta_description_length >= 120 && measurements.meta_description_length <= 165;
  const onPage = bounded(
    (measurements.title ? 20 : 0) + (titleOptimal ? 10 : 0)
    + (measurements.meta_description ? 20 : 0) + (descriptionOptimal ? 10 : 0)
    + (measurements.h1_count === 1 ? 20 : 0) + (measurements.h2_count > 0 ? 10 : 0) + (measurements.canonical ? 10 : 0)
  );
  const content = measurements.word_count >= 600 ? 100 : measurements.word_count >= 300 ? 75 : measurements.word_count >= 150 ? 50 : measurements.word_count >= 50 ? 25 : 0;
  const links = measurements.internal_links >= 10 ? 100 : measurements.internal_links >= 5 ? 75 : measurements.internal_links >= 2 ? 50 : measurements.internal_links >= 1 ? 25 : 0;
  const metadata = bounded((measurements.json_ld_count > 0 ? 50 : 0) + (measurements.open_graph_count >= 4 ? 50 : measurements.open_graph_count >= 2 ? 30 : 0));
  const speedPoints = measurements.response_ms <= 750 ? 60 : measurements.response_ms <= 1_500 ? 45 : measurements.response_ms <= 3_000 ? 25 : 10;
  const sizePoints = measurements.html_bytes <= 500_000 ? 40 : measurements.html_bytes <= 1_000_000 ? 30 : measurements.html_bytes <= 2_000_000 ? 15 : 0;
  const performance = bounded(speedPoints + sizePoints);
  const accessibility = bounded((measurements.lang ? 25 : 0) + (measurements.h1_count === 1 ? 25 : 0) + (measurements.image_alt_ratio / 2));
  const scores = { technique, on_page: onPage, contenu: content, maillage: links, metadonnees: metadata, performance, accessibilite: accessibility };
  const globalScore = bounded(technique * 0.25 + onPage * 0.25 + content * 0.15 + links * 0.10 + metadata * 0.10 + performance * 0.10 + accessibility * 0.05);
  return { scores, globalScore };
};

const buildFindings = (m) => {
  const strengths = [];
  const issues = [];
  const recommendations = [];
  const add = (condition, issue, priority, title, description, impact, evidence) => {
    if (!condition) return;
    issues.push(issue);
    recommendations.push({ priority, title, description, impact, evidence });
  };
  if (m.https) strengths.push('La page finale est servie en HTTPS.');
  if (m.status >= 200 && m.status < 300) strengths.push(`La page répond correctement avec le statut HTTP ${m.status}.`);
  if (m.title && m.title_length >= 30 && m.title_length <= 65) strengths.push(`La balise title est présente et mesure ${m.title_length} caractères.`);
  if (m.meta_description && m.meta_description_length >= 120 && m.meta_description_length <= 165) strengths.push(`La meta description mesure ${m.meta_description_length} caractères.`);
  if (m.h1_count === 1) strengths.push('Un seul titre H1 principal a été détecté.');
  if (m.json_ld_count > 0) strengths.push(`${m.json_ld_count} bloc(s) de données structurées JSON-LD détecté(s).`);

  add(!m.https, 'La page finale ne fonctionne pas en HTTPS.', 'high', 'Activer HTTPS', 'Servir la page et toutes ses ressources via HTTPS.', 'Sécurité et confiance des visiteurs.', `Protocole mesuré : HTTP`);
  add(m.status < 200 || m.status >= 300, `La page renvoie le statut HTTP ${m.status}.`, 'high', 'Corriger la réponse HTTP', 'La page principale doit répondre avec un statut 2xx.', 'Exploration et indexation.', `Statut mesuré : ${m.status}`);
  add(!m.title, 'Aucune balise title n’a été détectée.', 'high', 'Ajouter une balise title', 'Définir un titre unique et descriptif entre 30 et 65 caractères.', 'Compréhension de la page dans les résultats de recherche.', 'Longueur mesurée : 0 caractère');
  add(Boolean(m.title) && (m.title_length < 30 || m.title_length > 65), `La balise title mesure ${m.title_length} caractères.`, 'medium', 'Ajuster la longueur du title', 'Viser un titre descriptif entre 30 et 65 caractères.', 'Lisibilité dans les résultats de recherche.', `Longueur mesurée : ${m.title_length} caractères`);
  add(!m.meta_description, 'Aucune meta description n’a été détectée.', 'high', 'Ajouter une meta description', 'Rédiger une description unique de 120 à 165 caractères.', 'Taux de clic potentiel dans les résultats.', 'Longueur mesurée : 0 caractère');
  add(Boolean(m.meta_description) && (m.meta_description_length < 120 || m.meta_description_length > 165), `La meta description mesure ${m.meta_description_length} caractères.`, 'medium', 'Ajuster la meta description', 'Viser une description utile entre 120 et 165 caractères.', 'Présentation dans les résultats de recherche.', `Longueur mesurée : ${m.meta_description_length} caractères`);
  add(m.h1_count !== 1, `${m.h1_count} titre(s) H1 détecté(s), au lieu d’un seul.`, 'high', 'Définir exactement un H1', 'Utiliser un titre principal H1 unique et représentatif de la page.', 'Hiérarchie et compréhension du contenu.', `H1 mesurés : ${m.h1_count}`);
  add(!m.canonical, 'Aucune URL canonique n’a été détectée.', 'medium', 'Ajouter une URL canonique', 'Déclarer l’URL canonique publique de la page.', 'Prévention du contenu dupliqué.', 'Balise canonical : absente');
  add(!m.lang, 'La langue du document HTML n’est pas définie.', 'medium', 'Définir la langue du document', 'Ajouter un attribut lang adapté sur la balise html.', 'Accessibilité et compréhension linguistique.', 'Attribut lang : absent');
  add(!m.viewport, 'La meta viewport n’a pas été détectée.', 'high', 'Ajouter la meta viewport', 'Déclarer un viewport adapté aux appareils mobiles.', 'Affichage mobile.', 'Meta viewport : absente');
  add(m.image_alt_ratio < 100, `${m.image_count - m.images_with_alt} image(s) sur ${m.image_count} n’ont pas de texte alternatif renseigné.`, 'medium', 'Compléter les textes alternatifs', 'Ajouter un texte alternatif utile aux images porteuses de sens.', 'Accessibilité et recherche d’images.', `Couverture alt mesurée : ${m.image_alt_ratio}%`);
  add(m.internal_links < 2, `Seulement ${m.internal_links} lien(s) interne(s) détecté(s).`, 'medium', 'Renforcer le maillage interne', 'Ajouter des liens contextuels vers les pages importantes du site.', 'Exploration et circulation des visiteurs.', `Liens internes mesurés : ${m.internal_links}`);
  add(m.json_ld_count === 0, 'Aucune donnée structurée JSON-LD n’a été détectée.', 'low', 'Ajouter des données structurées pertinentes', 'Déclarer uniquement les schémas correspondant réellement à l’activité et au contenu.', 'Éligibilité à certains résultats enrichis.', 'Blocs JSON-LD mesurés : 0');
  add(m.open_graph_count < 2, `Seulement ${m.open_graph_count} métadonnée(s) Open Graph détectée(s).`, 'low', 'Compléter les métadonnées sociales', 'Ajouter au minimum un titre, une description, une image et une URL Open Graph.', 'Qualité des partages sur les réseaux sociaux.', `Balises Open Graph mesurées : ${m.open_graph_count}`);
  add(m.robots_status < 200 || m.robots_status >= 400, 'Le fichier robots.txt public n’a pas été confirmé.', 'medium', 'Vérifier robots.txt', 'Publier un fichier robots.txt cohérent avec les zones à indexer.', 'Pilotage de l’exploration.', `Statut robots.txt : ${m.robots_status || 'aucune réponse'}`);
  add(m.sitemap_status < 200 || m.sitemap_status >= 400, 'Le sitemap XML public n’a pas été confirmé.', 'medium', 'Publier un sitemap XML', 'Fournir un sitemap.xml à jour et le déclarer aux moteurs de recherche.', 'Découverte des pages.', `Statut sitemap.xml : ${m.sitemap_status || 'aucune réponse'}`);
  return { strengths, critical_issues: issues, recommendations };
};

const fetchAuxiliaryStatus = async (url) => {
  try {
    const result = await requestUrl(url, { maxBytes: MAX_AUXILIARY_BYTES, timeoutMs: 8_000 });
    return result.status;
  } catch { return 0; }
};

const auditOne = async (input) => {
  const requested = normalizePublicUrl(input);
  const page = await requestUrl(requested, { maxBytes: MAX_HTML_BYTES });
  const contentType = String(page.headers['content-type'] || '').toLowerCase();
  if (contentType && !contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) {
    throw new SeoAuditError(`La cible ne renvoie pas une page HTML (${contentType})`);
  }
  const finalUrl = normalizePublicUrl(page.finalUrl);
  const origin = finalUrl.origin;
  const [robotsStatus, sitemapStatus] = await Promise.all([
    fetchAuxiliaryStatus(new URL('/robots.txt', origin)),
    fetchAuxiliaryStatus(new URL('/sitemap.xml', origin)),
  ]);
  const html = page.body.toString('utf8');
  const measurements = analyzeHtml(html, {
    finalUrl: finalUrl.href,
    status: page.status,
    durationMs: page.durationMs,
    byteSize: page.body.length,
    robotsStatus,
    sitemapStatus,
  });
  const { scores, globalScore } = calculateScores(measurements);
  return { requestedUrl: requested.href, finalUrl: finalUrl.href, measurements, scores, globalScore, ...buildFindings(measurements) };
};

export const auditSeo = async ({ url, competitors = [] } = {}) => {
  const primary = await auditOne(url);
  const comparison = [];
  for (const competitor of Array.isArray(competitors) ? competitors.slice(0, 3) : []) {
    if (!String(competitor || '').trim()) continue;
    try {
      const result = await auditOne(competitor);
      comparison.push({ url: result.finalUrl, global_score: result.globalScore, scores: result.scores, verified: true });
    } catch (error) {
      comparison.push({ url: String(competitor), error: error.message, verified: false });
    }
  }
  return {
    audit_id: randomUUID(),
    measured_at: new Date().toISOString(),
    source: 'live_server_measurement',
    verified: true,
    target_url: primary.requestedUrl,
    final_url: primary.finalUrl,
    global_score: primary.globalScore,
    scores: primary.scores,
    measurements: primary.measurements,
    strengths: primary.strengths,
    critical_issues: primary.critical_issues,
    recommendations: primary.recommendations,
    comparison,
    limitations: [
      'Le temps de réponse et le poids HTML sont mesurés depuis le serveur JS-Innov.IA ; ils ne remplacent pas les Core Web Vitals réels des visiteurs.',
      'Les balises et le contenu correspondent au HTML initial envoyé par le serveur ; le contenu ajouté ensuite uniquement par JavaScript n’est pas rendu par cet audit.',
      'Cet audit contrôle la page demandée, robots.txt et sitemap.xml ; il ne parcourt pas toutes les pages du site.',
      'Le score est une grille technique transparente JS-Innov.IA, pas un classement officiel de Google.',
    ],
    email_sent: false,
  };
};
