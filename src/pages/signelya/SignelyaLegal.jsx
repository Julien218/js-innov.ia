import { ArrowLeft, ExternalLink, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import './signelya.css';

const UPDATED_AT = '3 septembre 2026';
const COMPANY = {
  tradeName: 'JS-INNOV.IA®',
  legalName: 'Pagin Julien',
  address: 'Grand Rue 52, 7370 Dour, Belgique',
  vat: 'BE 0877.926.214',
  email: 'info@jsinnovia.com',
  phone: '+32 494 11 90 90',
};

const PAGES = {
  mentions: {
    eyebrow: 'Informations juridiques',
    title: 'Mentions légales',
    intro: 'Identité de l’éditeur, hébergement, propriété intellectuelle et règles d’utilisation du site Signelya.',
    sections: [
      {
        title: '1. Éditeur du site',
        paragraphs: [
          `Le site signelya.jsinnovia.com et la solution Signelya sont édités sous le nom commercial ${COMPANY.tradeName} par ${COMPANY.legalName}, établi à ${COMPANY.address}.`,
          `Numéro d’entreprise et de TVA : ${COMPANY.vat}. Le responsable de la publication est Julien Pagin.`,
        ],
      },
      {
        title: '2. Coordonnées',
        paragraphs: [
          `Pour toute question relative au site, à l’application ou à une commande : ${COMPANY.email} — ${COMPANY.phone}.`,
        ],
      },
      {
        title: '3. Hébergement et services techniques',
        paragraphs: [
          'Le site public et certains services applicatifs sont hébergés sur l’infrastructure Railway. L’application peut également utiliser, selon les modules activés, des services techniques de base de données, de paiement, de stockage, de messagerie et de surveillance.',
          'Ces prestataires interviennent uniquement dans la mesure nécessaire au fonctionnement, à la sécurité, à la facturation ou au support de Signelya.',
        ],
      },
      {
        title: '4. Propriété intellectuelle',
        paragraphs: [
          'La marque Signelya, son identité visuelle, les textes, interfaces, logiciels, illustrations, vidéos, éléments graphiques et contenus du site sont protégés par le droit d’auteur, le droit des marques et les autres règles applicables à la propriété intellectuelle.',
          'Aucune reproduction, adaptation, extraction substantielle, diffusion ou exploitation n’est autorisée sans accord écrit préalable de JS-Innov.IA, sauf utilisation expressément permise par la loi ou par le contrat du client.',
        ],
      },
      {
        title: '5. Contenus déposés par les utilisateurs',
        paragraphs: [
          'Le client reste responsable des images, vidéos, marques, musiques, messages et autres contenus qu’il importe ou diffuse avec Signelya. Il garantit disposer des droits et autorisations nécessaires pour leur utilisation et leur diffusion.',
          'JS-Innov.IA peut suspendre un contenu manifestement illicite, dangereux, frauduleux ou portant atteinte aux droits d’un tiers, sans préjudice des autres mesures prévues au contrat ou par la loi.',
        ],
      },
      {
        title: '6. Exactitude et disponibilité',
        paragraphs: [
          'JS-Innov.IA veille à maintenir des informations claires et un service opérationnel. Des opérations de maintenance, mises à jour, incidents réseau ou interventions de prestataires peuvent néanmoins affecter temporairement l’accès au site ou à certaines fonctions.',
          'Les informations générales du site ne remplacent pas une étude technique de l’écran, du Player, du réseau ou des caméras. La compatibilité et le périmètre précis sont confirmés lors de la configuration ou dans l’offre commerciale.',
        ],
      },
      {
        title: '7. Liens externes',
        paragraphs: [
          'Le site peut renvoyer vers des services externes, notamment pour le paiement, l’hébergement ou l’assistance. Ces services disposent de leurs propres conditions et politiques de confidentialité.',
        ],
      },
      {
        title: '8. Droit applicable',
        paragraphs: [
          'Les présentes mentions sont régies par le droit belge. Les règles impératives applicables aux consommateurs, à la protection des données et à la compétence des juridictions restent pleinement applicables.',
        ],
      },
    ],
  },
  confidentialite: {
    eyebrow: 'Protection des données',
    title: 'Politique de confidentialité',
    intro: 'Les données utilisées par Signelya sont limitées aux besoins du service, de la sécurité, du support et de la facturation.',
    sections: [
      {
        title: '1. Responsable du traitement',
        paragraphs: [
          `${COMPANY.tradeName}, exploité par ${COMPANY.legalName}, ${COMPANY.address}, est responsable des traitements décrits dans la présente politique lorsqu’il détermine les finalités et moyens du traitement.`,
          `Contact vie privée : ${COMPANY.email}.`,
        ],
      },
      {
        title: '2. Données susceptibles d’être traitées',
        paragraphs: [
          'Selon votre utilisation, Signelya peut traiter : les coordonnées professionnelles et d’identification, les informations de compte et de rôle, l’adresse d’installation, les caractéristiques techniques des écrans, Players, réseaux ou caméras, les médias importés, les programmations, les journaux de connexion et d’activité, les demandes de support ainsi que les références de commande et de facturation.',
          'Les données complètes de carte bancaire ne sont pas enregistrées par Signelya. Le paiement est traité sur l’environnement sécurisé de Stripe.',
        ],
      },
      {
        title: '3. Finalités et bases juridiques',
        paragraphs: [
          'Les données sont utilisées pour répondre à une demande, vérifier la faisabilité technique, créer et administrer un compte, exécuter le service, synchroniser les Players, assurer la sécurité, fournir le support, gérer les paiements et la comptabilité, prévenir les abus et respecter les obligations légales.',
          'Selon la situation, ces traitements reposent sur l’exécution de mesures précontractuelles ou d’un contrat, le respect d’une obligation légale, l’intérêt légitime à sécuriser et améliorer le service, ou le consentement lorsqu’il est requis pour une utilisation facultative.',
        ],
      },
      {
        title: '4. Destinataires et sous-traitants',
        paragraphs: [
          'Les données sont accessibles aux personnes autorisées de JS-Innov.IA et, dans la limite de leur mission, aux prestataires nécessaires au fonctionnement du service. Ceux-ci peuvent inclure Railway pour l’hébergement, Supabase pour certains services de base de données et d’authentification, Stripe pour le paiement, Dropbox pour l’archivage lorsqu’il est activé, ainsi que des prestataires de messagerie, d’alertes ou de support selon les options choisies.',
          'Une transmission à une autorité peut avoir lieu lorsqu’elle est imposée par la loi ou nécessaire à la défense d’un droit.',
        ],
      },
      {
        title: '5. Transferts internationaux',
        paragraphs: [
          'Certains prestataires technologiques peuvent traiter des données en dehors de l’Espace économique européen. Dans ce cas, le traitement est encadré par un mécanisme reconnu par le droit applicable, tel qu’une décision d’adéquation ou des clauses contractuelles types, lorsque ce mécanisme est requis.',
        ],
      },
      {
        title: '6. Durée de conservation',
        paragraphs: [
          'Les données sont conservées pendant la durée nécessaire à la demande, à l’exécution du contrat, au support et à la sécurité, puis pendant les délais requis pour respecter les obligations comptables, fiscales, probatoires ou légales. Les médias, programmations et données d’exploitation sont supprimés ou restitués selon les modalités du contrat et les capacités de sauvegarde applicables.',
          'Les journaux techniques sont conservés pour une durée proportionnée aux besoins de sécurité, de diagnostic et de preuve de fonctionnement.',
        ],
      },
      {
        title: '7. Sécurité',
        paragraphs: [
          'Des mesures techniques et organisationnelles raisonnables sont mises en œuvre : communications HTTPS, authentification, gestion des rôles, limitation des accès, journalisation, sauvegardes et contrôle des opérations sensibles. Aucun système ne pouvant garantir un risque nul, les mesures sont régulièrement adaptées au contexte technique.',
        ],
      },
      {
        title: '8. Vos droits',
        paragraphs: [
          'Dans les conditions prévues par le RGPD, vous pouvez demander l’accès à vos données, leur rectification, leur effacement, la limitation du traitement, leur portabilité ou vous opposer à certains traitements. Vous pouvez retirer un consentement pour l’avenir lorsqu’un traitement repose sur celui-ci.',
          `La demande peut être adressée à ${COMPANY.email}. Une preuve d’identité proportionnée peut être demandée en cas de doute raisonnable sur l’identité du demandeur. Vous pouvez également introduire une réclamation auprès de l’Autorité de protection des données en Belgique.`,
        ],
      },
      {
        title: '9. Cookies et stockage local',
        paragraphs: [
          'La landing page Signelya n’utilise pas volontairement de traceurs publicitaires. Le site et l’application peuvent utiliser des cookies ou espaces de stockage strictement nécessaires à la sécurité, à la session, aux préférences, à l’installation PWA et au fonctionnement hors connexion.',
          'Tout traceur facultatif nécessitant un consentement devra être désactivé par défaut et présenté au moyen d’un mécanisme de choix approprié avant son activation.',
        ],
      },
      {
        title: '10. Mise à jour de la politique',
        paragraphs: [
          'La présente politique peut évoluer pour refléter une modification du service, des prestataires ou des règles applicables. La date de mise à jour affichée sur cette page permet d’identifier la version en vigueur.',
        ],
      },
    ],
  },
  conditions: {
    eyebrow: 'Cadre commercial',
    title: 'Conditions commerciales et d’utilisation',
    intro: 'Principes applicables à la présentation, à la commande et à l’usage professionnel de Signelya.',
    sections: [
      {
        title: '1. Objet',
        paragraphs: [
          'Les présentes conditions encadrent l’accès au site Signelya, la demande de configuration, la souscription aux services de pilotage d’écrans digitaux et, lorsqu’elle est choisie, l’option de vidéosurveillance compatible.',
          'Le périmètre définitif d’une installation, les options, le matériel, l’accompagnement et les délais figurent dans le récapitulatif de commande, le devis, le bon de commande ou le contrat particulier. Ces documents prévalent en cas de divergence.',
        ],
      },
      {
        title: '2. Public concerné et prérequis',
        paragraphs: [
          'Signelya est principalement proposé aux professionnels, entreprises, indépendants, associations et organisations exploitant un ou plusieurs écrans. Le client doit disposer d’une installation techniquement compatible, d’une alimentation électrique adaptée et, sauf mode local prévu, d’une connexion réseau suffisante.',
          'La validation d’un questionnaire ne garantit pas à elle seule la compatibilité. JS-Innov.IA peut demander des informations, photographies, accès techniques ou tests complémentaires avant activation.',
        ],
      },
      {
        title: '3. Offres et prix publics',
        paragraphs: [
          'Au 3 septembre 2026, l’offre Digital Signage est présentée à 449 € HTVA de mise en service initiale puis 69 € HTVA par mois. L’offre Signage + Vidéosurveillance est présentée à 690 € HTVA de mise en service initiale puis 129 € HTVA par mois.',
          'Le matériel supplémentaire, les déplacements particuliers, la création de contenus, les besoins de stockage spécifiques et les intégrations sur mesure ne sont inclus que lorsqu’ils sont expressément indiqués. Le prix total, la TVA et les options sont affichés ou communiqués avant la validation définitive.',
        ],
      },
      {
        title: '4. Commande et paiement',
        paragraphs: [
          'Le parcours de commande peut comporter un questionnaire technique, une validation de faisabilité et un paiement sécurisé par Stripe. Une commande est considérée comme acceptée lorsque les conditions affichées ont été acceptées, que le paiement requis est confirmé et que les éventuelles réserves techniques ont été levées.',
          'Les abonnements sont facturés selon la périodicité indiquée lors du paiement. En cas d’échec de paiement, le client est invité à régulariser la situation. L’accès à certaines fonctions peut être limité ou suspendu lorsque le service ne peut plus être valablement fourni.',
        ],
      },
      {
        title: '5. Mise en service',
        paragraphs: [
          'La mise en service comprend les opérations décrites dans l’offre retenue. Le client fournit en temps utile les informations, accès, équipements, autorisations et disponibilités nécessaires. Tout retard lié à un élément manquant ou incompatible peut décaler l’activation.',
        ],
      },
      {
        title: '6. Obligations du client',
        paragraphs: [
          'Le client protège ses identifiants, limite les accès aux personnes autorisées, maintient ses équipements et connexions en état, suit les consignes de sécurité et informe rapidement JS-Innov.IA d’un incident ou d’un accès suspect.',
          'Il garantit que les contenus diffusés et l’usage des caméras respectent les droits d’auteur, le droit à l’image, la vie privée, la réglementation applicable à la vidéosurveillance, les règles publicitaires et toute autorisation locale nécessaire.',
        ],
      },
      {
        title: '7. Disponibilité, maintenance et mode hors connexion',
        paragraphs: [
          'JS-Innov.IA met en œuvre des moyens raisonnables pour maintenir le service. Des maintenances, mises à jour, incidents de réseau, indisponibilités d’un prestataire ou contraintes matérielles peuvent provoquer une interruption temporaire.',
          'Lorsque le Player et la configuration le permettent, les médias déjà synchronisés peuvent continuer à être lus localement pendant une perte de connexion. Cette continuité dépend du matériel, du cache disponible et de l’état du Player.',
        ],
      },
      {
        title: '8. Support et évolutions',
        paragraphs: [
          'Le niveau de support dépend de l’offre ou du contrat choisi. Signelya peut évoluer afin d’améliorer la sécurité, la compatibilité, l’ergonomie ou les fonctionnalités. Une fonction peut être adaptée lorsqu’une évolution technique ou légale le justifie, sous réserve de préserver l’économie générale du service.',
        ],
      },
      {
        title: '9. Licence et propriété',
        paragraphs: [
          'Le client reçoit un droit personnel, limité, non exclusif et non transférable d’utiliser Signelya pendant la durée de son abonnement et pour ses besoins autorisés. Le logiciel, les marques, les modèles, le code, la documentation et les éléments visuels restent la propriété de JS-Innov.IA ou de leurs titulaires respectifs.',
        ],
      },
      {
        title: '10. Données et confidentialité',
        paragraphs: [
          'Le traitement des données personnelles est décrit dans la politique de confidentialité. Lorsque le client traite des données pour son propre compte, notamment via des caméras ou des contenus comportant des personnes identifiables, il reste responsable du respect de ses propres obligations d’information, de base juridique, de sécurité et de conservation.',
        ],
      },
      {
        title: '11. Durée, modification et fin du service',
        paragraphs: [
          'La durée, le renouvellement, les modalités de résiliation et les conséquences de la fin du service sont ceux indiqués dans le parcours de commande ou le contrat particulier. Toute demande de modification doit être adressée aux coordonnées de support afin de permettre l’identification du compte concerné.',
          'À la fin du service, l’accès au cockpit et aux fonctions liées à l’abonnement peut être désactivé. Le client doit récupérer les éléments dont il a besoin avant l’expiration des délais convenus.',
        ],
      },
      {
        title: '12. Responsabilité',
        paragraphs: [
          'Chaque partie répond des dommages directs résultant d’un manquement qui lui est imputable, dans les limites autorisées par le droit applicable et par le contrat particulier. JS-Innov.IA ne répond pas d’un contenu illicite fourni par le client, d’un équipement non compatible, d’une modification non autorisée, d’une panne électrique ou réseau externe, ni d’un service tiers hors de son contrôle raisonnable.',
          'Aucune disposition ne limite une responsabilité qui ne peut légalement être exclue ou limitée.',
        ],
      },
      {
        title: '13. Droit applicable et litiges',
        paragraphs: [
          'Le droit belge est applicable. Les parties recherchent d’abord une solution amiable en contactant le support. À défaut, les juridictions compétentes sont déterminées par les règles légales applicables et, lorsqu’il existe, par le contrat particulier. Les protections impératives d’un consommateur éventuel restent inchangées.',
        ],
      },
    ],
  },
};

function BrandLogo() {
  return <img className="sy-legal-logo" src="/signelya-lockup-horizontal.svg" alt="SIGNELYA — Vos écrans prennent vie." />;
}

export default function SignelyaLegal({ type = 'mentions' }) {
  const page = PAGES[type] || PAGES.mentions;

  return (
    <div className="sy-page sy-legal-page">
      <header className="sy-legal-header">
        <div className="sy-container sy-legal-header__inner">
          <Link to="/" aria-label="Retour à l’accueil Signelya"><BrandLogo /></Link>
          <Link className="sy-button sy-button--secondary" to="/"><ArrowLeft aria-hidden="true" /> Retour au site</Link>
        </div>
      </header>

      <main>
        <section className="sy-legal-hero">
          <div className="sy-container">
            <p className="sy-eyebrow">{page.eyebrow}</p>
            <h1>{page.title}</h1>
            <p>{page.intro}</p>
            <span>Dernière mise à jour : {UPDATED_AT}</span>
          </div>
        </section>

        <section className="sy-legal-content">
          <div className="sy-container sy-legal-layout">
            <aside className="sy-legal-aside">
              <div className="sy-legal-contact-card">
                <ShieldCheck aria-hidden="true" />
                <h2>Éditeur</h2>
                <strong>{COMPANY.tradeName}</strong>
                <span>{COMPANY.legalName}</span>
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(COMPANY.address)}`} target="_blank" rel="noreferrer"><MapPin aria-hidden="true" /> {COMPANY.address}</a>
                <a href={`mailto:${COMPANY.email}`}><Mail aria-hidden="true" /> {COMPANY.email}</a>
                <a href="tel:+32494119090"><Phone aria-hidden="true" /> {COMPANY.phone}</a>
                <span>TVA {COMPANY.vat}</span>
              </div>
              <nav className="sy-legal-nav" aria-label="Documents juridiques Signelya">
                <Link className={type === 'mentions' ? 'is-active' : ''} to="/signelya/mentions-legales">Mentions légales</Link>
                <Link className={type === 'confidentialite' ? 'is-active' : ''} to="/signelya/confidentialite">Confidentialité</Link>
                <Link className={type === 'conditions' ? 'is-active' : ''} to="/signelya/conditions">Conditions commerciales</Link>
              </nav>
            </aside>

            <article className="sy-legal-article">
              {page.sections.map((section) => (
                <section key={section.title}>
                  <h2>{section.title}</h2>
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </section>
              ))}

              {type === 'confidentialite' && (
                <div className="sy-legal-authority">
                  <h2>Autorité de contrôle</h2>
                  <p>Autorité de protection des données — Rue de la Presse 35, 1000 Bruxelles, Belgique.</p>
                  <a href="https://www.autoriteprotectiondonnees.be" target="_blank" rel="noreferrer">Consulter le site de l’APD <ExternalLink aria-hidden="true" /></a>
                </div>
              )}
            </article>
          </div>
        </section>
      </main>

      <footer className="sy-legal-footer">
        <div className="sy-container">
          <span>© 2026 JS-INNOV.IA® — Pagin Julien</span>
          <div>
            <Link to="/signelya/mentions-legales">Mentions légales</Link>
            <Link to="/signelya/confidentialite">Confidentialité</Link>
            <Link to="/signelya/conditions">Conditions</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
