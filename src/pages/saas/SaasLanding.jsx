import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Sparkles, Globe, Palette, Zap, Users, CheckCircle,
  Star, ChevronRight, MessageCircle, Play, Shield, BarChart3,
  Cpu, Clock, Target, TrendingUp, QrCode, Ticket, Image, FileText,
  Instagram, Youtube, Check, Monitor, Smartphone
} from 'lucide-react';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const PURPLE = '#8B5CF6';
const CYAN = '#06B6D4';
const PINK = '#EC4899';
const GREEN = '#22c55e';
const WA_LINK = 'https://wa.me/32494119090?text=Bonjour%20Julien%2C%20je%20souhaite%20créer%20mon%20projet.';

function Reveal({ children, delay = 0, y = 28 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

function NeuralBg() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const nodes = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      color: [GOLD, PURPLE, CYAN][Math.floor(Math.random() * 3)],
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
          if (d < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(212,175,55,${0.04 * (1 - d / 110)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
          }
        });
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.color + '44';
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-40" />;
}

// ── Before/After mockup ───────────────────────────────────────────────────────
function BeforeAfterDemo() {
  const [pos, setPos] = useState(50);
  return (
    <div className="relative w-full max-w-xl mx-auto rounded-3xl overflow-hidden select-none"
      style={{ height: 280, border: '1px solid rgba(212,175,55,0.25)', boxShadow: '0 0 60px rgba(212,175,55,0.08)' }}>
      {/* AFTER */}
      <div className="absolute inset-0 flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #0a0818 0%, #12102a 100%)' }}>
        <div className="text-center px-8">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${GOLD}, ${PURPLE})` }}>
            <Sparkles className="w-8 h-8 text-black" />
          </div>
          <div className="font-black text-white text-lg mb-1">NOVA CAFÉ</div>
          <div className="text-xs mb-3" style={{ color: GOLD }}>Identité visuelle premium</div>
          <div className="flex gap-2 justify-center">
            {['#D4AF37', '#8B5CF6', '#06B6D4'].map(c => (
              <div key={c} className="w-6 h-6 rounded-full" style={{ background: c }} />
            ))}
          </div>
          <div className="mt-3 text-xs font-bold" style={{ color: GREEN }}>✓ Livré en 48h</div>
        </div>
        <div className="absolute top-3 right-3 text-xs font-black px-3 py-1 rounded-full"
          style={{ background: GREEN, color: '#000' }}>APRÈS</div>
      </div>

      {/* BEFORE — clipped */}
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <div className="absolute inset-0 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' }}>
          <div className="text-center px-8">
            <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center bg-gray-700">
              <span className="text-2xl">☕</span>
            </div>
            <div className="font-bold text-gray-400 text-base mb-1">nova café</div>
            <div className="text-xs text-gray-600">logo fait maison</div>
            <div className="flex gap-2 justify-center mt-3">
              {['#666', '#888', '#aaa'].map(c => (
                <div key={c} className="w-6 h-6 rounded-full" style={{ background: c }} />
              ))}
            </div>
            <div className="mt-3 text-xs text-gray-600">sans cohérence</div>
          </div>
          <div className="absolute top-3 left-3 text-xs font-black px-3 py-1 rounded-full bg-gray-600 text-gray-300">AVANT</div>
        </div>
      </div>

      {/* Slider */}
      <div className="absolute inset-y-0 flex items-center" style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}>
        <div className="w-0.5 h-full" style={{ background: GOLD }} />
        <div className="absolute w-8 h-8 rounded-full border-2 flex items-center justify-center cursor-ew-resize z-10"
          style={{ background: '#0a0818', borderColor: GOLD }}
          onMouseDown={() => {
            const move = (e) => {
              const rect = e.currentTarget?.closest?.('.relative')?.getBoundingClientRect?.() ||
                document.querySelector('.relative')?.getBoundingClientRect();
              if (!rect) return;
              const newPos = Math.max(10, Math.min(90, ((e.clientX - rect.left) / rect.width) * 100));
              setPos(newPos);
            };
            const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
            window.addEventListener('mousemove', move);
            window.addEventListener('mouseup', up);
          }}>
          <ChevronRight className="w-3 h-3 absolute -right-1" style={{ color: GOLD }} />
          <ChevronRight className="w-3 h-3 absolute -left-1 rotate-180" style={{ color: GOLD }} />
        </div>
      </div>
    </div>
  );
}

const steps = [
  { n: '01', icon: FileText, title: 'Vous décrivez votre projet', desc: 'Activité, style, couleurs, besoins. 3 minutes suffisent.', color: CYAN },
  { n: '02', icon: Palette, title: 'On génère votre identité visuelle', desc: 'Logo, charte couleurs, typographies — livrés pour validation.', color: GOLD },
  { n: '03', icon: CheckCircle, title: 'Vous recevez une offre personnalisée', desc: 'Visuels + devis clair + lien paiement acompte.', color: PURPLE },
  { n: '04', icon: Shield, title: 'Vous validez avec un acompte', desc: 'Paiement sécurisé Stripe. Production démarrée immédiatement.', color: PINK },
  { n: '05', icon: Globe, title: 'Votre projet est livré rapidement', desc: 'Site, contenus, automatisations — dans votre espace client.', color: GREEN },
];

const services = [
  { icon: Palette, color: GOLD, title: 'Branding & Design', desc: 'Logo, charte graphique, carte de visite, affiches, bâches.', tag: 'À partir de 149€' },
  { icon: Globe, color: CYAN, title: 'Création de site web', desc: 'Sites vitrines, landing pages, boutiques e-commerce ultra-modernes.', tag: 'À partir de 490€' },
  { icon: Zap, color: PURPLE, title: 'Automatisation business', desc: 'Workflows intelligents, CRM, emails automatiques, relances.', tag: 'À partir de 1490€' },
  { icon: Instagram, color: PINK, title: 'Contenu réseaux sociaux', desc: 'Posts, stories, reels, visuels Facebook — générés et planifiés.', tag: 'À partir de 99€/mois' },
  { icon: QrCode, color: GREEN, title: 'Billetterie & événements', desc: 'Vente de tickets, QR codes, scan entrée, gestion participants.', tag: 'Sur devis' },
];

const contentExamples = [
  { icon: Instagram, platform: 'Instagram', color: PINK, example: 'Post produit', size: '1080×1080', bg: 'from-pink-900/20 to-purple-900/20' },
  { icon: Youtube, platform: 'YouTube Shorts', color: '#FF0000', example: 'Vidéo 60s', size: '1080×1920', bg: 'from-red-900/20 to-red-900/5' },
  { icon: Monitor, platform: 'Facebook', color: '#1877F2', example: 'Visuel pub', size: '1200×628', bg: 'from-blue-900/20 to-blue-900/5' },
  { icon: Smartphone, platform: 'TikTok', color: '#69C9D0', example: 'Script vidéo', size: 'Script + sous-titres', bg: 'from-cyan-900/20 to-cyan-900/5' },
];

const pricing = [
  {
    name: 'Starter', price: '149€', period: 'une fois', color: CYAN,
    features: ['Carte de visite pro', '3 visuels réseaux sociaux', 'Logo simplifié', 'Livraison 48h'],
    cta: 'Commencer'
  },
  {
    name: 'Pro', price: '399€', period: 'une fois', color: GOLD, popular: true,
    features: ['Branding complet', '10 visuels réseaux', 'Mini-site vitrine', 'Charte graphique', 'Livraison 5 jours'],
    cta: 'Choisir Pro'
  },
  {
    name: 'Business', price: '899€', period: 'une fois', color: PURPLE,
    features: ['Branding complet', 'Site web complet', 'Contenus réseaux', 'Automatisation email', 'Support 1 mois'],
    cta: 'Lancer mon business'
  },
];

const subscriptions = [
  { name: 'Essentiel', price: '29€', color: CYAN, desc: '4 posts/mois + maintenance' },
  { name: 'Croissance', price: '59€', color: GOLD, desc: '12 posts + SEO + email' },
  { name: 'Scale', price: '99€', color: PURPLE, desc: 'Contenu illimité + auto. + CRM' },
];

export default function SaasLanding() {
  return (
    <div className="min-h-screen overflow-x-hidden text-white">

      {/* ══ HERO ══ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-5 pb-16 pt-24">
        <NeuralBg />
        <div className="absolute inset-0 pointer-events-none">
          <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.12, 0.2, 0.12] }} transition={{ duration: 9, repeat: Infinity }}
            className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full blur-[150px]"
            style={{ background: `radial-gradient(circle, ${GOLD}28, transparent 70%)` }} />
          <motion.div animate={{ scale: [1, 1.08, 1], opacity: [0.1, 0.16, 0.1] }} transition={{ duration: 11, repeat: Infinity, delay: 3 }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px]"
            style={{ background: `radial-gradient(circle, ${PURPLE}35, transparent 70%)` }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-bold tracking-widest uppercase"
                style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid rgba(212,175,55,0.3)`, color: GOLD }}>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Plateforme · Branding · Automatisation
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.9 }}
                className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-[1.08]">
                <span className="block text-white">Automatisez votre business</span>
                <span className="block" style={{
                  background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L}, ${PURPLE})`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
                }}>et recevez votre identité</span>
                <span className="block text-white">visuelle en 48h.</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="text-lg mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                JS-Innov.IA crée, automatise et livre vos outils digitaux — site web, branding, contenus et workflows — sans complexité ni délai.
              </motion.p>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-3 mb-10">
                <Link to="/saas-projet">
                  <motion.button whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(212,175,55,0.5)' }} whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-7 py-4 rounded-2xl font-black text-black text-sm"
                    style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, boxShadow: `0 0 30px rgba(212,175,55,0.3)` }}>
                    <Sparkles className="w-4 h-4" /> Créer mon projet
                  </motion.button>
                </Link>
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-7 py-4 rounded-2xl font-semibold border text-sm"
                    style={{ borderColor: 'rgba(37,211,102,0.35)', color: '#25D366', background: 'rgba(37,211,102,0.06)' }}>
                    <MessageCircle className="w-4 h-4" /> Parler à Julien
                  </motion.button>
                </a>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                className="flex flex-wrap gap-6">
                {[
                  { v: '48h', l: 'Livraison' }, { v: '100%', l: 'Validation humaine' },
                  { v: '5★', l: 'Satisfaction' }, { v: 'RGPD', l: 'Conforme' }
                ].map(s => (
                  <div key={s.l} className="text-center">
                    <div className="text-xl font-black" style={{ color: GOLD }}>{s.v}</div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.l}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Before/After */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.8 }}>
              <div className="text-center mb-3">
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'rgba(212,175,55,0.5)' }}>
                  Glissez pour voir la transformation →
                </span>
              </div>
              <BeforeAfterDemo />
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  <div className="w-2 h-2 rounded-full bg-gray-600" /> Avant
                </div>
                <div className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: GREEN }} /> Après JS-Innov.IA
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ COMMENT ÇA MARCHE ══ */}
      <section className="py-24 px-5 relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.05) 0%, transparent 60%)' }} />
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-bold tracking-widest uppercase"
                style={{ background: 'rgba(6,182,212,0.08)', border: `1px solid rgba(6,182,212,0.22)`, color: CYAN }}>
                <Target className="w-3 h-3" /> Processus
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Comment ça marche ?</h2>
              <p className="text-base max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>5 étapes, de votre idée à la livraison complète.</p>
            </div>
          </Reveal>
          <div className="space-y-4">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <motion.div whileHover={{ x: 6 }} className="flex items-start gap-5 p-5 rounded-2xl relative"
                  style={{ background: 'rgba(10,8,22,0.8)', border: `1px solid ${s.color}18` }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${s.color}12`, border: `1px solid ${s.color}28` }}>
                    <s.icon className="w-5 h-5" style={{ color: s.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-black px-2 py-0.5 rounded-full" style={{ background: `${s.color}15`, color: s.color }}>{s.n}</span>
                      <h3 className="font-black text-white text-sm">{s.title}</h3>
                    </div>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.desc}</p>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="absolute -bottom-2 left-8 w-0.5 h-4 rounded-full" style={{ background: `${s.color}30` }} />
                  )}
                </motion.div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.4}>
            <div className="text-center mt-10">
              <Link to="/saas-projet">
                <motion.button whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(212,175,55,0.45)' }} whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-black text-sm"
                  style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>
                  <Sparkles className="w-4 h-4" /> Créer mon projet maintenant
                </motion.button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ SERVICES ══ */}
      <section className="py-24 px-5">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-bold tracking-widest uppercase"
                style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid rgba(212,175,55,0.2)`, color: GOLD }}>
                <Sparkles className="w-3 h-3" /> Nos services
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Tout ce dont vous avez besoin</h2>
              <p className="text-base max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>Une plateforme unique pour créer, automatiser et développer votre présence digitale.</p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.07}>
                <motion.div whileHover={{ y: -8 }} className="group p-6 rounded-2xl h-full relative overflow-hidden"
                  style={{ background: 'rgba(10,8,22,0.85)', border: `1px solid ${s.color}18` }}>
                  <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: `linear-gradient(90deg, transparent, ${s.color}70, transparent)` }} />
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${s.color}12`, border: `1px solid ${s.color}28` }}>
                    <s.icon className="w-6 h-6" style={{ color: s.color }} />
                  </div>
                  <h3 className="font-black text-white text-base mb-2">{s.title}</h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.42)' }}>{s.desc}</p>
                  <div className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full"
                    style={{ background: `${s.color}12`, color: s.color, border: `1px solid ${s.color}25` }}>
                    {s.tag}
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ MODULE ÉVÉNEMENT ══ */}
      <section className="py-24 px-5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(34,197,94,0.06) 0%, transparent 60%)' }} />
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="p-10 md:p-14 rounded-3xl relative overflow-hidden"
              style={{ background: 'rgba(10,8,22,0.92)', border: `1px solid ${GREEN}25`, boxShadow: `0 0 60px ${GREEN}08` }}>
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GREEN}70, transparent)` }} />
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-bold tracking-widest uppercase"
                    style={{ background: `${GREEN}12`, border: `1px solid ${GREEN}28`, color: GREEN }}>
                    <QrCode className="w-3 h-3" /> Billetterie & Événements
                  </div>
                  <h2 className="text-3xl font-black text-white mb-4">
                    Créez et gérez vos événements{' '}
                    <span style={{ color: GREEN }}>facilement.</span>
                  </h2>
                  <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.48)' }}>
                    De la billetterie en ligne à la gestion des entrées avec QR code — tout en un, sans complexité.
                  </p>
                  <div className="space-y-3 mb-8">
                    {[
                      { icon: Ticket, text: 'Vente de tickets en ligne sécurisée' },
                      { icon: QrCode, text: 'QR codes générés automatiquement' },
                      { icon: Smartphone, text: 'Scan à l\'entrée via mobile' },
                      { icon: Users, text: 'Gestion des participants en temps réel' },
                    ].map(item => (
                      <div key={item.text} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: `${GREEN}15`, border: `1px solid ${GREEN}28` }}>
                          <item.icon className="w-4 h-4" style={{ color: GREEN }} />
                        </div>
                        <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{item.text}</span>
                      </div>
                    ))}
                  </div>
                  <Link to="/saas-projet">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-black text-black text-sm"
                      style={{ background: GREEN, boxShadow: `0 0 25px ${GREEN}35` }}>
                      <Ticket className="w-4 h-4" /> Créer mon événement
                    </motion.button>
                  </Link>
                </div>
                {/* Visual mockup */}
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl" style={{ background: 'rgba(34,197,94,0.05)', border: `1px solid ${GREEN}20` }}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-black text-white">Festival Été 2025</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${GREEN}20`, color: GREEN }}>En vente</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {[{ l: 'Tickets vendus', v: '347' }, { l: 'Restants', v: '53' }, { l: 'Revenus', v: '2 435€' }].map(s => (
                        <div key={s.l} className="text-center p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                          <div className="text-base font-black" style={{ color: GREEN }}>{s.v}</div>
                          <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.l}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <QrCode className="w-8 h-8 p-1.5 rounded-lg" style={{ background: 'white', color: '#000' }} />
                      <div>
                        <div className="text-xs font-bold text-white">QR Code unique</div>
                        <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Ticket #4721 · Entrée VIP</div>
                      </div>
                      <div className="ml-auto w-5 h-5 rounded-full flex items-center justify-center" style={{ background: GREEN }}>
                        <Check className="w-3 h-3 text-black" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ CONTENU AUTOMATISÉ ══ */}
      <section className="py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-bold tracking-widest uppercase"
                style={{ background: `${PINK}12`, border: `1px solid ${PINK}25`, color: PINK }}>
                <Image className="w-3 h-3" /> Contenu automatisé
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Vos contenus, générés pour vous</h2>
              <p className="text-base max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>Posts Instagram, TikTok, Facebook, YouTube — créés et planifiés automatiquement.</p>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {contentExamples.map((c, i) => (
              <Reveal key={c.platform} delay={i * 0.08}>
                <motion.div whileHover={{ y: -6, scale: 1.03 }}
                  className={`p-5 rounded-2xl bg-gradient-to-br ${c.bg} flex flex-col items-center text-center`}
                  style={{ border: `1px solid ${c.color}20` }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: `${c.color}15`, border: `1px solid ${c.color}25` }}>
                    <c.icon className="w-6 h-6" style={{ color: c.color }} />
                  </div>
                  <div className="font-black text-white text-sm mb-1">{c.platform}</div>
                  <div className="text-xs font-bold mb-1" style={{ color: c.color }}>{c.example}</div>
                  <div className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{c.size}</div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PORTFOLIO ══ */}
      <section className="py-24 px-5 relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.05) 0%, transparent 60%)' }} />
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-bold tracking-widest uppercase"
                style={{ background: `${PURPLE}12`, border: `1px solid ${PURPLE}25`, color: PURPLE }}>
                <Palette className="w-3 h-3" /> Portfolio
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Nos dernières réalisations</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { title: 'Branding Nova Café', cat: 'Logo & Charte', color: GOLD, bg: 'from-yellow-900/20 to-yellow-900/5' },
              { title: 'Site TechPro Mons', cat: 'Site vitrine', color: CYAN, bg: 'from-cyan-900/20 to-cyan-900/5' },
              { title: 'Affiche Festival Dour', cat: 'Design print', color: PINK, bg: 'from-pink-900/20 to-pink-900/5' },
              { title: 'Auto. Boutique Mode', cat: 'Workflow', color: PURPLE, bg: 'from-purple-900/20 to-purple-900/5' },
              { title: 'Carte LUXE Resto', cat: 'Carte de visite', color: GOLD, bg: 'from-yellow-900/15 to-yellow-900/5' },
              { title: 'Réseaux BodyFit', cat: 'Contenus sociaux', color: GREEN, bg: 'from-green-900/20 to-green-900/5' },
            ].map((p, i) => (
              <Reveal key={p.title} delay={i * 0.06}>
                <motion.div whileHover={{ scale: 1.04, y: -4 }}
                  className={`aspect-square rounded-2xl bg-gradient-to-br ${p.bg} flex flex-col items-center justify-center relative overflow-hidden`}
                  style={{ border: `1px solid ${p.color}18` }}>
                  <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${p.color}50, transparent)` }} />
                  <Palette className="w-10 h-10 mb-3 opacity-50" style={{ color: p.color }} />
                  <div className="font-black text-white text-sm text-center px-3">{p.title}</div>
                  <div className="text-xs mt-1 px-3 py-1 rounded-full" style={{ background: `${p.color}15`, color: p.color }}>{p.cat}</div>
                </motion.div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.3}>
            <div className="text-center mt-8">
              <Link to="/saas">
                <button className="px-6 py-3 rounded-2xl text-sm font-bold border transition-all"
                  style={{ borderColor: 'rgba(212,175,55,0.25)', color: GOLD, background: 'rgba(212,175,55,0.05)' }}>
                  Voir tout le portfolio →
                </button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ PRICING ══ */}
      <section className="py-24 px-5 relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.05) 0%, transparent 60%)' }} />
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-bold tracking-widest uppercase"
                style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid rgba(212,175,55,0.2)`, color: GOLD }}>
                <TrendingUp className="w-3 h-3" /> Tarifs
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Offres claires, sans surprise</h2>
              <p className="text-base max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>Démarrez au bon niveau. Évoluez à votre rythme.</p>
            </div>
          </Reveal>

          {/* One-time */}
          <div className="grid md:grid-cols-3 gap-5 mb-10">
            {pricing.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.1}>
                <motion.div whileHover={{ y: -8 }}
                  className="relative p-7 rounded-3xl flex flex-col h-full overflow-hidden"
                  style={{
                    background: p.popular ? 'rgba(212,175,55,0.06)' : 'rgba(10,8,22,0.85)',
                    border: p.popular ? `1px solid rgba(212,175,55,0.35)` : `1px solid ${p.color}20`,
                    boxShadow: p.popular ? `0 0 50px rgba(212,175,55,0.08)` : 'none'
                  }}>
                  <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${p.color}70, transparent)` }} />
                  {p.popular && (
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-black text-black"
                      style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>⭐ Populaire</div>
                  )}
                  <div className="mb-5">
                    <h3 className="text-xl font-black text-white mb-1">{p.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black" style={{ color: p.color }}>{p.price}</span>
                      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>{p.period}</span>
                    </div>
                  </div>
                  <div className="space-y-2 flex-1 mb-6">
                    {p.features.map(f => (
                      <div key={f} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: p.color }} />
                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <Link to="/saas-projet">
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                      className="w-full py-3 rounded-2xl font-black text-sm"
                      style={p.popular
                        ? { background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, color: '#000' }
                        : { background: `${p.color}15`, color: p.color, border: `1px solid ${p.color}28` }}>
                      {p.cta} →
                    </motion.button>
                  </Link>
                </motion.div>
              </Reveal>
            ))}
          </div>

          {/* Subscriptions */}
          <Reveal delay={0.3}>
            <div className="p-6 rounded-2xl" style={{ background: 'rgba(10,8,22,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="text-center mb-5">
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>Ou abonnez-vous</span>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {subscriptions.map((s, i) => (
                  <div key={s.name} className="p-4 rounded-2xl text-center" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${s.color}18` }}>
                    <div className="font-black text-white mb-1">{s.name}</div>
                    <div className="text-2xl font-black mb-1" style={{ color: s.color }}>{s.price}<span className="text-xs font-normal text-gray-500">/mois</span></div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ CTA FINAL ══ */}
      <section className="py-24 px-5">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="relative p-12 md:p-16 rounded-3xl text-center overflow-hidden"
              style={{ background: 'rgba(10,8,22,0.98)', border: `1px solid rgba(212,175,55,0.25)`, boxShadow: '0 0 80px rgba(212,175,55,0.07)' }}>
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, ${PURPLE}, transparent)` }} />
              <div className="absolute top-0 left-0 w-32 h-32" style={{ background: `radial-gradient(circle, ${GOLD}15, transparent 70%)` }} />
              <div className="absolute bottom-0 right-0 w-32 h-32" style={{ background: `radial-gradient(circle, ${PURPLE}15, transparent 70%)` }} />
              <div className="relative z-10">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 rounded-full border mx-auto mb-6 flex items-center justify-center"
                  style={{ borderColor: `${GOLD}40`, borderTopColor: GOLD }}>
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Lancez votre projet maintenant</h2>
                <p className="text-base mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Décrivez votre projet en 3 minutes. Recevez une offre personnalisée avec visuels.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link to="/saas-projet">
                    <motion.button whileHover={{ scale: 1.06, boxShadow: '0 0 60px rgba(212,175,55,0.5)' }} whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-black text-sm"
                      style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, boxShadow: `0 0 30px rgba(212,175,55,0.35)` }}>
                      <Sparkles className="w-5 h-5" /> Créer mon projet
                    </motion.button>
                  </Link>
                  <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold border text-sm"
                      style={{ borderColor: 'rgba(37,211,102,0.35)', color: '#25D366', background: 'rgba(37,211,102,0.06)' }}>
                      <MessageCircle className="w-4 h-4" /> WhatsApp
                    </motion.button>
                  </a>
                </div>
                <div className="flex flex-wrap justify-center gap-6 mt-8 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {['Acompte sécurisé Stripe', 'Offre personnalisée', 'Livraison 48h', 'Satisfaction garantie'].map(t => (
                    <div key={t} className="flex items-center gap-1.5">
                      <Check className="w-3 h-3" style={{ color: `${GOLD}70` }} /> {t}
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