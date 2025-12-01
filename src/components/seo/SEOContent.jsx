import React from 'react';

/**
 * Bloc de contenu HTML sémantique visible par les moteurs de recherche
 * Ce contenu est rendu côté serveur et visible dans le DOM même sans JavaScript
 */
export default function SEOContent({ variant = 'full' }) {
  if (variant === 'minimal') {
    return (
      <section 
        className="sr-only" 
        aria-label="À propos de JS-INNOV.IA"
        itemScope 
        itemType="https://schema.org/LocalBusiness"
      >
        <h2 itemProp="name">JS-INNOV.IA - Automatisation & Intelligence Artificielle</h2>
        <p itemProp="description">
          Expert en automatisation et intelligence artificielle à Dour, Hainaut, Belgique. 
          Solutions sur mesure pour indépendants, courtiers et PME.
        </p>
        <address itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
          <span itemProp="addressLocality">Dour</span>, 
          <span itemProp="addressRegion">Hainaut</span>, 
          <span itemProp="addressCountry">Belgique</span>
        </address>
      </section>
    );
  }

  return (
    <article 
      className="max-w-4xl mx-auto px-4 py-12 text-gray-300"
      itemScope 
      itemType="https://schema.org/LocalBusiness"
    >
      <header className="mb-8">
        <h1 
          className="text-3xl font-bold text-white mb-4 gradient-text"
          itemProp="name"
        >
          JS-INNOV.IA : Automatisation & Intelligence Artificielle à Dour
        </h1>
        <p className="text-xl text-gray-400" itemProp="slogan">
          L'IA pratique, locale et efficace pour les indépendants et entreprises belges
        </p>
      </header>

      <section className="space-y-6" itemProp="description">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-3">
            Votre partenaire IA en Hainaut
          </h2>
          <p>
            Basé à <strong>Dour</strong>, dans le <strong>Hainaut</strong> en <strong>Belgique</strong>, 
            JS-INNOV.IA accompagne les <strong>indépendants</strong>, <strong>courtiers</strong>, 
            <strong>TPE</strong> et <strong>PME</strong> dans leur transformation digitale grâce à 
            l'<strong>intelligence artificielle</strong> et l'<strong>automatisation</strong>.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-white mb-3">
            Nos services d'automatisation IA
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-400">
            <li>
              <strong>Automatisation des tâches répétitives</strong> : 
              Gagnez du temps en automatisant vos processus métier
            </li>
            <li>
              <strong>Applications IA sur mesure</strong> : 
              Développement de solutions personnalisées pour votre activité
            </li>
            <li>
              <strong>Audit SEO et optimisation</strong> : 
              Améliorez votre visibilité en ligne avec notre expertise
            </li>
            <li>
              <strong>Templates vidéo et création visuelle</strong> : 
              Contenus marketing générés par IA
            </li>
            <li>
              <strong>Musiques libres de droits</strong> : 
              Bandes sonores sans SABAM pour commerces
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-white mb-3">
            Pourquoi choisir JS-INNOV.IA ?
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-400">
            <li><strong>Expertise locale</strong> : Proximité et compréhension du marché belge</li>
            <li><strong>Solutions adaptées</strong> : Offres sur mesure pour chaque budget</li>
            <li><strong>Accompagnement personnalisé</strong> : Support continu et formation</li>
            <li><strong>Technologies de pointe</strong> : IA générative, automatisation avancée</li>
          </ul>
        </div>

        <div 
          className="bg-gradient-to-br from-pink-600/10 to-purple-600/10 rounded-2xl p-6 border border-purple-500/20"
        >
          <h2 className="text-2xl font-semibold text-white mb-3">
            Contactez-nous
          </h2>
          <p className="mb-4">
            Vous êtes <strong>indépendant</strong>, <strong>courtier</strong> ou dirigeant de 
            <strong> PME</strong> en <strong>Belgique</strong> ? Découvrez comment l'IA peut 
            transformer votre activité et booster votre productivité.
          </p>
          <address 
            className="not-italic text-gray-400"
            itemProp="address" 
            itemScope 
            itemType="https://schema.org/PostalAddress"
          >
            <span itemProp="addressLocality">Dour</span>, 
            <span itemProp="addressRegion">Hainaut</span>, 
            <span itemProp="addressCountry">Belgique</span>
          </address>
        </div>
      </section>

      {/* Mots-clés cachés pour SEO (accessibles aux lecteurs d'écran) */}
      <footer className="sr-only">
        <p>
          Mots-clés : automatisation IA, intelligence artificielle Dour, IA Belgique, 
          automatisation PME, IA indépendants, Hainaut, courtiers IA, optimisation entreprise,
          solutions IA locales, transformation digitale Belgique, productivité IA,
          développement applications IA, audit SEO gratuit, musique libre de droits,
          templates vidéo IA, JS-INNOV.IA
        </p>
      </footer>
    </article>
  );
}