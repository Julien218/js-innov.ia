import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

const LAUNCHER = '/brand/companion/companion-launcher-256.webp';
const HINT_STORAGE_KEY = 'jsinnovia-companion-hint-seen';

export default function AIAvatar({ onClick, showWelcome }) {
  const reduceMotion = useReducedMotion();
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (!showWelcome) return undefined;

    try {
      if (window.localStorage.getItem(HINT_STORAGE_KEY)) return undefined;
    } catch {
      // localStorage may be unavailable in strict privacy modes.
    }

    const revealTimer = window.setTimeout(() => setShowHint(true), 900);
    const hideTimer = window.setTimeout(() => {
      setShowHint(false);
      try {
        window.localStorage.setItem(HINT_STORAGE_KEY, '1');
      } catch {
        // The hint can safely reappear on a later visit.
      }
    }, 9_000);

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(hideTimer);
    };
  }, [showWelcome]);

  function openCompanion() {
    setShowHint(false);
    try {
      window.localStorage.setItem(HINT_STORAGE_KEY, '1');
    } catch {
      // Opening the companion must never depend on storage access.
    }
    onClick();
  }

  return (
    <div className="fixed bottom-4 right-4 z-[70] flex max-w-[calc(100vw-2rem)] items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 12, y: 6 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 8 }}
            className="mb-2 hidden max-w-72 rounded-2xl border border-amber-300/25 bg-slate-950/95 px-4 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:block"
            role="status"
          >
            <p className="text-sm font-semibold text-white">Votre Compagnon JS-Innov.IA</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-300">
              Posez une question, découvrez nos solutions ou préparez votre projet.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={openCompanion}
        whileHover={reduceMotion ? undefined : { scale: 1.045, y: -2 }}
        whileTap={reduceMotion ? undefined : { scale: 0.97 }}
        className="group relative grid h-[74px] w-[74px] place-items-center rounded-full border border-amber-300/45 bg-slate-950/90 p-1 shadow-[0_0_0_1px_rgba(139,92,246,0.15),0_16px_48px_rgba(0,0,0,0.5),0_0_32px_rgba(212,175,55,0.28)] backdrop-blur-xl transition-shadow hover:shadow-[0_0_0_1px_rgba(212,175,55,0.35),0_18px_54px_rgba(0,0,0,0.55),0_0_42px_rgba(212,175,55,0.4)] focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/50 sm:h-[82px] sm:w-[82px]"
        aria-label="Ouvrir le Compagnon JS-Innov.IA"
        aria-haspopup="dialog"
      >
        {!reduceMotion && (
          <span
            className="absolute inset-1 animate-ping rounded-full border border-amber-300/20 [animation-duration:2.8s]"
            aria-hidden="true"
          />
        )}
        <img
          src={LAUNCHER}
          alt=""
          width="256"
          height="256"
          decoding="async"
          className="relative h-full wfull rounded-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
         />
        <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-[3px] border-slate-950 bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.75)]" aria-hidden="true" />
      </motion.button>
    </div>
  );
}
