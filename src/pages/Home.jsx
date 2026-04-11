import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  ArrowRight, Sparkles, BarChart3, FileText, Music, Bot, Check,
  Globe, Zap, TrendingUp, Shield, Star, Play, Award, Users, Clock,
  Home as HomeIcon, Car, Heart, Lock, Eye, MessageSquare, ChevronRight,
  Cpu, Database, Network, Layers, BarChart2, Settings, CheckCircle
} from 'lucide-react';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const PURPLE = '#8B5CF6';
const CYAN = '#06B6D4';
const BLUE = '#3B82F6';

// ── Animated particle network background ─────────────────────────────────────
function NeuralBackground() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const nodes = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.8 + 0.5,
      color: [GOLD, PURPLE, CYAN, BLUE][Math.floor(Math.random() * 4)],
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nodes.forEach((n, i) => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
        nodes.slice(i + 1).forEach(m => {
          const d = Math.hypot(n.x - m.x, n.y - m.y);
          if (d < 130) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(212,175,55,${0.06 * (1 - d / 130)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
          }
        });
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.color + '55';
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ opacity: 0.5 }} />;
}

// ── Scroll reveal wrapper ─────────────────────────────────────────────────────
function Reveal({ children, delay = 0, y = 30 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

// ── Section label ──────────────────────────────────────────────────────────────
function SectionLabel({ icon: Icon, text }) {
  return (
    <motion.div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-bold tracking-widest uppercase"
      style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: GOLD }}>
      {Icon && <Icon className="w-3 h-3" />} {text}
    </motion.div>
  );
}

// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ to, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const inc = to / 60;
    const t = setInterval(() => {
      start += inc;
      if (start >= to) { setCount(to); clearInterval(t); } else setCount(Math.floor(start));
    }, 20);
    return () => clearInterval(t);
  }, [inView, to]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// ── Live dashboard mockup ─────────────────────────────────────────────────────
function DashboardMockup() {
  const [active, setActive] = useState(0);
  const bars = [65, 80, 55, 90, 72, 88, 60, 95, 78, 85];
  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % bars.length), 800);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="relative rounded-2xl overflow-hidden p-5"
      style={{ background: 'rgba(8,8,20,0.95)', border: '1px solid rgba(212,175,55,0.2)', boxShadow: '0 0 60px rgba(212,175,55,0.08)' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-semibold" style={{ color: 'rgba(212,175,55,0.8)' }}>Système IA actif</span>
        </div>
        <div className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Live</div>
      </div>
      {/* Score cards */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {[
          { label: 'SEO Score', val: 94, color: GOLD },
          { label: 'Leads', val: 127, color: CYAN },
          { label: 'Automation', val: '98%', color: PURPLE },
        ].map(s => (
          <div key={s.label} className="p-3 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-lg font-black" style={{ color: s.color }}>{s.val}</div>
            <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.label}</div>
          </div>
        ))}
      </div>
      {/* Bar chart */}
      <div className="flex items-end gap-1 h-20">
        {bars.map((b, i) => (
          <motion.div key={i} className="flex-1 rounded-sm"
            animate={{ height: `${b}%`, opacity: i === active ? 1 : 0.35 }}
            transition={{ duration: 0.4 }}
            style={{ background: i === active ? `linear-gradient(to top, ${GOLD}, ${GOLD_L})` : 'rgba(212,175,55,0.2)', minHeight: 4 }} />
        ))}
      </div>
      {/* Activity feed */}
      <div className="mt-4 space-y-1.5">
        {[
          { text: 'Article SEO généré automatiquement', t: '2s' },
          { text: 'Nouveau lead capturé — Paris 15e', t: '5s' },
          { text: 'Rapport mensuel envoyé au client', t: '12s' },
        ].map((a, i) => (
          <motion.div key={a.text} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 }}
            className="flex items-center justify-between text-xs px-2 py-1.5 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: GOLD }} />
              <span style={{ color: 'rgba(255,255,255,0.55)' }}>{a.text}</span>
            </div>
            <span style={{ color: 'rgba(212,175,55,0.4)' }}>il y a {a.t}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Home() {
  const [url, setUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [score, setScore] = useState(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, -100]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.4]);

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setAnalyzing(true);
    await new Promise(r => setTimeout(r, 2500));
    setScore(Math.floor(Math.random() * 28) + 44);
    setAnalyzing(false);
  };

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#060610' }}>

      {/* ══════════════════════════════════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <NeuralBackground />

        {/* Ambient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.22, 0.15] }} transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 -left-32 w-[700px] h-[700px] rounded-full blur-[150px]"
            style={{ background: `radial-gradient(circle, ${PURPLE}30, transparent 70%)` }} />
          <motion.div animate={{ scale: [1, 1.08, 1], opacity: [0.12, 0.18, 0.12] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }}
            className="absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full blur-[130px]"
            style={{ background: `radial-gradient(circle, ${GOLD}25, transparent 70%)` }} />
          <motion.div animate={{ scale: [1, 1.12, 1], opacity: [0.1, 0.15, 0.1] }} transition={{ duration: 12, repeat: Infinity, delay: 4 }}
            className="absolute -bottom-32 left-1/2 w-[500px] h-[500px] rounded-full blur-[120px]"
            style={{ background: `radial-gradient(circle, ${CYAN}25, transparent 70%)` }} />
        </div>

        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, ${PURPLE}, ${CYAN}, transparent)` }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 text-center max-w-5xl mx-auto px-6">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-10 border"
            style={{ background: 'rgba(212,175,55,0.07)', borderColor: 'rgba(212,175,55,0.3)', boxShadow: `0 0 40px rgba(212,175,55,0.12)` }}>
            <motion.div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: GOLD }}>Plateforme IA Premium — 2025</span>
            </motion.div>
          </motion.div>

          {/* Main title */}
          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[1.05] tracking-tight">
            <span className="block text-white">L'intelligence artificielle</span>
            <span className="block" style={{
              background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_L} 30%, ${PURPLE} 65%, ${CYAN} 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              filter: 'drop-shadow(0 0 40px rgba(212,175,55,0.3))'
            }}>au service de votre activité</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.7 }}
            className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed font-light"
            style={{ color: 'rgba(255,255,255,0.55)' }}>
            Automatisation, assurance et suivi intelligent réunis en une seule plateforme.{' '}
            <span style={{ color: 'rgba(212,175,55,0.8)' }}>Conçu pour les entreprises locales.</span>
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4 mb-20">
            <Link to={createPageUrl('Pricing')}>
              <motion.button whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(212,175,55,0.5)' }} whileTap={{ scale: 0.97 }}
                className="group flex items-center gap-3 px-8 py-4 rounded-xl text-base font-black text-black transition-all"
                style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, boxShadow: `0 0 35px rgba(212,175,55,0.35)` }}>
                <Sparkles className="w-5 h-5" />
                Découvrir la plateforme
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <Link to={createPageUrl('Contact')}>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 px-8 py-4 rounded-xl text-base font-semibold border transition-all"
                style={{ borderColor: 'rgba(212,175,55,0.35)', color: GOLD, background: 'rgba(212,175,55,0.05)' }}>
                <Play className="w-4 h-4" fill={GOLD} />
                Demander une démo
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { val: 500, suffix: '+', label: 'Entreprises actives' },
              { val: 98, suffix: '%', label: 'Satisfaction client' },
              { val: 24, suffix: '/7', label: 'Agents IA actifs' },
              { val: 10000, suffix: '+', label: 'Contenus générés' },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 + i * 0.1 }}
                className="text-center">
                <div className="text-3xl md:text-4xl font-black" style={{ color: GOLD }}>
                  <Counter to={s.val} suffix={s.suffix} />
                </div>
                <div className="text-xs mt-1 tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <div className="w-6 h-10 rounded-full border flex items-start justify-center pt-2" style={{ borderColor: 'rgba(212,175,55,0.3)' }}>
            <div className="w-1.5 h-3 rounded-full" style={{ background: GOLD }} />
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          2. VALEUR — 4 blocs
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.06) 0%, transparent 60%)' }} />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Reveal><SectionLabel icon={Zap} text="Ce que nous faisons" /></Reveal>
            <Reveal delay={0.1}><h2 className="text-4xl md:text-5xl font-black text-white mb-4">Une plateforme, 4 super-pouvoirs</h2></Reveal>
            <Reveal delay={0.2}><p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Tout ce dont votre entreprise locale a besoin pour croître sans effort supplémentaire
            </p></Reveal>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Bot, color: GOLD, title: 'Automatisation intelligente', desc: 'Vos tâches répétitives s\'exécutent seules. Votre temps se consacre à ce qui compte vraiment.' },
              { icon: Database, color: PURPLE, title: 'Gestion centralisée', desc: 'Tous vos clients, projets et données en un seul endroit. Clair, simple, accessible partout.' },
              { icon: Users, color: CYAN, title: 'Suivi client optimisé', desc: 'Relances automatiques, historique complet et alertes intelligentes pour ne jamais rater une opportunité.' },
              { icon: Globe, color: BLUE, title: 'Visibilité digitale locale', desc: 'Présence SEO, contenu généré par IA, réseaux sociaux — tout automatisé pour votre zone géographique.' },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 0.1}>
                <motion.div whileHover={{ y: -8, scale: 1.02 }} transition={{ duration: 0.25 }}
                  className="group relative p-7 rounded-2xl h-full overflow-hidden cursor-default"
                  style={{ background: 'rgba(10,10,25,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(circle at 50% -10%, ${f.color}10 0%, transparent 65%)` }} />
                  <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: `linear-gradient(90deg, transparent, ${f.color}80, transparent)` }} />
                  <motion.div whileHover={{ rotate: 10, scale: 1.15 }} transition={{ duration: 0.3 }}
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}>
                    <f.icon className="w-7 h-7" style={{ color: f.color }} />
                  </motion.div>
                  <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.42)' }}>{f.desc}</p>
                  <div className="mt-5 flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: f.color }}>
                    En savoir plus <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          3. FEATURES / PRODUIT (glassmorphism)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[200px]"
            style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)' }} />
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Reveal><SectionLabel icon={Layers} text="Fonctionnalités" /></Reveal>
            <Reveal delay={0.1}><h2 className="text-4xl md:text-5xl font-black text-white mb-4">Tout ce qu'il vous faut, intégré</h2></Reveal>
            <Reveal delay={0.2}><p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Des outils conçus pour les entreprises locales qui veulent jouer dans la cour des grandes
            </p></Reveal>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: FileText, color: GOLD,
                title: 'Création de contenu automatisée',
                desc: 'Articles SEO, posts réseaux sociaux, newsletters — générés par IA et publiés automatiquement selon votre calendrier éditorial.',
                tags: ['Blog IA', 'SEO local', 'Réseaux sociaux'],
                link: 'ContentStudio'
              },
              {
                icon: BarChart2, color: PURPLE,
                title: 'Planification intelligente',
                desc: 'Votre agenda, vos rappels, vos réunions clients. L\'IA planifie, réorganise et optimise votre temps sans intervention manuelle.',
                tags: ['Agenda IA', 'Rappels auto', 'CRM intégré'],
                link: 'Automations'
              },
              {
                icon: Network, color: CYAN,
                title: 'CRM local nouvelle génération',
                desc: 'Gérez vos prospects, suivez vos clients, automatisez vos relances. Un CRM pensé pour les commerces de proximité.',
                tags: ['Prospects', 'Relances', 'Statistiques'],
                link: 'CRM'
              },
              {
                icon: Shield, color: BLUE,
                title: 'Intégration assurance intelligente',
                desc: 'Proposez, gérez et suivez les contrats d\'assurance de vos clients directement depuis la plateforme. Simple, transparent, sécurisé.',
                tags: ['Multirisque', 'Auto', 'Habitation'],
                link: 'Applications'
              },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 0.1}>
                <Link to={createPageUrl(f.link)}>
                  <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}
                    className="group relative p-8 rounded-3xl overflow-hidden h-full"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      boxShadow: '0 0 0 1px rgba(255,255,255,0.03) inset'
                    }}>
                    {/* Glassmorphism shine */}
                    <div className="absolute top-0 left-0 w-full h-px opacity-0 group-hover:opacity-100 transition-all duration-500"
                      style={{ background: `linear-gradient(90deg, transparent, ${f.color}60, transparent)` }} />
                    <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `${f.color}15` }} />
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-6">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                          style={{ background: `${f.color}12`, border: `1px solid ${f.color}25` }}>
                          <f.icon className="w-7 h-7" style={{ color: f.color }} />
                        </div>
                        <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all translate-x-0 group-hover:translate-x-1 duration-300" style={{ color: f.color }} />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                      <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.45)' }}>{f.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {f.tags.map(t => (
                          <span key={t} className="px-3 py-1 rounded-full text-xs font-semibold"
                            style={{ background: `${f.color}10`, color: `${f.color}`, border: `1px solid ${f.color}20` }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          4. SECTION ASSURANCE
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(59,130,246,0.06) 0%, transparent 65%)' }} />
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Reveal><SectionLabel icon={Shield} text="Assurance intelligente" /></Reveal>
              <Reveal delay={0.1}><h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Protégez vos clients,<br />
                <span style={{ color: BLUE }}>simplement.</span>
              </h2></Reveal>
              <Reveal delay={0.2}><p className="text-lg mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Un accompagnement personnalisé pour proposer et gérer les assurances de vos clients. Transparent, sécurisé, sans jargon.
              </p></Reveal>
              <div className="space-y-4">
                {[
                  { icon: Users, title: 'Accompagnement personnalisé', desc: 'Chaque client bénéficie d\'un suivi adapté à sa situation réelle.' },
                  { icon: Lock, title: 'Sécurité & conformité', desc: 'Données protégées, contrats conformes, processus validés.' },
                  { icon: Eye, title: 'Transparence totale', desc: 'Tarifs clairs, conditions lisibles, aucune surprise à la souscription.' },
                ].map((item, i) => (
                  <Reveal key={item.title} delay={0.3 + i * 0.1}>
                    <div className="flex items-start gap-4 p-4 rounded-xl transition-all"
                      style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.1)' }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.25)' }}>
                        <item.icon className="w-5 h-5" style={{ color: BLUE }} />
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{item.title}</div>
                        <div className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.desc}</div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
            <Reveal delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: HomeIcon, title: 'Habitation', desc: 'Multirisque habitation adaptée à chaque profil', color: GOLD },
                  { icon: Car, title: 'Automobile', desc: 'RC, tous risques, protection conducteur', color: PURPLE },
                  { icon: Heart, title: 'Santé & famille', desc: 'Mutuelle, prévoyance, garanties solides', color: CYAN },
                  { icon: Shield, title: 'Professionnelle', desc: 'RC Pro, multirisque commerce, cyber', color: BLUE },
                ].map((card, i) => (
                  <motion.div key={card.title} whileHover={{ scale: 1.04, y: -4 }} transition={{ duration: 0.2 }}
                    className="p-5 rounded-2xl"
                    style={{ background: 'rgba(10,10,25,0.8)', border: `1px solid ${card.color}20` }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: `${card.color}12`, border: `1px solid ${card.color}25` }}>
                      <card.icon className="w-6 h-6" style={{ color: card.color }} />
                    </div>
                    <h4 className="font-bold text-white text-sm mb-1">{card.title}</h4>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.38)' }}>{card.desc}</p>
                  </motion.div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          5. DEMO / INTERFACE
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.05) 0%, transparent 60%)' }} />
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div className="relative">
                <DashboardMockup />
                {/* Floating badges */}
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-6 -right-6 px-4 py-2 rounded-xl text-sm font-bold hidden md:flex items-center gap-2"
                  style={{ background: 'rgba(6,182,212,0.15)', border: `1px solid ${CYAN}30`, color: CYAN, backdropFilter: 'blur(12px)' }}>
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  Système en ligne
                </motion.div>
                <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  className="absolute -bottom-6 -left-6 px-4 py-2 rounded-xl text-sm font-bold hidden md:flex items-center gap-2"
                  style={{ background: 'rgba(212,175,55,0.12)', border: `1px solid ${GOLD}30`, color: GOLD, backdropFilter: 'blur(12px)' }}>
                  <Zap className="w-4 h-4" />
                  +127 leads ce mois
                </motion.div>
              </div>
            </Reveal>
            <div>
              <Reveal><SectionLabel icon={Cpu} text="Interface en temps réel" /></Reveal>
              <Reveal delay={0.1}><h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Votre business,<br />
                <span style={{ color: GOLD }}>en pilote automatique.</span>
              </h2></Reveal>
              <Reveal delay={0.2}><p className="text-lg mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Tableau de bord IA centralisé, alertes en temps réel, automatisations actives 24h/24. Vous pilotez, l'IA exécute.
              </p></Reveal>
              <div className="space-y-3">
                {[
                  'Rapports générés automatiquement chaque semaine',
                  'Leads qualifiés détectés et notifiés instantanément',
                  'Contenu publié selon votre calendrier éditorial IA',
                  'Suivi client et relances sans intervention manuelle',
                ].map((item, i) => (
                  <Reveal key={item} delay={0.3 + i * 0.08}>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: GOLD }} />
                      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{item}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
              <Reveal delay={0.6}>
                <div className="mt-10">
                  <Link to={createPageUrl('SEOAudit')}>
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-black"
                      style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, boxShadow: `0 0 30px rgba(212,175,55,0.3)` }}>
                      <Sparkles className="w-4 h-4" />
                      Essayer gratuitement
                    </motion.button>
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          6. PREUVES SOCIALES
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.06) 0%, transparent 60%)' }} />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Reveal><SectionLabel icon={Star} text="Ils nous font confiance" /></Reveal>
            <Reveal delay={0.1}><h2 className="text-4xl md:text-5xl font-black text-white mb-4">Des résultats concrets</h2></Reveal>
            <Reveal delay={0.2}><p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Ce que nos clients observent après 3 mois d'utilisation
            </p></Reveal>
          </div>

          {/* Key results */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-16">
            {[
              { val: 40, suffix: '%', label: 'de temps gagné sur les tâches répétitives', color: GOLD },
              { val: 3, suffix: 'x', label: 'plus de leads qualifiés capturés', color: PURPLE },
              { val: 60, suffix: '%', label: 'd\'augmentation de visibilité locale', color: CYAN },
              { val: 2, suffix: 'h', label: 'récupérées par jour en moyenne', color: BLUE },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 0.1}>
                <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(10,10,25,0.8)', border: `1px solid ${s.color}20` }}>
                  <div className="text-4xl font-black mb-2" style={{ color: s.color }}>
                    <Counter to={s.val} suffix={s.suffix} />
                  </div>
                  <div className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Marie L.', role: 'Responsable boutique — Paris', text: 'La plateforme a transformé notre façon de travailler. Les contenus sont générés automatiquement et notre visibilité a explosé.', rating: 5 },
              { name: 'Thomas R.', role: 'Gérant restaurant — Lyon', text: 'Plus de temps à perdre sur les réseaux sociaux. L\'IA gère tout et nos réservations ont augmenté de 35%.', rating: 5 },
              { name: 'Sophie M.', role: 'Courtière en assurance — Bordeaux', text: 'L\'intégration assurance est bluffante. Mes clients sont mieux accompagnés et je gagne du temps sur chaque dossier.', rating: 5 },
            ].map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}
                  className="p-7 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex gap-1 mb-4">
                    {Array(t.rating).fill(0).map((_, i) => <Star key={i} className="w-4 h-4 fill-current" style={{ color: GOLD }} />)}
                  </div>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.6)' }}>"{t.text}"</p>
                  <div>
                    <div className="font-bold text-white text-sm">{t.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'rgba(212,175,55,0.5)' }}>{t.role}</div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>

          {/* Partner logos */}
          <Reveal delay={0.3}>
            <div className="mt-16 text-center">
              <div className="text-xs tracking-widest uppercase mb-6" style={{ color: 'rgba(255,255,255,0.2)' }}>Intégrations & partenaires</div>
              <div className="flex flex-wrap justify-center gap-8 items-center">
                {['OpenAI', 'Google', 'Meta', 'Stripe', 'HubSpot', 'Notion'].map(p => (
                  <div key={p} className="px-5 py-2.5 rounded-lg text-sm font-bold"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)' }}>
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          7. SEO ANALYZER TOOL
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="relative p-10 rounded-3xl overflow-hidden"
              style={{ background: 'rgba(10,8,20,0.95)', border: '1px solid rgba(212,175,55,0.22)', boxShadow: '0 0 80px rgba(212,175,55,0.07), inset 0 0 40px rgba(212,175,55,0.02)' }}>
              <div className="absolute top-0 left-0 w-24 h-24" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.2), transparent)' }} />
              <div className="absolute bottom-0 right-0 w-24 h-24" style={{ background: 'linear-gradient(315deg, rgba(139,92,246,0.2), transparent)' }} />
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-bold"
                  style={{ background: 'rgba(6,182,212,0.1)', border: `1px solid ${CYAN}30`, color: CYAN }}>
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  Analyse IA gratuite — Sans inscription
                </div>
                <h2 className="text-3xl font-black text-white mb-2">Analysez votre site maintenant</h2>
                <p className="text-sm mb-8" style={{ color: 'rgba(212,175,55,0.55)' }}>Score SEO complet en 30 secondes</p>
                <AnimatePresence mode="wait">
                  {!score ? (
                    <motion.div key="input" exit={{ opacity: 0 }} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                      <div className="relative flex-1">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'rgba(212,175,55,0.4)' }} />
                        <input value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
                          placeholder="https://votre-site.com"
                          className="w-full pl-10 pr-4 py-3.5 rounded-xl text-sm outline-none"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.2)', color: 'white' }} />
                      </div>
                      <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                        onClick={handleAnalyze} disabled={analyzing || !url.trim()}
                        className="px-6 py-3.5 rounded-xl font-black text-black text-sm whitespace-nowrap disabled:opacity-40"
                        style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, boxShadow: `0 0 25px rgba(212,175,55,0.3)` }}>
                        {analyzing ? (
                          <span className="flex items-center gap-2">
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><Zap className="w-4 h-4" /></motion.div>
                            Analyse…
                          </span>
                        ) : 'Analyser →'}
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5">
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                        <div className="relative">
                          <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
                            <motion.circle cx="50" cy="50" r="42" stroke={score >= 80 ? '#22c55e' : score >= 60 ? GOLD : '#ef4444'}
                              strokeWidth="8" fill="none" strokeLinecap="round"
                              initial={{ strokeDasharray: '0 264' }}
                              animate={{ strokeDasharray: `${2.64 * score} 264` }}
                              transition={{ duration: 1.5, ease: 'easeOut' }} />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black" style={{ color: score >= 80 ? '#22c55e' : score >= 60 ? GOLD : '#ef4444' }}>{score}</span>
                            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>/100</span>
                          </div>
                        </div>
                        <div className="text-left space-y-2">
                          {['Mots-clés cibles manquants', 'Balises meta incomplètes', 'Vitesse à optimiser', 'Maillage interne insuffisant'].map(issue => (
                            <div key={issue} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-red-400" />{issue}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3 justify-center">
                        <Link to={createPageUrl('Pricing')}>
                          <button className="px-5 py-2.5 rounded-xl text-sm font-black text-black" style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>Voir les plans →</button>
                        </Link>
                        <button onClick={() => { setScore(null); setUrl(''); }}
                          className="px-5 py-2.5 rounded-xl text-sm border" style={{ borderColor: 'rgba(212,175,55,0.3)', color: GOLD }}>
                          Nouveau test
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          8. CTA FINAL
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="relative p-14 md:p-20 rounded-3xl text-center overflow-hidden"
              style={{ background: 'rgba(10,8,20,0.98)', border: '1px solid rgba(212,175,55,0.25)', boxShadow: '0 0 100px rgba(212,175,55,0.08)' }}>
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-40 h-40" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.15), transparent 70%)' }} />
              <div className="absolute bottom-0 right-0 w-40 h-40" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%)' }} />
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, ${PURPLE}, transparent)` }} />
              <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${CYAN}, ${GOLD}, transparent)` }} />

              {/* Orbiting ring */}
              <div className="relative z-10">
                <div className="relative w-24 h-24 mx-auto mb-8">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full border"
                    style={{ borderColor: `${GOLD}40`, borderTopColor: GOLD, borderRightColor: PURPLE }} />
                  <motion.div animate={{ rotate: -360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-2 rounded-full border"
                    style={{ borderColor: `${CYAN}30`, borderBottomColor: CYAN }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-8 h-8" style={{ color: GOLD }} />
                  </div>
                </div>

                <h2 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
                  Passez à l'automatisation<br />
                  <span style={{
                    background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L}, ${PURPLE})`,
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
                  }}>intelligente dès aujourd'hui</span>
                </h2>
                <p className="text-xl mb-12 max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Rejoignez les entreprises locales qui ont choisi de travailler plus intelligemment, pas plus durement.
                </p>

                <div className="flex flex-wrap justify-center gap-4 mb-10">
                  <Link to={createPageUrl('Pricing')}>
                    <motion.button whileHover={{ scale: 1.06, boxShadow: '0 0 70px rgba(212,175,55,0.55)' }} whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-3 px-10 py-5 rounded-xl text-lg font-black text-black transition-all"
                      style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, boxShadow: `0 0 40px rgba(212,175,55,0.35)` }}>
                      <Sparkles className="w-6 h-6" />
                      Commencer maintenant
                    </motion.button>
                  </Link>
                  <Link to={createPageUrl('Contact')}>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-3 px-10 py-5 rounded-xl text-lg font-semibold border transition-all"
                      style={{ borderColor: 'rgba(212,175,55,0.3)', color: GOLD, background: 'rgba(212,175,55,0.05)' }}>
                      <MessageSquare className="w-5 h-5" />
                      Parler à un expert
                    </motion.button>
                  </Link>
                </div>

                <div className="flex flex-wrap justify-center gap-6 text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {['Sans engagement', 'Annulez à tout moment', 'Support inclus', 'Données sécurisées'].map(item => (
                    <div key={item} className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" style={{ color: 'rgba(212,175,55,0.5)' }} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  );
}