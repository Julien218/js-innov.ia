import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Zap, Star, Crown, Sparkles } from 'lucide-react';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const PURPLE = '#8B5CF6';
const CYAN = '#06B6D4';

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

const plans = [
  {
    icon: Zap, name: 'Starter', price: '490',
    sub: '+ maintenance optionnelle 49€/mois',
    color: CYAN,
    desc: 'Idéal pour démarrer avec une présence professionnelle rapide.',
    features: ['Site vitrine 1 à 5 pages', 'Formulaire de contact', 'SEO de base (titres, métas)', 'Design responsive mobile', 'Google Business Profile', 'Livraison en 3 à 5 jours', '1 modification incluse'],
    cta: 'Choisir Starter',
  },
  {
    icon: Star, name: 'Pro', price: '990',
    sub: '+ maintenance 79€/mois',
    color: GOLD,
    desc: 'Pour aller plus loin avec les automatisations et la visibilité.',
    features: ['Tout le plan Starter', 'SEO avancé + contenu IA', 'Automatisation emails (4 étapes)', 'Posts réseaux sociaux programmés', 'Lead scoring automatique', 'Dashboard admin basique', 'Chatbot optionnel', '3 modifications incluses', 'Livraison en 5 à 7 jours'],
    cta: 'Choisir Pro', popular: true,
  },
  {
    icon: Crown, name: 'Premium', price: '1 990',
    sub: '+ maintenance 129€/mois',
    color: PURPLE,
    desc: 'Solution complète pour gérer, vendre et automatiser.',
    features: ['Tout le plan Pro', 'Dashboard admin complet', 'Support client intégré (tickets)', 'Commerce / paiements en ligne', 'Crédits IA mensuels inclus', 'Marque blanche possible', 'Intervention humaine incluse', 'WhatsApp scripts', 'Modifications illimitées (1 mois)', 'Livraison en 7 à 14 jours'],
    cta: 'Choisir Premium',
  },
];

const extras = [
  { label: 'Recharge crédits IA', price: '29€', desc: '100 crédits supplémentaires' },
  { label: 'Maintenance mensuelle', price: 'à partir de 49€', desc: 'Mises à jour, sécurité, support' },
  { label: 'Intervention manuelle', price: '49€/h', desc: 'Modification, ajout de page, debug' },
  { label: 'Page supplémentaire', price: '99€', desc: 'Design + SEO + intégration' },
  { label: 'Chatbot IA', price: '149€', desc: 'Configuration et formation IA' },
  { label: 'Marque blanche', price: 'Sur devis', desc: 'Dashboard + emails rebrandés' },
];

export default function WebOSOffre() {
  return (
    <div className="min-h-screen px-4 pt-10 pb-24 relative" style={{ color: 'white' }}>
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[160px] opacity-12"
          style={{ background: `radial-gradient(circle, ${GOLD}, transparent)` }} />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-[130px] opacity-10"
          style={{ background: `radial-gradient(circle, ${PURPLE}, transparent)` }} />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-5 text-xs font-bold tracking-widest uppercase"
              style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid rgba(212,175,55,0.28)`, color: GOLD }}>
              <Sparkles className="w-3 h-3" /> Offres & Tarifs
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Créez votre site,{' '}
              <span style={{
                background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L}, ${PURPLE})`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
              }}>votre business</span>
            </h1>
            <p className="text-base max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.42)' }}>
              Prix fixes, livraison rapide, résultats garantis.
            </p>
          </div>
        </Reveal>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.1}>
              <motion.div whileHover={{ y: -10 }} transition={{ duration: 0.2 }}
                className="relative p-7 rounded-3xl flex flex-col h-full overflow-hidden"
                style={{
                  background: plan.popular ? `rgba(212,175,55,0.06)` : 'rgba(10,8,22,0.85)',
                  border: plan.popular ? `1px solid rgba(212,175,55,0.4)` : `1px solid ${plan.color}22`,
                  boxShadow: plan.popular ? `0 0 60px rgba(212,175,55,0.1)` : 'none'
                }}>
                {/* Top line */}
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${plan.color}80, transparent)` }} />
                {/* Corner glow */}
                <div className="absolute top-0 right-0 w-20 h-20 pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${plan.color}15, transparent 70%)` }} />

                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-black text-black"
                    style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, boxShadow: `0 0 20px rgba(212,175,55,0.4)` }}>
                    ⭐ Populaire
                  </div>
                )}

                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${plan.color}15`, border: `1px solid ${plan.color}30` }}>
                  <plan.icon className="w-6 h-6" style={{ color: plan.color }} />
                </div>
                <h3 className="text-xl font-black text-white mb-1">{plan.name}</h3>
                <p className="text-xs mb-5" style={{ color: 'rgba(255,255,255,0.38)' }}>{plan.desc}</p>
                <div className="mb-1">
                  <span className="text-4xl font-black" style={{ color: plan.color }}>{plan.price}€</span>
                </div>
                <p className="text-xs mb-6" style={{ color: 'rgba(255,255,255,0.28)' }}>{plan.sub}</p>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: plan.color }} /> {f}
                    </li>
                  ))}
                </ul>
                <Link to={`/webos-contact?plan=${plan.name}`}>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    className="w-full py-3.5 rounded-2xl font-black text-sm"
                    style={plan.popular
                      ? { background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, color: '#000', boxShadow: `0 0 25px rgba(212,175,55,0.3)` }
                      : { background: `${plan.color}15`, color: plan.color, border: `1px solid ${plan.color}30` }}>
                    {plan.cta}
                  </motion.button>
                </Link>
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* Extras */}
        <Reveal>
          <div className="mb-16">
            <h2 className="text-2xl font-black text-white mb-8 text-center">
              <span style={{ color: GOLD }}>Options</span> supplémentaires
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {extras.map((e, i) => (
                <motion.div key={e.label}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="p-5 rounded-2xl flex items-center justify-between"
                  style={{ background: 'rgba(10,8,22,0.8)', border: `1px solid rgba(212,175,55,0.12)` }}>
                  <div>
                    <div className="font-bold text-white text-sm">{e.label}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.32)' }}>{e.desc}</div>
                  </div>
                  <span className="font-black text-sm whitespace-nowrap ml-3" style={{ color: GOLD }}>{e.price}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal>
          <div className="relative text-center p-10 rounded-3xl overflow-hidden"
            style={{ background: 'rgba(10,8,22,0.95)', border: `1px solid rgba(212,175,55,0.25)`, boxShadow: '0 0 60px rgba(212,175,55,0.07)' }}>
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, ${PURPLE}, transparent)` }} />
            <div className="absolute top-0 left-0 w-28 h-28"
              style={{ background: `radial-gradient(circle, ${GOLD}15, transparent 70%)` }} />
            <div className="absolute bottom-0 right-0 w-28 h-28"
              style={{ background: `radial-gradient(circle, ${CYAN}15, transparent 70%)` }} />
            <div className="relative z-10">
              <h2 className="text-2xl font-black text-white mb-3">Vous ne savez pas quel plan choisir ?</h2>
              <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.42)' }}>
                Décrivez votre projet, <span style={{ color: GOLD }}>Julien</span> vous oriente personnellement en moins de 24h.
              </p>
              <Link to="/webos-contact">
                <motion.button whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(212,175,55,0.45)' }} whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-black"
                  style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, boxShadow: `0 0 30px rgba(212,175,55,0.3)` }}>
                  <Zap className="w-5 h-5" /> Demander une orientation gratuite
                </motion.button>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}