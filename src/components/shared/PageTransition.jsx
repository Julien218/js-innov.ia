import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const PURPLE = '#8B5CF6';
const CYAN = '#06B6D4';
const PINK = '#EC4899';
const GREEN = '#22c55e';

const PAGE_THEMES = {
  '/Home':          { c1: GOLD,   c2: PURPLE, c3: CYAN },
  '/':              { c1: GOLD,   c2: PURPLE, c3: CYAN },
  '/Pricing':       { c1: GOLD,   c2: CYAN,   c3: PURPLE },
  '/Blog':          { c1: PURPLE, c2: GOLD,   c3: CYAN },
  '/BlogPost':      { c1: PURPLE, c2: GOLD,   c3: CYAN },
  '/Contact':       { c1: CYAN,   c2: GOLD,   c3: PURPLE },
  '/Applications':  { c1: PINK,   c2: PURPLE, c3: GOLD },
  '/SEOAudit':      { c1: CYAN,   c2: GOLD,   c3: GREEN },
  '/ContentStudio': { c1: GOLD,   c2: PINK,   c3: PURPLE },
  '/Automations':   { c1: PURPLE, c2: CYAN,   c3: GOLD },
  '/News':          { c1: CYAN,   c2: GREEN,  c3: PURPLE },
  '/Showcase':      { c1: GOLD,   c2: CYAN,   c3: PURPLE },
  '/Templates':     { c1: PURPLE, c2: PINK,   c3: GOLD },
  '/AIMusic':       { c1: PINK,   c2: PURPLE, c3: CYAN },
  '/Visuels':       { c1: GOLD,   c2: PINK,   c3: CYAN },
  '/Innovations':   { c1: CYAN,   c2: PURPLE, c3: GOLD },
};

function getTheme(pathname) {
  // Match exact or prefix (e.g. /BlogPost?slug=xxx)
  const base = '/' + pathname.replace(/^\//, '').split('?')[0];
  return PAGE_THEMES[base] || PAGE_THEMES[pathname] || { c1: GOLD, c2: PURPLE, c3: CYAN };
}

export default function PageTransition({ children }) {
  const location = useLocation();
  const theme = getTheme(location.pathname);

  return (
    <>
      {/* ── Fixed ambient background orbs (change per page) ─────────────────── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`bg-${location.pathname}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 0 }}
        >
          {/* Top-right orb */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.11 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute', top: '-10%', right: '-10%',
              width: 700, height: 700, borderRadius: '50%',
              background: `radial-gradient(circle, ${theme.c1}60 0%, transparent 70%)`,
              filter: 'blur(80px)',
            }}
          />
          {/* Bottom-left orb */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.09 }}
            transition={{ duration: 1.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute', bottom: '-10%', left: '-10%',
              width: 600, height: 600, borderRadius: '50%',
              background: `radial-gradient(circle, ${theme.c2}55 0%, transparent 70%)`,
              filter: 'blur(100px)',
            }}
          />
          {/* Center subtle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
            transition={{ duration: 2, delay: 0.3 }}
            style={{
              position: 'absolute', top: '40%', left: '40%',
              width: 400, height: 400, borderRadius: '50%',
              background: `radial-gradient(circle, ${theme.c3}40 0%, transparent 70%)`,
              filter: 'blur(80px)',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Sweep line on every page transition ─────────────────────────────── */}
      <AnimatePresence>
        <motion.div
          key={`sweep-${location.pathname}`}
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 1, opacity: [1, 1, 0] }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], times: [0, 0.7, 1] }}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, height: 2,
            background: `linear-gradient(90deg, transparent 0%, ${theme.c1} 30%, ${theme.c2} 60%, ${theme.c3} 80%, transparent 100%)`,
            transformOrigin: 'left',
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        />
      </AnimatePresence>

      {/* ── Corner flare sparks ──────────────────────────────────────────────── */}
      <AnimatePresence>
        <motion.div
          key={`spark-${location.pathname}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.6, 0], scale: [0, 1.2, 0] }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            position: 'fixed', top: 0, left: 0,
            width: 200, height: 200,
            background: `radial-gradient(circle at top left, ${theme.c1}40 0%, transparent 60%)`,
            pointerEvents: 'none',
            zIndex: 9998,
          }}
        />
      </AnimatePresence>

      {/* ── Page content with slide+fade ─────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -12, filter: 'blur(2px)' }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
            filter: { duration: 0.3 },
          }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}