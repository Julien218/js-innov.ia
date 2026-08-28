import React from 'react';
import { Link } from 'react-router-dom';

const offers = [
  { title: 'Visuel publicitaire', price: '49 €', text: 'Création d’un visuel statique adapté à votre identité de marque et à votre support.' },
  { title: 'Pack 3 visuels', price: '99 €', text: 'Trois propositions visuelles cohérentes pour comparer plusieurs directions créatives.' },
  { title: 'Vidéo courte 5–10 s', price: '149 €', text: 'Conception du concept, visuels de référence, animation et préparation du format de diffusion.' },
  { title: 'Pack 3 concepts vidéo', price: '299 €', text: 'Trois directions créatives distinctes pour permettre au client de choisir son univers préféré.' },
];

const workflow = [
  ['01', 'Analyse de votre marque', 'Site, logo, couleurs, photos, services, coordonnées et identité existante.'],
  ['02', 'Conception des visuels', 'Création des images clés en respectant l’ADN visuel de votre entreprise.'],
  ['03', 'Création vidéo', 'Animation des scènes, transitions, CTA et contrôle de la lisibilité selon le support.'],
  ['04', 'Déclinaisons', 'Adaptation possible pour Facebook, Instagram, site web, écran LED, écran magasin ou événement.'],
];

const cases = [
  { name: 'H2O Bois', tag: 'Piscine & aménagement extérieur', concepts: '3 concepts · format court 8 s', text: 'Campagne conçue autour de trois angles : inspiration jardin, rénovation avant/après et savoir-faire bois.' },
];

export default function CreativeStudio() {
  return (
    <main className="min-h-screen bg-[#060610] text-white">
      <section className="mx-auto max-w-7xl px-5 py-20 md:py-28">
        <div className="max-w-4xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">Studio créatif · By JS-Innov.IA</p>
          <h1 className="text-4xl font-black leading-tight md:text-6xl">Des visuels et vidéos pensés pour être vus, compris et mémorisés.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">Nous transformons votre identité de marque en contenus publicitaires adaptés aux écrans LED, réseaux sociaux, sites web, écrans en magasin et événements.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/Contact" className="rounded-full bg-white px-6 py-3 font-bold text-black">Demander une création</Link>
            <a href="#tarifs" className="rounded-full border border-white/20 px-6 py-3 font-semibold text-white">Voir les tarifs</a>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto max-w-7xl px-5 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">Notre méthode actuelle</p>
          <h2 className="mt-3 text-3xl font-black md:text-4xl">De votre ADN de marque au contenu final</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {workflow.map(([n, title, text]) => <article key={n} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"><span className="text-sm font-black text-violet-300">{n}</span><h3 className="mt-3 text-xl font-bold">{title}</h3><p className="mt-3 leading-7 text-white/60">{text}</p></article>)}
          </div>
          <p className="mt-7 max-w-4xl text-sm leading-6 text-white/50">Notre processus de production est aujourd’hui supervisé humainement à chaque étape. Il est progressivement intégré au Cockpit JS-Innov.IA afin d’automatiser les tâches répétitives tout en conservant la validation créative et le respect de la marque.</p>
        </div>
      </section>

      <section id="tarifs" className="mx-auto max-w-7xl px-5 py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">Tarifs de lancement</p>
        <h2 className="mt-3 text-3xl font-black md:text-4xl">Création de contenu</h2>
        <p className="mt-4 max-w-3xl text-white/60">Ces tarifs concernent exclusivement la création. L’achat d’espace, la programmation et la diffusion publicitaire sur un écran ou un média sont des prestations distinctes.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {offers.map((offer) => <article key={offer.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"><h3 className="text-xl font-bold">{offer.title}</h3><p className="mt-5 text-4xl font-black">{offer.price}<span className="text-sm font-medium text-white/40"> HTVA</span></p><p className="mt-4 leading-7 text-white/60">{offer.text}</p></article>)}
        </div>
        <div className="mt-6 rounded-3xl border border-violet-400/20 bg-violet-400/[0.06] p-6"><strong>Déclinaisons multi-supports :</strong><span className="text-white/65"> adaptation Facebook, Instagram, site web ou autre format à partir de 39 € HTVA / format. Campagnes complètes : sur devis.</span></div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">Réalisations</p>
          <h2 className="mt-3 text-3xl font-black md:text-4xl">Ils nous ont fait confiance</h2>
          <p className="mt-4 max-w-3xl text-white/60">Une sélection de créations publicitaires réalisées par JS-Innov.IA. Les supports de diffusion restent indépendants de notre prestation créative.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cases.map((item) => <article key={item.name} className="overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d18]"><div className="flex aspect-video items-center justify-center bg-gradient-to-br from-sky-400/25 via-blue-500/10 to-yellow-300/20"><span className="text-4xl font-black tracking-tight">{item.name}</span></div><div className="p-6"><p className="text-sm font-semibold text-violet-300">{item.tag}</p><h3 className="mt-2 text-xl font-bold">{item.concepts}</h3><p className="mt-3 leading-7 text-white/60">{item.text}</p></div></article>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-20 text-center">
        <h2 className="text-3xl font-black md:text-5xl">Un contenu. Plusieurs supports.</h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-white/60">Écran LED, Facebook, Instagram, site web, écran magasin ou événement : nous préparons le contenu dans le format réellement utile à votre communication.</p>
        <Link to="/Contact" className="mt-8 inline-block rounded-full bg-white px-7 py-3 font-bold text-black">Parler de mon projet</Link>
      </section>
    </main>
  );
}
