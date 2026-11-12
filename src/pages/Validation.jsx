import { useEffect, useRef } from 'react';

const T = {
  bg: '#070B1C',
  surface: '#10172F',
  line: '#27315A',
  fg: '#EEF1FA',
  muted: '#A9B2D0',
  gold: '#E9C46A',
  green: '#B3D13B',
};

const VIDEO_SRC = '/validation/logissim-3-propositions-v1.mp4';
const POSTER_SRC = '/validation/logissim-poster-v1.jpg';

const PROPOSITIONS = [
  {
    id: 1,
    time: 10.4,
    label: 'Proposition 1 · à 0:10',
    title: 'Mots géants',
    text: '« VENDEZ », « SANS FRAIS », puis « PEB & constat électrique OFFERTS ! » : un message plein écran à la fois, lisible de très loin.',
  },
  {
    id: 2,
    time: 23.4,
    label: 'Proposition 2 · à 0:23',
    title: "L'équipe",
    text: 'Guillaume, Fabrizio, José et Romain en grand, avec « Nos compétences à votre service ». La version qui met les visages en avant.',
  },
  {
    id: 3,
    time: 35.4,
    label: 'Proposition 3 · à 0:35',
    title: 'Avec ou sans affiche',
    text: "Un panneau « À VENDRE » apparaît puis s'efface : votre « avec ou sans affiche » mis en image, suivi de « Vendez sans frais ».",
  },
];

export default function Validation() {
  const videoRef = useRef(null);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Logissim · 3 propositions à valider | JS-Innov.IA';
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex,nofollow,noarchive';
    document.head.appendChild(robots);
    return () => {
      document.title = previousTitle;
      robots.remove();
    };
  }, []);

  const jumpTo = (time) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = time;
    video.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const playing = video.play();
    if (playing && playing.catch) playing.catch(() => {});
  };

  return (
    <main style={{ minHeight: '100vh', background: T.bg, color: T.fg }}>
      <div className="mx-auto flex max-w-[960px] flex-col gap-8 px-4 py-10 sm:py-14">
        <header className="flex flex-col gap-3">
          <p className="text-[13px] font-semibold uppercase tracking-[0.12em]" style={{ color: T.gold }}>
            JS-Innov.IA · Pour validation
          </p>
          <h1 className="text-3xl font-bold leading-tight sm:text-[44px]" style={{ textWrap: 'balance' }}>
            Logissim : 3 propositions pour <span style={{ color: T.green }}>votre écran géant</span>
          </h1>
          <p className="mt-2 text-xl font-semibold">Bonjour,</p>
          <p className="max-w-[62ch] text-base leading-relaxed" style={{ color: T.muted }}>
            Merci pour votre confiance. Nous avons préparé pour vous trois spots de 7 secondes, construits avec votre
            logo, vos couleurs et votre offre. Regardez le film ci-dessous, puis dites-nous laquelle vous retenez.
          </p>
        </header>

        <video
          ref={videoRef}
          controls
          playsInline
          preload="metadata"
          poster={POSTER_SRC}
          src={VIDEO_SRC}
          className="block w-full rounded-[10px] bg-black"
          style={{ aspectRatio: '16 / 9', border: `1px solid ${T.line}` }}
        />

        <section className="flex flex-col gap-4">
          <h2 className="text-[22px] font-bold">Les trois propositions</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {PROPOSITIONS.map((proposition) => (
              <article
                key={proposition.id}
                className="flex min-w-0 flex-col gap-2.5 rounded-[10px] p-5"
                style={{ background: T.surface, border: `1px solid ${T.line}` }}
              >
                <p className="text-[13px] font-bold uppercase tracking-[0.12em]" style={{ color: T.gold }}>
                  {proposition.label}
                </p>
                <h3 className="text-xl font-bold leading-tight">{proposition.title}</h3>
                <p className="flex-grow text-[15px] leading-relaxed" style={{ color: T.muted }}>
                  {proposition.text}
                </p>
                <button
                  type="button"
                  onClick={() => jumpTo(proposition.time)}
                  className="min-h-[44px] self-start rounded-lg px-[18px] text-[15px] font-semibold transition hover:brightness-110 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px]"
                  style={{ background: T.gold, color: T.bg, outlineColor: T.green }}
                >
                  Voir la proposition {proposition.id}
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-2.5 rounded-[10px] p-6" style={{ border: `1px solid ${T.gold}` }}>
          <h2 className="text-[22px] font-bold">Comment valider</h2>
          <p className="max-w-[65ch] leading-relaxed">
            Répondez au message qui vous a transmis ce lien en indiquant le numéro de la proposition retenue (1, 2 ou
            3) et, si besoin, les ajustements souhaités : texte, couleurs, photos, durée.
          </p>
          <p className="max-w-[65ch] text-sm leading-relaxed" style={{ color: T.muted }}>
            Chaque spot se termine sur la même carte : logo, « Vendez sans frais », « Avec ou sans affiche »,
            www.logissim.be et le 065/31.96.96.
          </p>
        </section>

        <footer className="text-[13px]" style={{ color: T.muted }}>
          Aperçu en 720p. Les spots définitifs sont livrés en 1920×1080.
        </footer>
      </div>
    </main>
  );
}
