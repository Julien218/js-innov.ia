import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Check, Sparkles, ArrowRight, Shield, Zap, Crown, Star, Rocket, ChevronDown, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { SERVICE_PACKS, formatEuro } from '@/config/catalog';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const PURPLE = '#7C3AED';

function Reveal({ children, delay = 0, y = 30 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

const PLAN_PRESENTATION = {
  starter: {
    icon: Rocket,
    glow: 'rgba(6,182,212,0.22)',
    tagline: 'Une présence web professionnelle.',
    idealFor: ['Indépendants', 'Commerces locaux', 'Associations', 'Activités en lancement'],
    note: 'Projet livré selon un périmètre confirmé dans le devis.',
    cta: 'Demander le pack Starter',
  },
  business: {
    icon: Star,
    glow: 'rgba(212,175,55,0.32)',
    tagline: 'Un système complet pour acquérir des clients.',
    idealFor: ['PME', 'Commerces actifs', 'Horeca', 'Entreprises en croissance'],
    note: 'Le suivi mensuel est distinct du prix de création initial.',
    cta: 'Demander le pack Business',
  },
  automation: {
    icon: Crown,
    glow: 'rgba(124,58,237,0.28)',
    tagline: 'Automatiser les opérations répétitives.',
    idealFor: ['Équipes', 'Projets multi-outils', 'Processus métier', 'Besoins sur mesure'],
    note: 'Les API, crédits IA et services tiers sont chiffrés séparément.',
    cta: 'Étudier mon automatisation',
  },
};

const PLANS = SERVICE_PACKS.map((pack) => ({
  ...pack,
  ...PLAN_PRESENTATION[pack.id],
}));

const FAQS = [
  { q: 'Comment choisir le bon pack ?', a: "Starter couvre une présence web professionnelle. Business ajoute l’acquisition, le chatbot et le CRM. Automation cible les processus métier et les intégrations sur mesure. Nous validons le bon périmètre avant le devis." },
  { q: 'S’agit-il d’un abonnement ?', a: "Non pour la création initiale : le montant « à partir de » correspond au projet. La maintenance ou la supervision mensuelle est affichée séparément et n’est activée qu’avec votre accord." },
  { q: 'Les prix sont-ils fixes ?', a: "Ce sont des prix de départ hors TVA. Le tarif final dépend du nombre de pages, des intégrations, des contenus, des délais et des services tiers nécessaires. Le devis fixe le périmètre avant tout démarrage." },
  { q: 'Les coûts d’IA et les outils externes sont-ils inclus ?', a: "Uniquement lorsqu’ils sont explicitement inscrits dans le devis. Les crédits LLM, API, hébergement, nom de domaine, publicité, générateurs vidéo et autres abonnements tiers sont suivis séparément." },
  { q: 'Que comprend le suivi mensuel ?', a: "Selon le pack : maintenance, sécurité, corrections, support, suivi technique ou supervision des automatisations. Les créations vidéo, campagnes publicitaires et développements supplémentaires restent des prestations distinctes." },
];

export default function Pricing() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen" style={{ color: 'white' }}>

      {/* HERO */}
      <section className="pt-20 pb-16 px-5 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.07, 0.13, 0.07] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[420px] blur-[130px] rounded-full"
            style={{ background: `radial-gradient(ellipse, ${GOLD}38, transparent 70%)` }}
          />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6 text-xs font-bold tracking-widest uppercase"
            style={{ background: 'rgba(212,175,55,0.07)', border: `1px solid rgba(212,175,55,0.28)`, color: GOLD }}>
            <Sparkles className="w-3.5 h-3.5" /> Tarifs 2026 · Projets et suivi séparés
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.8 }}
            className="text-4xl md:text-6xl font-black mb-5 leading-tight font-cinzel">
            <span className="text-white">Ce que vous payez,</span>{' '}
            <span style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L}, ${PURPLE})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              c'est votre croissance.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-lg leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.42)' }}>
            Des prix de départ lisibles pour la création de votre projet, puis un suivi mensuel optionnel clairement séparé.
          </motion.p>
        </div>
      </section>

      {/* PLANS */}
      <section className="px-5 pb-24 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.id} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -8, scale: 1.015 }}
                transition={{ duration: 0.28 }}
                className="relative rounded-3xl p-8 flex flex-col h-full overflow-hidden"
                style={{
                  background: plan.popular
                    ? `linear-gradient(145deg, rgba(212,175,55,0.09), rgba(124,58,237,0.06))`
                    : 'rgba(8,6,20,0.88)',
                  border: `1px solid ${plan.color}${plan.popular ? '44' : '1e'}`,
                  boxShadow: plan.popular ? `0 0 70px ${plan.glow}` : 'none',
                }}>

                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${plan.color}70, transparent)` }} />

                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                      animate={{ boxShadow: [`0 0 12px ${GOLD}55`, `0 0 28px ${GOLD}88`, `0 0 12px ${GOLD}55`] }}
                      transition={{ duration: 2.2, repeat: Infinity }}
                      className="px-5 py-1.5 rounded-full text-xs font-black text-black"
                      style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>
                      Le plus rentable
                    </motion.div>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${plan.color}11`, border: `1px solid ${plan.color}28` }}>
                    <plan.icon className="w-6 h-6" style={{ color: plan.color }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">{plan.name}</h3>
                    <p className="text-xs font-semibold" style={{ color: plan.color }}>{plan.tagline}</p>
                  </div>
                </div>

                <p className="text-sm mb-6 leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {plan.description}
                </p>

                <div className="mb-6">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>Création du projet · à partir de</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black" style={{ color: plan.color }}>{formatEuro(plan.price)}</span>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.28)' }}>HTVA</span>
                  </div>
                  <p className="mt-2 text-xs font-bold" style={{ color: plan.color }}>{plan.recurringLabel} · optionnel</p>
                </div>

                <div className="mb-5 p-3 rounded-xl" style={{ background: `${plan.color}08`, border: `1px solid ${plan.color}14` }}>
                  <p className="text-xs font-bold mb-2 uppercase tracking-widest" style={{ color: plan.color }}>Ideal pour</p>
                  <div className="flex flex-wrap gap-1.5">
                    {plan.idealFor.map((item) => (
                      <span key={item} className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: `${plan.color}10`, color: 'rgba(255,255,255,0.55)', border: `1px solid ${plan.color}18` }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: `${plan.color}16`, border: `1px solid ${plan.color}32` }}>
                        <Check className="w-2.5 h-2.5" style={{ color: plan.color }} />
                      </div>
                      <span className="text-sm leading-snug" style={{ color: 'rgba(255,255,255,0.68)' }}>{f}</span>
                    </div>
                  ))}
                </div>

                <p className="text-xs mb-5 leading-relaxed italic" style={{ color: 'rgba(255,255,255,0.26)' }}>
                  {plan.note}
                </p>

                <Link to={createPageUrl('Contact')}>
                  <motion.button
                    whileHover={{ scale: 1.03, boxShadow: `0 0 28px ${plan.glow}` }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all"
                    style={plan.popular
                      ? { background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, color: '#000' }
                      : { background: `${plan.color}10`, color: plan.color, border: `1px solid ${plan.color}28` }}>
                    {plan.cta} <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            {[
              { icon: Shield, title: 'Pas de surprise', desc: 'Offre claire avant de demarrer. Zero frais cache.' },
              { icon: Zap, title: 'Evolution facile', desc: 'Changez de pack a tout moment selon votre croissance.' },
              { icon: MessageCircle, title: 'On en parle d\'abord', desc: 'Un appel gratuit pour trouver le bon pack ensemble.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3 p-4 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
                  <Icon className="w-4 h-4" style={{ color: GOLD }} />
                </div>
                <div>
                  <p className="font-bold text-sm text-white mb-0.5">{title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="px-5 pb-24 max-w-6xl mx-auto">
        <Reveal>
          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-7 md:p-9">
            <p className="text-xs font-black uppercase tracking-[0.18em]" style={{ color: GOLD }}>Ce que cette page chiffre réellement</p>
            <h2 className="mt-3 text-2xl font-black text-white md:text-3xl">Les prestations JS‑Innov.IA, sans mélanger projet et consommation.</h2>
            <div className="mt-7 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-white/8 bg-black/20 p-5">
                <p className="font-black text-white">Inclus dans le projet</p>
                <p className="mt-2 text-sm leading-relaxed text-white/45">Conception, réalisation, configuration et livraison des éléments décrits dans le devis.</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/20 p-5">
                <p className="font-black text-white">Suivi optionnel</p>
                <p className="mt-2 text-sm leading-relaxed text-white/45">Maintenance, support ou supervision récurrente, affichés séparément du coût initial.</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/20 p-5">
                <p className="font-black text-white">Chiffré séparément</p>
                <p className="mt-2 text-sm leading-relaxed text-white/45">TVA, API et crédits IA, hébergement, domaines, publicité, production vidéo, diffusion écran, HainoFlow et abonnements tiers.</p>
              </div>
            </div>
            <div className="mt-7 flex flex-wrap gap-3 text-sm font-bold">
              <Link to={createPageUrl('CreativeStudio')} className="rounded-full border border-white/15 px-5 py-3 text-white/75 transition hover:border-white/30 hover:text-white">Voir les créations et vidéos</Link>
              <Link to={createPageUrl('Contact')} className="rounded-full border border-white/15 px-5 py-3 text-white/75 transition hover:border-white/30 hover:text-white">Demander un chiffrage précis</Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="px-5 pb-24 max-w-3xl mx-auto">
        <Reveal>
          <h2 className="text-3xl font-black text-center mb-10 font-cinzel"
            style={{ background: `linear-gradient(135deg, #fff, ${GOLD})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Questions frequentes
          </h2>
        </Reveal>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <motion.div
                className="rounded-2xl overflow-hidden cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${openFaq === i ? 'rgba(212,175,55,0.28)' : 'rgba(255,255,255,0.07)'}` }}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className="flex items-center justify-between p-5">
                  <span className="font-semibold text-sm text-white pr-4">{faq.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.25 }}>
                    <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: GOLD }} />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                      <p className="px-5 pb-5 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="px-5 pb-24 max-w-2xl mx-auto text-center">
        <Reveal>
          <div className="p-10 rounded-3xl relative overflow-hidden"
            style={{ background: 'linear-gradient(145deg, rgba(212,175,55,0.07), rgba(124,58,237,0.05))', border: '1px solid rgba(212,175,55,0.18)' }}>
            <div className="absolute inset-0 pointer-events-none">
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.06, 0.12, 0.06] }}
                transition={{ duration: 7, repeat: Infinity }}
                className="absolute inset-0 blur-[80px] rounded-3xl"
                style={{ background: `radial-gradient(ellipse, ${GOLD}28, transparent 70%)` }}
              />
            </div>
            <div className="relative z-10">
              <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: GOLD }}>Pas encore decide ?</p>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-3 font-cinzel">On en parle — sans engagement.</h3>
              <p className="text-sm leading-relaxed mb-7" style={{ color: 'rgba(255,255,255,0.38)' }}>
                Un appel de 20 minutes suffit pour savoir exactement quel pack vous correspond et comment on peut faire grandir votre activite.
              </p>
              <Link to={createPageUrl('Contact')}>
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: `0 0 40px rgba(212,175,55,0.25)` }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-4 rounded-2xl font-black text-sm text-black flex items-center gap-2 mx-auto"
                  style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>
                  Parler a Julien <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

    </div>
  );
}
