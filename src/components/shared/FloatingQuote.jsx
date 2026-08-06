import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PowerWord from './PowerWord';
import { Sparkles } from 'lucide-react';

export default function FloatingQuote() {
  const quotes = [
    <span><PowerWord>JS-INNOV.IA</PowerWord> : Créations artistiques et <PowerWord>automatisations intelligentes</PowerWord>.</span>,
    <span>Avec <PowerWord>JS-INNOV.IA</PowerWord>, <PowerWord>transformez</PowerWord> vos idées en <PowerWord>réalité</PowerWord>.</span>,
    <span><PowerWord>JS-INNOV.IA</PowerWord> : Votre partenaire <PowerWord>innovation</PowerWord> et <PowerWord>IA</PowerWord>.</span>,
    <span><PowerWord>Templates</PowerWord>, <PowerWord>automatisations</PowerWord>, <PowerWord>applications</PowerWord> : tout avec <PowerWord>JS-INNOV.IA</PowerWord>.</span>,
    <span><PowerWord>Innovons</PowerWord> ensemble pour un <PowerWord>futur digital</PowerWord> - <PowerWord>JS-INNOV.IA</PowerWord>.</span>,
    <span><PowerWord>JS-INNOV.IA</PowerWord> : L'<PowerWord>excellence IA</PowerWord> à votre service.</span>,
    <span>Chaque <PowerWord>projet</PowerWord> unique mérite <PowerWord>JS-INNOV.IA</PowerWord>.</span>,
    <span><PowerWord>JS-INNOV.IA</PowerWord> : Là où l'<PowerWord>art</PowerWord> rencontre l'<PowerWord>intelligence</PowerWord>.</span>
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="fixed bottom-6 left-6 z-40 max-w-sm"
    >
      <div className="p-4 rounded-2xl bg-black/80 backdrop-blur-xl border border-purple-500/30 shadow-2xl">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-pink-400 flex-shrink-0 mt-1" />
          <AnimatePresence mode="wait">
            <motion.p
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="text-sm text-gray-300 leading-relaxed"
            >
              {quotes[currentIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}