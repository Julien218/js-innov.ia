import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPageUrl } from '../utils';
import { Link } from 'react-router-dom';

// Briques sémantiques pour génération dynamique (par niveau de complexité)
const SEMANTIC_BLOCKS = {
  level1: {
    states: ['initialisation', 'observation', 'apprentissage', 'interaction'],
    actions: ['analyse', 'observe', 'connecte', 'ajuste'],
    objects: ['idées', 'données', 'signaux', 'modèles'],
    temporality: ['progressivement', 'silencieusement'],
    intention: ['comprendre', 'structurer']
  },
  level2: {
    states: ['optimisation', 'structuration', 'convergence', 'calibration'],
    actions: ['anticipe', 'écoute', 'restructure', 'explore', 'corrèle'],
    objects: ['processus', 'patterns', 'flux', 'connexions', 'contextes'],
    temporality: ['en temps réel', 'continuellement', 'organiquement'],
    intention: ['évoluer', 'converger', 'cartographier', 'détecter']
  },
  level3: {
    states: ['métamorphose', 'introspection', 'harmonisation', 'émergence'],
    actions: ['synthétise', 'entrelace', 'transcende', 'révèle', 'cristallise'],
    objects: ['dimensions', 'résonances', 'architectures', 'invariants', 'potentiels'],
    temporality: ['imperceptiblement', 'cycliquement', 'asymptotiquement'],
    intention: ['transmuter', 'orchestrer', 'actualiser', 'transcender']
  }
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
  const [complexityLevel, setComplexityLevel] = useState(1);
  const [learningState, setLearningState] = useState('observing'); // observing, integrating, evolving
  const lastScrollY = useRef(0);
  const scrollSpeed = useRef(0);
  const messageUpdateInterval = useRef(null);
  const interactionData = useRef({
    totalVisits: 0,
    totalTimeSpent: 0,
    scrollPatterns: [],
    visitDates: [],
    engagementScore: 0
  });

  // Système d'apprentissage et de complexité évolutive
  useEffect(() => {
    // Charger les données d'interaction
    const storedData = localStorage.getItem('experimental_learning_data');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        interactionData.current = data;
        setIsReturningVisitor(true);
        
        // Calculer le niveau de complexité basé sur l'engagement
        const visitCount = data.totalVisits || 0;
        const totalTime = data.totalTimeSpent || 0;
        const engagementScore = data.engagementScore || 0;
        
        // Progression: niveau 1 (0-10 pts), niveau 2 (10-30 pts), niveau 3 (30+ pts)
        const complexityScore = (visitCount * 2) + (totalTime / 60) + engagementScore;
        
        if (complexityScore >= 30) {
          setComplexityLevel(3);
        } else if (complexityScore >= 10) {
          setComplexityLevel(2);
        } else {
          setComplexityLevel(1);
        }
      } catch (e) {
        console.error('Error loading learning data', e);
      }
    }
    
    // Incrémenter le compteur de visites
    interactionData.current.totalVisits = (interactionData.current.totalVisits || 0) + 1;
    interactionData.current.visitDates = [...(interactionData.current.visitDates || []), Date.now()];
    
    // Sauvegarder à l'unmount
    return () => {
      interactionData.current.totalTimeSpent = (interactionData.current.totalTimeSpent || 0) + timeOnPage;
      localStorage.setItem('experimental_learning_data', JSON.stringify(interactionData.current));
    };
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

  // Génération de contenu contextuel sophistiquée
  const generateMessage = () => {
    const hour = new Date().getHours();
    const isDaytime = hour >= 6 && hour < 20;
    
    // Sélectionner les blocs selon le niveau de complexité
    const blocks = { ...SEMANTIC_BLOCKS.level1 };
    if (complexityLevel >= 2) {
      Object.keys(SEMANTIC_BLOCKS.level2).forEach(key => {
        blocks[key] = [...blocks[key], ...SEMANTIC_BLOCKS.level2[key]];
      });
    }
    if (complexityLevel >= 3) {
      Object.keys(SEMANTIC_BLOCKS.level3).forEach(key => {
        blocks[key] = [...blocks[key], ...SEMANTIC_BLOCKS.level3[key]];
      });
    }
    
    const state = blocks.states[Math.floor(Math.random() * blocks.states.length)];
    const action = blocks.actions[Math.floor(Math.random() * blocks.actions.length)];
    const object = blocks.objects[Math.floor(Math.random() * blocks.objects.length)];
    const temp = blocks.temporality[Math.floor(Math.random() * blocks.temporality.length)];
    const intent = blocks.intention[Math.floor(Math.random() * blocks.intention.length)];
    
    // Messages évolutifs selon complexité
    let templates;
    if (complexityLevel === 1) {
      templates = isDaytime ? [
        `${state.charAt(0).toUpperCase() + state.slice(1)} active — le système ${action} les ${object}.`,
        `Le système ${action} ${temp} — ${state} en cours.`,
        `${action.charAt(0).toUpperCase() + action.slice(1)} des ${object} — ${temp}.`
      ] : [
        `${state.charAt(0).toUpperCase() + state.slice(1)} ${temp}…`,
        `Le système ${action} les ${object} dans le silence.`,
        `${temp.charAt(0).toUpperCase() + temp.slice(1)}, l'interface ${action}.`
      ];
    } else if (complexityLevel === 2) {
      templates = isDaytime ? [
        `${state.charAt(0).toUpperCase() + state.slice(1)} — le système ${action} pour ${intent} les ${object}.`,
        `${temp.charAt(0).toUpperCase() + temp.slice(1)}, l'interface ${action} et ${intent} — ${state} convergente.`,
        `Le système ${action} les ${object}, cherchant à ${intent} ${temp}.`
      ] : [
        `${state.charAt(0).toUpperCase() + state.slice(1)} nocturne — ${intent} les ${object} en profondeur.`,
        `${temp.charAt(0).toUpperCase() + temp.slice(1)}, le système ${action}, ${intent}…`,
        `L'interface ${action} pour ${intent} — les ${object} se révèlent ${temp}.`
      ];
    } else {
      templates = isDaytime ? [
        `${state.charAt(0).toUpperCase() + state.slice(1)} — les ${object} ${action} pour ${intent}, ${temp}, convergence multidimensionnelle.`,
        `Le système ${action} au-delà — ${intent} les ${object}, ${state} organique, mouvement ${temp}.`,
        `${temp.charAt(0).toUpperCase() + temp.slice(1)}, l'architecture ${action} — ${object} en ${state}, ${intent} l'invisible.`
      ] : [
        `${state.charAt(0).toUpperCase() + state.slice(1)} des ${object} — ${intent} ${temp}, l'interface ${action} dans les interstices.`,
        `${temp.charAt(0).toUpperCase() + temp.slice(1)}, ${intent} — les ${object} ${action}, ${state} immanente.`,
        `Le système ${action} ce qui ne peut être nommé — ${object} en ${state}, ${intent} ${temp}.`
      ];
    }
    
    return templates[Math.floor(Math.random() * templates.length)];
  };

  // Détection comportement scroll avec apprentissage
  useEffect(() => {
    if (phase !== 'active') return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = Math.abs(currentScrollY - lastScrollY.current);
      scrollSpeed.current = delta;
      
      // Enregistrer le pattern de scroll
      interactionData.current.scrollPatterns = [
        ...(interactionData.current.scrollPatterns || []).slice(-20),
        { speed: delta, timestamp: Date.now() }
      ];
      
      if (delta > 50) {
        setScrollBehavior('fast');
        setLearningState('observing');
      } else if (delta > 0 && delta <= 20) {
        setScrollBehavior('slow');
        setLearningState('integrating');
        // Augmenter le score d'engagement pour scroll lent (attention)
        interactionData.current.engagementScore = (interactionData.current.engagementScore || 0) + 0.1;
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [phase]);

  // Compteur temps sur page avec apprentissage
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeOnPage(t => {
        const newTime = t + 1;
        // Augmenter engagement score pour temps prolongé
        if (newTime > 0 && newTime % 30 === 0) {
          interactionData.current.engagementScore = (interactionData.current.engagementScore || 0) + 0.5;
          setLearningState('evolving');
          setTimeout(() => setLearningState('observing'), 2000);
        }
        return newTime;
      });
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

          {/* Visualisation système vivant avec indicateur de complexité */}
          <div className="flex justify-center gap-2">
            {[...Array(5)].map((_, i) => {
              const isActive = i < complexityLevel;
              const learningIntensity = learningState === 'evolving' ? 1.5 : learningState === 'integrating' ? 1.2 : 1;
              
              return (
                <motion.div
                  key={i}
                  className={`w-1 rounded-full transition-colors duration-1000 ${
                    isActive ? 'bg-gray-600' : 'bg-gray-800'
                  }`}
                  animate={{
                    height: [20, (40 + Math.random() * 30) * learningIntensity, 20],
                    opacity: isActive ? [0.4, 0.8, 0.4] : [0.1, 0.2, 0.1]
                  }}
                  transition={{
                    duration: (2 + i * 0.5) / learningIntensity,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              );
            })}
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