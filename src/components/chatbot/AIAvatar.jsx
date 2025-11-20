import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIAvatar({ onClick, showWelcome, isSpeaking }) {
  const [brightness, setBrightness] = useState(1);
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const scrollFraction = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      const newBrightness = 0.8 + (scrollFraction * 0.4);
      setBrightness(newBrightness);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowBubble(true);
        setTimeout(() => setShowBubble(false), 4000);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: 1, 
          scale: isSpeaking ? [1, 1.15, 1] : 1,
          y: [0, -20, 0],
        }}
        className="fixed bottom-6 right-6 cursor-pointer"
        style={{
          width: '180px',
          height: '180px',
          filter: `brightness(${brightness}) drop-shadow(0 0 ${isSpeaking ? '50px' : '30px'} rgba(6,255,165,${isSpeaking ? '1' : '0.6'}))`,
          zIndex: 9999,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        transition={{
          y: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          },
          scale: isSpeaking ? {
            duration: 0.5,
            repeat: Infinity,
            ease: "easeInOut"
          } : {}
        }}
      >
        <img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691d332d17337e06a0c04ae3/dfb5c5ef3_Designsanstitre.png"
          alt="Assistant IA"
          className="w-full h-full object-contain"
          style={{ 
            display: 'block',
            background: 'transparent',
            mixBlendMode: 'normal'
          }}
        />
      </motion.div>

      {/* Message Bubble */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-48 right-6 z-50 max-w-[250px] px-4 py-3 bg-gray-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-xl"
          >
            <p className="text-sm text-white">
              👋 Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider aujourd'hui ?
            </p>
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-gray-900/95 border-r border-b border-cyan-500/30 transform rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}