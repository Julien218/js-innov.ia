import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  BellRing,
  CalendarDays,
  Camera,
  ChevronDown,
  Cloud,
  Download,
  ExternalLink,
  FileVideo2,
  Laptop,
  Library,
  LockKeyhole,
  Menu,
  Monitor,
  PlayCircle,
  ShieldCheck,
  Smartphone,
  Users,
  WifiOff,
  X,
} from 'lucide-react';
import './signelya.css';
import './signelya-pricing.css';

const APP_URL = 'https://app.signelya.jsinnovia.com/ecran-geant';
const SUPPORT_EMAIL = 'info@jsinnovia.com';
const SUPPORT_PHONE = '+32 494 11 90 90';
const OFFICIAL_LOCKUP = '/branding/signelya-officiel-jsinnovia.png?v=20260903-official-2';
const OFFICIAL_ICON = '/branding/signelya-logo-carre.png?v=20260903-official-2';
const OFFICIAL_SOCIAL = 'https://signelya.jsinnovia.com/branding/signelya-officiel-jsinnovia.png?v=20260903-official-2';

const PRICES = {
  signage: { setup: 449, monthly: 69 },
  security: { setup: 241, monthly: 60 },
};

const CREA_PACKS = [
  { spots: 4, plan: 'crea4', monthly: 119 },
  { spots: 10, plan: 'crea10', monthly: 179 },
  { spots: 20, plan: 'crea20', monthly: 279 },
  { spots: 30, plan: 'crea30', monthly: 359 },
];
const LAUNCH_OFFER_LABEL = '10 premiers clients ou jusqu’au 31 mars 2027';

const FEATURES = [
  {
    icon: Library,
    title: 'Médiathèque centralisée',
    text: 'Importez vos images et vidéos, organisez vos contenus et retrouvez chaque campagne depuis un seul espace.',
  },
  {
    icon: PlayCircle,
    title: 'Playlists intelligentes',
    text: 'Composez vos boucles de diffusion, ordonnez les médias et adaptez le contenu à chaque écran.',
  },
  {
    icon: CalendarDays,
    title: 'Programmation précise',
    text: 'Planifiez une campagne par date, plage horaire et durée, sans devoir intervenir sur le Player sur place.',
  },
  {
    icon: BarChart3,
    title: 'Suivi de diffusion',
    text: 'Contrôlez l’état des Players et consultez l’historique opérationnel pour mieux suivre vos campagnes.',
  },
  {
    icon: WifiOff,
    title: 'Continuité hors connexion',
    text: 'Le Player conserve localement les médias déjà synchronisés et poursuit la diffusion lors d’une coupure réseau.',
  },
  {
    icon: Users,
    title: 'Accès par utilisateur',
    text: 'Donnez à chaque membre de l’équipe un accès adapté et gardez les opérations sensibles sous contrôle.',
  },
];

const INSTALL_STEPS = [
  {
    icon: Smartphone,
    label: 'Android',
    title: 'Chrome ou Edge',
    steps: ['Ouvrez l’application Signelya.', 'Touchez Installer ou Ajouter à l’écran d’accueil.', 'Validez : l’icône apparaît avec vos applications.'],
  },
  {
    icon: Smartphone,
    label: 'iPhone et iPad',
    title: 'Safari',
    steps: ['Ouvrez l’application dans Safari.', 'Touchez Partager.', 'Choisissez Sur l’écran d’accueil, puis Ajouter.'],
  },
  {
    icon: Laptop,
    label: 'Windows',
    title: 'Edge ou Chrome',
    steps: ['Ouvrez l’application sur votre ordinateur.', 'Cliquez sur l’icône Installer dans la barre d’adresse.', 'Épinglez Signelya à la barre des tâches si nécessaire.'],
  },
  {
    icon: Laptop,
    label: 'macOS',
    title: 'Chrome ou Edge',
    steps: ['Ouvrez l’application dans votre navigateur.', 'Sélectionnez Installer Signelya dans le menu.', 'Lancez-la ensuite comme une application classique.'],
  },
];

const FAQ = [
  {
    question: 'Dois-je télécharger un fichier sur mon téléphone ?',
    answer: 'Non. Signelya est une application web installable. Vous ouvrez l’application sécurisée dans votre navigateur, puis vous l’ajoutez à l’écran d’accueil. Elle s’ouvre ensuite dans sa propre fenêtre, comme une application.',
  },
  {
    question: 'Puis-je utiliser Signelya sur plusieurs appareils ?',
    answer: 'Oui. Le même compte autorisé peut être utilisé sur téléphone, tablette ou ordinateur. Les droits d’accès restent liés à votre profil et à votre organisation.',
  },
  {
    question: 'Que se passe-t-il si la connexion internet du Player est coupée ?',
    answer: 'Les médias déjà synchronisés restent disponibles dans le cache local du Player. La diffusion peut continuer et la synchronisation reprend lorsque la connexion revient.',
  },
  {
    question: 'La création de vidéos publicitaires est-elle comprise ?',
    answer: 'Oui, avec les Packs Créa : de 4 à 30 spots vidéo de 7 secondes créés chaque mois, prêts à diffuser. La formule Affichage seule gère la diffusion de vos propres contenus ; un spot supplémentaire peut être commandé à 19 € HTVA.',
  },
  {
    question: 'Les prix affichés comprennent-ils la TVA ?',
    answer: 'Non. Les montants sont affichés hors TVA. Le récapitulatif de commande présente la TVA applicable et le montant total avant toute validation de paiement.',
  },
  {
    question: 'Puis-je ajouter la vidéosurveillance plus tard ?',
    answer: 'Oui, après une vérification de compatibilité de vos caméras, de votre réseau et de la durée d’archivage souhaitée. Le module est activé uniquement pour les comptes concernés.',
  },
];

function updateMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    const tagName = selector.startsWith('link') ? 'link' : 'meta';
    element = document.createElement(tagName);
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
}

function BrandLogo({ compact = false }) {
  return (
    <span className={`sy-brand ${compact ? 'sy-brand--compact' : ''}`}>
      <img src={OFFICIAL_LOCKUP} alt="SIGNELYA by JS-Innov.IA — Vos écrans prennent vie." />
    </span>
  );
}

function FeatureCard({ icon: Icon, title, text }) {
  return (
    <article className="sy-feature-card">
      <span className="sy-icon-box" aria-hidden="true"><Icon /></span>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function InstallCard({ icon: Icon, label, title, steps }) {
  return (
    <article className="sy-install-card">
      <div className="sy-install-card__head">
        <span className="sy-icon-box sy-icon-box--small" aria-hidden="true"><Icon /></span>
        <div>
          <p>{label}</p>
          <h3>{title}</h3>
        </div>
      </div>
      <ol>
        {steps.map((step) => <li key={step}>{step}</li>)}
      </ol>
    </article>
  );
}

const euro = (value) => `${String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f')} €`;

function PricingList({ items, yearly }) {
  return (
    <ul className="sgy-list">
      {items.map((item) => <li key={item}>{item}</li>)}
      {yearly && <li className="sgy-gift">Player offert</li>}
      {yearly && <li className="sgy-gift">Mise en service <s>{euro(PRICES.signage.setup)}</s> offerte</li>}
    </ul>
  );
}

function SignelyaPricing() {
  const [billing, setBilling] = useState('year');
  const [spots, setSpots] = useState(10);
  const yearly = billing === 'year';
  const pack = CREA_PACKS.find((item) => item.spots === spots) || CREA_PACKS[1];
  const sub = (monthly) => (yearly ? `soit ${euro(monthly * 12)} HTVA / an` : `Player ${euro(49)} · mise en service ${euro(PRICES.signage.setup)}`);
  const configure = (plan, security = false) => `/digital-signage?plan=${plan}&billing=${billing}${security ? '&security=1' : ''}#configuration`;
  return (
    <section id="tarifs" className="sgy-pricing">
      <div className="sgy-wrap">
        <div className="sgy-head">
          <span className="sgy-eyebrow"><i />TARIFS PROFESSIONNELS</span>
          <h2>Vos écrans prennent vie.<br /><span className="sgy-grad">À un prix clair.</span></h2>
          <p>Choisissez votre formule : pilotage seul, ou pilotage avec création de vos spots vidéo chaque mois.</p>
        </div>
        <div className="sgy-launch">
          <b>🚀 Offre de lancement : <span className="sgy-grad">Player offert + mise en service offerte</span></b>
          <span>Paiement annuel · {LAUNCH_OFFER_LABEL}</span>
        </div>
        <div className="sgy-toggle"><div>
          <button type="button" className={yearly ? 'on' : ''} aria-pressed={yearly} onClick={() => setBilling('year')}>Annuel <small>Player offert</small></button>
          <button type="button" className={!yearly ? 'on' : ''} aria-pressed={!yearly} onClick={() => setBilling('month')}>Mensuel <small>sans engagement</small></button>
        </div></div>
        <div className="sgy-grid">
          <article className="sgy-card">
            <span className="sgy-kicker">DIGITAL SIGNAGE</span>
            <h3>Affichage</h3>
            <p className="sgy-desc">Vous créez vos contenus, Signelya les programme et les diffuse.</p>
            <div className="sgy-price"><strong>{euro(PRICES.signage.monthly)}</strong><em>HTVA / mois</em></div>
            <div className="sgy-sub">{sub(PRICES.signage.monthly)}</div>
            <PricingList yearly={yearly} items={['Médiathèque, playlists et programmation', 'Player local, diffusion même hors connexion', 'État des écrans en temps réel et historique', 'Cockpit sur téléphone, tablette et ordinateur', 'Support local en français']} />
            <Link className="sgy-cta" to={configure('affichage')}>Choisir Affichage</Link>
          </article>
          <article className="sgy-card sgy-hot">
            <span className="sgy-tag">LE PLUS COMPLET</span>
            <span className="sgy-kicker">AFFICHAGE + CRÉATION</span>
            <h3>Pack Créa</h3>
            <p className="sgy-desc">On crée vos spots publicitaires chaque mois, prêts à diffuser.</p>
            <div className="sgy-tabs" role="group" aria-label="Nombre de spots par mois">
              {CREA_PACKS.map((item) => (
                <button key={item.spots} type="button" className={item.spots === spots ? 'on' : ''} aria-pressed={item.spots === spots} onClick={() => setSpots(item.spots)}>{item.spots}<small>spots</small></button>
              ))}
            </div>
            <div className="sgy-price"><strong>{euro(pack.monthly)}</strong><em>HTVA / mois</em></div>
            <div className="sgy-sub">{sub(pack.monthly)}</div>
            <PricingList yearly={yearly} items={[`${pack.spots} spots vidéo de 7 s créés chaque mois`, 'Toutes les fonctions Affichage incluses', '1 aller-retour de corrections par spot', 'Livraison sous 72 h ouvrables']} />
            <Link className="sgy-cta" to={configure(pack.plan)}>Choisir le Pack Créa {pack.spots}</Link>
          </article>
          <article className="sgy-card">
            <span className="sgy-kicker">OPTION</span>
            <h3>Sécurité</h3>
            <p className="sgy-desc">Ajoutez la vidéosurveillance à n’importe quelle formule.</p>
            <div className="sgy-price"><strong>+{euro(PRICES.security.monthly)}</strong><em>HTVA / mois</em></div>
            <div className="sgy-sub">mise en service {euro(PRICES.security.setup)} HTVA</div>
            <ul className="sgy-list">
              {['Vue multi-caméras selon compatibilité', 'Historique et durée de conservation configurés', 'Archivage Dropbox lorsque prévu', 'Alertes de disponibilité et supervision', 'Activable à tout moment'].map((item) => <li key={item}>{item}</li>)}
            </ul>
            <Link className="sgy-cta" to={configure('affichage', true)}>Ajouter la sécurité</Link>
          </article>
        </div>
        <div className="sgy-extra">
          <div className="sgy-box">
            <h4>Bon à savoir</h4>
            <ul>
              <li><b>1 spot = 7 secondes.</b> Un spot de 15 s compte pour 2.</li>
              <li><b>Spot supplémentaire :</b> {euro(19)} HTVA l’unité.</li>
              <li>Spots non utilisés reportables 1 mois.</li>
              <li>Caméras non incluses dans l’option Sécurité.</li>
            </ul>
          </div>
          <div className="sgy-box">
            <h4>Installation des écrans</h4>
            <p>La fixation des écrans, les supports et le câblage sont réalisés par notre <b>installateur partenaire</b>, sur devis séparé. Nous vous mettons en contact.</p>
          </div>
        </div>
        <p className="sgy-legal">Tarifs hors TVA. Formules annuelles : engagement et paiement pour 12 mois. Formules mensuelles : sans engagement, Player {euro(49)} et mise en service {euro(PRICES.signage.setup)}.<br />Le prix total et la TVA applicable sont confirmés avant tout paiement.</p>
      </div>
    </section>
  );
}

function FaqItem({ item, open, onToggle }) {
  return (
    <article className={`sy-faq-item ${open ? 'is-open' : ''}`}>
      <button type="button" onClick={onToggle} aria-expanded={open}>
        <span>{item.question}</span>
        <ChevronDown aria-hidden="true" />
      </button>
      <div className="sy-faq-item__answer" hidden={!open}>
        <p>{item.answer}</p>
      </div>
    </article>
  );
}

export default function SignelyaLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const deviceLabel = useMemo(() => {
    if (typeof navigator === 'undefined') return 'votre appareil';
    const agent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(agent)) return 'votre iPhone ou iPad';
    if (/android/.test(agent)) return 'votre téléphone Android';
    if (/windows/.test(agent)) return 'votre PC Windows';
    if (/macintosh|mac os x/.test(agent)) return 'votre Mac';
    return 'votre appareil';
  }, []);

  useEffect(() => {
    document.documentElement.lang = 'fr-BE';
    document.title = 'SIGNELYA by JS-Innov.IA — Pilotage intelligent de vos écrans';

    updateMeta('meta[name="description"]', {
      name: 'description',
      content: 'SIGNELYA centralise vos médias, playlists, programmations, Players et alertes. Application installable sur téléphone, tablette, PC et Mac.',
    });
    updateMeta('meta[name="theme-color"]', { name: 'theme-color', content: '#050817' });
    updateMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'SIGNELYA by JS-Innov.IA' });
    updateMeta('meta[property="og:title"]', { property: 'og:title', content: 'SIGNELYA — Vos écrans prennent vie.' });
    updateMeta('meta[property="og:description"]', { property: 'og:description', content: 'Pilotez vos écrans, médias et programmations depuis une application installable sur mobile et ordinateur.' });
    updateMeta('meta[property="og:url"]', { property: 'og:url', content: 'https://signelya.jsinnovia.com/' });
    updateMeta('meta[property="og:image"]', { property: 'og:image', content: OFFICIAL_SOCIAL });
    updateMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    updateMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: 'SIGNELYA — Vos écrans prennent vie.' });
    updateMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: 'L’application de pilotage digital conçue par JS-Innov.IA.' });
    updateMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: OFFICIAL_SOCIAL });
    updateMeta('link[rel="canonical"]', { rel: 'canonical', href: 'https://signelya.jsinnovia.com/' });
    updateMeta('link[rel="icon"]', { rel: 'icon', type: 'image/png', href: OFFICIAL_ICON });

    const existing = document.getElementById('signelya-structured-data');
    if (existing) existing.remove();
    const script = document.createElement('script');
    script.id = 'signelya-structured-data';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'SIGNELYA',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Android, iOS, Windows, macOS, Web',
      description: 'Application de gestion et de programmation d’écrans digitaux, avec option vidéosurveillance.',
      url: 'https://signelya.jsinnovia.com/',
      creator: {
        '@type': 'Organization',
        name: 'JS-Innov.IA',
        url: 'https://www.jsinnovia.com/',
      },
      offers: [
        {
          '@type': 'Offer',
          name: 'SIGNELYA Digital Signage',
          price: String(PRICES.signage.monthly),
          priceCurrency: 'EUR',
          category: 'subscription',
        },
        {
          '@type': 'Offer',
          name: 'SIGNELYA Option Sécurité',
          price: String(PRICES.security.monthly),
          priceCurrency: 'EUR',
          category: 'subscription',
        },
      ],
    });
    document.head.appendChild(script);

    return () => script.remove();
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const close = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [menuOpen]);

  return (
    <div className="sy-page">
      <a className="sy-skip-link" href="#contenu">Aller au contenu</a>

      <header className="sy-header">
        <div className="sy-container sy-header__inner">
          <a className="sy-header__brand" href="#accueil" aria-label="Accueil Signelya"><BrandLogo compact /></a>
          <nav className="sy-nav" aria-label="Navigation principale">
            <a href="#fonctionnalites">Fonctionnalités</a>
            <a href="#installation">Installation</a>
            <a href="#tarifs">Tarifs</a>
            <a href="#securite">Sécurité</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="sy-header__actions">
            <a className="sy-button sy-button--ghost" href={APP_URL}>Se connecter</a>
            <a className="sy-button sy-button--primary sy-header__install" href={APP_URL}>
              <Download aria-hidden="true" /> Installer
            </a>
            <button className="sy-menu-button" type="button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-controls="sy-mobile-menu" aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}>
              {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav id="sy-mobile-menu" className="sy-mobile-nav" aria-label="Navigation mobile">
            {[
              ['#fonctionnalites', 'Fonctionnalités'],
              ['#installation', 'Installation'],
              ['#tarifs', 'Tarifs'],
              ['#securite', 'Sécurité'],
              ['#faq', 'FAQ'],
            ].map(([href, label]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
            <a className="sy-button sy-button--primary sy-button--full" href={APP_URL}>Ouvrir l’application</a>
          </nav>
        )}
      </header>

      <main id="contenu">
        <section id="accueil" className="sy-hero">
          <span className="sy-orb sy-orb--cyan" aria-hidden="true" />
          <span className="sy-orb sy-orb--pink" aria-hidden="true" />
          <div className="sy-container sy-hero__grid">
            <div className="sy-hero__copy">
              <div className="sy-kicker"><span className="sy-live-dot" /> Application de pilotage digital</div>
              <h1>Vos écrans prennent vie.<br /><span>Vous gardez le contrôle.</span></h1>
              <p className="sy-hero__lead">Signelya réunit vos médias, playlists, horaires, écrans et alertes dans une interface claire, accessible partout.</p>
              <div className="sy-hero__actions">
                <a className="sy-button sy-button--primary sy-button--large" href={APP_URL}>
                  <Download aria-hidden="true" /> Installer sur {deviceLabel}
                </a>
                <a className="sy-button sy-button--secondary sy-button--large" href="#tarifs">
                  Voir les tarifs <ArrowRight aria-hidden="true" />
                </a>
              </div>
              <p className="sy-install-note"><ShieldCheck aria-hidden="true" /> Aucune boutique d’applications nécessaire. Installation depuis le navigateur sécurisé.</p>
              <div className="sy-trust-row" aria-label="Avantages principaux">
                <span><Monitor aria-hidden="true" /> Multi-écrans</span>
                <span><WifiOff aria-hidden="true" /> Player hors ligne</span>
                <span><Cloud aria-hidden="true" /> Synchronisation à distance</span>
              </div>
            </div>

            <div className="sy-hero__visual" aria-label="Aperçu du cockpit Signelya">
              <div className="sy-dashboard-shell">
                <div className="sy-dashboard-topbar">
                  <div className="sy-dashboard-brand"><img src={OFFICIAL_ICON} alt="" /><span>SIGNELYA</span></div>
                  <span className="sy-status"><i /> Système opérationnel</span>
                </div>
                <div className="sy-dashboard-body">
                  <aside className="sy-dashboard-sidebar" aria-hidden="true">
                    <span className="is-active"><Monitor /></span>
                    <span><Library /></span>
                    <span><CalendarDays /></span>
                    <span><BarChart3 /></span>
                  </aside>
                  <div className="sy-dashboard-content">
                    <div className="sy-dashboard-heading">
                      <div><small>Vue d’ensemble</small><strong>Bonjour, votre diffusion est active</strong></div>
                      <button type="button" tabIndex="-1"><FileVideo2 /> Nouveau média</button>
                    </div>
                    <div className="sy-dashboard-metrics">
                      <article><span>Écrans en ligne</span><strong>1 / 1</strong><em>Connecté</em></article>
                      <article><span>Campagnes actives</span><strong>4</strong><em>Planifiées</em></article>
                      <article><span>Médias disponibles</span><strong>28</strong><em>Synchronisés</em></article>
                    </div>
                    <div className="sy-dashboard-lower">
                      <article className="sy-screen-card">
                        <div className="sy-screen-preview"><PlayCircle /><span>Campagne Espace C</span></div>
                        <div className="sy-screen-meta"><span>Player principal</span><b><i /> En ligne</b></div>
                      </article>
                      <article className="sy-schedule-card">
                        <div><CalendarDays /><span>Prochaine diffusion</span></div>
                        <strong>Aujourd’hui · 12:30</strong>
                        <p>Playlist publicitaire — boucle 2 min</p>
                        <span className="sy-progress"><i /></span>
                      </article>
                    </div>
                  </div>
                </div>
              </div>
              <div className="sy-floating-card sy-floating-card--alert"><BellRing /><div><b>Alerte résolue</b><span>Player reconnecté automatiquement</span></div></div>
              <div className="sy-floating-card sy-floating-card--mobile"><Smartphone /><div><b>Installable</b><span>Mobile, tablette et PC</span></div></div>
            </div>
          </div>
        </section>

        <section className="sy-logo-strip" aria-label="Cas d’usage">
          <div className="sy-container">
            <p>Conçu pour</p>
            <span>Écrans LED</span><i />
            <span>Commerces</span><i />
            <span>Vitrines</span><i />
            <span>Événements</span><i />
            <span>Réseaux multi-sites</span>
          </div>
        </section>

        <section id="fonctionnalites" className="sy-section">
          <div className="sy-container">
            <div className="sy-section-heading">
              <p className="sy-eyebrow">Tout centraliser</p>
              <h2>La diffusion digitale, sans dispersion.</h2>
              <p>Vous préparez, programmez et contrôlez vos contenus depuis Signelya. Le Player exécute la diffusion sur place.</p>
            </div>
            <div className="sy-feature-grid">
              {FEATURES.map((feature) => <FeatureCard key={feature.title} {...feature} />)}
            </div>
          </div>
        </section>

        <section className="sy-section sy-section--panel">
          <div className="sy-container sy-workflow">
            <div className="sy-workflow__copy">
              <p className="sy-eyebrow">Un parcours simple</p>
              <h2>De votre fichier à l’écran en trois étapes.</h2>
              <p>Signelya sépare clairement la préparation des contenus, la programmation et l’exécution par le Player.</p>
              <a className="sy-text-link" href={APP_URL}>Découvrir l’application <ExternalLink aria-hidden="true" /></a>
            </div>
            <ol className="sy-workflow__steps">
              <li><span>01</span><div><h3>Ajoutez vos médias</h3><p>Images et vidéos sont regroupées dans votre médiathèque.</p></div></li>
              <li><span>02</span><div><h3>Créez votre programmation</h3><p>Choisissez l’ordre, les dates et les plages horaires de diffusion.</p></div></li>
              <li><span>03</span><div><h3>Suivez vos Players</h3><p>Le cockpit affiche leur état et permet de réagir rapidement.</p></div></li>
            </ol>
          </div>
        </section>

        <section id="installation" className="sy-section">
          <div className="sy-container">
            <div className="sy-section-heading sy-section-heading--split">
              <div>
                <p className="sy-eyebrow">Application installable</p>
                <h2>Votre cockpit, sur téléphone comme sur ordinateur.</h2>
              </div>
              <div>
                <p>Signelya utilise la technologie PWA : une seule application web, toujours accessible, qui peut être ajoutée à votre appareil sans passer par une boutique.</p>
                <a className="sy-button sy-button--primary" href={APP_URL}><Download aria-hidden="true" /> Ouvrir et installer</a>
              </div>
            </div>
            <div className="sy-install-grid">
              {INSTALL_STEPS.map((item) => <InstallCard key={item.label} {...item} />)}
            </div>
            <div className="sy-install-callout">
              <ShieldCheck aria-hidden="true" />
              <div><strong>Une seule version, toujours à jour.</strong><p>Les améliorations web sont disponibles sans rechercher manuellement un nouveau fichier d’installation.</p></div>
            </div>
          </div>
        </section>

        <SignelyaPricing />

        <section id="securite" className="sy-section sy-section--panel">
          <div className="sy-container sy-security">
            <div className="sy-security__visual" aria-hidden="true">
              <span className="sy-security-ring sy-security-ring--one" />
              <span className="sy-security-ring sy-security-ring--two" />
              <span className="sy-security-core"><LockKeyhole /></span>
              <span className="sy-security-tag sy-security-tag--top"><ShieldCheck /> HTTPS</span>
              <span className="sy-security-tag sy-security-tag--left"><Users /> Accès contrôlés</span>
              <span className="sy-security-tag sy-security-tag--right"><Cloud /> Sauvegarde</span>
            </div>
            <div className="sy-security__copy">
              <p className="sy-eyebrow">Sécurité et gouvernance</p>
              <h2>Vos écrans restent visibles. Vos accès restent maîtrisés.</h2>
              <p>Signelya applique des contrôles d’accès, une connexion chiffrée et une séparation des espaces clients. Les modules sensibles sont activés uniquement selon les droits accordés.</p>
              <ul>
                <li><ShieldCheck aria-hidden="true" /><span><b>Connexion protégée</b> — échanges via HTTPS et sessions authentifiées.</span></li>
                <li><Users aria-hidden="true" /><span><b>Droits adaptés</b> — accès différenciés selon l’utilisateur et l’organisation.</span></li>
                <li><Camera aria-hidden="true" /><span><b>Caméras optionnelles</b> — traitement limité aux installations concernées et à la configuration convenue.</span></li>
                <li><Cloud aria-hidden="true" /><span><b>Données encadrées</b> — hébergement et sous-traitants décrits dans la politique de confidentialité.</span></li>
              </ul>
              <Link className="sy-text-link" to="/signelya/confidentialite">Lire la politique de confidentialité <ArrowRight aria-hidden="true" /></Link>
            </div>
          </div>
        </section>

        <section id="faq" className="sy-section">
          <div className="sy-container sy-faq-layout">
            <div className="sy-faq-layout__intro">
              <p className="sy-eyebrow">Questions fréquentes</p>
              <h2>Ce qu’il faut savoir avant l’activation.</h2>
              <p>Une question propre à votre écran ou votre réseau ? L’équipe JS-Innov.IA vérifie votre configuration avant la mise en service.</p>
              <a className="sy-button sy-button--secondary" href={`mailto:${SUPPORT_EMAIL}`}>Contacter l’équipe</a>
            </div>
            <div className="sy-faq-list">
              {FAQ.map((item, index) => (
                <FaqItem key={item.question} item={item} open={openFaq === index} onToggle={() => setOpenFaq(openFaq === index ? -1 : index)} />
              ))}
            </div>
          </div>
        </section>

        <section className="sy-final-cta">
          <span className="sy-orb sy-orb--cyan" aria-hidden="true" />
          <span className="sy-orb sy-orb--pink" aria-hidden="true" />
          <div className="sy-container sy-final-cta__inner">
            <img src={OFFICIAL_ICON} alt="" />
            <p className="sy-eyebrow">Prêt à centraliser vos diffusions ?</p>
            <h2>Installez Signelya et prenez le contrôle de vos écrans.</h2>
            <p>L’application fonctionne sur téléphone, tablette, Windows et macOS depuis un navigateur compatible.</p>
            <div>
              <a className="sy-button sy-button--primary sy-button--large" href={APP_URL}><Download aria-hidden="true" /> Installer l’application</a>
              <a className="sy-button sy-button--secondary sy-button--large" href="#tarifs">Comparer les offres</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="sy-footer">
        <div className="sy-container sy-footer__grid">
          <div className="sy-footer__brand">
            <BrandLogo />
            <p>La plateforme de pilotage digital conçue par JS-Innov.IA pour donner vie à vos écrans.</p>
          </div>
          <div>
            <h2>Produit</h2>
            <a href="#fonctionnalites">Fonctionnalités</a>
            <a href="#installation">Installation</a>
            <a href="#tarifs">Tarifs</a>
            <a href={APP_URL}>Se connecter</a>
          </div>
          <div>
            <h2>Informations</h2>
            <Link to="/signelya/mentions-legales">Mentions légales</Link>
            <Link to="/signelya/confidentialite">Confidentialité</Link>
            <Link to="/signelya/conditions">Conditions commerciales</Link>
            <a href={`mailto:${SUPPORT_EMAIL}`}>Support</a>
          </div>
          <div>
            <h2>JS-Innov.IA</h2>
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
            <a href="tel:+32494119090">{SUPPORT_PHONE}</a>
            <span>Grand Rue 52 · 7370 Dour</span>
            <span>TVA BE 0877.926.214</span>
          </div>
        </div>
        <div className="sy-container sy-footer__bottom">
          <span>© 2026 JS-INNOV.IA® — Pagin Julien. Tous droits réservés.</span>
          <span>Signelya · Vos écrans prennent vie.</span>
        </div>
      </footer>
    </div>
  );
}
