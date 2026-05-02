import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Check, X, Sparkles, Zap, Shield, ArrowRight, BarChart3, FileText, Music, Bot, Star, Crown, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const PURPLE = '#8B5CF6';
const CYAN = '#06B6D4';

function Reveal({ children, delay = 0, y = 30 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

const PLANS = [
  {
    id: 'starter', name: 'Starter', price: 19, icon: Rocket,
    color: CYAN, glow: 'rgba(6,182,212,0.25)',
    description: 'Parfait pour démarrer avec l\'IA',
    features: [
      { text: 'AI SEO Analyzer', ok: true },
      { text: 'AI Content Generator', ok: true },
      { text: '50 générations / mois', ok: true },
      { text: 'Rapports SEO basiques', ok: true },
      { text: 'AI Music Generator', ok: false },
      { text: 'Automation Agents IA', ok: false },
      { text: 'Accès API', ok: false },
      { text: 'Support prioritaire', ok: false },
    ]
  },
  {
    id: 'pro', name: 'Pro', price: 39, icon: Star,
    color: GOLD, glow: 'rgba(212,175,55,0.35)',
    popular: true,
    description: 'Pour les entrepreneurs ambitieux',
    features: [
      { text: 'AI SEO Analyzer', ok: true },
      { text: 'AI Content Generator', ok: true },
      { text: '200 générations / mois', ok: true },
      { text: 'Rapports SEO avancés', ok: true },
      { text: 'AI Music Generator', ok: true },
      { text: 'Automation Agents IA', ok: false },
      { text: 'Accès API', ok: false },
      { text: 'Support prioritaire', ok: true },
    ]
  },
  {
    id: 'business', name: 'Business', price: 79, icon: Crown,
    color: PURPLE, glow: 'rgba(139,92,246,0.3)',
    description: 'Pour les PME qui veulent tout automatiser',
    features: [
      { text: 'AI SEO Analyzer', ok: true },
      { text: 'AI Content Generator', ok: true },
      { text: 'Générations illimitées', ok: true },
      { text: 'Rapports SEO complets', ok: true },
      { text: 'AI Music Generator', ok: true },
      { text: 'Automation Agents IA', ok: true },
      { text: 'Accès API', ok: true },
      { text: 'Support dédié 24/7', ok: true },
    ]
  }
];

const FAQS = [
  { q: 'Puis-je annuler à tout moment ?', a: 'Oui, sans frais ni question. Votre accès reste actif jusqu\'à la fin de la période payée.' },
  { q: 'Qu\'est-ce qu\'une génération ?', a: 'Un article, une analyse SEO complète, une musique ou un rapport automatisé.' },
  { q: 'Y a-t-il un essai gratuit ?', a: 'Oui, une analyse SEO gratuite et sans inscription pour tester nos outils IA.' },
  { q: 'Comment fonctionne la facturation ?', a: 'Mensuelle via Stripe. Une facture est envoyée chaque mois.' },
  { q: 'Puis-je changer de plan ?', a: 'Oui, upgrade ou downgrade à tout moment depuis votre tableau de bord.' },
];

export default function Pricing() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen" style={{ color: 'white' }}>

      {/* HERO */}
      <section className="pt-20 pb-16 px-5 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div animate={{ scale: [1, 1.08, 1], opacity: [0.08, 0.14, 0.08] }} transition={{ duration: 9, repeat: Infinity }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] blur-[120px] rounded-full"
            style={{ background: `radial-gradient(ellipse, ${GOLD}40, transparent 70%)` }} />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6 text-xs font-bold tracking-widest uppercase"
            style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid rgba(212,175,55,0.3)`, color: GOLD }}>
            <Sparkles className="w-3.5 h-3.5" /> Tarifs simples et transparents
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.8 }}
            className="text-4xl md:text-6xl font-black mb-4 leading-tight font-cinzel">
            <span className="text-white">Choisissez votre</span>{' '}
            <span style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L}, ${PURPLE})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              plan IA
            </span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="text-lg" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Commencez dès <span style={{ color: GOLD }}>19€/mois</span> · Sans engagement · Annulez à tout moment
          </motion.p>
        </div>
      </section>

      {/* PLANS */}
      <section className="px-5 pb-24 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.id} delay={i * 0.1}>
              <motion.div whileHover={{ y: -10, scale: 1.02 }} transition={{ duration: 0.25 }}
                className="relative rounded-3xl p-8 flex flex-col h-full overflow-hidden"
                style={{
                  background: plan.popular
                    ? `linear-gradient(135deg, rgba(212,175,55,0.1), rgba(139,92,246,0.08))`
                    : 'rgba(10,8,22,0.85)',
                  border: `1px solid ${plan.color}${plan.popular ? '55' : '22'}`,
                  boxShadow: plan.popular ? `0 0 60px ${plan.glow}` : 'none',
                }}>

                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <motion.div animate={{ boxShadow: [`0 0 15px ${GOLD}60`, `0 0 30px ${GOLD}90`, `0 0 15px ${GOLD}60`] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="px-5 py-1.5 rounded-full text-xs font-black text-black"
                      style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>
                      ⭐ Le plus populaire
                    </motion.div>
                  </div>
                )}

                {/* Top color line */}
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${plan.color}80, transparent)` }} />

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: `${plan.color}12`, border: `1px solid ${plan.color}28` }}>
                  <plan.icon className="w-7 h-7" style={{ color: plan.color }} />
                </div>

                <h3 className="text-2xl font-black text-white mb-1">{plan.name}</h3>
                <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.4)' }}>{plan.description}</p>

                <div className="flex items-baseline gap-1 mb-7">
                  <span className="text-5xl font-black" style={{ color: plan.color }}>{plan.price}€</span>
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>/mois</span>
                </div>

                <div className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <div key={f.text} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: f.ok ? `${plan.color}18` : 'rgba(255,255,255,0.04)', border: `1px solid ${f.ok ? plan.color + '35' : 'rgba(255,255,255,0.08)'}` }}>
                        {f.ok
                          ? <Check className="w-3 h-3" style={{ color: plan.color }} />
                          : <X className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.2)' }} />
                        }
                      </div>
                      <span className="text-sm" style={{ color: f.ok ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.25)' }}>
                        {f.text}
                      </span>
                    </div>
                  ))}
                </div>

                <Link to={createPageUrl('Contact')}>
                  <motion.button whileHover={{ scale: 1.03, boxShadow: `0 0 30px ${plan.glow}` }} whileTap={{ scale: 0.97 }}
                    className="w-full py-3.5 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2"
                    style={plan.popular
                      ? { background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, color: '#000' }
                      : { background: `${plan.color}12`, color: plan.color, border: `1px solid ${plan.color}30` }}>
                    Commencer avec {plan.name} <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* Guarantees */}
        <Reveal delay={0.3}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
            {[
              { icon: Shield, title: 'Sans engagement', desc: 'Annulez quand vous voulez, sans frais.' },
              { icon: Zap, title: 'Accès immédiat', desc: 'Tous les outils disponibles dès inscription.' },
              { icon: Sparkles, title: 'Mises à jour incluses', desc: 'Nouvelles fonctionnalités IA automatiquement.' }
            ].map((g) => (
              <div key={g.title} className="flex items-center gap-4 p-5 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.1)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.18)' }}>
                  <g.icon className="w-5 h-5" style={{ color: GOLD }} />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{g.title}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{g.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mt-20">
          <Reveal>
            <h2 className="text-3xl font-black text-white text-center mb-10 font-cinzel">
              Questions <span style={{ color: GOLD }}>fréquentes</span>
            </h2>
          </Reveal>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="rounded-2xl overflow-hidden cursor-pointer transition-all"
                  style={{
                    background: 'rgba(10,8,22,0.8)',
                    border: `1px solid rgba(212,175,55,${openFaq === i ? '0.25' : '0.1'})`
                  }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <div className="flex items-center justify-between p-5"
                    style={{ color: openFaq === i ? GOLD : 'rgba(255,255,255,0.7)' }}>
                    <span className="font-bold text-sm">{faq.q}</span>
                    <motion.span animate={{ rotate: openFaq === i ? 45 : 0 }} transition={{ duration: 0.2 }}
                      className="text-xl flex-shrink-0 ml-4" style={{ color: GOLD }}>+</motion.span>
                  </div>
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

        {/* Bottom CTA */}
        <Reveal delay={0.2}>
          <div className="relative mt-20 p-12 rounded-3xl text-center overflow-hidden"
            style={{ background: 'rgba(10,8,22,0.98)', border: `1px solid rgba(212,175,55,0.22)`, boxShadow: `0 0 60px rgba(212,175,55,0.06)` }}>
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, ${PURPLE}, transparent)` }} />
            <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${CYAN}, ${GOLD}, transparent)` }} />
            <h2 className="text-2xl font-black text-white mb-2">Encore des questions ?</h2>
            <p className="mb-6 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Notre équipe est là pour vous aider à choisir le bon plan.</p>
            <Link to={createPageUrl('Contact')}>
              <motion.button whileHover={{ scale: 1.05, boxShadow: `0 0 40px rgba(212,175,55,0.4)` }} whileTap={{ scale: 0.97 }}
                className="px-8 py-3.5 rounded-2xl font-black text-black text-sm"
                style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>
                Parler à un expert →
              </motion.button>
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}