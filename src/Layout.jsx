import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { Menu, X, ShoppingCart, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AIChatbot from './components/chatbot/AIChatbot';
import SalesAgent from './components/agent/SalesAgent';
import SEOMetaTags from './components/seo/SEOMetaTags';
import { CartProvider, useCart } from './components/cart/CartContext';
import { platform } from '@/api/platformClient';
import PageTransition from './components/shared/PageTransition';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const PURPLE = '#8B5CF6';
const CYAN = '#06B6D4';

function LayoutContent({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [dynNavPages, setDynNavPages] = useState([]);
  const { getCartCount } = useCart();

  const isStandalonePage = currentPageName === 'LogoSenergieDour';

  useEffect(() => {
    platform.auth.me().then(u => setIsAdmin(u?.role === 'admin')).catch(() => {});
  }, []);

  useEffect(() => {
    platform.entities.DynamicPage.filter({ show_in_nav: true, status: 'publiée' })
      .then(setDynNavPages).catch(() => {});
  }, []);

  const navItems = [
    { name: 'Accueil', path: 'Home' },
    {
      name: 'Outils IA',
      submenu: [
        { name: 'AI SEO Analyzer', path: 'SEOAudit', desc: 'Analysez votre site web' },
        { name: 'Content Studio', path: 'ContentStudio', desc: 'Générez du contenu IA' },
        { name: 'AI Music Generator', path: 'AIMusic', desc: 'Musiques sans droits SABAM' },
        { name: 'Automation Agents', path: 'Automations', desc: 'Automatisez votre business' },
        { name: 'Applications IA', path: 'Applications', desc: 'Solutions sur mesure' },
      ]
    },
    {
      name: 'Ressources',
      submenu: [
        { name: 'Blog', path: 'Blog', desc: 'Actualités & conseils IA' },
        { name: 'Veille IA', path: 'News', desc: 'Dernières innovations' },
        { name: 'Portfolio', path: 'Showcase', desc: 'Nos réalisations' },
        { name: 'Templates vidéo', path: 'Templates', desc: "Prêts à l'emploi" },
      ]
    },
    { name: 'Tarifs', path: 'Pricing' },
    { name: 'Visuels Pub', path: 'Visuels' },
    { name: 'Contact', path: 'Contact' },
    ...dynNavPages.map(p => ({ name: p.nav_label || p.title, dynamicSlug: p.slug })),
    { name: 'Commencer', path: 'Pricing', highlight: true },
  ];

  const adminItems = isAdmin ? [
    { name: 'Tableau de bord', path: 'Admin' },
    { name: 'CRM', path: 'CRM' },
    { name: 'Gestion devis', path: 'QuoteDashboard' },
    { name: 'Gestion contenu', path: 'BlogAdmin' },
    { name: 'SEO Dashboard', path: 'SEODashboard' },
    { name: 'Formulaires', path: 'FormBuilder' },
    { name: 'Gestion des pages', path: 'PageManager' },
  ] : [];

  if (isStandalonePage) {
    return (
      <div className="min-h-screen">
        <SEOMetaTags pageName={currentPageName} />
        {children}
      </div>
    );
  }

  const navLinkStyle = (item) => {
    if (item.highlight) return { background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, color: '#080808', fontWeight: 800, boxShadow: `0 0 25px rgba(212,175,55,0.4)` };
    if (currentPageName === item.path) return { background: 'rgba(212,175,55,0.12)', color: GOLD, border: `1px solid rgba(212,175,55,0.35)` };
    return { background: 'rgba(212,175,55,0.05)', color: 'rgba(212,175,55,0.7)', border: `1px solid rgba(212,175,55,0.12)` };
  };

  const submenuStyle = { background: 'rgba(6,6,18,0.98)', border: `1px solid rgba(212,175,55,0.2)`, boxShadow: '0 20px 60px rgba(0,0,0,0.9), 0 0 40px rgba(212,175,55,0.06)' };

  return (
    <div className="min-h-screen text-white bg-brand" style={{ background: 'linear-gradient(135deg, #10101a 0%, #14102a 40%, #10101a 100%)' }}>
      <SEOMetaTags pageName={currentPageName} />
      <style>{`
        :root { --gold: #D4AF37; --gold-light: #F5CF41; --purple: #8B5CF6; --cyan: #06B6D4; }
        .power-word {
          background: linear-gradient(135deg, #D4AF37, #F5CF41, #8B5CF6);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          font-weight: 700; display: inline-block;
        }
        .gradient-text {
          background: linear-gradient(135deg, #D4AF37, #F5CF41, #8B5CF6, #06B6D4);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
      `}</style>

      {/* Gold gradient line */}
      <div className="fixed top-0 left-0 right-0 h-px z-[60]"
        style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, ${PURPLE}, ${CYAN}, transparent)` }} />

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl border-b"
        style={{ background: 'rgba(6,6,18,0.94)', borderColor: 'rgba(212,175,55,0.15)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-28">

            {/* Logo */}
            <Link to={createPageUrl('Home')} className="group flex-shrink-0">
              <motion.div className="relative w-24 h-24 mt-20 phoenix-glow"
                animate={{ y: [0, -8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}>
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68ae1c019dacc474a322f2b2/f9316a8c1_Js-innovIA.png"
                  alt="JS-INNOV.IA"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  style={{ filter: 'drop-shadow(0 0 12px rgba(212,175,55,0.6)) drop-shadow(0 0 24px rgba(139,92,246,0.3))' }}
                />
                <div className="absolute inset-0 rounded-full blur-2xl opacity-30 group-hover:opacity-55 transition-opacity -z-10"
                  style={{ background: `radial-gradient(circle, ${GOLD}, ${PURPLE}, ${CYAN})` }} />
              </motion.div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-2">
              {navItems.map((item) =>
                item.submenu ? (
                  <div key={item.name} className="relative"
                    onMouseEnter={() => setOpenSubmenu(item.name)}
                    onMouseLeave={() => setOpenSubmenu(null)}>
                    <button
                      className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                      style={openSubmenu === item.name
                        ? { background: 'rgba(212,175,55,0.12)', color: GOLD, border: `1px solid rgba(212,175,55,0.3)` }
                        : { background: 'rgba(212,175,55,0.05)', color: 'rgba(212,175,55,0.65)', border: `1px solid rgba(212,175,55,0.12)` }}>
                      {item.name}
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    <AnimatePresence>
                      {openSubmenu === item.name && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                          className="absolute top-full left-0 mt-2 w-64 rounded-2xl overflow-hidden z-50"
                          style={submenuStyle}>
                          {item.submenu.map((sub) => (
                            <Link key={sub.path} to={createPageUrl(sub.path)}
                              className="block px-4 py-3 border-b last:border-0 transition-colors"
                              style={{ borderColor: 'rgba(212,175,55,0.08)' }}
                              onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,175,55,0.06)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                              <div className="text-sm font-semibold" style={{ color: 'rgba(212,175,55,0.85)' }}>{sub.name}</div>
                              <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.32)' }}>{sub.desc}</div>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link key={item.dynamicSlug || item.path}
                    to={item.dynamicSlug ? `/page/${item.dynamicSlug}` : createPageUrl(item.path)}
                    className="block px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                    style={navLinkStyle(item)}>
                    {item.name}
                  </Link>
                )
              )}

              {/* Admin dropdown */}
              {adminItems.length > 0 && (
                <div className="relative ml-1 pl-2" style={{ borderLeft: `1px solid rgba(139,92,246,0.2)` }}
                  onMouseEnter={() => setOpenSubmenu('admin')}
                  onMouseLeave={() => setOpenSubmenu(null)}>
                  <button className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold transition-all"
                    style={{ background: 'rgba(139,92,246,0.1)', color: PURPLE, border: `1px solid rgba(139,92,246,0.2)` }}>
                    Admin <ChevronDown className="w-3 h-3" />
                  </button>
                  <AnimatePresence>
                    {openSubmenu === 'admin' && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                        className="absolute top-full right-0 mt-2 w-56 rounded-2xl overflow-hidden z-50"
                        style={{ background: 'rgba(6,6,18,0.98)', border: `1px solid rgba(139,92,246,0.22)`, boxShadow: '0 20px 60px rgba(0,0,0,0.9)' }}>
                        {adminItems.map((item) => (
                          <Link key={item.path} to={createPageUrl(item.path)}
                            className="block px-4 py-3 text-sm border-b last:border-0 transition-colors"
                            style={{ color: 'rgba(139,92,246,0.8)', borderColor: 'rgba(139,92,246,0.1)' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,92,246,0.1)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            {item.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Cart + burger */}
            <div className="flex items-center gap-2">
              <Link to={createPageUrl('Cart')} className="relative hidden lg:block p-2 rounded-lg transition-all"
                style={{ color: 'rgba(212,175,55,0.6)' }}
                onMouseEnter={e => e.currentTarget.style.color = GOLD}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(212,175,55,0.6)'}>
                <ShoppingCart className="w-6 h-6" />
                {getCartCount() > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-black"
                    style={{ background: GOLD }}>{getCartCount()}</div>
                )}
              </Link>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg transition-all"
                style={{ color: 'rgba(212,175,55,0.7)' }}>
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t" style={{ background: 'rgba(4,4,14,0.98)', borderColor: 'rgba(212,175,55,0.12)' }}>
              <div className="px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto">
                {navItems.map((item) =>
                  item.submenu ? (
                    <div key={item.name}>
                      <button onClick={() => setOpenSubmenu(openSubmenu === item.name ? null : item.name)}
                        className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all"
                        style={{ color: 'rgba(212,175,55,0.7)', background: 'rgba(212,175,55,0.04)' }}>
                        {item.name}
                        <ChevronDown className={`w-4 h-4 transition-transform ${openSubmenu === item.name ? 'rotate-180' : ''}`} />
                      </button>
                      {openSubmenu === item.name && (
                        <div className="ml-4 mt-1 space-y-0.5">
                          {item.submenu.map(sub => (
                            <Link key={sub.path} to={createPageUrl(sub.path)} onClick={() => setMobileMenuOpen(false)}
                              className="block px-4 py-2.5 rounded-lg text-sm transition-all"
                              style={{ color: 'rgba(212,175,55,0.55)' }}
                              onMouseEnter={e => e.currentTarget.style.color = GOLD}
                              onMouseLeave={e => e.currentTarget.style.color = 'rgba(212,175,55,0.55)'}>
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link key={item.dynamicSlug || item.path}
                      to={item.dynamicSlug ? `/page/${item.dynamicSlug}` : createPageUrl(item.path)}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                      style={item.highlight
                        ? { background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, color: '#080808', fontWeight: 800 }
                        : { color: 'rgba(212,175,55,0.7)', background: 'rgba(212,175,55,0.04)' }}>
                      {item.name}
                    </Link>
                  )
                )}
                {adminItems.length > 0 && (
                  <>
                    <div className="border-t my-2" style={{ borderColor: 'rgba(139,92,246,0.15)' }} />
                    <div className="text-xs px-4 py-1" style={{ color: 'rgba(139,92,246,0.5)' }}>Administration</div>
                    {adminItems.map(item => (
                      <Link key={item.path} to={createPageUrl(item.path)} onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-2.5 rounded-lg text-sm transition-all"
                        style={{ color: 'rgba(139,92,246,0.7)', background: 'rgba(139,92,246,0.04)' }}>
                        {item.name}
                      </Link>
                    ))}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main */}
      <main className="pt-28 relative" style={{ zIndex: 1 }}>
        <PageTransition>{children}</PageTransition>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t" style={{ background: 'rgba(4,4,12,0.99)', borderColor: 'rgba(212,175,55,0.12)' }}>
        <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, ${PURPLE}, transparent)` }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-4 text-sm tracking-wider uppercase" style={{ color: GOLD }}>Services</h3>
              <div className="space-y-2.5">
                {[
                  { label: 'Intelligence Artificielle', path: 'Applications' },
                  { label: 'Automatisations', path: 'Automations' },
                  { label: 'Audit SEO', path: 'SEOAudit' },
                  { label: 'Création de sites', path: 'DevisWebsite' },
                ].map(l => (
                  <Link key={l.path} to={createPageUrl(l.path)} className="block text-sm transition-colors"
                    style={{ color: 'rgba(255,255,255,0.35)' }}
                    onMouseEnter={e => e.target.style.color = GOLD}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.35)'}>{l.label}</Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-sm tracking-wider uppercase" style={{ color: GOLD }}>Ressources</h3>
              <div className="space-y-2.5">
                {[
                  { label: 'Blog', path: 'Blog' },
                  { label: 'Veille IA', path: 'News' },
                  { label: 'Portfolio', path: 'Showcase' },
                  { label: 'Contact', path: 'Contact' },
                ].map(l => (
                  <Link key={l.path} to={createPageUrl(l.path)} className="block text-sm transition-colors"
                    style={{ color: 'rgba(255,255,255,0.35)' }}
                    onMouseEnter={e => e.target.style.color = GOLD}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.35)'}>{l.label}</Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-sm tracking-wider uppercase" style={{ color: GOLD }}>Commencer un projet</h3>
              <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.35)' }}>Transformez vos idées en réalité avec l'IA.</p>
              <Link to={createPageUrl('DevisWebsite')}>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="px-6 py-2.5 rounded-lg text-sm font-bold text-black"
                  style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, boxShadow: '0 0 20px rgba(212,175,55,0.25)' }}>
                  Demander un devis →
                </motion.button>
              </Link>
            </div>
          </div>
          <div className="border-t mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs"
            style={{ borderColor: 'rgba(212,175,55,0.08)', color: 'rgba(255,255,255,0.2)' }}>
            <p>© 2024 JS-INNOV.IA · Julien Pagin · Tous droits réservés</p>
            <p style={{ color: 'rgba(212,175,55,0.35)' }}>contact@js-innov.ia · +32 494 11 90 90 · Dour, Belgique</p>
          </div>
        </div>
      </footer>

      <AIChatbot />
      <SalesAgent />
    </div>
  );
}

export default function Layout({ children, currentPageName }) {
  return (
    <CartProvider>
      <LayoutContent children={children} currentPageName={currentPageName} />
    </CartProvider>
  );
}