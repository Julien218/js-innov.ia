import React from 'react';
import { motion } from 'framer-motion';
import PowerWord from './PowerWord';

export default function FloatingBrand() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="fixed bottom-6 left-6 z-40 max-w-xs"
    >
      <div className="p-4 rounded-2xl bg-black/80 backdrop-blur-xl border border-purple-500/30 shadow-2xl">
        <div className="font-bold text-lg gradient-text mb-2">JS-INNOV.IA</div>
        <p className="text-gray-400 text-xs leading-relaxed">
          Créations artistiques et <PowerWord>automatisations intelligentes</PowerWord> avec l'<PowerWord>IA</PowerWord>.
          <PowerWord>Innovons</PowerWord> ensemble pour un <PowerWord>futur digital</PowerWord>.
        </p>
      </div>
    </motion.div>
  );
}