import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Globe, Zap, BarChart3, Headphones, Bot, Search, Share2, Star,
  ArrowRight, CheckCircle, Shield, Layers, ChevronRight, Sparkles,
  Phone, Mail, ExternalLink
} from 'lucide-react';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const PURPLE = '#8B5CF6';
const CYAN = '#06B6D4';

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

// Animated particle canvas
function ParticleField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      color: [GOLD, PURPLE, CYAN][Math.floor(Math.random() * 3)],
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        particles.slice(i + 1).forEach(q => {
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(212,175,55,${0.04 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        });
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + '66';
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />;
}

// Phoenix SVG
function PhoenixHero() {
  return (
    <svg width="140" height="140" viewBox="0 0 120 120" fill="none">
      <defs>
        <radialGradient id="hg1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F5CF41" />
          <stop offset="60%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.5" />
        </radialGradient>
        <radialGradient id="hg2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </radialGradient>
        <radialGradient id="hglow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Outer glow ring */}
      <circle cx="60" cy="60" r="55" fill="url(#hglow)" />
      {/* Ring */}
      <circle cx="60" cy="60" r="52" stroke="url(#hg1)" strokeWidth="1.5" fill="none" opacity="0.6" filter="url(#glow)"/>
      <circle cx="60" cy="60" r="46" stroke={GOLD} strokeWidth="0.5" fill="none" opacity="0.2"/>
      {/* Left wing - gold */}
      <path d="M60 78 Q32 68 22 46 Q34 56 60 60" fill="url(#hg1)" opacity="0.95" filter="url(#glow)"/>
      <path d="M60 76 Q28 72 14 58 Q30 62 60 66" fill="url(#hg2)" opacity="0.6"/>
      <path d="M60 74 Q24 76 10 68 Q28 68 60 70" fill={PURPLE} opacity="0.4"/>
      {/* Right wing - gold */}
      <path d="M60 78 Q88 68 98 46 Q86 56 60 60" fill="url(#hg1)" opacity="0.95" filter="url(#glow)"/>
      <path d="M60 76 Q92 72 106 58 Q90 62 60 66" fill="url(#hg2)" opacity="0.6"/>
      <path d="M60 74 Q96 76 110 68 Q92 68 60 70" fill={PURPLE} opacity="0.4"/>
      {/* Body */}
      <path d="M60 30 Q68 46 66 64 Q60 72 54 64 Q52 46 60 30" fill="url(#hg1)" filter="url(#glow)"/>
      {/* Head */}
      <circle cx="60" cy="32" r="7" fill="#F5CF41" filter="url(#glow)"/>
      {/* Beak */}
      <path d="M60 35 L64 38 L60 37" fill="#D4AF37"/>
      {/* Eye */}
      <circle cx="58" cy="30" r="1.5" fill="#0d0a1a"/>
      {/* Tail feathers */}
      <path d="M60 78 Q54 88 50 96 Q56 84 60 80" fill={GOLD} opacity="0.7"/>
      <path d="M60 78 Q60 90 60 98 Q60 86 60 80" fill={GOLD_L} opacity="0.8"/>
      <path d="M60 78 Q66 88 70 96 Q64 84 60 80" fill={GOLD} opacity="0.7"/>
      {/* Sparkles */}
      <circle cx="30" cy="40" r="1.5" fill={GOLD} opacity="0.8"/>
      <circle cx="90" cy="40" r="1.5" fill={GOLD} opacity="0.8"/>
      <circle cx="20" cy="58" r="1" fill={CYAN} opacity="0.6"/>
      <circle cx="100" cy="58" r="1" fill={CYAN} opacity="0.6"/>
      <circle cx="40" cy="28" r="1" fill={GOLD_L} opacity="0.7"/>
      <circle cx="80" cy="28" r="1" fill={GOLD_L} opacity="0.7"/>
    </svg>
  );
}

const services = [
  { icon: Globe, title: 'Site vitrine', desc: 'Présence professionnelle, SEO, formulaire, responsive.', color: GOLD },
  { icon: Layers, title: 'Vitrine de vente', desc: 'Catalogue, offres, tunnel de conversion simple.', color: PURPLE },
  { icon: BarChart3, title: 'Dashboard admin', desc: 'Espace mobile pour gérer contenus et clients.', color: CYAN },
  { icon: Headphones, title: 'Support client', desc: 'Tickets, messages, suivi demandes intégré.', color: GOLD },
  { icon: Bot, title: 'Automatisation IA', desc: 'Emails, posts, workflows automatisés par IA.', color: PURPLE },
  { icon: Search, title: 'SEO automatique', desc: 'Référencement local, Google Business, contenu IA.', color: CYAN },
  { icon: Share2, title: 'Réseaux sociaux', desc: 'Posts programmés, visuels générés, validation client.', color: GOLD },
  { icon: Shield, title: 'Marque blanche', desc: 'Solutions revendables sous votre propre marque.', color: PURPLE },
];

const advantages = [
  { title: 'Livraison rapide', desc: 'Premiers résultats en 48h à 7 jours.', color: GOLD },
  { title: 'Mobile-first', desc: 'Parfait sur téléphone, tablette et desktop.', color: PURPLE },
  { title: 'IA intégrée', desc: 'Automatisations et contenu généré par intelligence artificielle.', color: CYAN },
  { title: 'Support humain', desc: 'Intervention manuelle possible, suivi personnalisé.', color: GOLD },
];

export default function WebOSHome() {
  const [activeStat, setActiveStat] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveStat(p => (p + 1) % 4), 2000);
    return () => clearInterval(t);
  }, []);

  const stats = [
    { val: '48h', label: 'Délai de livraison', color: GOLD },
    { val: '100%', label: 'Mobile-first', color: PURPLE },
    { val: '24/7', label: 'Disponibilité IA', color: CYAN },
    { val: '0€', label: 'Démo gratuite', color: GOLD },
  ];

  return (
    <div className="min-h-screen" style={{ color: 'white' }}>

      {/* ══ HERO ══ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-5 pt-16 pb-16">
        <ParticleField />

        {/* Ambient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[150px]"
            style={{ background: `radial-gradient(circle, ${GOLD}30, transparent 70%)` }} />
          <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.18, 0.1] }}
            transition={{ duration: 10, repeat: Infinity, delay: 3 }}
            className="absolute top-2/3 left-1/4 w-72 h-72 rounded-full blur-[120px]"
            style={{ background: `radial-gradient(circle, ${PURPLE}40, transparent 70%)` }} />
          <motion.div animate={{ scale: [1, 1.12, 1], opacity: [0.08, 0.15, 0.08] }}
            transition={{ duration: 12, repeat: Infinity, delay: 6 }}
            className="absolute top-1/2 right-1/4 w-72 h-72 rounded-full blur-[120px]"
            style={{ background: `radial-gradient(circle, ${CYAN}30, transparent 70%)` }} />
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto">

          {/* Phoenix hero icon */}
          <motion.div initial={{ opacity: 0, scale: 0.5, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center mb-6">
            <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ filter: 'drop-shadow(0 0 30px rgba(212,175,55,0.5)) drop-shadow(0 0 60px rgba(139,92,246,0.2))' }}>
              <PhoenixHero />
            </motion.div>
          </motion.div>

          {/* Badge */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6 text-xs font-bold tracking-widest uppercase"
            style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid rgba(212,175,55,0.3)`, color: GOLD, boxShadow: `0 0 30px rgba(212,175,55,0.1)` }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Js-Innov.IA — Plateforme Premium 2025
          </motion.div>

          {/* Title */}
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-6xl font-black mb-5 leading-tight">
            <span className="block text-white">Sites web & automatisations</span>
            <span className="block mt-1" style={{
              background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_L} 30%, ${PURPLE} 65%, ${CYAN} 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              filter: 'drop-shadow(0 0 30px rgba(212,175,55,0.3))'
            }}>prêts à vendre</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
            className="text-lg md:text-xl mb-10 leading-relaxed max-w-2xl mx-auto"
            style={{ color: 'rgba(255,255,255,0.5)' }}>
            Julien Pagin crée des solutions digitales premium : site vitrine, boutique en ligne, dashboard admin, automatisation IA et marque blanche.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
            <Link to="/webos-contact">
              <motion.button whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(212,175,55,0.5)' }} whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-black text-base transition-all"
                style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, boxShadow: `0 0 35px rgba(212,175,55,0.35)` }}>
                <Zap className="w-5 h-5" /> Demander une démo
              </motion.button>
            </Link>
            <Link to="/webos-portfolio">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base border transition-all"
                style={{ borderColor: `rgba(212,175,55,0.35)`, color: GOLD, background: 'rgba(212,175,55,0.06)' }}>
                Voir le portfolio <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Animated stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
            className="flex flex-wrap justify-center gap-6">
            {stats.map((s, i) => (
              <motion.div key={s.label}
                animate={{ opacity: i === activeStat ? 1 : 0.4, scale: i === activeStat ? 1.08 : 1 }}
                transition={{ duration: 0.4 }}
                className="text-center">
                <div className="text-2xl font-black" style={{ color: s.color }}>{s.val}</div>
                <div className="text-xs mt-0.5 tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact info */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            className="flex flex-wrap justify-center gap-5 mt-8">
            <a href="tel:+32494119090" className="flex items-center gap-2 text-xs transition-colors"
              style={{ color: 'rgba(212,175,55,0.5)' }}
              onMouseEnter={e => e.currentTarget.style.color = GOLD}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(212,175,55,0.5)'}>
              <Phone className="w-3.5 h-3.5" /> 0494/11.90.90
            </a>
            <a href="https://www.jsinnovia.com" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs transition-colors"
              style={{ color: 'rgba(212,175,55,0.5)' }}
              onMouseEnter={e => e.currentTarget.style.color = GOLD}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(212,175,55,0.5)'}>
              <ExternalLink className="w-3.5 h-3.5" /> www.jsinnovia.com
            </a>
          </motion.div>
        </div>
      </section>

      {/* ══ SERVICES ══ */}
      <section className="py-20 px-5">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-bold tracking-widest uppercase"
                style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid rgba(212,175,55,0.2)`, color: GOLD }}>
                <Sparkles className="w-3 h-3" /> Nos services
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white">Tout ce dont vous avez besoin</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.06}>
                <motion.div whileHover={{ y: -8, scale: 1.03 }} transition={{ duration: 0.2 }}
                  className="group p-5 rounded-2xl h-full relative overflow-hidden cursor-default"
                  style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${s.color}18` }}>
                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                    style={{ background: `radial-gradient(circle at 50% -10%, ${s.color}10, transparent 65%)` }} />
                  <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: `linear-gradient(90deg, transparent, ${s.color}60, transparent)` }} />
                  <div className="relative z-10">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: `${s.color}12`, border: `1px solid ${s.color}28` }}>
                      <s.icon className="w-5 h-5" style={{ color: s.color }} />
                    </div>
                    <h3 className="font-bold text-white text-sm mb-1">{s.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)' }}>{s.desc}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ AVANTAGES ══ */}
      <section className="py-16 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl p-8 md:p-12 relative overflow-hidden"
            style={{ background: 'rgba(10,8,22,0.8)', border: `1px solid rgba(212,175,55,0.18)` }}>
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, ${PURPLE}, transparent)` }} />
            <div className="absolute bottom-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${CYAN}, ${GOLD}, transparent)` }} />
            {/* Bg orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[100px] pointer-events-none"
              style={{ background: `radial-gradient(circle, ${PURPLE}15, transparent)` }} />
            <Reveal>
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-black text-white mb-2">Pourquoi choisir Js-Innov.IA ?</h2>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>Julien Pagin · Dour, Belgique</p>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative z-10">
              {advantages.map((a, i) => (
                <Reveal key={a.title} delay={i * 0.08}>
                  <div className="flex items-start gap-4 p-4 rounded-2xl transition-all"
                    style={{ background: `${a.color}06`, border: `1px solid ${a.color}15` }}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${a.color}15`, border: `1px solid ${a.color}25` }}>
                      <CheckCircle className="w-4 h-4" style={{ color: a.color }} />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm mb-1">{a.title}</div>
                      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{a.desc}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ AUTOMATISATION IA ══ */}
      <section className="py-16 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <Reveal>
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-bold tracking-widest uppercase"
                  style={{ background: `rgba(139,92,246,0.08)`, border: `1px solid rgba(139,92,246,0.22)`, color: PURPLE }}>
                  <Bot className="w-3 h-3" /> Automatisation IA
                </div>
                <h2 className="text-3xl font-black text-white mb-5">Votre business en <span style={{ color: GOLD }}>pilote automatique</span></h2>
                <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.48)' }}>
                  Emails automatisés avec délai humain, posts réseaux sociaux programmés, leads scorés automatiquement. Js-Innov.IA gère pendant que vous travaillez.
                </p>
                <ul className="space-y-3">
                  {['Emails personnalisés à délai humain', 'Scoring automatique des leads', 'Posts validés par vos clients', 'Workflows IA configurables'].map((item, i) => (
                    <li key={item} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: [GOLD, PURPLE, CYAN, GOLD][i] + '20' }}>
                        <ChevronRight className="w-3 h-3" style={{ color: [GOLD, PURPLE, CYAN, GOLD][i] }} />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="rounded-2xl p-6 space-y-3 relative overflow-hidden"
                style={{ background: 'rgba(10,8,22,0.9)', border: `1px solid rgba(212,175,55,0.18)` }}>
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
                <div className="text-xs font-bold mb-4 flex items-center gap-2" style={{ color: 'rgba(212,175,55,0.6)' }}>
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Séquence email active
                </div>
                {[
                  { t: 'J0 +45min', label: 'Email analyse humaine', color: GOLD },
                  { t: 'J1', label: 'Première recommandation', color: PURPLE },
                  { t: 'J3', label: 'Structure personnalisée', color: CYAN },
                  { t: 'J7', label: 'Dernier suivi projet', color: '#22c55e' },
                ].map((item, i) => (
                  <motion.div key={item.t}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: `${item.color}08`, border: `1px solid ${item.color}20` }}>
                    <span className="text-xs font-black w-14 flex-shrink-0" style={{ color: item.color }}>{item.t}</span>
                    <span className="text-xs flex-1" style={{ color: 'rgba(255,255,255,0.55)' }}>{item.label}</span>
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                  </motion.div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ SEO & MARQUE BLANCHE ══ */}
      <section className="py-16 px-5">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          {[
            { icon: Search, color: GOLD, title: 'SEO automatique', desc: 'Référencement local, Google Business Profile optimisé, contenu généré par IA chaque semaine. Vos clients vous trouvent, vous les convertissez.' },
            { icon: Shield, color: PURPLE, title: 'Marque blanche', desc: 'Solutions revendables sous votre propre marque. Dashboard, site vitrine, automatisations — tout livré sans mention Js-Innov.IA.' },
          ].map((card, i) => (
            <Reveal key={card.title} delay={i * 0.1}>
              <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.2 }}
                className="group p-7 rounded-2xl h-full relative overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${card.color}18` }}>
                <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(90deg, transparent, ${card.color}60, transparent)` }} />
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: `${card.color}12`, border: `1px solid ${card.color}25` }}>
                  <card.icon className="w-6 h-6" style={{ color: card.color }} />
                </div>
                <h3 className="text-xl font-black text-white mb-3">{card.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{card.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ CTA FINAL ══ */}
      <section className="py-20 px-5">
        <div className="max-w-2xl mx-auto text-center">
          <Reveal>
            <div className="p-10 md:p-14 rounded-3xl relative overflow-hidden"
              style={{ background: 'rgba(10,8,22,0.98)', border: `1px solid rgba(212,175,55,0.28)`, boxShadow: '0 0 80px rgba(212,175,55,0.07)' }}>
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-24 h-24"
                style={{ background: `radial-gradient(circle, ${GOLD}20, transparent 70%)` }} />
              <div className="absolute bottom-0 right-0 w-24 h-24"
                style={{ background: `radial-gradient(circle, ${PURPLE}20, transparent 70%)` }} />
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, ${PURPLE}, transparent)` }} />
              <div className="absolute bottom-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${CYAN}, ${GOLD}, transparent)` }} />

              <div className="relative z-10">
                {/* Phoenix mini */}
                <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity }}
                  className="flex justify-center mb-5">
                  <div style={{ filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.4))' }}>
                    <svg width="60" height="60" viewBox="0 0 80 80" fill="none">
                      <circle cx="40" cy="40" r="35" stroke={GOLD} strokeWidth="1.5" fill="none" opacity="0.5"/>
                      <path d="M40 55 Q24 46 18 34 Q28 42 40 44" fill={GOLD} opacity="0.9"/>
                      <path d="M40 55 Q56 46 62 34 Q52 42 40 44" fill={GOLD} opacity="0.9"/>
                      <path d="M40 55 Q28 58 20 52 Q30 52 40 50" fill={PURPLE} opacity="0.6"/>
                      <path d="M40 55 Q52 58 60 52 Q50 52 40 50" fill={PURPLE} opacity="0.6"/>
                      <path d="M40 22 Q46 33 44 47 Q40 52 36 47 Q34 33 40 22" fill={GOLD}/>
                      <circle cx="40" cy="24" r="5" fill={GOLD_L}/>
                    </svg>
                  </div>
                </motion.div>

                <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Prêt à lancer votre projet ?</h2>
                <p className="text-base mb-3 font-light" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Décrivez votre projet en quelques lignes.<br />
                  <span style={{ color: GOLD }}>Julien Pagin</span> vous répond personnellement.
                </p>
                <div className="flex items-center justify-center gap-4 mb-8 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  <span>0494/11.90.90</span>
                  <span className="w-1 h-1 rounded-full bg-current" />
                  <span>www.jsinnovia.com</span>
                </div>
                <Link to="/webos-contact">
                  <motion.button whileHover={{ scale: 1.06, boxShadow: '0 0 60px rgba(212,175,55,0.5)' }} whileTap={{ scale: 0.97 }}
                    className="px-10 py-4 rounded-2xl font-black text-black text-base transition-all"
                    style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, boxShadow: `0 0 35px rgba(212,175,55,0.3)` }}>
                    Demander une démo gratuite →
                  </motion.button>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}