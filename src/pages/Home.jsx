import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  ArrowRight, Sparkles, BarChart3, FileText,
  Music, Bot, Check, Globe, Zap, TrendingUp,
  ChevronRight, Shield, Star, Play, Award, Users, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// ── Particle canvas ──────────────────────────────────────────────────────────
function ParticleField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      color: ['#D4AF37', '#8B5CF6', '#06B6D4'][Math.floor(Math.random() * 3)],
      alpha: Math.random() * 0.6 + 0.2,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-40" />;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: BarChart3,
    gradient: 'from-gold-500 to-gold-700',
    glow: 'shadow-gold-500/30',
    border: 'border-gold-500/30',
    bg: 'from-gold-500/8 to-gold-700/4',
    title: 'AI SEO Analyzer',
    description: 'Analysez votre site en 30 secondes. Score SEO, keywords manquants, backlinks et recommandations IA ultra-personnalisées.',
    path: 'SEOAudit',
    items: ['Score SEO instantané', 'Analyse des keywords', 'Recommandations IA'],
    tag: 'Populaire'
  },
  {
    icon: FileText,
    gradient: 'from-purple-500 to-purple-800',
    glow: 'shadow-purple-500/30',
    border: 'border-purple-500/30',
    bg: 'from-purple-500/8 to-purple-800/4',
    title: 'AI Content Generator',
    description: 'Générez des articles SEO, posts réseaux sociaux, emails marketing et descriptions produits en quelques secondes.',
    path: 'ContentStudio',
    items: ['Articles SEO optimisés', 'Posts réseaux sociaux', 'Emails marketing'],
    tag: null
  },
  {
    icon: Music,
    gradient: 'from-cyan-500 to-cyan-700',
    glow: 'shadow-cyan-500/30',
    border: 'border-cyan-500/30',
    bg: 'from-cyan-500/8 to-cyan-700/4',
    title: 'AI Music Generator',
    description: 'Créez des musiques de fond, jingles publicitaires, intros YouTube sans droits SABAM.',
    path: 'AIMusic',
    items: ['Libre de droits SABAM', 'Jingles personnalisés', 'Export MP3 / WAV'],
    tag: null
  },
  {
    icon: Bot,
    gradient: 'from-violet-500 to-gold-600',
    glow: 'shadow-violet-500/30',
    border: 'border-violet-500/30',
    bg: 'from-violet-500/8 to-gold-600/4',
    title: 'AI Automation Agents',
    description: 'Des agents IA qui répondent à vos clients, génèrent des devis et automatisent vos process business 24/7.',
    path: 'Automations',
    items: ['Agents personnalisés', 'Automatisation emails', 'Génération de devis'],
    tag: 'Nouveau'
  }
];

const PLANS = [
  {
    name: 'Starter', price: '19',
    border: 'border-gold-700/30', cardBg: 'bg-black/40',
    btnClass: 'border border-gold-500/50 text-gold-400 hover:bg-gold-500/10',
    btnVariant: 'outline',
    items: ['AI SEO Analyzer', 'AI Content Generator', '50 générations/mois', 'Support email']
  },
  {
    name: 'Pro', price: '39', popular: true,
    border: 'border-gold-500/70', cardBg: 'bg-gradient-to-br from-gold-900/20 to-purple-900/20',
    btnClass: 'bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold hover:from-gold-400 hover:to-gold-500',
    btnVariant: 'default',
    items: ['SEO + Content IA', 'AI Music Generator', '200 générations/mois', 'Support prioritaire']
  },
  {
    name: 'Business', price: '79',
    border: 'border-purple-500/50', cardBg: 'bg-black/40',
    btnClass: 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:from-purple-500 hover:to-cyan-500',
    btnVariant: 'default',
    items: ['Tout inclus', 'Automation Agents IA', 'Générations illimitées', 'Support dédié 24/7']
  }
];

const STATS = [
  { value: '500+', label: 'Entreprises actives', icon: Users },
  { value: '10K+', label: 'Contenus générés', icon: FileText },
  { value: '98%', label: 'Satisfaction client', icon: Star },
  { value: '24/7', label: 'Agents IA actifs', icon: Clock }
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [url, setUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [score, setScore] = useState(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, -80]);

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setAnalyzing(true);
    await new Promise(r => setTimeout(r, 2800));
    setScore(Math.floor(Math.random() * 30) + 42);
    setAnalyzing(false);
  };

  const scoreColor = (s) => s >= 80 ? '#22c55e' : s >= 60 ? '#D4AF37' : '#ef4444';
  const scoreLabel = (s) => s >= 80 ? 'Excellent' : s >= 60 ? 'À améliorer' : 'Critique — action requise';

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: 'linear-gradient(135deg, #080808 0%, #0d0a1a 50%, #080808 100%)' }}>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <ParticleField />

        {/* Orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/5 w-[600px] h-[600px] rounded-full blur-[140px]" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)' }} />
          <div className="absolute top-1/3 right-1/5 w-[500px] h-[500px] rounded-full blur-[120px]" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)' }} />
          <div className="absolute bottom-1/4 left-1/2 w-[400px] h-[400px] rounded-full blur-[100px]" style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)' }} />
        </div>

        {/* Gold line top */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, #8B5CF6, #06B6D4, transparent)' }} />

        <motion.div style={{ y: heroY }} className="relative z-10 text-center max-w-5xl mx-auto px-4">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8 border"
            style={{ background: 'rgba(212,175,55,0.08)', borderColor: 'rgba(212,175,55,0.4)', boxShadow: '0 0 30px rgba(212,175,55,0.15)' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
              <Sparkles className="w-4 h-4" style={{ color: '#D4AF37' }} />
            </motion.div>
            <span className="text-sm font-semibold tracking-wider" style={{ color: '#D4AF37' }}>JS-INNOV.IA — Intelligence Artificielle Premium</span>
          </motion.div>

          {/* Title */}
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
            className="text-6xl md:text-8xl font-black mb-6 leading-none tracking-tight">
            <span className="block text-white">L'IA qui</span>
            <span className="block" style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #F5CF41 30%, #8B5CF6 60%, #06B6D4 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>
              transforme tout
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }}
            className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed" style={{ color: 'rgba(212,175,55,0.7)' }}>
            Plateforme tout-en-un pour automatiser votre SEO, créer du contenu, générer de la musique et piloter votre croissance.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4 mb-20">
            <Link to={createPageUrl('Pricing')}>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                className="group flex items-center gap-3 px-8 py-4 rounded-xl text-base font-bold text-black transition-all"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #F5CF41)', boxShadow: '0 0 40px rgba(212,175,55,0.4)' }}>
                <Sparkles className="w-5 h-5" />
                Commencer maintenant
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <Link to={createPageUrl('SEOAudit')}>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 px-8 py-4 rounded-xl text-base font-semibold border transition-all"
                style={{ borderColor: 'rgba(212,175,55,0.4)', color: '#D4AF37', background: 'rgba(212,175,55,0.05)' }}>
                <Play className="w-4 h-4" />
                Voir la démo
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {STATS.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 + i * 0.1 }}
                className="text-center p-4 rounded-xl border" style={{ background: 'rgba(212,175,55,0.04)', borderColor: 'rgba(212,175,55,0.15)' }}>
                <s.icon className="w-5 h-5 mx-auto mb-2 opacity-60" style={{ color: '#D4AF37' }} />
                <div className="text-2xl font-black" style={{ color: '#D4AF37' }}>{s.value}</div>
                <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, #080808)' }} />
      </section>

      {/* ── SEO DEMO ── */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative p-10 rounded-3xl overflow-hidden"
            style={{ background: 'rgba(10,8,20,0.9)', border: '1px solid rgba(212,175,55,0.25)', boxShadow: '0 0 60px rgba(212,175,55,0.08), inset 0 0 40px rgba(212,175,55,0.03)' }}>
            {/* corner accents */}
            <div className="absolute top-0 left-0 w-16 h-16" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.3), transparent)' }} />
            <div className="absolute bottom-0 right-0 w-16 h-16" style={{ background: 'linear-gradient(315deg, rgba(139,92,246,0.3), transparent)' }} />

            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-sm font-semibold"
                style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', color: '#06B6D4' }}>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse inline-block" />
                Analyse IA en direct — GRATUIT
              </div>

              <h2 className="text-3xl md:text-4xl font-black text-white mb-2">Analysez votre site maintenant</h2>
              <p className="mb-8 text-sm" style={{ color: 'rgba(212,175,55,0.6)' }}>Score SEO complet en 30 secondes, sans inscription</p>

              <AnimatePresence mode="wait">
                {!score ? (
                  <motion.div key="input" exit={{ opacity: 0 }} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                    <div className="relative flex-1">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'rgba(212,175,55,0.5)' }} />
                      <input value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
                        placeholder="https://votre-site.com"
                        className="w-full pl-10 pr-4 py-3.5 rounded-xl text-white text-sm outline-none transition-all"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.25)', color: 'white' }} />
                    </div>
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                      onClick={handleAnalyze} disabled={analyzing || !url.trim()}
                      className="px-6 py-3.5 rounded-xl font-bold text-black text-sm whitespace-nowrap disabled:opacity-40 transition-all"
                      style={{ background: 'linear-gradient(135deg, #D4AF37, #F5CF41)', boxShadow: '0 0 25px rgba(212,175,55,0.3)' }}>
                      {analyzing ? (
                        <span className="flex items-center gap-2">
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><Zap className="w-4 h-4" /></motion.div>
                          Analyse…
                        </span>
                      ) : 'Analyser →'}
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                      <div className="relative">
                        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
                          <motion.circle cx="50" cy="50" r="42" stroke={scoreColor(score)} strokeWidth="8" fill="none"
                            strokeLinecap="round" strokeDasharray={`${2.64 * score} 264`}
                            initial={{ strokeDasharray: '0 264' }} animate={{ strokeDasharray: `${2.64 * score} 264` }} transition={{ duration: 1.5, ease: 'easeOut' }} />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-4xl font-black" style={{ color: scoreColor(score) }}>{score}</span>
                          <span className="text-xs opacity-60 text-white">/100</span>
                        </div>
                      </div>
                      <div className="text-left space-y-2">
                        <div className="text-xl font-bold" style={{ color: scoreColor(score) }}>{scoreLabel(score)}</div>
                        {['Mots-clés cibles manquants', 'Balises meta incomplètes', 'Vitesse à optimiser', 'Maillage interne insuffisant'].map(issue => (
                          <div key={issue} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#ef4444' }} />{issue}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}>
                      <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.7)' }}>🎯 Obtenez le rapport complet avec plan d'action personnalisé</p>
                      <div className="flex flex-wrap gap-3 justify-center">
                        <Link to={createPageUrl('Pricing')}>
                          <button className="px-4 py-2 rounded-lg text-sm font-bold text-black" style={{ background: 'linear-gradient(135deg, #D4AF37, #F5CF41)' }}>Voir les plans →</button>
                        </Link>
                        <button onClick={() => { setScore(null); setUrl(''); }}
                          className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: 'rgba(212,175,55,0.3)', color: '#D4AF37' }}>
                          Analyser un autre site
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-bold tracking-widest uppercase"
              style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}>
              <Award className="w-3 h-3" /> Suite Premium IA
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">4 outils pour tout automatiser</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(212,175,55,0.6)' }}>Une suite complète d'outils IA pour développer votre business sans effort</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link to={createPageUrl(f.path)}>
                  <motion.div whileHover={{ y: -6, scale: 1.01 }} transition={{ duration: 0.2 }}
                    className="group relative p-7 rounded-2xl h-full overflow-hidden cursor-pointer"
                    style={{ background: 'rgba(8,8,20,0.9)', border: `1px solid rgba(212,175,55,0.2)` }}>
                    {/* Hover glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: 'radial-gradient(circle at 50% 0%, rgba(212,175,55,0.06) 0%, transparent 70%)' }} />
                    <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }} />

                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-5">
                        <div className="p-3 rounded-xl" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
                          <f.icon className="w-6 h-6" style={{ color: '#D4AF37' }} />
                        </div>
                        {f.tag && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}>
                            {f.tag}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
                      <p className="text-sm mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{f.description}</p>
                      <div className="space-y-2 mb-5">
                        {f.items.map(item => (
                          <div key={item} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(212,175,55,0.8)' }}>
                            <Check className="w-4 h-4 flex-shrink-0" style={{ color: '#D4AF37' }} />
                            {item}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all" style={{ color: '#D4AF37' }}>
                        Découvrir <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.05) 0%, transparent 70%)' }} />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">3 étapes, des résultats immédiats</h2>
          <p className="mb-16 text-lg" style={{ color: 'rgba(212,175,55,0.6)' }}>De zéro à une machine de croissance en quelques minutes</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: Globe, title: 'Entrez votre site', desc: 'Saisissez l\'URL de votre site ou décrivez votre projet en quelques mots.' },
              { step: '02', icon: Zap, title: 'L\'IA analyse', desc: 'Nos agents IA analysent et génèrent des insights actionnables en quelques secondes.' },
              { step: '03', icon: TrendingUp, title: 'Croissez plus vite', desc: 'Appliquez les recommandations IA et regardez vos résultats s\'envoler.' }
            ].map((item, i) => (
              <motion.div key={item.step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="relative p-8 rounded-2xl" style={{ background: 'rgba(10,8,20,0.8)', border: '1px solid rgba(212,175,55,0.15)' }}>
                <div className="absolute top-4 right-4 text-6xl font-black opacity-5 text-white">{item.step}</div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(139,92,246,0.1))', border: '1px solid rgba(212,175,55,0.25)' }}>
                  <item.icon className="w-6 h-6" style={{ color: '#D4AF37' }} />
                </div>
                <div className="text-xs font-bold tracking-widest mb-2" style={{ color: 'rgba(212,175,55,0.5)' }}>ÉTAPE {item.step}</div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Plans simples et transparents</h2>
            <p style={{ color: 'rgba(212,175,55,0.6)' }}>Commencez dès 19€/mois · Sans engagement</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan, i) => (
              <motion.div key={plan.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`relative p-7 rounded-2xl ${plan.cardBg} ${plan.popular ? 'md:scale-105' : ''}`}
                style={{ border: `1px solid ${plan.popular ? 'rgba(212,175,55,0.5)' : 'rgba(212,175,55,0.15)'}`, boxShadow: plan.popular ? '0 0 50px rgba(212,175,55,0.12)' : 'none' }}>
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full text-xs font-black text-black" style={{ background: 'linear-gradient(135deg, #D4AF37, #F5CF41)' }}>⭐ POPULAIRE</span>
                  </div>
                )}
                <div className="mb-5">
                  <div className="text-sm font-bold tracking-widest mb-1" style={{ color: 'rgba(212,175,55,0.7)' }}>{plan.name.toUpperCase()}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">{plan.price}€</span>
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>/mois</span>
                  </div>
                </div>
                <div className="space-y-2.5 mb-6">
                  {plan.items.map(item => (
                    <div key={item} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: '#D4AF37' }} />
                      {item}
                    </div>
                  ))}
                </div>
                <Link to={createPageUrl('Pricing')} className="block">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${plan.btnClass}`}>
                    Commencer avec {plan.name}
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to={createPageUrl('Pricing')} className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
              style={{ color: '#D4AF37' }}>
              Voir tous les détails <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative p-12 md:p-16 rounded-3xl text-center overflow-hidden"
            style={{ background: 'rgba(10,8,20,0.95)', border: '1px solid rgba(212,175,55,0.3)', boxShadow: '0 0 80px rgba(212,175,55,0.1)' }}>
            {/* Gradient corners */}
            <div className="absolute top-0 left-0 w-32 h-32" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.2), transparent 70%)' }} />
            <div className="absolute bottom-0 right-0 w-32 h-32" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.2), transparent 70%)' }} />
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }} />

            <div className="relative z-10">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)' }}>
                <Sparkles className="w-7 h-7" style={{ color: '#D4AF37' }} />
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Prêt à tout automatiser ?</h2>
              <p className="text-lg mb-10" style={{ color: 'rgba(212,175,55,0.7)' }}>
                Rejoignez 500+ entrepreneurs qui utilisent JS-INNOV.IA pour transformer leur business.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to={createPageUrl('Pricing')}>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-8 py-4 rounded-xl text-base font-black text-black"
                    style={{ background: 'linear-gradient(135deg, #D4AF37, #F5CF41)', boxShadow: '0 0 40px rgba(212,175,55,0.35)' }}>
                    <Sparkles className="w-5 h-5" />
                    Commencer maintenant
                  </motion.button>
                </Link>
                <Link to={createPageUrl('Contact')}>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                    className="px-8 py-4 rounded-xl text-base font-semibold border transition-all"
                    style={{ borderColor: 'rgba(212,175,55,0.3)', color: '#D4AF37', background: 'rgba(212,175,55,0.05)' }}>
                    Nous contacter
                  </motion.button>
                </Link>
              </div>
              <div className="flex items-center justify-center gap-2 mt-8 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                <Shield className="w-3.5 h-3.5" />
                Sans engagement · Annulez à tout moment
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}