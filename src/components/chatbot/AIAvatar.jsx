import { motion } from 'framer-motion';

export default function AIAvatar({ onClick, showWelcome }) {
  return (
    <div className="fixed bottom-4 right-4 z-[70] flex max-w-[calc(100vw-2rem)] items-end gap-3 sm:bottom-6 sm:right-6">
      {showWelcome && (
        <p className="mb-3 hidden max-w-64 rounded-2xl border border-amber-300/30 bg-slate-950/95 px-4 py-3 text-sm text-white shadow-2xl sm:block" role="status">
          Bonjour, je suis votre compagnon JS-Innov.IA. Comment puis-je vous aider ?
        </p>
      )}
      <motion.button
        type="button"
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        className="relative h-24 w-24 rounded-full border border-amber-300/50 bg-slate-950/90 p-1 shadow-[0_0_35px_rgba(212,175,55,0.45)] focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/60 sm:h-32 sm:w-32"
        aria-label="Ouvrir le compagnon JS-Innov.IA"
        aria-haspopup="dialog"
      >
        <img src="/jsinnovia-companion.png" alt="" className="h-full w-full object-contain" />
        <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-slate-950 bg-emerald-400" aria-hidden="true" />
      </motion.button>
    </div>
  );
}
