import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const GOLD = '#D4AF37';
const PURPLE = '#8B5CF6';
const CYAN = '#06B6D4';

// Unique ambient per route
const PAGE_THEMES = {
  '/': { orb1: GOLD, orb2: PURPLE, label: 'Accueil', icon: '🏠' },
  '/Pricing': { orb1: GOLD, orb2: CYAN, label: 'Tarifs', icon: '💎' },
  '/Blog': { orb1: PURPLE, orb2: CYAN, label: 'Blog', icon: '✍️' },
  '/Contact': { orb1: CYAN, orb2: GOLD, label: 'Contact', icon: '💬' },
  '/Applications': { orb1: '#EC4899', orb2: PURPLE, label: 'Applications', icon: '🤖' },
  '/SEOAudit': { orb1: CYAN, orb2: GOLD, label: 'SEO Audit', icon: '📊' },
  '/ContentStudio': { orb1: GOLD, orb2: '#EC4899', label: 'Content Studio', icon: '✨' },
  '/Automations': { orb1: PURPLE, orb2: CYAN, label: 'Automatisation', icon: '⚡' },
  '/News': { orb1: CYAN, orb2: '#22c55e', label: 'Veille IA', icon: '📡' },
  '/Blog': { orb1: PURPLE, orb2: GOLD, label: 'Blog', icon: '📖' },
  '/Showcase': { orb1: GOLD, orb2: CYAN, label: 'Portfolio', icon: '🎨' },
};

const variants = {
  initial: { opacity: 0, y: 24, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -16, scale: 0.99, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
};

export default function PageTransition({ children }) {
  const location = useLocation();
  const theme = PAGE_THEMES[location.pathname] || { orb1: GOLD, orb2: PURPLE };

  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} variants={variants} initial="initial" animate="animate" exit="exit"
        className="relative min-h-screen" style={{ overflow: 'hidden' }}>

        {/* Unique ambient orbs per page — appear on entry */}
        <motion.div
          key={`orb1-${location.pathname}`}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 0.12, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="fixed top-0 right-0 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${theme.orb1}50, transparent 70%)`,
            filter: 'blur(100px)',
            zIndex: 0,
            transform: 'translate(30%, -30%)',
          }}
        />
        <motion.div
          key={`orb2-${location.pathname}`}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 0.09, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${theme.orb2}50, transparent 70%)`,
            filter: 'blur(120px)',
            zIndex: 0,
            transform: 'translate(-30%, 30%)',
          }}
        />

        {/* Page flash — thin sweep line on entry */}
        <motion.div
          key={`sweep-${location.pathname}`}
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 1, opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-0 left-0 right-0 h-[2px] pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, ${theme.orb1}, ${theme.orb2}, transparent)`,
            transformOrigin: 'left',
            zIndex: 9999,
          }}
        />

        <div className="relative" style={{ zIndex: 1 }}>
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}