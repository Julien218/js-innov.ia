import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, MessageCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const PURPLE = '#8B5CF6';
const CYAN = '#06B6D4';
const BLUE = '#3B82F6';
const WA_LINK = 'https://wa.me/32494119090?text=Bonjour%20Julien%2C%20je%20viens%20du%20site%20Js-Innov.IA%20et%20je%20souhaite%20parler%20de%20mon%20projet.';

function PhoenixLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <defs>
        <radialGradient id="sl1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F5CF41" />
          <stop offset="60%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </radialGradient>
        <radialGradient id="sl2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </radialGradient>
      </defs>
      <circle cx="40" cy="40" r="36" stroke="url(#sl1)" strokeWidth="2" fill="none" opacity="0.7"/>
      <path d="M40 52 Q18 44 14 28 Q22 36 40 40" fill="url(#sl1)" opacity="0.9"/>
      <path d="M40 52 Q20 48 10 38 Q20 42 40 44" fill="url(#sl2)" opacity="0.7"/>
      <path d="M40 52 Q62 44 66 28 Q58 36 40 40" fill="url(#sl1)" opacity="0.9"/>
      <path d="M40 52 Q60 48 70 38 Q60 42 40 44" fill="url(#sl2)" opacity="0.7"/>
      <path d="M40 20 Q46 32 44 44 Q40 50 36 44 Q34 32 40 20" fill="url(#sl1)"/>
      <circle cx="40" cy="22" r="5" fill="#F5CF41"/>
    </svg>
  );
}

const navItems = [
  { label: 'Accueil', path: '/saas' },
  { label: 'Services', path: '/saas-services' },
  { label: 'Packs', path: '/saas-packs' },
  { label: 'Réalisations', path: '/saas-portfolio' },
  { label: 'Processus', path: '/saas-processus' },
  { label: 'Agents IA', path: '/saas-agents' },
  { label: 'Blog', path: '/saas-blog' },
  { label: 'Contact', path: '/saas-contact' },
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
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #050510 0%, #0a0818 50%, #060610 100%)', color: 'white' }}>
      {/* Ambient bg */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[160px] opacity-15" style={{ background: `radial-gradient(circle, ${PURPLE}, transparent)` }} />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-[140px] opacity-10" style={{ background: `radial-gradient(circle, ${CYAN}, transparent)` }} />
      </div>

      {/* Top line */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-50" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, ${PURPLE}, ${CYAN}, transparent)` }} />

      {/* NAV */}
      <nav className="fixed top-[2px] left-0 right-0 z-40 transition-all duration-300"
        style={{ background: scrolled ? 'rgba(5,5,16,0.98)' : 'rgba(5,5,16,0.9)', backdropFilter: 'blur(24px)', borderBottom: `1px solid rgba(212,175,55,${scrolled ? '0.18' : '0.08'})` }}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/saas" className="flex items-center gap-3 group">
            <PhoenixLogo size={36} />
            <div>
              <span className="font-black text-base tracking-tight block leading-none"
                style={{ background: `linear-gradient(135deg, ${GOLD_L}, ${GOLD}, ${PURPLE})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Js-Innov.IA
              </span>
              <span className="text-[9px] tracking-[0.18em] uppercase block mt-0.5" style={{ color: 'rgba(212,175,55,0.4)' }}>Solutions Premium</span>
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
            <Link to="/saas-analyse"
              className="ml-2 px-4 py-2 rounded-full text-xs font-black text-black"
              style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, boxShadow: `0 0 20px rgba(212,175,55,0.3)` }}>
              Analyser mon projet →
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
              <Link to="/saas-analyse" onClick={() => setMenuOpen(false)}
                className="block px-4 py-3.5 rounded-xl text-sm font-black text-black text-center"
                style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>
                Analyser mon projet →
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="pt-16 relative z-10">{children}</main>

      {/* Footer */}
      <footer className="relative z-10 border-t mt-16 py-12 px-4" style={{ background: 'rgba(3,3,12,0.99)', borderColor: 'rgba(212,175,55,0.12)' }}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, ${PURPLE}, ${CYAN}, transparent)` }} />
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <PhoenixLogo size={40} />
                <div>
                  <div className="font-black text-lg" style={{ background: `linear-gradient(135deg, ${GOLD_L}, ${GOLD}, ${PURPLE})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Js-Innov.IA</div>
                  <div className="text-xs" style={{ color: 'rgba(212,175,55,0.35)' }}>Julien Pagin · Solutions Premium</div>
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

      {/* WhatsApp floating button */}
      <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all hover:scale-110"
        style={{ background: '#25D366', boxShadow: '0 4px 30px rgba(37,211,102,0.4)' }}>
        <MessageCircle className="w-7 h-7 text-white" />
      </a>
    </div>
  );
}