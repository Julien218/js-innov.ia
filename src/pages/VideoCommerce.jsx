import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowUpRight,
  Check,
  Film,
  Globe,
  MapPin,
  ShieldCheck,
  Sparkles,
  Upload,
  Menu,
  X,
} from 'lucide-react';
import './video-commerce.css';
import { SocialLinks } from './StudioContent';
import AIChatbot from '../components/chatbot/AIChatbot';
import WebsiteExamples from '../components/web-studio/WebsiteExamples';
const offers = [
  {
    id: 'video-1',
    name: 'Essentiel',
    duration: '1 minute',
    price: '49,99 €',
    description: 'Un concentré de vos plus beaux moments.',
  },
  {
    id: 'video-3',
    name: 'Signature',
    duration: '3 minutes',
    price: '100 €',
    description: 'Plus de temps pour raconter votre histoire.',
  },
];
const states = {
  collecting: 'Vos médias et votre brief',
  paid: 'Commande réglée · dossier reçu',
  production: 'Votre film est en préparation',
  internal_review: 'Votre film est en préparation',
  client_review: 'Votre version est prête à découvrir',
  revision_requested: 'Vos ajustements sont pris en compte',
  delivered: 'Votre film est validé',
};
const links = [
  ['Vidéos', '/videos'],
  ['Sites web', '/web-studio'],
  ['Solutions', '/solutions'],
  ['Réalisations', '/realisations'],
  ['Le studio', '/le-studio'],
];
const projects = [
  ['Synergie Dour', 'Événements & communauté', 'https://www.synergiedour.be'],
  [
    'Miss & Mister Dour',
    'Concours & expérience digitale',
    'https://www.missetmisterdour.be',
  ],
  ['Fashionist’ART', 'Mode & événements', 'https://www.fashionistartdour.be'],
];
function Seo({ title, description }) {
  const location = useLocation();
  useEffect(() => {
    document.title = `${title} · JS-Innov.IA`;
    let m = document.querySelector('meta[name="description"]');
    if (!m) {
      m = document.createElement('meta');
      m.name = 'description';
      document.head.append(m);
    }
    m.content = description;
    let c = document.querySelector('link[rel="canonical"]');
    if (!c) {
      c = document.createElement('link');
      c.rel = 'canonical';
      document.head.append(c);
    }
    c.href = `https://jsinnovia.com${location.pathname}`;
  }, [title, description, location.pathname]);
  return null;
}
export function CommerceLayout({ children }) {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [loc.pathname]);
  return (
    <div className="vc">
      <a className="vc-skip" href="#contenu">
        Aller au contenu
      </a>
      <header className="vc-header">
        <Link to="/" className="vc-brand">
          <img
            src="/brand/jsinnovia-128.webp?v=official-800"
            width="64"
            height="64"
            alt="JS-Innov.IA"
          />
          <span>
            JS-INNOV.IA<small>L’IA amplifiée par l’humain</small>
          </span>
        </Link>
        <button
          className="vc-menu"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
          aria-controls="vc-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav
          id="vc-nav"
          className={open ? 'is-open' : ''}
          aria-label="Navigation principale"
        >
          {links.map(([name, path]) => (
            <Link
              key={path}
              to={path}
              aria-current={loc.pathname === path ? 'page' : undefined}
            >
              {name}
            </Link>
          ))}
          <Link className="vc-outline" to="/espace-video">
            Mon espace
          </Link>
        </nav>
      </header>
      <main id="contenu">{children}</main>
      <footer className="vc-footer">
        <div>
          <Link className="vc-wordmark" to="/">
            JS-INNOV.IA
          </Link>
          <p>L’IA amplifiée par l’humain</p>
          <p>Un studio créatif à Dour, pour vos projets d’ici et d’ailleurs.</p>
        </div>
        <div>
          <strong>On en parle ?</strong>
          <a href="mailto:info@jsinnovia.store">info@jsinnovia.store</a>
          <a href="tel:+32494119090">+32 494 11 90 90</a>
          <Link to="/saas-contact">Décrire mon projet</Link>
        </div>
        <div>
          <strong>Informations</strong>
          <Link to="/saas-mentions">Mentions légales</Link>
          <Link to="/saas-confidentialite">Confidentialité</Link>
          <Link to="/saas-cgv">Conditions de vente</Link>
          <Link to="/partenaires">Partenaires & écosystème</Link>
          <Link to="/ecosysteme">Tous les sites reliés</Link>
          <Link to="/reseaux">YouTube & TikTok</Link>
          <Link to="/guides/preparer-sa-video">Bien préparer mon film</Link>
          <Link to="/guides/site-web-local">Préparer mon site web</Link>
        </div>
        <SocialLinks />
        <small>
          © {new Date().getFullYear()} JS-Innov.IA · BCE 0877926214 · Grand Rue
          52, 7370 Dour
        </small>
      </footer>
      {![
        '/espace-video',
        '/commander-video',
        '/studio-review',
        '/web-studio',
      ].includes(loc.pathname) && <AIChatbot />}
    </div>
  );
}
function Tag({ children }) {
  return <p className="vc-tag">{children}</p>;
}
function Action({ to, children }) {
  return (
    <Link className="vc-primary" to={to}>
      {children}
      <ArrowUpRight size={18} />
    </Link>
  );
}
export function CommerceHome() {
  return (
    <>
      <Seo
        title="Studio créatif & solutions digitales à Dour"
        description="Films personnalisés dès 49,99 €, sites web et solutions digitales. JS-Innov.IA à Dour : L’IA amplifiée par l’humain."
      />
      <section className="vc-hero">
        <div>
          <Tag>
            <MapPin size={14} /> DOUR, BELGIQUE · STUDIO CRÉATIF & DIGITAL
          </Tag>
          <h1>
            Vos idées méritent
            <br />
            de <em>prendre vie.</em>
          </h1>
          <p className="vc-lead">
            Un film qui vous ressemble. Un site qui donne envie. Des solutions
            qui font avancer votre activité.
          </p>
          <div className="vc-actions">
            <Action to="/web-studio">Découvrir les exemples de sites</Action>
            <Link className="vc-textlink" to="/videos">
              Créer mon film · dès 49,99 € <ArrowUpRight size={17} />
            </Link>
          </div>
          <p className="vc-note">
            <ShieldCheck size={16} /> Votre projet, notre regard créatif. Vous
            validez le résultat.
          </p>
        </div>
        <div className="vc-brand-art">
          <img
            src="/brand/jsinnovia-official.png?v=official-800"
            alt="Le phénix JS-Innov.IA, identité du studio"
            width="392"
            height="396"
          />
          <span>CRÉATIVITÉ. TECHNOLOGIE. HUMAIN.</span>
        </div>
      </section>
      <section className="vc-strip">
        <span>01 / Imaginez</span>
        <span>02 / Personnalisez</span>
        <span>03 / Validez</span>
        <span>04 / Partagez</span>
      </section>
      <WebsiteExamples />
      <section className="vc-section">
        <Tag>CE QUE NOUS CRÉONS</Tag>
        <h2>
          De l’émotion.
          <br />
          Et de l’impact.
        </h2>
        <div className="vc-grid vc-three">
          <article className="vc-card">
            <Film />
            <h3>Vos souvenirs, en film.</h3>
            <p>
              Mariage, anniversaire, communion ou événement professionnel. Votre
              histoire devient une création à partager.
            </p>
            <Action to="/videos">Découvrir les films</Action>
            <small>1 min · 49,99 € / 3 min · 100 €</small>
          </article>
          <article className="vc-card">
            <Globe />
            <h3>Votre présence digitale.</h3>
            <p>
              Explorez les univers du Web Studio et trouvez la direction qui
              exprime votre activité.
            </p>
            <Action to="/web-studio">Explorer les sites</Action>
            <small>Sur devis, selon votre projet</small>
          </article>
          <article className="vc-card">
            <Sparkles />
            <h3>Votre quotidien, simplifié.</h3>
            <p>
              Des outils pour votre gestion, vos écrans et votre territoire.
              Découvrez l’écosystème JS-Innov.IA.
            </p>
            <Action to="/solutions">Voir les solutions</Action>
            <small>HainoFlow · Signelya · VilleConnect OS</small>
          </article>
        </div>
      </section>
      <section className="vc-section vc-local">
        <Tag>UNE CRÉATIVITÉ ANCRÉE ICI</Tag>
        <h2>
          Depuis Dour.
          <br />
          Avec vous.
        </h2>
        <p>
          Des projets locaux, des besoins concrets et une relation directe avec
          Julien.
        </p>
        <div className="vc-grid">
          {projects.map(([name, desc, url]) => (
            <a
              className="vc-project"
              href={url}
              key={name}
              target="_blank"
              rel="noopener noreferrer"
            >
              <small>{desc}</small>
              <h3>
                {name} <ArrowUpRight size={20} />
              </h3>
              <span>Voir le projet</span>
            </a>
          ))}
        </div>
        <Link className="vc-textlink" to="/partenaires">
          Découvrir notre écosystème <ArrowUpRight size={17} />
        </Link>
      </section>
      <section className="vc-section vc-content-cta">
        <Link className="vc-outline" to="/realisations">
          Découvrir nos films & clips
        </Link>
        <Link className="vc-outline" to="/ecosysteme">
          Les sites de notre écosystème
        </Link>
        <Link className="vc-outline" to="/le-studio">
          Rencontrer le studio
        </Link>
      </section>
      <section className="vc-section vc-guide">
        <img
          src="/brand/companion/companion-avatar-256.webp?v=20261112"
          width="96"
          height="96"
          alt="Elynea, guide virtuel JS-Innov.IA"
        />
        <div>
          <Tag>UN POINT DE DÉPART SIMPLE</Tag>
          <h2>Une idée. Une conversation.</h2>
          <p>
            Vous hésitez entre plusieurs solutions ? Décrivez votre envie, nous
            vous aidons à choisir.
          </p>
        </div>
        <Action to="/saas-contact">Parlons de votre projet</Action>
      </section>
    </>
  );
}
export function VideoShop() {
  return (
    <>
      <Seo
        title="Films personnalisés dès 49,99 €"
        description="Transformez vos photos et vidéos en film personnalisé. 1 minute à 49,99 € ou 3 minutes à 100 €. Brief, médias et validation dans votre espace privé."
      />
      <section className="vc-section vc-shop">
        <Tag>STUDIO VIDÉO · VOTRE HISTOIRE, NOTRE CRÉATIVITÉ</Tag>
        <h1>
          Les moments passent.
          <br />
          <em>L’émotion reste.</em>
        </h1>
        <p className="vc-lead">
          Confiez-nous vos photos, vos vidéos et vos envies. Nous leur donnons
          un rythme, une ambiance et une histoire.
        </p>
        <div className="vc-actions">
          <Action to="/commander-video">Personnaliser mon film</Action>
          <a className="vc-textlink" href="#formules">
            Comparer les formules ↓
          </a>
        </div>
        <div className="vc-chips">
          <span>Mariage</span>
          <span>Anniversaire</span>
          <span>Baptême & communion</span>
          <span>Événement professionnel</span>
        </div>
      </section>
      <section className="vc-section" id="formules">
        <Tag>DEUX FORMULES, UNE MÊME ATTENTION</Tag>
        <h2>Choisissez votre format d’émotion.</h2>
        <div className="vc-grid">
          {offers.map((o, i) => (
            <article
              key={o.id}
              className={`vc-card vc-offer ${i ? 'vc-featured' : ''}`}
            >
              <Tag>{i ? 'POUR RACONTER DAVANTAGE' : 'LE MOMENT FORT'}</Tag>
              <h3>{o.name}</h3>
              <p>{o.description}</p>
              <div className="vc-price">
                {o.price}
                <small> / {o.duration}</small>
              </div>
              <ul>
                <li>
                  <Check size={16} /> Votre brief personnalisé
                </li>
                <li>
                  <Check size={16} /> Vos photos et vidéos
                </li>
                <li>
                  <Check size={16} /> Format horizontal, vertical ou carré
                </li>
                <li>
                  <Check size={16} /> Visionnage privé avant validation
                </li>
                <li>
                  <Check size={16} /> Fichier final téléchargeable
                </li>
              </ul>
              <Action to={`/videos/${o.id}`}>Découvrir {o.name}</Action>
            </article>
          ))}
        </div>
        <p className="vc-note">
          Autres durées et prestations : tarif sur devis. Aucun supplément
          ajouté au montant affiché dans ce parcours de test.
        </p>
      </section>
      <section className="vc-section vc-grid">
        <div>
          <Tag>LE PARCOURS</Tag>
          <h2>
            Simple pour vous.
            <br />
            Soigné par le studio.
          </h2>
          <ol className="vc-steps">
            <li>Choisissez votre durée et votre ambiance.</li>
            <li>Déposez vos médias dans votre espace privé.</li>
            <li>Réglez votre commande sur Stripe.</li>
            <li>Découvrez votre film, demandez vos ajustements et validez.</li>
          </ol>
        </div>
        <aside className="vc-card">
          <ShieldCheck />
          <h3>Et le délai de 24 h ?</h3>
          <p>
            Il n’est pas garanti à ce stade. Le studio confirme le délai après
            réception du paiement, du brief complet et des médias exploitables,
            selon ses disponibilités.
          </p>
          <p>
            Une éventuelle offre 24 h concernera la première version. Les
            ajustements peuvent prolonger la livraison finale.
          </p>
          <strong>En préparation · Paiement de test uniquement</strong>
        </aside>
      </section>
      <section className="vc-section">
        <h2>Avant de commencer.</h2>
        {[
          [
            'Quels fichiers envoyer ?',
            'JPEG, PNG et MP4. Jusqu’à 30 fichiers, 64 Mo par fichier et 512 Mo au total dans cette version de test.',
          ],
          [
            'Qui voit mes médias ?',
            'Vos médias sont privés et accessibles au studio pour préparer votre commande. Ils ne sont pas publiés dans le portfolio.',
          ],
          [
            'Puis-je demander une modification ?',
            'Vous pouvez formuler une demande depuis votre espace. Le périmètre des retouches sera précisé avec le studio avant une commande réelle.',
          ],
          [
            'Puis-je payer maintenant ?',
            'Le parcours est en préparation et accepte uniquement un environnement de test. Aucun paiement réel n’est disponible.',
          ],
        ].map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </section>
    </>
  );
}
export function VideoProduct() {
  const { offer } = useParams();
  const o = offers.find((o) => o.id === offer);
  if (!o)
    return (
      <section className="vc-section">
        <h1>Formule introuvable</h1>
        <Action to="/videos">Voir les formules</Action>
      </section>
    );
  return (
    <>
      <Seo
        title={`Film ${o.name} · ${o.price}`}
        description={`${o.duration} pour raconter votre histoire. Personnalisez votre film JS-Innov.IA avec vos photos et vidéos.`}
      />
      <section className="vc-section vc-grid">
        <div>
          <Tag>VOTRE FILM PERSONNALISÉ</Tag>
          <h1>
            {o.name}.<br />
            <em>{o.duration} à vous.</em>
          </h1>
          <p className="vc-lead">{o.description}</p>
          <div className="vc-price">{o.price}</div>
          <Action to={`/commander-video?offre=${o.id}`}>
            Personnaliser cette formule
          </Action>
        </div>
        <article className="vc-card">
          <h2>Votre histoire donne le ton.</h2>
          <p>
            Choisissez votre événement, l’ambiance et le format. Le studio
            prépare votre création à partir des médias que vous transmettez.
          </p>
          <p>
            Votre espace privé permet de suivre la préparation, découvrir la
            version proposée, demander des ajustements et télécharger le
            résultat après validation.
          </p>
          <p>
            Délai confirmé par le studio. Aucune garantie 24 h actuellement.
          </p>
          <Link to="/videos">Comparer les deux formules</Link>
        </article>
      </section>
    </>
  );
}
export function Solutions() {
  return (
    <>
      <Seo
        title="Solutions digitales & VilleConnect OS"
        description="Découvrez les solutions JS-Innov.IA : HainoFlow, Signelya et VilleConnect OS, plateforme citoyenne, commerciale et communale."
      />
      <section className="vc-section">
        <Tag>L’ÉCOSYSTÈME JS-INNOV.IA</Tag>
        <h1>
          Connecter les idées.
          <br />
          <em>Faire avancer le quotidien.</em>
        </h1>
        <div className="vc-grid vc-three">
          <article className="vc-card">
            <h2>HainoFlow</h2>
            <p>Gestion, devis, factures et suivi pour indépendants et PME.</p>
            <a
              href="https://hainoflow.jsinnovia.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Découvrir HainoFlow ↗
            </a>
          </article>
          <article className="vc-card">
            <h2>Signelya</h2>
            <p>
              Vos médias, écrans et programmations dans une solution dédiée.
            </p>
            <a
              href="https://signelya.jsinnovia.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Découvrir Signelya ↗
            </a>
          </article>
          <article className="vc-card">
            <img
              className="vc-product-logo"
              src="/brand/villeconnect-os.webp"
              width="180"
              height="140"
              alt="VilleConnect OS"
            />
            <h2>VilleConnect OS</h2>
            <p>
              Une plateforme pour relier citoyens, commerces, artisans et
              services communaux. DourConnect en est la déclinaison locale.
            </p>
            <Link to="/saas-contact?produit=villeconnect-os">
              Parler de VilleConnect OS ↗
            </Link>
          </article>
        </div>
      </section>
    </>
  );
}
export function PartnerPage() {
  return (
    <>
      <Seo
        title="Partenaires & écosystème local"
        description="Découvrez les projets locaux et l’écosystème JS-Innov.IA à Dour."
      />
      <section className="vc-section">
        <Tag>ÉCOSYSTÈME & COLLABORATIONS</Tag>
        <h1>
          Le digital avance
          <br />
          <em>avec les bonnes rencontres.</em>
        </h1>
        <p className="vc-lead">
          Notre ancrage à Dour se traduit par des projets concrets. Retrouvez
          une sélection de réalisations et nos solutions.
        </p>
        <h2>Projets & références locales</h2>
        <div className="vc-grid">
          {projects.map(([name, desc, url]) => (
            <a
              className="vc-project"
              href={url}
              key={name}
              target="_blank"
              rel="noopener noreferrer"
            >
              <small>{desc}</small>
              <h3>
                {name}
                <ArrowUpRight size={20} />
              </h3>
              <span>Découvrir le site</span>
            </a>
          ))}
        </div>
        <h2>Nos solutions</h2>
        <Link className="vc-product-link" to="/solutions">
          <img
            src="/brand/villeconnect-os.webp"
            width="100"
            height="80"
            alt="VilleConnect OS"
          />{' '}
          VilleConnect OS · HainoFlow · Signelya <ArrowUpRight />
        </Link>
        <h2>Construisons la suite ensemble.</h2>
        <p>
          Vous êtes une entreprise, une association ou un acteur local et
          souhaitez collaborer avec JS-Innov.IA ?
        </p>
        <Action to="/saas-contact?partenariat=oui">
          Proposer un partenariat
        </Action>
      </section>
    </>
  );
}
async function api(path, token, options = {}) {
  const res = await fetch(`/api/video/${path}`, {
    ...options,
    headers: {
      ...(options.body && !(options.body instanceof File)
        ? { 'Content-Type': 'application/json' }
        : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Demande impossible.');
  return data;
}
function getSession() {
  try {
    const value = JSON.parse(
      sessionStorage.getItem('js-video-session') || 'null',
    );
    return value &&
      /^[a-f0-9-]{36}$/.test(value.id) &&
      /^[a-f0-9]{64}$/.test(value.token)
      ? value
      : null;
  } catch {
    return null;
  }
}
export function VideoConfigure() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    offer:
      new URLSearchParams(window.location.search).get('offre') === 'video-3'
        ? 'video-3'
        : 'video-1',
    event: 'Mariage',
    mood: 'Émotion',
    format: '16:9',
    name: '',
    email: '',
    brief: '',
    consent: false,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [catalog, setCatalog] = useState(null);
  useEffect(() => {
    api('catalog')
      .then(setCatalog)
      .catch((e) => setError(e.message));
  }, []);
  function field(key) {
    return {
      value: form[key],
      onChange: (e) => setForm({ ...form, [key]: e.target.value }),
    };
  }
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const o = await api('orders', null, {
        method: 'POST',
        body: JSON.stringify(form),
      });
      sessionStorage.setItem(
        'js-video-session',
        JSON.stringify({ id: o.id, token: o.token }),
      );
      nav('/espace-video');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Seo
        title="Personnaliser mon film"
        description="Choisissez votre formule, votre événement et l’ambiance de votre film."
      />
      <section className="vc-section">
        <Tag>01 / IMAGINONS VOTRE FILM</Tag>
        <h1>
          Racontez-nous
          <br />
          <em>ce qui compte.</em>
        </h1>
        <p className="vc-notice">
          Parcours de test · aucun paiement réel. Utilisez des coordonnées et
          des médias de démonstration.
        </p>
        <form className="vc-config" onSubmit={submit}>
          <div className="vc-card">
            <fieldset>
              <legend>Votre formule</legend>
              {offers.map((o) => (
                <label className="vc-radio" key={o.id}>
                  <input
                    type="radio"
                    name="offer"
                    value={o.id}
                    checked={form.offer === o.id}
                    onChange={(e) =>
                      setForm({ ...form, offer: e.target.value })
                    }
                  />
                  <span>
                    {o.name} · {o.duration}
                  </span>
                  <strong>{o.price}</strong>
                </label>
              ))}
            </fieldset>
            <div className="vc-grid">
              <label>
                Votre événement
                <select {...field('event')}>
                  {[
                    'Mariage',
                    'Anniversaire',
                    'Baptême / communion',
                    'Événement professionnel',
                    'Autre',
                  ].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
              <label>
                L’ambiance
                <select {...field('mood')}>
                  {['Émotion', 'Dynamique', 'Cinéma'].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              Le format
              <select {...field('format')}>
                <option value="16:9">Horizontal · 16:9</option>
                <option value="9:16">Vertical · 9:16</option>
                <option value="1:1">Carré · 1:1</option>
              </select>
            </label>
            <label>
              Votre histoire, vos envies
              <textarea
                required
                minLength={10}
                maxLength={4000}
                rows={5}
                {...field('brief')}
                placeholder="Les moments à retenir, les personnes, le texte à afficher, l’émotion souhaitée…"
              />
            </label>
            <div className="vc-grid">
              <label>
                Votre nom
                <input
                  required
                  maxLength={100}
                  autoComplete="name"
                  {...field('name')}
                />
              </label>
              <label>
                Votre e-mail
                <input
                  required
                  type="email"
                  maxLength={254}
                  autoComplete="email"
                  {...field('email')}
                />
              </label>
            </div>
            <label className="vc-check">
              <input
                type="checkbox"
                required
                checked={form.consent}
                onChange={(e) =>
                  setForm({ ...form, consent: e.target.checked })
                }
              />
              <span>
                Je dispose des autorisations nécessaires sur les médias transmis
                et j’ai lu la{' '}
                <Link to="/saas-confidentialite">
                  politique de confidentialité
                </Link>
                .
              </span>
            </label>
            <p role="alert">{error}</p>
            <button className="vc-primary" disabled={busy || !catalog?.enabled}>
              {busy ? 'Création de votre espace…' : 'Continuer vers mes médias'}
              <ArrowUpRight size={18} />
            </button>
            {catalog && !catalog.enabled && (
              <p>
                Les commandes ne sont pas encore ouvertes.{' '}
                <Link to="/saas-contact">Contacter le studio</Link>
              </p>
            )}
          </div>
          <aside className="vc-card vc-summary">
            <Tag>VOTRE CRÉATION</Tag>
            <h2>Film {offers.find((o) => o.id === form.offer).name}</h2>
            <div className="vc-price">
              {offers.find((o) => o.id === form.offer).price}
            </div>
            <p>
              {form.event} · {form.mood} · {form.format}
            </p>
            <p>Médias privés. Validation avant livraison.</p>
            <p>
              Le délai est confirmé après réception du dossier complet. Aucune
              garantie 24 h à ce stade.
            </p>
            <small>
              Étape suivante : vos médias, puis Stripe en mode test.
            </small>
          </aside>
        </form>
      </section>
    </>
  );
}
export function VideoSpace() {
  const [session, setSession] = useState(getSession);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [link, setLink] = useState('');
  const [restore, setRestore] = useState('');
  const [progress, setProgress] = useState('');
  async function refresh() {
    if (session) setOrder(await api(`orders/${session.id}`, session.token));
  }
  useEffect(() => {
    if (!session) return;
    let live = true;
    const update = () =>
      api(`orders/${session.id}`, session.token)
        .then((x) => {
          if (live) setOrder(x);
        })
        .catch((e) => {
          if (live) setError(e.message);
        });
    update();
    const timer = setInterval(update, 10000);
    return () => {
      live = false;
      clearInterval(timer);
    };
  }, [session]);
  async function run(fn) {
    setBusy(true);
    setError('');
    try {
      await fn();
      await refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
      setProgress('');
    }
  }
  async function download() {
    const r = await fetch(`/api/video/orders/${session.id}/download`, {
      headers: { Authorization: `Bearer ${session.token}` },
    });
    if (!r.ok) throw new Error('Le fichier n’est pas disponible.');
    const u = URL.createObjectURL(await r.blob());
    const a = document.createElement('a');
    a.href = u;
    a.download = 'JS-InnovIA-film.mp4';
    a.click();
    setTimeout(() => URL.revokeObjectURL(u), 1000);
  }
  function recover(e) {
    e.preventDefault();
    try {
      const u = new URL(restore);
      const [id, token] = u.hash.slice(1).split('.');
      if (!/^[a-f0-9-]{36}$/.test(id) || !/^[a-f0-9]{64}$/.test(token))
        throw new Error();
      const s = { id, token };
      sessionStorage.setItem('js-video-session', JSON.stringify(s));
      setSession(s);
      window.history.replaceState(null, '', '/espace-video');
      setError('');
    } catch {
      setError('Lien privé invalide.');
    }
  }
  useEffect(() => {
    if (window.location.hash) {
      setRestore(window.location.href);
    }
  }, []);
  return (
    <>
      <Seo
        title="Mon espace vidéo privé"
        description="Suivez votre film JS-Innov.IA et retrouvez vos médias et votre validation."
      />
      <section className="vc-section">
        <Tag>VOTRE ESPACE PRIVÉ</Tag>
        <h1>
          Votre histoire.
          <br />
          <em>À chaque étape.</em>
        </h1>
        <p className="vc-notice">Espace de test · aucun paiement réel.</p>
        {!session ? (
          <div className="vc-card">
            <h2>Retrouvez votre commande</h2>
            <form onSubmit={recover}>
              <label>
                Votre lien privé
                <input
                  type="url"
                  required
                  value={restore}
                  onChange={(e) => setRestore(e.target.value)}
                />
              </label>
              <button className="vc-primary">Ouvrir ma commande</button>
            </form>
            <p>
              Votre lien privé vous a été proposé à la création de l’espace.
              Conservez-le comme un mot de passe. Aucun e-mail automatique n’est
              envoyé dans cette version.
            </p>
            <Action to="/commander-video">Créer un nouveau film</Action>
          </div>
        ) : order ? (
          <div className="vc-config">
            <div className="vc-card">
              <h2>{states[order.status] || 'Suivi de votre commande'}</h2>
              <p>Référence : {order.id}</p>
              <p>
                Paiement :{' '}
                {
                  {
                    paid: 'confirmé',
                    unpaid: 'en attente',
                    failed: 'échoué',
                    expired: 'session expirée',
                  }[order.payment]
                }
              </p>
              <p role="status">{progress}</p>
              <ul>
                {order.files.map((f) => (
                  <li key={f.id}>
                    {f.name} · {(f.size / 1024 / 1024).toFixed(1)} Mo
                  </li>
                ))}
              </ul>
              {['collecting', 'paid'].includes(order.status) && (
                <>
                  <label className="vc-upload">
                    <Upload />
                    Ajouter des photos ou vidéos
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,video/mp4"
                      disabled={busy || order.complete}
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        run(async () => {
                          for (let i = 0; i < files.length; i++) {
                            if (files[i].size > 64 * 1024 * 1024)
                              throw new Error('64 Mo maximum par fichier.');
                            setProgress(
                              `Envoi ${i + 1}/${files.length} : ${files[i].name}`,
                            );
                            await api(
                              `orders/${session.id}/files`,
                              session.token,
                              {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/octet-stream',
                                  'x-file-name': files[i].name.replace(
                                    /[^a-zA-Z0-9._ -]/g,
                                    '_',
                                  ),
                                },
                                body: files[i],
                              },
                            );
                          }
                        });
                        e.target.value = '';
                      }}
                    />
                  </label>
                  <small>
                    JPEG, PNG, MP4 · 30 fichiers · 64 Mo/fichier · 512
                    Mo/dossier
                  </small>
                  <button
                    className="vc-primary"
                    disabled={
                      busy || !order.files.length || order.payment === 'paid'
                    }
                    onClick={() =>
                      run(async () => {
                        await api(
                          `orders/${session.id}/complete`,
                          session.token,
                          { method: 'POST', body: '{}' },
                        );
                        const x = await api(
                          `orders/${session.id}/checkout`,
                          session.token,
                          { method: 'POST', body: '{}' },
                        );
                        window.location.assign(x.url);
                      })
                    }
                  >
                    Confirmer le dossier et payer en test
                  </button>
                  <p>
                    Après confirmation, les médias sont verrouillés pour
                    préserver votre dossier.
                  </p>
                </>
              )}
              {order.downloadable && (
                <>
                  <button
                    className="vc-primary"
                    disabled={busy}
                    onClick={() => run(download)}
                  >
                    Télécharger et découvrir mon film
                  </button>
                  {order.status === 'client_review' && (
                    <>
                      <button
                        className="vc-outline"
                        disabled={busy}
                        onClick={() =>
                          run(() =>
                            api(`orders/${session.id}/review`, session.token, {
                              method: 'POST',
                              body: JSON.stringify({ decision: 'approve' }),
                            }),
                          )
                        }
                      >
                        Valider mon film
                      </button>
                      <label>
                        Vos ajustements
                        <textarea
                          value={feedback}
                          maxLength={2000}
                          onChange={(e) => setFeedback(e.target.value)}
                        />
                      </label>
                      <button
                        className="vc-outline"
                        disabled={busy || feedback.trim().length < 5}
                        onClick={() =>
                          run(() =>
                            api(`orders/${session.id}/review`, session.token, {
                              method: 'POST',
                              body: JSON.stringify({
                                decision: 'changes',
                                feedback,
                              }),
                            }),
                          )
                        }
                      >
                        Envoyer mes ajustements
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
            <aside className="vc-card vc-summary">
              <h2>Film personnalisé</h2>
              <p>{order.offer.name}</p>
              <div className="vc-price">
                {(order.offer.amount / 100).toLocaleString('fr-BE', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </div>
              <button
                className="vc-outline"
                onClick={() =>
                  setLink(
                    `${window.location.origin}/espace-video#${session.id}.${session.token}`,
                  )
                }
              >
                Afficher mon lien de récupération
              </button>
              {link && (
                <label>
                  Conservez ce lien privé
                  <input
                    readOnly
                    value={link}
                    onFocus={(e) => e.target.select()}
                  />
                </label>
              )}
              <p>
                Enregistrez ce lien avant de quitter cette session. Aucun e-mail
                n’est envoyé à ce stade.
              </p>
              <p>Délai à confirmer avec le studio.</p>
              <button
                className="vc-textlink"
                onClick={() => {
                  sessionStorage.removeItem('js-video-session');
                  setSession(null);
                  setOrder(null);
                  setLink('');
                }}
              >
                Fermer ma session
              </button>
            </aside>
          </div>
        ) : (
          <p>Chargement de votre commande…</p>
        )}
        <p role="alert">{error}</p>
      </section>
    </>
  );
}
