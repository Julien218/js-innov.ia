import { Link, useLocation } from 'react-router-dom';
import { SOCIALS, WORKS, NETWORK, EDITORIAL } from '../../site-content.mjs';
export function SocialLinks() {
  return (
    <div className="vc-social-links">
      {SOCIALS.map((s) => (
        <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer">
          {s.name} ↗
        </a>
      ))}
    </div>
  );
}
export function WorkPage() {
  return (
    <section className="vc-section">
      <p className="vc-tag">DES CRÉATIONS À DÉCOUVRIR</p>
      <h1>
        Des idées.
        <br />
        <em>Des images. Des histoires.</em>
      </h1>
      <p className="vc-lead">
        Une sélection de films et de formats courts publiés sur la chaîne
        JS-Innov.IA. Découvrez le ton, les univers et les projets du studio.
      </p>
      <div className="vc-grid">
        {WORKS.map((v) => (
          <article className="vc-card vc-work" key={v.id}>
            <a
              href={`https://www.youtube.com/watch?v=${v.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                width="480"
                height="360"
                loading="lazy"
                alt={`Aperçu de ${v.title}`}
              />
              <small>{v.category}</small>
              <h2>{v.title}</h2>
            </a>
            <p>{v.description}</p>
            <a
              className="vc-outline"
              href={`https://www.youtube.com/watch?v=${v.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Regarder sur YouTube ↗
            </a>
          </article>
        ))}
      </div>
      <p>
        Les vidéos s’ouvrent sur YouTube. Aucun lecteur tiers n’est chargé sur
        cette page.
      </p>
      <SocialLinks />
      <div className="vc-content-cta">
        <Link className="vc-primary" to="/videos">
          Créer mon film
        </Link>
        <Link className="vc-outline" to="/ecosysteme">
          Découvrir les sites de l’écosystème
        </Link>
      </div>
    </section>
  );
}
export function SocialPage() {
  return (
    <section className="vc-section">
      <p className="vc-tag">RETROUVONS-NOUS AUSSI ICI</p>
      <h1>
        Le studio en images.
        <br />
        <em>Le territoire en mouvement.</em>
      </h1>
      <div className="vc-grid">
        {SOCIALS.map((s) => (
          <article className="vc-card" key={s.url}>
            <p className="vc-tag">{s.brand}</p>
            <h2>{s.name}</h2>
            <p>{s.description}</p>
            <a
              className="vc-primary"
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ouvrir le profil officiel ↗
            </a>
          </article>
        ))}
      </div>
      <h2>Du contenu au projet.</h2>
      <p>
        Une vidéo vous inspire ? Retrouvez les créations du studio, préparez
        votre film ou explorez un univers de site web. Chaque espace a son rôle
        et reste relié à JS-Innov.IA.
      </p>
      <div className="vc-content-cta">
        <Link to="/realisations" className="vc-outline">
          Voir les réalisations
        </Link>
        <Link to="/web-studio" className="vc-outline">
          Explorer les sites web
        </Link>
        <Link to="/solutions" className="vc-outline">
          Découvrir VilleConnect OS
        </Link>
      </div>
    </section>
  );
}
export function EcosystemPage() {
  return (
    <section className="vc-section">
      <p className="vc-tag">LES SITES RELIÉS AU STUDIO</p>
      <h1>
        Un point de départ.
        <br />
        <em>Plusieurs univers.</em>
      </h1>
      <p className="vc-lead">
        Retrouvez les solutions JS-Innov.IA et les sites de référence locaux.
        Chaque lien ouvre son site dédié.
      </p>
      <div className="vc-grid">
        {NETWORK.map((n) => (
          <article className="vc-card" key={n.name}>
            <small>{n.kind}</small>
            <h2>{n.name}</h2>
            <p>{n.description}</p>
            <a
              className="vc-outline"
              href={n.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Découvrir {n.name} ↗
            </a>
          </article>
        ))}
      </div>
      <h2>Une identité pour chaque projet.</h2>
      <p>
        Les solutions du studio et les réalisations locales conservent leurs
        propres marques. Ce répertoire permet de les retrouver depuis
        JS-Innov.IA sans confondre leurs offres ou leurs espaces clients.
      </p>
      <SocialLinks />
    </section>
  );
}
export function EditorialPage() {
  const { pathname } = useLocation();
  const page = EDITORIAL[pathname];
  if (!page) return null;
  return (
    <article className="vc-section vc-editorial">
      <p className="vc-tag">JS-INNOV.IA · LE STUDIO & LES GUIDES</p>
      <h1>{page.title}</h1>
      <p className="vc-lead">{page.description}</p>
      {page.sections.map(([h, text]) => (
        <section key={h}>
          <h2>{h}</h2>
          <p>{text}</p>
        </section>
      ))}
      <p className="vc-note">
        Par JS-Innov.IA · Mis à jour le 12 novembre 2026
      </p>
      <nav className="vc-content-cta" aria-label="Poursuivre la découverte">
        <Link className="vc-primary" to="/saas-contact">
          Parlons de votre projet
        </Link>
        <Link className="vc-outline" to="/videos">
          Films personnalisés
        </Link>
        <Link className="vc-outline" to="/web-studio">
          Web Studio
        </Link>
      </nav>
    </article>
  );
}
