import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Sparkles, Globe, Bot, Smartphone, Film, Zap, Users,
  CheckCircle, Star, ChevronRight, MessageCircle, Play, Shield,
  BarChart3, Cpu, Layers, Clock, Target, TrendingUp
} from 'lucide-react';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const PURPLE = '#8B5CF6';
const CYAN = '#06B6D4';
const BLUE = '#3B82F6';
const WA_LINK = 'https://wa.me/32494119090?text=Bonjour%20Julien%2C%20je%20viens%20du%20site%20Js-Innov.IA%20et%20je%20souhaite%20parler%20de%20mon%20projet.';

function Reveal({ children, delay = 0, y = 30 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-70px' });
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
    const nodes = Array.from({ length: 45 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.5 + 0.5,
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
          if (d < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(212,175,55,${0.05 * (1 - d / 120)})`;
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
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-50" />;
}

const services = [
  { icon: Globe, color: CYAN, title: 'Sites web nouvelle génération', desc: 'Sites vitrines, boutiques, landing pages ultra-modernes et performants.' },
  { icon: Bot, color: PURPLE, title: 'Chatbots métier personnalisés', desc: 'Agents conversationnels intelligents adaptés à votre activité.' },
  { icon: Smartphone, color: BLUE, title: 'Applications mobiles', desc: 'Apps iOS & Android modernes, intuitives et sur mesure.' },
  { icon: Film, color: GOLD, title: 'Contenus & vidéos drone', desc: 'Création de contenus digitaux, vidéos aériennes et productions visuelles.' },
  { icon: Zap, color: '#F59E0B', title: 'Automatisation', desc: 'Workflows intelligents pour alléger votre charge de travail.' },
  { icon: Cpu, color: '#EC4899', title: 'Agents métiers IA', desc: 'Agents intelligents avec validation humaine pour chaque action sensible.' },
];

const packs = [
  { name: 'Pack Starter', price: 'À partir de 490€', color: CYAN, icon: Globe, target: 'Indépendants & petites activités', desc: 'Site vitrine + formulaire + WhatsApp + SEO de base' },
  { name: 'Pack Business', price: 'À partir de 990€', color: GOLD, icon: TrendingUp, target: 'Génération de leads', desc: 'Site avancé + chatbot + CRM + automatisation emails' },
  { name: 'Pack Automation', price: 'À partir de 1490€', color: PURPLE, icon: Zap, target: 'Alléger votre charge', desc: 'Automatisations + tableaux de bord + WhatsApp + validation' },
  { name: 'Pack IA Premium', price: 'Sur devis', color: '#EC4899', icon: Cpu, target: 'Agents IA complets', desc: 'Agents IA + espace client + dashboard + contenu + suivi' },
];

const steps = [
  { n: '01', title: 'Analyse', desc: 'Vous décrivez votre problème. Notre agent IA analyse votre situation.', color: CYAN },
  { n: '02', title: 'Proposition', desc: 'Julien valide la recommandation et vous propose une solution adaptée.', color: GOLD },
  { n: '03', title: 'Production', desc: "L'équipe crée votre solution. Chaque étape importante est validée par vous.", color: PURPLE },
  { n: '04', title: 'Livraison', desc: 'Votre solution est livrée, testée et suivie. Support inclus.', color: BLUE },
];

const testimonials = [
  { name: 'Sophie M.', role: 'Boutique de mode, Bruxelles', text: 'Mon site a été livré en 5 jours. Le chatbot qualifie mes clients avant même que je leur parle. Exceptionnel.', stars: 5 },
  { name: 'Thomas V.', role: 'Indépendant, Mons', text: "L'automatisation des emails m'a fait gagner 8h par semaine. Julien est réactif et professionnel.", stars: 5 },
  { name: 'Marie-Claire L.', role: 'ASBL culturelle, Dour', text: "L'agent IA gère les demandes d'infos. Nous avons 3x plus d'inscriptions depuis le lancement.", stars: 5 },
];

const faqs = [
  { q: 'Combien de temps pour livrer un site ?', a: 'Entre 3 et 14 jours selon le pack choisi. Le Pack Starter en 3 à 5 jours, le Pack IA Premium en 7 à 14 jours.' },
  { q: 'Puis-je modifier mon site après livraison ?', a: 'Oui. Chaque pack inclut des modifications. Une maintenance mensuelle est disponible pour les mises à jour continues.' },
  { q: "Qu'est-ce qu'un agent métier avec validation humaine ?", a: "Un agent IA qui analyse, génère et propose des actions, mais qui attend toujours la validation de Julien avant d'envoyer, publier ou exécuter quoi que ce soit." },
  { q: 'Proposez-vous des paiements échelonnés ?', a: 'Oui. Des facilités de paiement sont possibles selon le projet. Contactez Julien directement.' },
  { q: 'Les données sont-elles sécurisées ?', a: 'Absolument. Nous respectons le RGPD. Vos données ne sont jamais partagées ni vendues. Consentement obligatoire avant toute collecte.' },
];

export default function SaasHome() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ color: 'white' }}>

      {/* ══ HERO ══ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-5 pb-16 pt-20">
        <NeuralBg />
        <div className="absolute inset-0 pointer-events-none">
          <motion.div animate={{ scale: [1, 1.12, 1], opacity: [0.15, 0.22, 0.15] }} transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[160px]"
            style={{ background: `radial-gradient(circle, ${GOLD}28, transparent 70%)` }} />
          <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.17, 0.1] }} transition={{ duration: 10, repeat: Infinity, delay: 3 }}
            className="absolute top-2/3 left-1/4 w-72 h-72 rounded-full blur-[120px]"
            style={{ background: `radial-gradient(circle, ${PURPLE}40, transparent 70%)` }} />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6 text-xs font-bold tracking-widest uppercase"
            style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid rgba(212,175,55,0.3)`, color: GOLD }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Plateforme SaaS Premium · Belgique
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.9 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.08]">
            <span className="block text-white font-inter">Votre problème devient</span>
            <span className="block font-cinzel text-gold-shimmer">
              notre point de départ.
            </span>
            <span className="block text-white mt-1 text-3xl md:text-4xl font-light font-inter" style={{ color: 'rgba(255,255,255,0.7)' }}>Votre solution devient notre création.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Sites web nouvelle génération, chatbots métier, applications mobiles, automatisation, agents IA — tout sous validation humaine de Julien.
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-3 mb-14">
            <Link to="/saas-analyse">
              <motion.button whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(212,175,55,0.5)' }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-7 py-4 rounded-2xl font-black text-black text-sm"
                style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, boxShadow: `0 0 30px rgba(212,175,55,0.35)` }}>
                <Sparkles className="w-4 h-4" /> Analyser mon projet
              </motion.button>
            </Link>
            <Link to="/saas-packs">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-7 py-4 rounded-2xl font-semibold border text-sm"
                style={{ borderColor: 'rgba(212,175,55,0.35)', color: GOLD, background: 'rgba(212,175,55,0.06)' }}>
                Voir les packs <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
            <Link to="/saas-contact">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-7 py-4 rounded-2xl font-semibold border text-sm"
                style={{ borderColor: 'rgba(139,92,246,0.35)', color: PURPLE, background: 'rgba(139,92,246,0.06)' }}>
                Contacter Julien
              </motion.button>
            </Link>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-7 py-4 rounded-2xl font-semibold border text-sm"
                style={{ borderColor: 'rgba(37,211,102,0.35)', color: '#25D366', background: 'rgba(37,211,102,0.06)' }}>
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </motion.button>
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="flex flex-wrap justify-center gap-8">
            {[{ v: '48h', l: 'Livraison express' }, { v: '100%', l: 'Validation humaine' }, { v: '24/7', l: 'Agents IA actifs' }, { v: 'RGPD', l: 'Données protégées' }].map((s, i) => (
              <div key={s.l} className="text-center">
                <div className="text-2xl font-black" style={{ color: GOLD }}>{s.v}</div>
                <div className="text-xs mt-0.5 tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.l}</div>
              </div>
            ))}
          </motion.div>
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
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Des solutions sur mesure</h2>
              <p className="text-base max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>De la conception à la livraison, avec validation humaine à chaque étape sensible.</p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.07}>
                <motion.div whileHover={{ y: -8 }} className="group p-6 rounded-2xl h-full relative overflow-hidden"
                  style={{ background: 'rgba(10,8,22,0.8)', border: `1px solid ${s.color}18` }}>
                  <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: `linear-gradient(90deg, transparent, ${s.color}70, transparent)` }} />
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: `${s.color}12`, border: `1px solid ${s.color}28` }}>
                    <s.icon className="w-6 h-6" style={{ color: s.color }} />
                  </div>
                  <h3 className="font-black text-white text-base mb-2">{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.42)' }}>{s.desc}</p>
                  <Link to="/saas-services" className="mt-4 flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: s.color }}>
                    En savoir plus <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.3}>
            <div className="text-center mt-10">
              <Link to="/saas-services">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                  className="px-8 py-3.5 rounded-2xl font-bold text-sm border transition-all"
                  style={{ borderColor: 'rgba(212,175,55,0.3)', color: GOLD, background: 'rgba(212,175,55,0.05)' }}>
                  Voir tous les services →
                </motion.button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ PACKS ══ */}
      <section className="py-24 px-5 relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.06) 0%, transparent 60%)' }} />
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-bold tracking-widest uppercase"
                style={{ background: `rgba(139,92,246,0.08)`, border: `1px solid rgba(139,92,246,0.22)`, color: PURPLE }}>
                <Layers className="w-3 h-3" /> Nos packs
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">La solution adaptée à votre objectif</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {packs.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.1}>
                <motion.div whileHover={{ y: -10, scale: 1.02 }}
                  className="group p-6 rounded-2xl flex flex-col h-full relative overflow-hidden"
                  style={{ background: 'rgba(10,8,22,0.85)', border: `1px solid ${p.color}22` }}>
                  <div className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: `linear-gradient(90deg, transparent, ${p.color}60, transparent)` }} />
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${p.color}12`, border: `1px solid ${p.color}28` }}>
                    <p.icon className="w-5 h-5" style={{ color: p.color }} />
                  </div>
                  <h3 className="font-black text-white text-sm mb-1">{p.name}</h3>
                  <p className="text-xs mb-2 font-semibold" style={{ color: p.color }}>{p.price}</p>
                  <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>{p.target}</p>
                  <p className="text-xs leading-relaxed flex-1 mb-5" style={{ color: 'rgba(255,255,255,0.48)' }}>{p.desc}</p>
                  <Link to={`/saas-packs`}>
                    <button className="w-full py-2.5 rounded-xl text-xs font-black transition-all"
                      style={{ background: `${p.color}15`, color: p.color, border: `1px solid ${p.color}28` }}>
                      Découvrir →
                    </button>
                  </Link>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PROCESSUS ══ */}
      <section className="py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-bold tracking-widest uppercase"
                style={{ background: 'rgba(6,182,212,0.08)', border: `1px solid rgba(6,182,212,0.22)`, color: CYAN }}>
                <Target className="w-3 h-3" /> Notre méthode
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Comment ça se passe ?</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.1}>
                <div className="relative">
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-7 left-full w-full h-px z-0" style={{ background: `linear-gradient(90deg, ${s.color}40, transparent)` }} />
                  )}
                  <div className="relative z-10 text-center p-5 rounded-2xl" style={{ background: 'rgba(10,8,22,0.7)', border: `1px solid ${s.color}18` }}>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                      style={{ background: `${s.color}12`, border: `1px solid ${s.color}28` }}>
                      <span className="text-lg font-black" style={{ color: s.color }}>{s.n}</span>
                    </div>
                    <h3 className="font-black text-white text-sm mb-2">{s.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.42)' }}>{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ AGENTS IA ══ */}
      <section className="py-24 px-5 relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.04) 0%, transparent 60%)' }} />
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="p-10 md:p-14 rounded-3xl relative overflow-hidden"
              style={{ background: 'rgba(10,8,22,0.9)', border: `1px solid rgba(212,175,55,0.22)` }}>
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, ${PURPLE}, transparent)` }} />
              <div className="absolute top-0 left-0 w-32 h-32" style={{ background: `radial-gradient(circle, ${GOLD}12, transparent 70%)` }} />
              <div className="grid md:grid-cols-2 gap-10 items-center relative z-10">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-bold tracking-widest uppercase"
                    style={{ background: `rgba(139,92,246,0.08)`, border: `1px solid rgba(139,92,246,0.22)`, color: PURPLE }}>
                    <Cpu className="w-3 h-3" /> Agents métiers IA
                  </div>
                  <h2 className="text-3xl font-black text-white mb-4">L'IA travaille. <span style={{ color: GOLD }}>Julien valide.</span></h2>
                  <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.48)' }}>
                    Nos agents IA analysent, génèrent et proposent. Mais aucune action sensible — email, publication, devis — n'est exécutée sans validation humaine.
                  </p>
                  {['Agent Audit Client', 'Agent Devis', 'Agent Contenu', 'Agent SEO', 'Agent Support', 'Agent Automatisation'].map((a, i) => (
                    <div key={a} className="flex items-center gap-2 mb-2">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: `${[GOLD, PURPLE, CYAN, BLUE, '#EC4899', '#22c55e'][i]}20` }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: [GOLD, PURPLE, CYAN, BLUE, '#EC4899', '#22c55e'][i] }} />
                      </div>
                      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{a}</span>
                    </div>
                  ))}
                  <Link to="/saas-agents">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                      className="mt-6 flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-black text-sm"
                      style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>
                      Découvrir les agents <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </Link>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Analyse problème client', status: 'Validé', color: '#22c55e' },
                    { label: 'Brouillon devis généré', status: '⏳ Attente validation', color: GOLD },
                    { label: 'Post Facebook créé', status: '⏳ Attente validation', color: GOLD },
                    { label: 'Email de suivi prêt', status: '⏳ Attente validation', color: GOLD },
                    { label: 'Script vidéo généré', status: 'Refusé — à modifier', color: '#ef4444' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between p-3 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${item.color}18` }}>
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{item.label}</span>
                      <span className="text-xs font-bold" style={{ color: item.color }}>{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ TÉMOIGNAGES ══ */}
      <section className="py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Ils nous font confiance</h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <motion.div whileHover={{ y: -5 }} className="p-7 rounded-2xl"
                  style={{ background: 'rgba(10,8,22,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex gap-1 mb-4">
                    {Array(t.stars).fill(0).map((_, i) => <Star key={i} className="w-4 h-4 fill-current" style={{ color: GOLD }} />)}
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
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section className="py-24 px-5">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-white mb-3">Questions fréquentes</h2>
            </div>
          </Reveal>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <Reveal key={faq.q} delay={i * 0.05}>
                <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(10,8,22,0.8)', border: `1px solid rgba(212,175,55,${openFaq === i ? '0.25' : '0.1'})` }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                    style={{ color: openFaq === i ? GOLD : 'rgba(255,255,255,0.7)' }}>
                    <span className="font-bold text-sm">{faq.q}</span>
                    <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-90' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                        <p className="px-5 pb-5 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            ))}
          </div>
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
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Prêt à transformer votre activité ?</h2>
                <p className="text-base mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>Décrivez votre projet. Julien vous répond personnellement.</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link to="/saas-analyse">
                    <motion.button whileHover={{ scale: 1.06, boxShadow: '0 0 60px rgba(212,175,55,0.5)' }} whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-black text-sm"
                      style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, boxShadow: `0 0 30px rgba(212,175,55,0.35)` }}>
                      <Sparkles className="w-5 h-5" /> Analyser mon projet
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
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}