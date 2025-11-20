import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';

export default function CustomMusicCard() {
  const [showBubble, setShowBubble] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);

  const messages = [
    { 
      text: "🎯 Découvrez nos innovations IA révolutionnaires !",
      link: "Innovations"
    },
    { 
      text: "🎬 Templates vidéo professionnels dès maintenant !",
      link: "Templates"
    },
    { 
      text: "⚡ Automatisations clé en main pour votre entreprise",
      link: "Automations"
    },
    { 
      text: "🚀 Applications sur mesure avec intelligence artificielle",
      link: "Applications"
    },
    { 
      text: "💡 Transformez votre commerce avec l'IA",
      link: "Contact"
    }
  ];

  useEffect(() => {
    // Show bubble every 10 seconds
    const bubbleInterval = setInterval(() => {
      setShowBubble(true);
      setCurrentMessage((prev) => (prev + 1) % messages.length);
      
      setTimeout(() => {
        setShowBubble(false);
      }, 6000);
    }, 10000);

    const initialTimeout = setTimeout(() => {
      setShowBubble(true);
    }, 2000);

    return () => {
      clearInterval(bubbleInterval);
      clearTimeout(initialTimeout);
    };
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="group relative"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-600/20 via-purple-600/20 to-cyan-600/20 backdrop-blur-sm border-2 border-pink-500/40 hover:border-pink-400/60 hover:shadow-2xl hover:shadow-pink-500/30 hover:-translate-y-2 transition-all duration-300">
          
          {/* Sparkle Effect */}
          <div className="absolute top-4 right-4">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
          </div>

          {/* Avatar Section */}
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-pink-900/40 to-purple-900/40 flex items-center justify-center">
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              {/* Avatar */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 p-1 shadow-2xl">
                <div className="w-full h-full rounded-full bg-white/10 backdrop-blur-sm overflow-hidden border-2 border-white/20">
                  <img 
                    src="https://drive.google.com/uc?export=view&id=1ySt1ej95d6U1gMbAZ_Hw-wdKG3hj8KuF" 
                    alt="Assistant JS-INNOV.IA"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Pulse effect */}
              <div className="absolute inset-0 rounded-full bg-pink-500/30 animate-ping"></div>
              
              {/* Availability indicator */}
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Speech Bubble */}
            <AnimatePresence>
              {showBubble && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.8 }}
                  className="relative mb-4"
                >
                  <div className="bg-white rounded-2xl shadow-2xl p-3 border-2 border-pink-400/50 relative">
                    <button
                      onClick={() => setShowBubble(false)}
                      className="absolute top-1 right-1 p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-3 h-3 text-gray-500" />
                    </button>
                    <p className="text-gray-800 text-xs font-medium pr-6">
                      {messages[currentMessage].text}
                    </p>
                  </div>
                  {/* Arrow */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-b-6 border-b-white"></div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="text-center mb-4">
              <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-300 text-xs font-semibold mb-3">
                ✨ Votre Assistant IA
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 gradient-text">
                Explorez Nos Services
              </h3>
              
              <p className="text-gray-300 text-sm">
                Innovations, templates, automatisations et plus encore. Trouvez la solution parfaite pour votre projet !
              </p>
            </div>

            {/* Features */}
            <div className="space-y-2 mb-6 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <span className="text-pink-400">✨</span>
                <span>Innovations IA révolutionnaires</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-400">🎬</span>
                <span>Templates & Automatisations</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-400">🚀</span>
                <span>Applications sur mesure</span>
              </div>
            </div>

            {/* CTA Button */}
            <Link
              to={createPageUrl(messages[currentMessage].link)}
              className="flex items-center justify-center gap-2 w-full py-6 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 hover:from-pink-500 hover:via-purple-500 hover:to-cyan-500 text-white font-semibold shadow-lg hover:shadow-2xl transition-all"
            >
              <span>Découvrir nos services</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  );
}