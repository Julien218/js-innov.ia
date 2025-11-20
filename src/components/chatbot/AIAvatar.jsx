import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIAvatar({ onClick, showWelcome, isSpeaking, messageTypes }) {
  const [brightness, setBrightness] = useState(1);
  const [showBubble, setShowBubble] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);

  const allMessages = {
    conseils: [
      "👋 Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider ?",
      "💬 Besoin d'aide ? Je suis là pour vous guider !",
      "🌟 Chaque innovation commence par une idée audacieuse."
    ],
    proverbes: [
      "💡 L'IA ne remplace pas l'intelligence humaine, elle l'amplifie.",
      "🚀 L'avenir appartient à ceux qui comprennent l'IA.",
      "✨ L'intelligence artificielle : transformer l'impossible en possible.",
      "⚡ L'IA n'est pas magique, elle est intelligente.",
      "🔮 L'IA : le meilleur outil pour libérer la créativité."
    ],
    services: [
      "🎯 Découvrez nos templates vidéo et automatisations !",
      "🎵 Économisez sur la SABAM avec nos musiques !"
    ]
  };

  const messages = [
    ...(messageTypes?.conseils ? allMessages.conseils : []),
    ...(messageTypes?.proverbes ? allMessages.proverbes : []),
    ...(messageTypes?.services ? allMessages.services : [])
  ].filter(Boolean);

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
        setTimeout(() => setShowBubble(false), 5000);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  // Messages interactifs réguliers
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % messages.length);
      setShowBubble(true);
      setTimeout(() => setShowBubble(false), 6000);
    }, 45000); // Toutes les 45 secondes

    return () => clearInterval(interval);
  }, []);

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
        {/* Halos lumineux de l'antenne */}
        <motion.div
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(6,255,165,0.4) 0%, rgba(255,0,110,0.2) 50%, transparent 70%)',
            filter: 'blur(20px)',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 0.9, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,0,0.6) 0%, rgba(255,165,0,0.3) 50%, transparent 70%)',
            filter: 'blur(15px)',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691d332d17337e06a0c04ae3/dfb5c5ef3_Designsanstitre.png"
          alt="Assistant IA"
          className="w-full h-full object-contain relative z-10"
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
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="fixed bottom-52 right-6 z-50 max-w-[280px] px-5 py-4 bg-gradient-to-br from-cyan-900/95 via-purple-900/95 to-pink-900/95 backdrop-blur-xl border border-cyan-400/50 rounded-2xl shadow-2xl"
            style={{
              boxShadow: '0 0 30px rgba(6,255,165,0.3), 0 0 60px rgba(255,0,110,0.2)'
            }}
          >
            <p className="text-sm text-white font-medium leading-relaxed">
              {messages[currentMessage]}
            </p>
            <div className="absolute -bottom-2 right-12 w-4 h-4 bg-gradient-to-br from-cyan-900/95 to-purple-900/95 border-r border-b border-cyan-400/50 transform rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}