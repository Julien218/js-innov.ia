import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { EDITORIAL } from '../../site-content.mjs';
const pages = {
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
  '/web-studio': [
    'Des sites qui ont du caractère',
    'Explorez les concepts Atelier et Aura et personnalisez votre direction dans le Web Studio JS-Innov.IA.',
  ],
  ...Object.fromEntries(
    Object.entries(EDITORIAL).map(([p, v]) => [p, [v.title, v.description]]),
  ),
};
export default function SiteMetadata() {
  const { pathname } = useLocation();
  useEffect(() => {
    const privatePage =
      /^\/(api|espace-video|commander-video|studio-review|admin|crm|saas-client|saas-admin|blogadmin|quotedashboard|formbuilder|pagemanager|seodashboard|saas-chatbot-admin|checkout|cart|fidelite|experimentalhome|catalogue-tarifs-brouillon)(\/|$)/i.test(
        pathname,
      );
    const meta = (name, content) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.name = name;
        document.head.append(el);
      }
      el.content = content;
    };
    meta(
      'robots',
      privatePage
        ? 'noindex,nofollow,noarchive'
        : 'index,follow,max-image-preview:large',
    );
    meta(
      'referrer',
      privatePage ? 'no-referrer' : 'strict-origin-when-cross-origin',
    );
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.append(canonical);
    }
    canonical.href = 'https://jsinnovia.com' + pathname;
    const item = pages[pathname];
    if (item) {
      document.title = item[0] + ' · JS-Innov.IA';
      meta('description', item[1]);
      for (const [property, content] of [
        ['og:title', document.title],
        ['og:description', item[1]],
        ['og:url', canonical.href],
      ]) {
        let el = document.querySelector(`meta[property="${property}"]`);
        if (!el) {
          el = document.createElement('meta');
          el.setAttribute('property', property);
          document.head.append(el);
        }
        el.content = content;
      }
    }
  }, [pathname]);
  return null;
}
