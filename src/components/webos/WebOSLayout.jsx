import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LayoutDashboard, ChevronRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const PURPLE = '#8B5CF6';
const CYAN = '#06B6D4';

// Phoenix SVG logo
function PhoenixLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <defs>
        <radialGradient id="pg1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F5CF41" />
          <stop offset="60%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </radialGradient>
        <radialGradient id="pg2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </radialGradient>
      </defs>
      {/* Circle ring */}
      <circle cx="40" cy="40" r="36" stroke="url(#pg1)" strokeWidth="2" fill="none" opacity="0.7"/>
      {/* Wings left */}
      <path d="M40 52 Q18 44 14 28 Q22 36 40 40" fill="url(#pg1)" opacity="0.9"/>
      <path d="M40 52 Q20 48 10 38 Q20 42 40 44" fill="url(#pg2)" opacity="0.7"/>
      {/* Wings right */}
      <path d="M40 52 Q62 44 66 28 Q58 36 40 40" fill="url(#pg1)" opacity="0.9"/>
      <path d="M40 52 Q60 48 70 38 Q60 42 40 44" fill="url(#pg2)" opacity="0.7"/>
      {/* Body */}
      <path d="M40 20 Q46 32 44 44 Q40 50 36 44 Q34 32 40 20" fill="url(#pg1)"/>
      {/* Head */}
      <circle cx="40" cy="22" r="5" fill="#F5CF41"/>
      {/* Glow */}
      <circle cx="40" cy="40" r="12" fill="#D4AF37" opacity="0.08"/>
    </svg>
  );
}

const navItems = [
  { label: 'Accueil', path: '/webos' },
  { label: 'Services', path: '/webos-services' },
  { label: 'Portfolio', path: '/webos-portfolio' },
  { label: 'Offres', path: '/webos-offre' },
  { label: 'Contact', path: '/webos-contact' },
];

export default function WebOSLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    base44.auth.me().then(u => setIsAdmin(u?.role === 'admin')).catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const path = location.pathname;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #0a0a14 0%, #0d0a1a 40%, #080810 100%)', color: 'white' }}>

      {/* Ambient background particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[140px] opacity-20"
          style={{ background: `radial-gradient(circle, ${PURPLE}, transparent)` }} />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-[120px] opacity-15"
          style={{ background: `radial-gradient(circle, ${CYAN}, transparent)` }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-[100px] opacity-10"
          style={{ background: `radial-gradient(circle, ${GOLD}, transparent)` }} />
      </div>

      {/* Top gradient line */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-50"
        style={{ background: `linear-gradient(90deg, transparent 0%, ${GOLD} 25%, ${PURPLE} 50%, ${CYAN} 75%, transparent 100%)` }} />

      {/* NAV */}
      <nav className="fixed top-[2px] left-0 right-0 z-40 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(8,8,20,0.97)' : 'rgba(8,8,20,0.85)',
          backdropFilter: 'blur(24px)',
          borderBottom: `1px solid rgba(212,175,55,${scrolled ? '0.18' : '0.08'})`,
          boxShadow: scrolled ? '0 4px 40px rgba(0,0,0,0.5)' : 'none'
        }}>
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/webos" className="flex items-center gap-3 group">
            <motion.div whileHover={{ scale: 1.08 }} transition={{ duration: 0.2 }}>
              <PhoenixLogo size={38} />
            </motion.div>
            <div>
              <span className="font-black text-base tracking-tight block leading-none"
                style={{ background: `linear-gradient(135deg, ${GOLD_L}, ${GOLD}, ${PURPLE})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Js-Innov.IA
              </span>
              <span className="text-[9px] tracking-[0.2em] uppercase block mt-0.5" style={{ color: 'rgba(212,175,55,0.45)' }}>
                Solutions Premium
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <Link key={item.path} to={item.path}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                style={path === item.path
                  ? { background: `rgba(212,175,55,0.12)`, color: GOLD, border: `1px solid rgba(212,175,55,0.3)` }
                  : { color: 'rgba(255,255,255,0.48)', background: 'transparent', border: '1px solid transparent' }}>
                {item.label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/webos-admin"
                className="ml-1 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all"
                style={{ background: `rgba(139,92,246,0.1)`, color: PURPLE, border: `1px solid rgba(139,92,246,0.25)` }}>
                <LayoutDashboard className="w-3.5 h-3.5" /> Admin
              </Link>
            )}
            <Link to="/webos-contact"
              className="ml-2 px-5 py-2 rounded-full text-sm font-black text-black transition-all"
              style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, boxShadow: `0 0 20px rgba(212,175,55,0.3)` }}>
              Démo gratuite →
            </Link>
          </div>

          {/* Mobile burger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-xl"
            style={{ color: 'rgba(212,175,55,0.7)' }}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t px-4 py-4 space-y-1"
              style={{ borderColor: 'rgba(212,175,55,0.1)', background: 'rgba(5,5,16,0.99)' }}>
              {navItems.map(item => (
                <Link key={item.path} to={item.path} onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all"
                  style={path === item.path
                    ? { background: 'rgba(212,175,55,0.1)', color: GOLD }
                    : { color: 'rgba(255,255,255,0.55)' }}>
                  {item.label} <ChevronRight className="w-4 h-4 opacity-40" />
                </Link>
              ))}
              {isAdmin && (
                <Link to="/webos-admin" onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold"
                  style={{ color: PURPLE, background: 'rgba(139,92,246,0.08)' }}>
                  <span className="flex items-center gap-2"><LayoutDashboard className="w-4 h-4" /> Admin</span>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </Link>
              )}
              <Link to="/webos-contact" onClick={() => setMenuOpen(false)}
                className="block px-4 py-3.5 rounded-2xl text-sm font-black text-black text-center"
                style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>
                Demander une démo →
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main content */}
      <main className="pt-16 relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t mt-8 py-12 px-4"
        style={{ background: 'rgba(4,4,14,0.99)', borderColor: 'rgba(212,175,55,0.12)' }}>
        {/* Footer top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, ${PURPLE}, ${CYAN}, transparent)` }} />

        <div className="max-w-5xl mx-auto">
          {/* Logo + tagline */}
          <div className="flex flex-col items-center mb-10">
            <PhoenixLogo size={52} />
            <span className="mt-3 font-black text-xl tracking-tight"
              style={{ background: `linear-gradient(135deg, ${GOLD_L}, ${GOLD}, ${PURPLE})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Js-Innov.IA
            </span>
            <span className="text-xs tracking-[0.25em] uppercase mt-1" style={{ color: 'rgba(212,175,55,0.35)' }}>
              Julien Pagin · Solutions Premium
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: GOLD }}>Navigation</p>
              {navItems.map(item => (
                <Link key={item.path} to={item.path} className="block text-xs py-1 transition-colors"
                  style={{ color: 'rgba(255,255,255,0.32)' }}
                  onMouseEnter={e => e.target.style.color = GOLD}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.32)'}>
                  {item.label}
                </Link>
              ))}
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: GOLD }}>Services</p>
              {['Site vitrine', 'Dashboard admin', 'Automatisation IA', 'Support client', 'Marque blanche'].map(s => (
                <p key={s} className="text-xs py-1" style={{ color: 'rgba(255,255,255,0.32)' }}>{s}</p>
              ))}
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: GOLD }}>Contact</p>
              <p className="text-xs py-1" style={{ color: 'rgba(255,255,255,0.32)' }}>contact@js-innov.ia</p>
              <p className="text-xs py-1" style={{ color: 'rgba(255,255,255,0.32)' }}>+32 494 11 90 90</p>
              <p className="text-xs py-1" style={{ color: 'rgba(255,255,255,0.32)' }}>www.jsinnovia.com</p>
              <p className="text-xs py-1" style={{ color: 'rgba(255,255,255,0.32)' }}>Dour, Belgique</p>
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: GOLD }}>Légal</p>
              <Link to="/webos-mentions" className="block text-xs py-1 transition-colors"
                style={{ color: 'rgba(255,255,255,0.32)' }}
                onMouseEnter={e => e.target.style.color = GOLD}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.32)'}>
                Mentions légales
              </Link>
              <Link to="/webos-mentions" className="block text-xs py-1 transition-colors"
                style={{ color: 'rgba(255,255,255,0.32)' }}
                onMouseEnter={e => e.target.style.color = GOLD}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.32)'}>
                Confidentialité
              </Link>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs"
            style={{ borderColor: 'rgba(212,175,55,0.08)', color: 'rgba(255,255,255,0.18)' }}>
            <p>© 2025 Js-Innov.IA · Julien Pagin · Dour, Belgique · Tous droits réservés</p>
            <div className="flex gap-4">
              <span style={{ color: `rgba(212,175,55,0.3)` }}>0494/11.90.90</span>
              <span style={{ color: `rgba(139,92,246,0.3)` }}>www.jsinnovia.com</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}