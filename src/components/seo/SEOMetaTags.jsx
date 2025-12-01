import { useEffect } from 'react';

// Configuration SEO par page avec mots-clés locaux optimisés
const SEO_CONFIG = {
  Home: {
    title: "JS-INNOV.IA | Automatisation & Intelligence Artificielle à Dour, Belgique",
    description: "JS-INNOV.IA : expert en automatisation et IA à Dour (Hainaut). Solutions sur mesure pour indépendants, courtiers et PME. Optimisez votre productivité avec l'IA locale.",
    keywords: "automatisation IA, intelligence artificielle Dour, IA Belgique, automatisation PME, IA indépendants, Hainaut, courtiers IA, optimisation entreprise, JS-INNOV.IA"
  },
  News: {
    title: "Actualités IA | JS-INNOV.IA - Veille Intelligence Artificielle",
    description: "Suivez les dernières actualités en intelligence artificielle. Découvertes, innovations et tendances IA analysées par JS-INNOV.IA, expert IA à Dour.",
    keywords: "actualités IA, news intelligence artificielle, innovations IA, veille technologique, IA Belgique, tendances IA 2024"
  },
  Innovations: {
    title: "Innovations IA | JS-INNOV.IA - Projets & Idées Révolutionnaires",
    description: "Explorez nos innovations en intelligence artificielle. Projets créatifs et solutions IA avant-gardistes par JS-INNOV.IA, votre partenaire IA à Dour.",
    keywords: "innovations IA, projets intelligence artificielle, solutions créatives IA, R&D IA, développement IA Belgique"
  },
  Showcase: {
    title: "Portfolio IA | Réalisations JS-INNOV.IA - Automatisation & IA",
    description: "Découvrez nos réalisations en automatisation et IA. Portfolio de projets réussis pour indépendants et entreprises en Belgique par JS-INNOV.IA.",
    keywords: "portfolio IA, réalisations automatisation, projets IA Belgique, études de cas IA, succès clients IA"
  },
  SEOAudit: {
    title: "Audit SEO Gratuit | JS-INNOV.IA - Analyse de Référencement",
    description: "Analysez gratuitement le SEO de votre site web. Audit complet avec recommandations personnalisées par JS-INNOV.IA, expert digital à Dour.",
    keywords: "audit SEO gratuit, analyse référencement, optimisation SEO, diagnostic site web, SEO Belgique, améliorer référencement"
  },
  MusicShop: {
    title: "Musiques Libres de Droits | JS-INNOV.IA - Bandes Sonores Commerciales",
    description: "Musiques libres de droits SABAM pour commerces, restaurants et boutiques. Paiement unique, usage illimité. Solutions audio par JS-INNOV.IA.",
    keywords: "musique libre de droits, bande sonore commerce, musique sans SABAM, audio restaurant, musique boutique Belgique"
  },
  Templates: {
    title: "Templates Vidéo IA | JS-INNOV.IA - Modèles Motion Design",
    description: "Templates vidéo professionnels générés par IA. Motion design et animations pour vos contenus marketing. JS-INNOV.IA, création visuelle à Dour.",
    keywords: "templates vidéo IA, motion design, animations marketing, modèles vidéo, création visuelle IA"
  },
  Automations: {
    title: "Automatisations IA | JS-INNOV.IA - Solutions Productivité",
    description: "Automatisez vos tâches répétitives avec l'IA. Solutions d'automatisation sur mesure pour indépendants et PME en Belgique par JS-INNOV.IA.",
    keywords: "automatisation tâches, IA productivité, workflow automatisé, solutions PME, automatisation Belgique, gain de temps IA"
  },
  Applications: {
    title: "Applications IA Sur Mesure | JS-INNOV.IA - Développement",
    description: "Applications intelligence artificielle personnalisées pour votre entreprise. Développement sur mesure par JS-INNOV.IA, expert IA à Dour.",
    keywords: "application IA sur mesure, développement IA, logiciel intelligence artificielle, app personnalisée, IA entreprise"
  },
  Partners: {
    title: "Partenaires | JS-INNOV.IA - Réseau IA Belgique",
    description: "Découvrez notre réseau de partenaires en intelligence artificielle. Collaborations stratégiques pour l'innovation IA en Belgique.",
    keywords: "partenaires IA, réseau innovation, collaborations IA Belgique, écosystème IA, partenariat technologique"
  },
  Contact: {
    title: "Contact | JS-INNOV.IA - Devis Gratuit Automatisation & IA",
    description: "Contactez JS-INNOV.IA pour vos projets d'automatisation et IA. Devis gratuit, accompagnement personnalisé. Expert IA à Dour, Hainaut, Belgique.",
    keywords: "contact JS-INNOV.IA, devis automatisation, consultation IA, projet IA Belgique, rendez-vous expert IA"
  },
  default: {
    title: "JS-INNOV.IA | Automatisation & Intelligence Artificielle Locale",
    description: "JS-INNOV.IA : automatisation et intelligence artificielle pratique, locale et efficace pour indépendants et entreprises à Dour, Belgique.",
    keywords: "JS-INNOV.IA, automatisation, intelligence artificielle, IA locale, Dour, Belgique, Hainaut"
  }
};

export default function SEOMetaTags({ pageName, customTitle, customDescription, customKeywords }) {
  useEffect(() => {
    const config = SEO_CONFIG[pageName] || SEO_CONFIG.default;
    
    // Titre optimisé
    const title = customTitle || config.title;
    document.title = title;

    // Meta description (130-160 caractères optimisé)
    const description = customDescription || config.description;
    updateOrCreateMeta('description', description);

    // Keywords avec mots-clés locaux
    const keywords = customKeywords || config.keywords;
    updateOrCreateMeta('keywords', keywords);

    // Viewport et charset
    updateOrCreateMeta('viewport', 'width=device-width, initial-scale=1.0');
    updateOrCreateMeta('robots', 'index, follow');
    updateOrCreateMeta('author', 'JS-INNOV.IA');
    updateOrCreateMeta('geo.region', 'BE-WHT');
    updateOrCreateMeta('geo.placename', 'Dour, Hainaut, Belgique');

    // Open Graph complet
    const ogTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: window.location.href },
      { property: 'og:site_name', content: 'JS-INNOV.IA' },
      { property: 'og:locale', content: 'fr_BE' },
      { property: 'og:image', content: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68ae1c019dacc474a322f2b2/f9316a8c1_Js-innovIA.png' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: 'JS-INNOV.IA - Automatisation et Intelligence Artificielle' }
    ];

    ogTags.forEach(tag => updateOrCreateMetaProperty(tag.property, tag.content));

    // Twitter Card complet
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68ae1c019dacc474a322f2b2/f9316a8c1_Js-innovIA.png' },
      { name: 'twitter:image:alt', content: 'JS-INNOV.IA - Automatisation et Intelligence Artificielle' }
    ];

    twitterTags.forEach(tag => updateOrCreateMeta(tag.name, tag.content));

    // Schema.org JSON-LD enrichi
    const existingSchema = document.querySelector('script[type="application/ld+json"]');
    if (existingSchema) existingSchema.remove();

    const schema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "JS-INNOV.IA",
      "description": description,
      "url": window.location.origin,
      "logo": "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68ae1c019dacc474a322f2b2/f9316a8c1_Js-innovIA.png",
      "image": "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68ae1c019dacc474a322f2b2/f9316a8c1_Js-innovIA.png",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Dour",
        "addressRegion": "Hainaut",
        "addressCountry": "BE"
      },
      "areaServed": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": 50.3977,
          "longitude": 3.7806
        },
        "geoRadius": "50000"
      },
      "priceRange": "€€",
      "serviceType": ["Automatisation", "Intelligence Artificielle", "Développement IA", "Audit SEO"],
      "knowsAbout": ["Intelligence Artificielle", "Automatisation", "Machine Learning", "SEO", "Développement Web"],
      "slogan": "Automatisation & IA pratique, locale, efficace",
      "foundingDate": "2024",
      "sameAs": []
    };

    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.text = JSON.stringify(schema);
    document.head.appendChild(schemaScript);

  }, [pageName, customTitle, customDescription, customKeywords]);

  return null;
}

function updateOrCreateMeta(name, content) {
  let meta = document.querySelector(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function updateOrCreateMetaProperty(property, content) {
  let meta = document.querySelector(`meta[property="${property}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.content = content;
}