import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, MessageCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import VoiceButton from '@/components/voice/VoiceButton';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const PURPLE = '#7C3AED';
const PURPLE_S = '#8B5CF6';
const CYAN = '#06B6D4';
const MAGENTA = '#FF1B47';
const NOIR = '#0B0B0F';
const BLEU_NUIT = '#0F172A';
const WA_LINK = 'https://wa.me/32494119090?text=Bonjour%20Julien%2C%20je%20viens%20du%20site%20Js-Innov.IA%20et%20je%20souhaite%20parler%20de%20mon%20projet.';

function PhoenixLogo({ size = 36 }) {
  return (
    <div style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
      <img
        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68ae1c019dacc474a322f2b2/f9316a8c1_Js-innovIA.png"
        alt="Js-Innov.IA Phoenix"
        style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(212,175,55,0.5))' }}
      />
    </div>
  );
}

const navItems = [
  { label: 'Accueil', path: '/' },
  { label: 'Packs', path: '/saas-packs' },
  { label: 'Événements', path: '/saas-events' },
  { label: 'Agents IA', path: '/saas-agents' },
  { label: 'Contact', path: '/saas-contact' },
  { label: 'Mon espace', path: '/saas-client' },
];

export default function SaasLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    base44.auth.me().then(u => setIsAdmin(u?.role === 'admin')).catch(() => {});
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const path = location.pathname;

  return (
    <div className="min-h-screen bg-adn" style={{ color: 'white' }}>
      {/* Ambient bg */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[160px] opacity-12" style={{ background: `radial-gradient(circle, ${PURPLE}, transparent)` }} />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-[140px] opacity-08" style={{ background: `radial-gradient(circle, ${CYAN}, transparent)` }} />
        <div className="absolute top-1/2 left-3/4 w-64 h-64 rounded-full blur-[120px] opacity-06" style={{ background: `radial-gradient(circle, ${GOLD}, transparent)` }} />
      </div>

      {/* Top line ADN */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-50 energy-flow" />

      {/* NAV */}
      <nav className="fixed top-[2px] left-0 right-0 z-40 transition-all duration-300"
        style={{ background: scrolled ? 'rgba(11,11,15,0.98)' : 'rgba(11,11,15,0.88)', backdropFilter: 'blur(28px)', borderBottom: `1px solid rgba(212,175,55,${scrolled ? '0.25' : '0.1'})`, fontFamily: "'Poppins', sans-serif" }}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/saas" className="flex items-center gap-3 group">
            <PhoenixLogo size={36} />
            <div>
              <span className="font-cinzel font-bold text-base tracking-wide block leading-none text-gold-gradient">
                Js-Innov.IA
              </span>
              <span className="text-[8px] tracking-[0.15em] uppercase block mt-0.5 font-poppins" style={{ color: 'rgba(212,175,55,0.45)' }}>Automatisation · IA · Humain</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              <Link key={item.path} to={item.path}
                className="px-3 py-2 rounded-full text-xs font-semibold transition-all"
                style={path === item.path
                  ? { background: 'rgba(212,175,55,0.12)', color: GOLD, border: '1px solid rgba(212,175,55,0.28)' }
                  : { color: 'rgba(255,255,255,0.48)' }}>
                {item.label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/saas-admin" className="ml-1 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold"
                style={{ background: 'rgba(139,92,246,0.1)', color: PURPLE, border: '1px solid rgba(139,92,246,0.25)' }}>
                Admin
              </Link>
            )}
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
              className="ml-2 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold"
              style={{ background: 'rgba(37,211,102,0.12)', color: '#25D366', border: '1px solid rgba(37,211,102,0.25)' }}>
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
            </a>
            <Link to="/saas-landing#formulaire"
              className="ml-2 btn-primary-gold px-4 py-2 text-xs">
              Créer mon projet →
            </Link>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 rounded-xl" style={{ color: 'rgba(212,175,55,0.7)' }}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t px-4 py-4 space-y-1" style={{ borderColor: 'rgba(212,175,55,0.1)', background: 'rgba(5,5,16,0.99)' }}>
              {navItems.map(item => (
                <Link key={item.path} to={item.path} onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-semibold"
                  style={path === item.path ? { background: 'rgba(212,175,55,0.1)', color: GOLD } : { color: 'rgba(255,255,255,0.55)' }}>
                  {item.label}
                </Link>
              ))}
              {isAdmin && (
                <Link to="/saas-admin" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-bold" style={{ color: PURPLE }}>Admin</Link>
              )}
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold"
                style={{ color: '#25D366', background: 'rgba(37,211,102,0.08)' }}>
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
              <Link to="/saas-landing#formulaire" onClick={() => setMenuOpen(false)}
                className="btn-primary-gold block px-4 py-3.5 text-sm text-center">
                Créer mon projet →
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="pt-16 relative z-10">{children}</main>

      {/* Footer */}
      <footer className="relative z-10 border-t mt-16 py-12 px-4" style={{ background: NOIR, borderColor: 'rgba(212,175,55,0.12)', fontFamily: "'Poppins', sans-serif" }}>
        <div className="absolute top-0 left-0 right-0 h-[2px] energy-flow" />
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <PhoenixLogo size={40} />
                <div>
                  <div className="font-cinzel font-bold text-lg text-gold-gradient">Js-Innov.IA</div>
                  <div className="text-xs" style={{ color: 'rgba(212,175,55,0.35)' }}>Solutions Premium</div>
                </div>
              </div>
              <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
                Votre problème devient notre point de départ.<br />Votre solution devient notre création.
              </p>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold"
                style={{ background: 'rgba(37,211,102,0.12)', color: '#25D366', border: '1px solid rgba(37,211,102,0.2)' }}>
                <MessageCircle className="w-3.5 h-3.5" /> 0494/11.90.90
              </a>
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: GOLD }}>Navigation</p>
              {navItems.slice(0, 5).map(item => (
                <Link key={item.path} to={item.path} className="block text-xs py-1 transition-colors" style={{ color: 'rgba(255,255,255,0.3)' }}
                  onMouseEnter={e => e.target.style.color = GOLD} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.3)'}>
                  {item.label}
                </Link>
              ))}
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: GOLD }}>Services</p>
              {['Sites web', 'Chatbots métier', 'App mobile', 'Contenus digitaux', 'Automatisation', 'Agents IA'].map(s => (
                <p key={s} className="text-xs py-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{s}</p>
              ))}
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: GOLD }}>Légal</p>
              <Link to="/saas-mentions" className="block text-xs py-1 transition-colors" style={{ color: 'rgba(255,255,255,0.3)' }}
                onMouseEnter={e => e.target.style.color = GOLD} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.3)'}>
                Mentions légales
              </Link>
              <Link to="/saas-confidentialite" className="block text-xs py-1 transition-colors" style={{ color: 'rgba(255,255,255,0.3)' }}
                onMouseEnter={e => e.target.style.color = GOLD} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.3)'}>
                Confidentialité
              </Link>
              <Link to="/saas-cgv" className="block text-xs py-1 transition-colors" style={{ color: 'rgba(255,255,255,0.3)' }}
                onMouseEnter={e => e.target.style.color = GOLD} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.3)'}>
                CGV
              </Link>
              <p className="text-xs py-1 mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>BCE : 0877926214</p>
              <p className="text-xs py-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Grand Rue 52, 7370 Dour</p>
            </div>
          </div>
          <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs" style={{ borderColor: 'rgba(212,175,55,0.08)', color: 'rgba(255,255,255,0.18)' }}>
            <p>© 2025 Js-Innov.IA · Julien Pagin · Grand Rue 52, 7370 Dour · BCE 0877926214</p>
            <p style={{ color: 'rgba(212,175,55,0.3)' }}>info@jsinnovia.com · 0494/11.90.90</p>
          </div>
        </div>
      </footer>

      {/* Voice Assistant */}
      <VoiceButton />

      {/* WhatsApp floating button */}
      <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all hover:scale-110"
        style={{ background: '#25D366', boxShadow: '0 4px 30px rgba(37,211,102,0.4)' }}>
        <MessageCircle className="w-7 h-7 text-white" />
      </a>
    </div>
  );
}