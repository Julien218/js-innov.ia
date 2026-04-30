import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, LayoutDashboard, ChevronRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';

const navItems = [
  { label: 'Accueil', path: '/webos' },
  { label: 'Services', path: '/webos-services' },
  { label: 'Portfolio', path: '/webos-portfolio' },
  { label: 'Offres', path: '/webos-offre' },
  { label: 'Contact', path: '/webos-contact' },
];

export default function WebOSLayout({ children, currentPath }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    base44.auth.me().then(u => setIsAdmin(u?.role === 'admin')).catch(() => {});
  }, []);

  const path = location.pathname;

  return (
    <div className="min-h-screen" style={{ background: '#070710', color: 'white' }}>
      {/* Top gradient line */}
      <div className="fixed top-0 left-0 right-0 h-px z-50"
        style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, #8B5CF6, #06B6D4, transparent)` }} />

      {/* NAV */}
      <nav className="fixed top-px left-0 right-0 z-40 backdrop-blur-2xl border-b"
        style={{ background: 'rgba(5,5,16,0.95)', borderColor: 'rgba(212,175,55,0.12)' }}>
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/webos" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border"
                style={{ borderColor: `${GOLD}40`, borderTopColor: GOLD }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-4.5 h-4.5" style={{ color: GOLD }} />
              </div>
            </div>
            <span className="font-black text-base tracking-tight"
              style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              JS-Innov.ia
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <Link key={item.path} to={item.path}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
                style={path === item.path
                  ? { background: 'rgba(212,175,55,0.12)', color: GOLD, border: '1px solid rgba(212,175,55,0.28)' }
                  : { color: 'rgba(255,255,255,0.5)', background: 'transparent' }}>
                {item.label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/webos-admin"
                className="ml-2 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all"
                style={{ background: 'rgba(139,92,246,0.12)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.25)' }}>
                <LayoutDashboard className="w-3.5 h-3.5" /> Admin
              </Link>
            )}
            <Link to="/webos-contact"
              className="ml-2 px-4 py-2 rounded-full text-sm font-black text-black transition-all"
              style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>
              Démo →
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
              style={{ borderColor: 'rgba(212,175,55,0.1)', background: 'rgba(5,5,16,0.98)' }}>
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
                  style={{ color: '#8B5CF6', background: 'rgba(139,92,246,0.08)' }}>
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
      <main className="pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t mt-8 py-10 px-4" style={{ background: 'rgba(3,3,12,0.99)', borderColor: 'rgba(212,175,55,0.1)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: GOLD }}>Navigation</p>
              {navItems.map(item => (
                <Link key={item.path} to={item.path} className="block text-xs py-1 transition-colors"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                  onMouseEnter={e => e.target.style.color = GOLD}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.35)'}>
                  {item.label}
                </Link>
              ))}
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: GOLD }}>Services</p>
              {['Site vitrine', 'Dashboard admin', 'Automatisation IA', 'Support client', 'Marque blanche'].map(s => (
                <p key={s} className="text-xs py-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{s}</p>
              ))}
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: GOLD }}>Contact</p>
              <p className="text-xs py-1" style={{ color: 'rgba(255,255,255,0.35)' }}>contact@js-innov.ia</p>
              <p className="text-xs py-1" style={{ color: 'rgba(255,255,255,0.35)' }}>+32 494 11 90 90</p>
              <p className="text-xs py-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Dour, Belgique</p>
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: GOLD }}>Légal</p>
              <Link to="/webos-mentions" className="block text-xs py-1 transition-colors"
                style={{ color: 'rgba(255,255,255,0.35)' }}
                onMouseEnter={e => e.target.style.color = GOLD}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.35)'}>
                Mentions légales
              </Link>
              <Link to="/webos-mentions" className="block text-xs py-1 transition-colors"
                style={{ color: 'rgba(255,255,255,0.35)' }}
                onMouseEnter={e => e.target.style.color = GOLD}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.35)'}>
                Confidentialité
              </Link>
            </div>
          </div>
          <div className="border-t pt-6 text-center text-xs" style={{ borderColor: 'rgba(212,175,55,0.08)', color: 'rgba(255,255,255,0.2)' }}>
            © 2025 JS-Innov.ia · Julien Pagin · Dour, Belgique · Tous droits réservés
          </div>
        </div>
      </footer>
    </div>
  );
}