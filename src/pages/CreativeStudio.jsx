import React from 'react';
import { Link } from 'react-router-dom';

const directOffers = [
  { title: 'Visuel publicitaire', price: '49 € HTVA', text: 'Un visuel statique adapté à votre identité de marque et à votre support.' },
  { title: 'Pack 3 visuels', price: '99 € HTVA', text: 'Trois propositions cohérentes pour comparer plusieurs directions créatives.' },
  { title: 'Vidéo courte 5–10 s', price: '149 € HTVA', text: 'Concept, visuels de référence, animation et fichier final prêt pour votre communication.' },
  { title: 'Pack créatif vidéo', price: '299 € HTVA', text: 'Trois directions créatives, présentation de validation et une version finale après votre choix.' },
];

const digitalOffers = [
  { title: 'Extension digitale', price: '99 € TTC', badge: 'Après une production existante', text: 'Récupérez les 3 vidéos déjà créées pour votre communication digitale : réseaux sociaux, site web et écrans internes.' },
  { title: 'Pack Social', price: '149 € TTC', badge: 'Multi-formats', text: 'Les 3 vidéos + adaptations principales 16:9, carré 1:1 et vertical 9:16 selon les contenus disponibles.' },
  { title: 'Social Mensuel', price: '149 € TTC / mois', badge: 'Récurrent', text: '4 contenus par mois pour garder une présence régulière sur vos canaux digitaux.' },
  { title: 'Social Plus', price: '249 € TTC / mois', badge: 'Récurrent +', text: '8 contenus par mois avec déclinaisons multi-formats pour une communication plus soutenue.' },
];

const workflow = [
  ['01', 'Analyse de votre marque', 'Site, logo, couleurs, photos, services, coordonnées et identité existante.'],
  ['02', '3 directions créatives', 'Création de propositions distinctes tout en respectant votre ADN visuel.'],
  ['03', 'Présentation & validation', 'Les propositions sont réunies dans une présentation claire afin de faciliter votre choix.'],
  ['04', 'Finalisation & déclinaisons', 'Le contenu validé est préparé pour le support prévu et peut ensuite être décliné pour le digital.'],
];

const cases = [
  { name: 'H2O Bois', tag: 'Piscine & aménagement extérieur', concepts: '3 concepts · format court 8 s', text: 'Trois angles créatifs : inspiration jardin, rénovation avant/après et savoir-faire bois.' },
];

export default function CreativeStudio() {
  return (
    <main className="min-h-screen bg-[#060610] text-white">
      <section className="mx-auto max-w-7xl px-5 py-20 md:py-28">
        <div className="max-w-4xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">Studio créatif · By JS-Innov.IA</p>
          <h1 className="text-4xl font-black leading-tight md:text-6xl">Des contenus qui continuent à travailler après leur première diffusion.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">Visuels, vidéos courtes et déclinaisons pour réseaux sociaux, sites web, écrans LED, écrans en magasin et événements. Une création peut devenir plusieurs contenus utiles, sans repartir de zéro.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link to="/Contact" className="rounded-full bg-white px-6 py-3 font-bold text-black">Demander une création</Link><a href="#tarifs" className="rounded-full border border-white/20 px-6 py-3 font-semibold">Voir les offres</a></div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03]"><div className="mx-auto max-w-7xl px-5 py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">Notre méthode</p><h2 className="mt-3 text-3xl font-black md:text-4xl">De votre ADN de marque à la validation</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-4">{workflow.map(([n,title,text]) => <article key={n} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"><span className="text-sm font-black text-violet-300">{n}</span><h3 className="mt-3 text-xl font-bold">{title}</h3><p className="mt-3 leading-7 text-white/60">{text}</p></article>)}</div>
        <p className="mt-7 max-w-4xl text-sm leading-6 text-white/50">Ce processus est aujourd’hui supervisé humainement et progressivement intégré au Cockpit JS-Innov.IA pour automatiser les tâches répétitives sans sacrifier la validation créative ni le respect de la marque.</p>
      </div></section>

      <section id="tarifs" className="mx-auto max-w-7xl px-5 py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">Création directe</p><h2 className="mt-3 text-3xl font-black md:text-4xl">Vous partez de zéro ?</h2>
        <p className="mt-4 max-w-3xl text-white/60">Nous créons votre contenu sur mesure. Ces tarifs concernent la création uniquement : achat d’espace, programmation et diffusion publicitaire restent des prestations distinctes.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{directOffers.map(o => <article key={o.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"><h3 className="text-xl font-bold">{o.title}</h3><p className="mt-5 text-3xl font-black">{o.price}</p><p className="mt-4 leading-7 text-white/60">{o.text}</p></article>)}</div>
      </section>

      <section className="border-y border-white/10 bg-gradient-to-b from-violet-500/[0.08] to-transparent"><div className="mx-auto max-w-7xl px-5 py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">Rentabilisez vos créations</p><h2 className="mt-3 max-w-4xl text-3xl font-black md:text-5xl">Vous aimez les 3 propositions ? Gardez-les.</h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-white/65">Lorsqu’une production a déjà donné naissance à plusieurs propositions créatives, les contenus non retenus pour le support initial peuvent devenir de vrais actifs pour votre communication digitale.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{digitalOffers.map(o => <article key={o.title} className="rounded-3xl border border-violet-300/20 bg-white/[0.05] p-6"><span className="rounded-full bg-violet-400/10 px-3 py-1 text-xs font-bold text-violet-200">{o.badge}</span><h3 className="mt-5 text-xl font-bold">{o.title}</h3><p className="mt-4 text-3xl font-black">{o.price}</p><p className="mt-4 leading-7 text-white/60">{o.text}</p></article>)}</div>
        <p className="mt-6 text-sm text-white/45">L’offre Extension digitale à 99 € TTC s’applique aux trois vidéos déjà produites et disponibles. Toute nouvelle direction artistique, modification importante ou création supplémentaire fait l’objet d’un devis.</p>
      </div></section>

      <section className="mx-auto max-w-7xl px-5 py-20"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">Réalisations</p><h2 className="mt-3 text-3xl font-black md:text-4xl">Ils nous ont fait confiance</h2><p className="mt-4 max-w-3xl text-white/60">Une sélection de créations réalisées par JS-Innov.IA. La création du contenu et son éventuelle diffusion média sont deux prestations indépendantes.</p><div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{cases.map(item => <article key={item.name} className="overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d18]"><div className="flex aspect-video items-center justify-center bg-gradient-to-br from-sky-400/25 via-blue-500/10 to-yellow-300/20"><span className="text-4xl font-black">{item.name}</span></div><div className="p-6"><p className="text-sm font-semibold text-violet-300">{item.tag}</p><h3 className="mt-2 text-xl font-bold">{item.concepts}</h3><p className="mt-3 leading-7 text-white/60">{item.text}</p></div></article>)}</div></section>

      <section className="mx-auto max-w-5xl px-5 py-20 text-center"><h2 className="text-3xl font-black md:text-5xl">Un contenu. Plusieurs vies.</h2><p className="mx-auto mt-5 max-w-2xl text-lg text-white/60">Écran, Facebook, Instagram, site web ou communication interne : transformons vos créations existantes en contenus réellement exploitables.</p><Link to="/Contact" className="mt-8 inline-block rounded-full bg-white px-7 py-3 font-bold text-black">Parler de mon projet</Link></section>
    </main>
  );
}
