import React, { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Globe, Zap, BarChart3, Headphones, Bot, Search, Share2, Star,
  ArrowRight, CheckCircle, Shield, Layers, ChevronRight, Sparkles
} from 'lucide-react';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';

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

const services = [
  { icon: Globe, title: 'Site vitrine', desc: 'Présence professionnelle, SEO, formulaire, responsive.' },
  { icon: Layers, title: 'Vitrine de vente', desc: 'Catalogue, offres, tunnel de conversion simple.' },
  { icon: BarChart3, title: 'Dashboard admin', desc: 'Espace mobile pour gérer contenus et clients.' },
  { icon: Headphones, title: 'Support client', desc: 'Tickets, messages, suivi demandes intégré.' },
  { icon: Bot, title: 'Automatisation IA', desc: 'Emails, posts, workflows automatisés par IA.' },
  { icon: Search, title: 'SEO automatique', desc: 'Référencement local, Google Business, contenu IA.' },
  { icon: Share2, title: 'Réseaux sociaux', desc: 'Posts programmés, visuels générés, validation client.' },
  { icon: Shield, title: 'Marque blanche', desc: 'Solutions revendables sous votre propre marque.' },
];

const advantages = [
  { title: 'Livraison rapide', desc: 'Premiers résultats en 48h à 7 jours.' },
  { title: 'Mobile-first', desc: 'Parfait sur téléphone, tablette et desktop.' },
  { title: 'IA intégrée', desc: 'Automatisations et contenu généré par intelligence artificielle.' },
  { title: 'Support humain', desc: 'Intervention manuelle possible, suivi personnalisé.' },
];

export default function WebOSHome() {
  return (
    <div className="min-h-screen" style={{ background: '#070710', color: 'white' }}>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-5 pt-20 pb-16">
        {/* Orb bg */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[160px]"
            style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.18) 0%, transparent 70%)' }} />
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          {/* Phoenix icon */}
          <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
            className="flex justify-center mb-8">
            <div className="relative w-24 h-24">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: `${GOLD}40`, borderTopColor: GOLD }} />
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-3 rounded-full border"
                style={{ borderColor: `${GOLD}25`, borderBottomColor: GOLD_L }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-9 h-9" style={{ color: GOLD }} />
              </div>
              <div className="absolute inset-0 rounded-full blur-xl opacity-30"
                style={{ background: `radial-gradient(circle, ${GOLD}, transparent)` }} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-bold tracking-widest uppercase"
            style={{ background: 'rgba(212,175,55,0.09)', border: `1px solid rgba(212,175,55,0.28)`, color: GOLD }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            JS-Innov.ia WebOS — Plateforme premium
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.8 }}
            className="text-4xl md:text-6xl font-black mb-5 leading-tight">
            Sites web, automatisations IA<br />
            <span style={{
              background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_L} 50%, #fff 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>et dashboards prêts à vendre</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-lg md:text-xl mb-10 leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.52)' }}>
            JS-Innov.ia crée des solutions digitales premium : site vitrine, boutique en ligne, dashboard admin, support client, automatisation IA et marque blanche.
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
            className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/webos-contact">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-black text-black text-base"
                style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, boxShadow: `0 0 40px rgba(212,175,55,0.35)` }}>
                <Zap className="w-5 h-5" /> Demander une démo
              </motion.button>
            </Link>
            <Link to="/webos-portfolio">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-semibold text-base border"
                style={{ borderColor: 'rgba(212,175,55,0.35)', color: GOLD, background: 'rgba(212,175,55,0.06)' }}>
                Voir le portfolio <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 px-5">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: GOLD }}>Nos services</p>
              <h2 className="text-3xl md:text-4xl font-black text-white">Tout ce dont vous avez besoin</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.06}>
                <motion.div whileHover={{ y: -6, scale: 1.02 }} transition={{ duration: 0.2 }}
                  className="p-5 rounded-2xl h-full"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.12)' }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
                    <s.icon className="w-5 h-5" style={{ color: GOLD }} />
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1">{s.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)' }}>{s.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* AVANTAGES */}
      <section className="py-16 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl p-8 md:p-12 relative overflow-hidden"
            style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.18)' }}>
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
            <Reveal>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-8 text-center">Pourquoi choisir JS-Innov.ia ?</h2>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {advantages.map((a, i) => (
                <Reveal key={a.title} delay={i * 0.08}>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: GOLD }} />
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

      {/* AUTOMATISATION IA */}
      <section className="py-16 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <Reveal>
              <div>
                <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: GOLD }}>Automatisation IA</p>
                <h2 className="text-3xl font-black text-white mb-5">Votre business en pilote automatique</h2>
                <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.48)' }}>
                  Emails automatisés avec délai humain, posts réseaux sociaux programmés, leads scorés automatiquement. JS-Innov.ia gère pendant que vous travaillez.
                </p>
                <ul className="space-y-3">
                  {['Emails personnalisés à délai humain', 'Scoring automatique des leads', 'Posts validés par vos clients', 'Workflows IA configurables'].map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: GOLD }} /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="rounded-2xl p-6 space-y-3"
                style={{ background: 'rgba(10,10,22,0.9)', border: '1px solid rgba(212,175,55,0.18)' }}>
                {[
                  { t: 'J0 +45min', label: 'Email analyse humaine', color: GOLD },
                  { t: 'J1', label: 'Première recommandation', color: '#8B5CF6' },
                  { t: 'J3', label: 'Structure personnalisée', color: '#06B6D4' },
                  { t: 'J7', label: 'Dernier suivi projet', color: '#22c55e' },
                ].map(item => (
                  <div key={item.t} className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${item.color}20` }}>
                    <span className="text-xs font-black w-12 flex-shrink-0" style={{ color: item.color }}>{item.t}</span>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>{item.label}</span>
                    <div className="ml-auto w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SEO & MARQUE BLANCHE */}
      <section className="py-16 px-5">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          <Reveal>
            <div className="p-7 rounded-2xl h-full" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <Search className="w-8 h-8 mb-4" style={{ color: GOLD }} />
              <h3 className="text-xl font-black text-white mb-3">SEO automatique</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Référencement local, Google Business Profile optimisé, contenu généré par IA chaque semaine. Vos clients vous trouvent, vous les convertissez.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="p-7 rounded-2xl h-full" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <Shield className="w-8 h-8 mb-4" style={{ color: GOLD }} />
              <h3 className="text-xl font-black text-white mb-3">Marque blanche</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Solutions revendables sous votre propre marque. Dashboard, site vitrine, automatisations — tout peut être livré sans mention JS-Innov.ia.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 px-5">
        <div className="max-w-2xl mx-auto text-center">
          <Reveal>
            <div className="p-10 rounded-3xl relative overflow-hidden"
              style={{ background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.25)' }}>
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
              <Star className="w-10 h-10 mx-auto mb-5" style={{ color: GOLD }} />
              <h2 className="text-3xl font-black text-white mb-4">Prêt à lancer votre projet ?</h2>
              <p className="text-base mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Décrivez votre projet en quelques lignes. Je vous réponds personnellement.
              </p>
              <Link to="/webos-contact">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                  className="px-8 py-4 rounded-2xl font-black text-black"
                  style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, boxShadow: `0 0 35px rgba(212,175,55,0.3)` }}>
                  Demander une démo gratuite →
                </motion.button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}