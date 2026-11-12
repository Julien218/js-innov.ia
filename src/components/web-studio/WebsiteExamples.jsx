import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { WEBSITE_CONCEPTS, WebsiteConceptContent } from './WebGallery';
import { updateExperience } from '../../lib/visitorExperienceStore.mjs';

export default function WebsiteExamples() {
  return (
    <section
      className="vc-section wg vc-home-examples"
      aria-labelledby="website-examples-title"
    >
      <p className="vc-tag">VOTRE FUTUR SITE COMMENCE ICI</p>
      <div className="vc-example-heading">
        <div>
          <h2 id="website-examples-title">Des exemples pour vous projeter.</h2>
          <p>
            Artisan, restaurant, entreprise ou événement : trouvez un univers
            qui parle à vos clients. Cliquez sur un exemple pour découvrir le
            Web Studio et personnaliser votre projet.
          </p>
        </div>
        <Link className="vc-outline" to="/web-studio">
          Voir tous les exemples <ArrowUpRight size={17} />
        </Link>
      </div>
      <div className="wg-grid">
        {WEBSITE_CONCEPTS.map((concept) => {
          const destination = `/web-studio?modele=${concept.id}&secteur=${concept.sector}`;
          const select = () =>
            updateExperience({
              model: concept.id,
              sector: concept.sector,
              goal: 'web',
            });
          return (
            <article className="wg-card" key={concept.id}>
              <Link
                className={`wg-preview wg-${concept.id}`}
                to={destination}
                onClick={select}
                aria-label={`Découvrir l’exemple ${concept.name} dans le Web Studio`}
              >
                <WebsiteConceptContent concept={concept} heading="h3" />
              </Link>
              <div className="wg-caption">
                <div>
                  <small>{concept.label}</small>
                  <h3>{concept.name}</h3>
                </div>
                <Link to={destination} onClick={select}>
                  Découvrir ce site <ArrowUpRight size={16} />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
      <p className="wg-disclaimer">
        Concepts fictifs · Illustrations IA de démonstration · Votre site sera
        adapté à votre identité.
      </p>
      <div className="vc-example-next">
        <p>
          Dans le Web Studio : explorez les 18 concepts, essayez votre identité
          et préparez votre demande.
        </p>
        <Link className="vc-primary" to="/web-studio">
          Explorer les sites web <ArrowUpRight size={18} />
        </Link>
      </div>
    </section>
  );
}
