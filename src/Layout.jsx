import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { Menu, X, ShoppingCart, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AIChatbot from './components/chatbot/AIChatbot';
import VoiceCompanion from './components/chatbot/VoiceCompanion';
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

  useEffect(() => { platform.auth.me().then(u => setIsAdmin(u?.role === 'admin')).catch(() => {}); }, []);
  useEffect(() => { platform.entities.DynamicPage.filter({ show_in_nav: true, status: 'publiée' }).then(setDynNavPages).catch(() => {}); }, []);

  const navItems = [
    { name: 'Accueil', path: 'Home' },
    { name: 'Studio Créatif', path: 'CreativeStudio' },
    { name: 'Outils IA', submenu: [
      { name: 'AI SEO Analyzer', path: 'SEOAudit', desc: 'Analysez votre site web' },
      { name: 'Content Studio', path: 'ContentStudio', desc: 'Générez du contenu IA' },
      { name: 'AI Music Generator', path: 'AIMusic', desc: 'Musiques sans droits SABAM' },
      { name: 'Automation Agents', path: 'Automations', desc: 'Automatisez votre business' },
      { name: 'Applications IA', path: 'Applications', desc: 'Solutions sur mesure' },
    ]},
    { name: 'Ressources', submenu: [
      { name: 'Blog', path: 'Blog', desc: 'Actualités & conseils IA' },
      { name: 'Veille IA', path: 'News', desc: 'Dernières innovations' },
      { name: 'Portfolio', path: 'Showcase', desc: 'Nos réalisations' },
      { name: 'Templates vidéo', path: 'Templates', desc: "Prêts à l'emploi" },
    ]},
    { name: 'Tarifs', path: 'Pricing' },
    { name: 'Visuels Pub', path: 'Visuels' },
    { name: 'Contact', path: 'Contact' },
    ...dynNavPages.map(p => ({ name: p.nav_label || p.title, dynamicSlug: p.slug })),
    { name: 'Commencer', path: 'Pricing', highlight: true },
  ];

  const adminItems = isAdmin ? [
    { name: 'Tableau de bord', path: 'Admin' }, { name: 'CRM', path: 'CRM' },
    { name: 'Gestion devis', path: 'QuoteDashboard' }, { name: 'Gestion contenu', path: 'BlogAdmin' },
    { name: 'SEO Dashboard', path: 'SEODashboard' }, { name: 'Formulaires', path: 'FormBuilder' },
    { name: 'Gestion des pages', path: 'PageManager' },
  ] : [];

  if (isStandalonePage) return <div className="min-h-screen"><SEOMetaTags pageName={currentPageName} />{children}</div>;

  const navLinkStyle = (item) => item.highlight
    ? { background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, color: '#080808', fontWeight: 800, boxShadow: `0 0 25px rgba(212,175,55,0.4)` }
    : currentPageName === item.path
      ? { background: 'rgba(212,175,55,0.12)', color: GOLD, border: `1px solid rgba(212,175,55,0.35)` }
      : { background: 'rgba(212,175,55,0.05)', color: 'rgba(212,175,55,0.7)', border: `1px solid rgba(212,175,55,0.12)` };
  const submenuStyle = { background: 'rgba(6,6,18,0.98)', border: `1px solid rgba(212,175,55,0.2)`, boxShadow: '0 20px 60px rgba(0,0,0,0.9), 0 0 40px rgba(212,175,55,0.06)' };

  return <div className="min-h-screen text-white bg-brand" style={{ background: 'linear-gradient(135deg, #10101a 0%, #14102a 40%, #10101a 100%)' }}>
    <SEOMetaTags pageName={currentPageName} />
    <div className="fixed top-0 left-0 right-0 h-px z-[60]" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, ${PURPLE}, ${CYAN}, transparent)` }} />
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl border-b" style={{ background: 'rgba(6,6,18,0.94)', borderColor: 'rgba(212,175,55,0.15)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="flex justify-between items-center h-28">
        <Link to={createPageUrl('Home')} className="group flex-shrink-0"><motion.div className="relative w-24 h-24 mt-20" animate={{ y:[0,-8,0] }} transition={{duration:3.5,repeat:Infinity}}><img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68ae1c019dacc474a322f2b2/f9316a8c1_Js-innovIA.png" alt="JS-INNOV.IA" className="w-full h-full object-contain" /></motion.div></Link>
        <div className="hidden lg:flex items-center gap-2">{navItems.map(item => item.submenu ? <div key={item.name} className="relative" onMouseEnter={()=>setOpenSubmenu(item.name)} onMouseLeave={()=>setOpenSubmenu(null)}><button className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold" style={navLinkStyle(item)}>{item.name}<ChevronDown className="w-3 h-3" /></button><AnimatePresence>{openSubmenu===item.name&&<motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:8}} className="absolute top-full left-0 mt-2 w-64 rounded-2xl overflow-hidden z-50" style={submenuStyle}>{item.submenu.map(sub=><Link key={sub.path} to={createPageUrl(sub.path)} className="block px-4 py-3 border-b border-white/5"><div className="text-sm font-semibold" style={{color:'rgba(212,175,55,.85)'}}>{sub.name}</div><div className="text-xs mt-0.5 text-white/30">{sub.desc}</div></Link>)}</motion.div>}</AnimatePresence></div> : <Link key={item.dynamicSlug||item.path} to={item.dynamicSlug?`/page/${item.dynamicSlug}`:createPageUrl(item.path)} className="block px-4 py-2 rounded-full text-sm font-semibold" style={navLinkStyle(item)}>{item.name}</Link>)}</div>
        <div className="flex items-center gap-2"><Link to={createPageUrl('Cart')} className="relative hidden lg:block p-2" style={{color:GOLD}}><ShoppingCart className="w-6 h-6" />{getCartCount()>0&&<div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-black" style={{background:GOLD}}>{getCartCount()}</div>}</Link><button onClick={()=>setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2" style={{color:GOLD}}>{mobileMenuOpen?<X/>:<Menu/>}</button></div>
      </div></div>
      <AnimatePresence>{mobileMenuOpen&&<motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} className="lg:hidden border-t border-white/10 bg-[#060612]"><div className="px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto">{navItems.map(item=>item.submenu?<div key={item.name}><button onClick={()=>setOpenSubmenu(openSubmenu===item.name?null:item.name)} className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex justify-between" style={{color:GOLD}}>{item.name}<ChevronDown className="w-4 h-4"/></button>{openSubmenu===item.name&&<div className="ml-4">{item.submenu.map(sub=><Link key={sub.path} to={createPageUrl(sub.path)} onClick={()=>setMobileMenuOpen(false)} className="block px-4 py-2.5 text-sm text-white/60">{sub.name}</Link>)}</div>}</div>:<Link key={item.dynamicSlug||item.path} to={item.dynamicSlug?`/page/${item.dynamicSlug}`:createPageUrl(item.path)} onClick={()=>setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-semibold" style={navLinkStyle(item)}>{item.name}</Link>)}</div></motion.div>}</AnimatePresence>
    </nav>
    <main className="pt-28"><PageTransition>{children}</PageTransition></main>
    <VoiceCompanion /><AIChatbot /><SalesAgent />
  </div>;
}

export default function Layout({ children, currentPageName }) { return <CartProvider><LayoutContent currentPageName={currentPageName}>{children}</LayoutContent></CartProvider>; }
