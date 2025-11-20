import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import CustomMusicRequestModal from './CustomMusicRequestModal';

export default function FloatingMusicAssistant() {
  const [showBubble, setShowBubble] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const messages = [
    "🎵 Besoin d'une ambiance unique pour votre commerce ?",
    "💰 Économisez sur la SABAM avec notre solution !",
    "✨ Créons ensemble votre playlist idéale !",
    "🎶 Une musique sur mesure pour votre espace ?",
    "💡 Discutons de votre projet musical !"
  ];

  useEffect(() => {
    // Show bubble every 15 seconds
    const bubbleInterval = setInterval(() => {
      setShowBubble(true);
      setCurrentMessage((prev) => (prev + 1) % messages.length);
      
      // Hide bubble after 8 seconds
      setTimeout(() => {
        setShowBubble(false);
      }, 8000);
    }, 15000);

    // Show initial bubble after 3 seconds
    const initialTimeout = setTimeout(() => {
      setShowBubble(true);
    }, 3000);

    return () => {
      clearInterval(bubbleInterval);
      clearTimeout(initialTimeout);
    };
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-8 left-8 z-40 flex items-start gap-3"
      >
        {/* Speech Bubble */}
        <AnimatePresence>
          {showBubble && (
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.8 }}
              className="relative max-w-xs order-2"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-4 pl-10 border-2 border-pink-400/50">
                <button
                  onClick={() => setShowBubble(false)}
                  className="absolute top-2 left-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
                <p className="text-gray-800 text-sm font-medium">
                  {messages[currentMessage]}
                </p>
              </div>
              {/* Arrow */}
              <div className="absolute bottom-4 -left-2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Avatar Button */}
        <motion.button
          onClick={() => setShowModal(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative group"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 p-1 shadow-2xl">
            <div className="w-full h-full rounded-full bg-white/10 backdrop-blur-sm overflow-hidden border-2 border-white/20">
              <img 
                src="https://drive.google.com/uc?export=view&id=1ySt1ej95d6U1gMbAZ_Hw-wdKG3hj8KuF" 
                alt="Assistant Musical"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Pulse effect */}
          <div className="absolute inset-0 rounded-full bg-pink-500/30 animate-ping"></div>
          
          {/* Availability indicator */}
          <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
        </motion.button>
      </motion.div>

      {/* Request Modal */}
      <CustomMusicRequestModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </>
  );
}