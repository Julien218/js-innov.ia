import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPageUrl } from '../utils';
import { Link } from 'react-router-dom';

// Briques sémantiques pour génération dynamique
const SEMANTIC_BLOCKS = {
  states: ['initialisation', 'observation', 'apprentissage', 'interaction', 'optimisation', 'structuration', 'convergence'],
  actions: ['analyse', 'observe', 'connecte', 'ajuste', 'anticipe', 'écoute', 'restructure', 'explore'],
  objects: ['idées', 'données', 'signaux', 'modèles', 'processus', 'patterns', 'flux', 'connexions'],
  temporality: ['en temps réel', 'progressivement', 'silencieusement', 'continuellement', 'organiquement'],
  intention: ['comprendre', 'structurer', 'évoluer', 'converger', 'cartographier', 'détecter']
};

// Séquence d'initialisation
const INIT_SEQUENCE = [
  'Initialisation…',
  'Analyse du contexte…',
  'Connexion aux signaux…',
  'Interface active.'
];

export default function ExperimentalHome() {
  const [phase, setPhase] = useState('init'); // init, active
  const [initStep, setInitStep] = useState(0);
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [scrollBehavior, setScrollBehavior] = useState('neutral');
  const [timeOnPage, setTimeOnPage] = useState(0);
  const [isReturningVisitor, setIsReturningVisitor] = useState(false);
  const lastScrollY = useRef(0);
  const scrollSpeed = useRef(0);
  const messageUpdateInterval = useRef(null);

  // Détecter visiteur récurrent
  useEffect(() => {
    const hasVisited = localStorage.getItem('experimental_visited');
    if (hasVisited) {
      setIsReturningVisitor(true);
    } else {
      localStorage.setItem('experimental_visited', Date.now());
    }
  }, []);

  // Séquence d'initialisation
  useEffect(() => {
    if (phase === 'init') {
      const timer = setTimeout(() => {
        if (initStep < INIT_SEQUENCE.length - 1) {
          setInitStep(initStep + 1);
        } else {
          setTimeout(() => setPhase('active'), 1000);
        }
      }, 800 + Math.random() * 400);
      return () => clearTimeout(timer);
    }
  }, [phase, initStep]);

  // Génération de contenu contextuel
  const generateMessage = () => {
    const hour = new Date().getHours();
    const isDaytime = hour >= 6 && hour < 20;
    
    const state = SEMANTIC_BLOCKS.states[Math.floor(Math.random() * SEMANTIC_BLOCKS.states.length)];
    const action = SEMANTIC_BLOCKS.actions[Math.floor(Math.random() * SEMANTIC_BLOCKS.actions.length)];
    const object = SEMANTIC_BLOCKS.objects[Math.floor(Math.random() * SEMANTIC_BLOCKS.objects.length)];
    const temp = SEMANTIC_BLOCKS.temporality[Math.floor(Math.random() * SEMANTIC_BLOCKS.temporality.length)];
    
    // Messages plus directs le jour, plus introspectifs la nuit
    const templates = isDaytime ? [
      `${state.charAt(0).toUpperCase() + state.slice(1)} active — le système ${action} les ${object}.`,
      `Le système ${action} ${temp} — ${state} en cours.`,
      `${action.charAt(0).toUpperCase() + action.slice(1)} des ${object} — ${temp}.`
    ] : [
      `${state.charAt(0).toUpperCase() + state.slice(1)} ${temp}…`,
      `Le système ${action} les ${object} dans le silence.`,
      `${temp.charAt(0).toUpperCase() + temp.slice(1)}, l'interface ${action}.`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  };

  // Détection comportement scroll
  useEffect(() => {
    if (phase !== 'active') return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = Math.abs(currentScrollY - lastScrollY.current);
      scrollSpeed.current = delta;
      
      if (delta > 50) {
        setScrollBehavior('fast');
      } else if (delta > 0 && delta <= 20) {
        setScrollBehavior('slow');
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [phase]);

  // Compteur temps sur page
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeOnPage(t => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Régénération du message
  useEffect(() => {
    if (phase === 'active') {
      setGeneratedMessage(generateMessage());
      
      // Intervalle de régénération variable (15-40 secondes)
      const interval = 15000 + Math.random() * 25000;
      messageUpdateInterval.current = setTimeout(() => {
        setGeneratedMessage(generateMessage());
      }, interval);
    }
    
    return () => {
      if (messageUpdateInterval.current) {
        clearTimeout(messageUpdateInterval.current);
      }
    };
  }, [phase, scrollBehavior, timeOnPage]);

  // Messages de reconnaissance subtile
  const getSubtleRecognition = () => {
    if (isReturningVisitor && timeOnPage < 10) {
      return 'continuité détectée';
    }
    if (timeOnPage > 60) {
      return 'observation prolongée';
    }
    if (scrollBehavior === 'slow') {
      return 'attention notée';
    }
    return null;
  };

  // Action variable
  const getAction = () => {
    const hour = new Date().getHours();
    const actions = [
      '> entrer en contact',
      '> revenir demain',
      '> continuer l\'observation',
      '> explorer le système'
    ];
    
    if (hour >= 0 && hour < 6) return actions[1]; // Nuit
    if (timeOnPage > 45) return actions[0]; // Long temps
    if (isReturningVisitor) return actions[2]; // Récurrent
    return actions[Math.floor(Math.random() * actions.length)];
  };

  if (phase === 'init') {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center p-8">
        <div className="max-w-2xl w-full">
          <AnimatePresence mode="wait">
            {INIT_SEQUENCE.slice(0, initStep + 1).map((text, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: index === initStep ? 1 : 0.3 }}
                className="mb-2 text-sm tracking-wider"
              >
                {text}
                {index === initStep && (
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    _
                  </motion.span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-300 overflow-hidden relative">
      {/* Grille de fond organique */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <motion.circle
                cx="30"
                cy="30"
                r="1"
                fill="currentColor"
                animate={{
                  r: [1, 1.5, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Connexions visuelles évolutives */}
      <svg className="absolute inset-0 pointer-events-none opacity-20">
        {[...Array(8)].map((_, i) => (
          <motion.line
            key={i}
            x1={`${20 + i * 10}%`}
            y1="0%"
            x2={`${30 + i * 8}%`}
            y2="100%"
            stroke="currentColor"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 0],
              opacity: [0, 0.3, 0]
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
          />
        ))}
      </svg>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
        <div className="max-w-4xl w-full space-y-16">
          {/* Nom */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-light tracking-widest mb-4 text-white">
              JS-INNOV.IA
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 1.5 }}
              className="text-sm tracking-[0.3em] text-gray-500"
            >
              INTERFACE D'INNOVATION AUTO-ÉVOLUTIVE
            </motion.p>
          </motion.div>

          {/* Message généré dynamiquement */}
          <motion.div
            key={generatedMessage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="text-center"
          >
            <p className="text-lg md:text-2xl font-light text-gray-400 tracking-wide">
              {generatedMessage}
            </p>
          </motion.div>

          {/* Reconnaissance subtile */}
          <AnimatePresence>
            {getSubtleRecognition() && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.3, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center text-xs tracking-widest text-gray-600"
              >
                {getSubtleRecognition()}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Visualisation système vivant */}
          <div className="flex justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-gray-700 rounded-full"
                animate={{
                  height: [20, 40 + Math.random() * 30, 20],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                  duration: 2 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Point d'ancrage humain */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
            className="text-center max-w-2xl mx-auto"
          >
            <p className="text-sm leading-relaxed text-gray-500 tracking-wide">
              JS-Innov.IA explore comment l'intelligence artificielle
              <br />
              transforme des idées en systèmes concrets.
              <br />
              Cette interface évolue volontairement.
            </p>
          </motion.div>

          {/* Action minimale */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4 }}
            className="text-center"
          >
            <Link
              to={createPageUrl('Contact')}
              className="inline-block text-sm tracking-[0.2em] text-gray-600 hover:text-gray-400 transition-colors duration-700 border-b border-gray-800 hover:border-gray-600 pb-1"
            >
              {getAction()}
            </Link>
          </motion.div>

          {/* Indicateur d'évolution */}
          <motion.div
            animate={{
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="flex justify-center gap-1 mt-16"
          >
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-1 h-1 bg-gray-700 rounded-full" />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Particles organiques */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-gray-700 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0, 0.5, 0],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}