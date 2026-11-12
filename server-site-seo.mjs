import { readFileSync } from 'node:fs';
import { EDITORIAL, SOCIALS, WORKS, NETWORK } from './site-content.mjs';
export const META = {
  '/': [
    'Studio créatif & solutions digitales à Dour',
    'Films personnalisés dès 49,99 €, sites web et solutions digitales. L’IA amplifiée par l’humain.',
  ],
  '/videos': [
    'Films personnalisés dès 49,99 €',
    'Votre film personnalisé : 1 minute à 49,99 € ou 3 minutes à 100 €. Vos souvenirs, votre ambiance et votre validation.',
  ],
  '/videos/video-1': [
    'Film Essentiel · 1 minute · 49,99 €',
    'Un film personnalisé de 1 minute avec vos photos, vos vidéos et vos envies.',
  ],
  '/videos/video-3': [
    'Film Signature · 3 minutes · 100 €',
    'Trois minutes pour raconter votre histoire dans un film personnalisé.',
  ],
  '/solutions': [
    'Solutions digitales & VilleConnect OS',
    'HainoFlow, Signelya et VilleConnect OS : les solutions de l’écosystème JS-Innov.IA.',
  ],
  '/partenaires': [
    'Partenaires & écosystème local',
    'Projets locaux, références et collaborations JS-Innov.IA à Dour.',
  ],
  '/web-studio': [
    'Web Studio · votre site à votre image',
    'Explorez les univers de sites web JS-Innov.IA et personnalisez votre projet.',
  ],
  '/creativestudio': [
    'Studio Créatif',
    'Créations visuelles et vidéos pour votre communication.',
  ],
  '/saas-packs': [
    'Packs & accompagnement digital',
    'Découvrez les prestations JS-Innov.IA et préparez votre projet sur devis.',
  ],
  '/saas-agents': [
    'Assistants IA pour votre activité',
    'Des solutions intelligentes avec un contrôle humain pour accompagner votre activité.',
  ],
  '/saas-contact': [
    'Parlons de votre projet',
    'Contactez le studio JS-Innov.IA à Dour pour vos projets créatifs et digitaux.',
  ],
  '/realisations': [
    'Films, clips & réalisations du studio',
    'Découvrez les créations publiées sur la chaîne YouTube JS-Innov.IA.',
  ],
  '/reseaux': [
    'YouTube JS-Innov.IA & TikTok VilleConnect OS',
    'Retrouvez les profils officiels du studio et de VilleConnect OS.',
  ],
  '/ecosysteme': [
    'Les sites de l’écosystème JS-Innov.IA',
    'HainoFlow, Signelya, VilleConnect OS et les références locales du studio.',
  ],
  ...Object.fromEntries(
    Object.entries(EDITORIAL).map(([p, v]) => [p, [v.title, v.description]]),
  ),
};
export const PRIVATE = [
  '/api/',
  '/espace-video',
  '/commander-video',
  '/studio-review',
  '/saas-client',
  '/saas-admin',
  '/admin',
  '/crm',
  '/checkout',
  '/cart',
  '/catalogue-tarifs-brouillon',
  '/blogadmin',
  '/quotedashboard',
  '/formbuilder',
  '/pagemanager',
  '/seodashboard',
  '/saas-chatbot-admin',
  '/commande',
  '/paymentsuccess',
  '/paymentcancel',
  '/orderconfirmation',
  '/experimentalhome',
  '/fidelite',
];
const escape = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ],
  );
export function siteSeo(req, res, path, dist, knownPages = new Set()) {
  if (!['GET', 'HEAD'].includes(req.method)) return false;
  const lower = path.toLowerCase();
  if (lower === '/robots.txt') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(
      'User-agent: *\nAllow: /\n' +
        PRIVATE.map((p) => `Disallow: ${p}`).join('\n') +
        '\nSitemap: https://jsinnovia.com/sitemap.xml\n',
    );
    return true;
  }
  if (lower === '/sitemap.xml') {
    res.writeHead(200, { 'Content-Type': 'application/xml; charset=utf-8' });
    res.end(
      '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
        Object.keys(META)
          .map((p) => `<url><loc>https://jsinnovia.com${p}</loc></url>`)
          .join('') +
        '</urlset>',
    );
    return true;
  }
  const isPrivate = PRIVATE.includes(lower);
  if (!META[lower] && !isPrivate && !knownPages.has(lower)) return false;
  let html;
  try {
    html = readFileSync(`${dist}/index.html`, 'utf8');
  } catch {
    return false;
  }
  const [title, description] =
    META[lower] ||
    (isPrivate
      ? ['Votre espace privé', 'Votre projet JS-Innov.IA dans un espace privé.']
      : [
          path.slice(1).replace(/[-/]/g, ' '),
          'Découvrez les créations et services du studio JS-Innov.IA à Dour.',
        ]);
  html = html
    .replace(
      /<title>[\s\S]*?<\/title>/,
      `<title>${escape(title)} · JS-Innov.IA</title>`,
    )
    .replace(
      /(<meta\s+name="description"\s+content=")[^"]*("\s*\/?>)/,
      `$1${escape(description)}$2`,
    )
    .replace(
      /(<link rel="canonical" href=")[^"]*("\s*\/?>)/,
      `$1https://jsinnovia.com${escape(path)}$2`,
    )
    .replace(
      /(<meta property="og:url" content=")[^"]*/,
      `$1https://jsinnovia.com${escape(path)}`,
    )
    .replace(
      /(<meta (?:property="og:title"|name="twitter:title") content=")[^"]*/g,
      `$1${escape(title)} · JS-Innov.IA`,
    )
    .replace(
      /(<meta\s+(?:property="og:description"|name="twitter:description")\s+content=")[^"]*/g,
      `$1${escape(description)}`,
    );
  if (isPrivate) {
    html = html.replace(
      /name="robots" content="[^"]*"/,
      'name="robots" content="noindex,nofollow,noarchive"',
    );
    res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
    res.setHeader('Referrer-Policy', 'no-referrer');
  }
  if (!isPrivate) {
    const org = {
      '@type': 'Organization',
      '@id': 'https://jsinnovia.com/#organization',
      name: 'JS-Innov.IA',
      url: 'https://jsinnovia.com/',
      logo: 'https://jsinnovia.com/brand/jsinnovia-official.png',
      slogan: 'L’IA amplifiée par l’humain',
      email: 'info@jsinnovia.store',
      telephone: '+32494119090',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Grand Rue 52',
        postalCode: '7370',
        addressLocality: 'Dour',
        addressCountry: 'BE',
      },
      sameAs: [SOCIALS[0].url],
    };
    const page = {
      '@type': EDITORIAL[lower] ? 'Article' : 'WebPage',
      '@id': `https://jsinnovia.com${path}#page`,
      url: `https://jsinnovia.com${path}`,
      name: title,
      description,
      inLanguage: 'fr-BE',
      publisher: { '@id': org['@id'] },
    };
    if (EDITORIAL[lower])
      Object.assign(page, {
        headline: title,
        dateModified: '2026-11-12',
        author: { '@id': org['@id'] },
      });
    const graph = [
      org,
      {
        '@type': 'WebSite',
        '@id': 'https://jsinnovia.com/#website',
        url: 'https://jsinnovia.com/',
        name: 'JS-Innov.IA',
        publisher: { '@id': org['@id'] },
      },
      page,
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Accueil',
            item: 'https://jsinnovia.com/',
          },
          ...(path === '/'
            ? []
            : [
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: title,
                  item: `https://jsinnovia.com${path}`,
                },
              ]),
        ],
      },
    ];
    html = html
      .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '')
      .replace(
        '</head>',
        `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script></head>`,
      );
    const sections =
      EDITORIAL[lower]?.sections ||
      (lower === '/ecosysteme'
        ? NETWORK.map((n) => [n.name, n.description])
        : lower === '/reseaux'
          ? SOCIALS.map((s) => [s.name, s.description])
          : lower === '/realisations'
            ? WORKS.map((w) => [w.title, w.description])
            : lower === '/videos'
              ? [
                  [
                    'Film Essentiel · 1 minute',
                    '49,99 €. Brief personnalisé, médias privés et validation du film.',
                  ],
                  [
                    'Film Signature · 3 minutes',
                    '100 €. Délai confirmé par le studio. Les 24 h ne sont pas garanties.',
                  ],
                ]
              : []);
    const summary = `<main style="max-width:1000px;margin:4rem auto;padding:2rem;font:18px/1.7 system-ui;color:#eee;background:#080a14"><a href="/">JS-Innov.IA</a><h1>${escape(title)}</h1><p>${escape(description)}</p>${sections.map(([h, p]) => `<section><h2>${escape(h)}</h2><p>${escape(p)}</p></section>`).join('')}<nav>${Object.keys(
      META,
    )
      .filter((p) => !p.startsWith('/videos/'))
      .map(
        (p) =>
          `<a href="${p}" style="margin-right:1rem">${escape(META[p][0])}</a>`,
      )
      .join(
        '',
      )}</nav>${SOCIALS.map((s) => `<p><a href="${s.url}">${escape(s.name)}</a></p>`).join('')}<p>L’IA amplifiée par l’humain · Grand Rue 52, 7370 Dour · info@jsinnovia.store</p></main>`;
    html = html.replace(
      '<div id="root"></div>',
      `<div id="root">${summary}</div>`,
    );
  }
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(req.method === 'HEAD' ? '' : html);
  return true;
}
