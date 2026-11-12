import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MODELS, modelById } from '../../lib/webStudio.mjs';
import './web-gallery.css';
const categories = [
  ['', 'Tous'],
  ['artisan', 'Artisanat'],
  ['horeca', 'Restauration'],
  ['immobilier', 'Architecture'],
  ['evenement', 'Événement'],
];
export default function WebGallery({ onExplore, onCategory }) {
  const [category, setCategory] = useState('');
  const concepts = [
    {
      id: 'atelier',
      sector: 'artisan',
      name: 'Atelier',
      label: 'Artisan',
      title: 'Le détail change tout.',
      description:
        'Mobilier sur mesure, agencement, pièces uniques en bois massif.',
      image: '/concepts/atelier-photo.webp',
      cta: 'Parlons de votre projet',
      nav: ['Réalisations', 'Savoir-faire', 'L’atelier'],
    },
    {
      id: 'aura',
      sector: 'horeca',
      name: 'Aura',
      label: 'Restaurant',
      title: 'Une table. Mille histoires.',
      description:
        'Cuisine de saison, produits d’exception et inspirations d’ici et d’ailleurs.',
      image: '/concepts/aura-photo.webp',
      cta: 'Découvrir la carte',
      nav: ['La carte', 'Notre maison', 'Réserver'],
    },
  ];
  const visible = concepts.filter((c) => !category || c.sector === category);
  return (
    <section className="wg" aria-labelledby="wg-title">
      <div className="wg-intro">
        <p className="wg-overline">JS-INNOV.IA / SITES DE CARACTÈRE</p>
        <h1 id="wg-title">
          Des sites qui ont du <em>caractère</em>
          <span>.</span>
        </h1>
        <p>Une identité forte. Une expérience qui donne envie.</p>
      </div>
      <div
        className="wg-filters"
        role="group"
        aria-label="Les univers du studio"
      >
        {categories.map(([id, label]) => (
          <button
            key={id}
            aria-pressed={category === id}
            onClick={() => {
              setCategory(id);
              onCategory(id);
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="wg-grid">
        {visible.map((c, i) => (
          <article className="wg-card" key={c.id}>
            <button
              className={`wg-preview wg-${c.id}`}
              onClick={(e) => onExplore(modelById(c.id), e.currentTarget)}
              aria-label={`Explorer le concept ${c.name}`}
            >
              <div className="wg-demo-nav">
                <strong>
                  {c.name}
                  <small>
                    {c.id === 'atelier'
                      ? 'ÉBÉNISTERIE SUR MESURE'
                      : 'RESTAURANT CONTEMPORAIN'}
                  </small>
                </strong>
                <span>
                  {c.nav.map((n) => (
                    <i key={n}>{n}</i>
                  ))}
                </span>
              </div>
              <div className="wg-photo">
                <img
                  src={c.image}
                  alt={
                    c.id === 'atelier'
                      ? 'Artisan dans un atelier de bois — illustration IA de démonstration'
                      : 'Table gastronomique dans un restaurant — illustration IA de démonstration'
                  }
                  width="900"
                  height="1000"
                  loading="eager"
                />
              </div>
              <div className="wg-demo-copy">
                <h2>{c.title}</h2>
                <p>{c.description}</p>
                <span>
                  {c.cta} <b>→</b>
                </span>
                {c.id === 'atelier' && (
                  <small>
                    MATIÈRES NOBLES
                    <br />& SAVOIR-FAIRE
                  </small>
                )}
              </div>
            </button>
            <div className="wg-caption">
              <div>
                <small>
                  0{i + 1} / {c.label}
                </small>
                <h2>{c.name}</h2>
              </div>
              <button
                onClick={(e) => onExplore(modelById(c.id), e.currentTarget)}
              >
                Explorer le concept ↗
              </button>
            </div>
          </article>
        ))}
      </div>
      {!visible.length && (
        <div className="wg-more">
          <h2>
            {category === 'immobilier'
              ? 'Des espaces qui expriment votre vision.'
              : 'Des expériences qui rassemblent.'}
          </h2>
          <p>
            Explorez les directions interactives de la collection et projetez-y
            votre identité.
          </p>
          {MODELS.filter((m) => m.sector === category).map((m) => (
            <button key={m.id} onClick={(e) => onExplore(m, e.currentTarget)}>
              Découvrir {m.name} ↗
            </button>
          ))}
        </div>
      )}
      <p className="wg-disclaimer">
        Concepts fictifs · Illustrations IA de démonstration · Aucun de ces
        exemples n’est un établissement client.
      </p>
      <div className="wg-depth">
        <div>
          <h2>Votre métier donne la direction.</h2>
          <p>
            Une belle page doit aussi aider vos visiteurs à comprendre votre
            offre et à passer à l’action. Nous construisons la structure, les
            contenus et les fonctions autour de votre activité.
          </p>
        </div>
        <div>
          <h3>Une identité qui vous ressemble</h3>
          <p>
            Logo, couleurs, photographies et ton éditorial se répondent. Votre
            site prolonge l’expérience de votre entreprise.
          </p>
          <h3>Un parcours qui a du sens</h3>
          <p>
            Présenter une carte, recevoir une demande, exposer un savoir-faire
            ou valoriser un événement : chaque page a un rôle précis.
          </p>
          <h3>Une base pour être trouvé</h3>
          <p>
            Des pages lisibles sur mobile, des informations locales cohérentes
            et des contenus explicites pour les visiteurs, les moteurs et les
            assistants de recherche.
          </p>
        </div>
      </div>
      <div className="wg-links">
        <Link to="/realisations">Voir les réalisations JS-Innov.IA ↗</Link>
        <a href="#ws-collection">Explorer les 18 concepts interactifs ↓</a>
        <Link to="/saas-contact">Parlons de votre futur site ↗</Link>
      </div>
    </section>
  );
}
