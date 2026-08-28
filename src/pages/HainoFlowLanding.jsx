import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bot,
  Check,
  FileCheck2,
  Gauge,
  Layers3,
  ReceiptText,
  RefreshCcw,
  Sparkles,
  Workflow,
} from 'lucide-react';
import { HAINOFLOW_PLANS, formatEuro } from '@/config/catalog';
import { useDraftPageMeta } from '@/lib/useDraftPageMeta';

const NAVY = '#031238';
const NAVY_LIGHT = '#071F4C';
const GOLD = '#E7B14A';
const GOLD_LIGHT = '#FFDD89';
const CYAN = '#16D5FF';
const PURPLE = '#8449FF';

const capabilities = [
  { icon: ReceiptText, title: 'Facturer simplement', text: 'Créez devis et factures depuis une interface claire, pensée pour les indépendants et PME.' },
  { icon: RefreshCcw, title: 'Automatiser le suivi', text: 'Centralisez les échéances, relances et statuts pour réduire les oublis et accélérer les paiements.' },
  { icon: FileCheck2, title: 'Structurer les échanges', text: 'Préparez des documents structurés et des exports compatibles avec votre organisation comptable.' },
  { icon: Gauge, title: 'Piloter votre activité', text: 'Suivez les montants facturés, payés et en attente dans un tableau de bord lisible.' },
];

function FeatureList({ features, color }) {
  return (
    <div className="space-y-2.5">
      {features.map((feature) => (
        <div key={feature} className="flex items-start gap-2.5 text-sm text-white/65">
          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full" style={{ background: `${color}18` }}>
            <Check className="h-2.5 w-2.5" style={{ color }} />
          </span>
          {feature}
        </div>
      ))}
    </div>
  );
}

export default function HainoFlowLanding() {
  useDraftPageMeta('Aperçu HainoFlow — validation en cours');

  return (
    <main className="min-h-screen overflow-hidden text-white" style={{ background: `linear-gradient(180deg, ${NAVY}, ${NAVY_LIGHT} 48%, ${NAVY})`, fontFamily: 'Manrope, ui-sans-serif, system-ui, sans-serif' }}>
      <section className="relative px-5 pb-24 pt-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full blur-[140px]" style={{ background: 'rgba(6,182,212,0.12)' }} />
          <div className="absolute right-0 top-48 h-80 w-80 rounded-full blur-[120px]" style={{ background: 'rgba(139,92,246,0.12)' }} />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_.92fr]">
            <motion.div initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.16em]" style={{ color: CYAN, borderColor: `${CYAN}35`, background: `${CYAN}0b` }}>
                <Sparkles className="h-3.5 w-3.5" /> HainoFlow — by JS‑Innov.IA
              </div>
              <p className="mt-6 text-xs font-black uppercase tracking-[0.22em]" style={{ color: GOLD_LIGHT }}>Née dans le Hainaut. Conçue pour toute la Belgique.</p>
              <h1 className="mt-4 text-5xl font-black leading-[1.02] md:text-7xl" style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
                La facturation belge
                <span className="block" style={{ background: `linear-gradient(135deg, ${CYAN}, ${GOLD_LIGHT}, ${PURPLE})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  simple, fluide et humaine.
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/48">
                HainoFlow centralise les devis, factures, relances et indicateurs utiles. Utilisez-le seul ou connectez-le à votre site, votre chatbot et vos automatisations JS‑Innov.IA.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href="#tarifs" className="inline-flex items-center gap-2 rounded-2xl px-6 py-4 text-sm font-black text-black" style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})` }}>
                  Découvrir les formules <ArrowRight className="h-4 w-4" />
                </a>
                <Link to="/saas-contact" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-6 py-4 text-sm font-bold text-white/75">
                  Demander une démonstration
                </Link>
              </div>
              <p className="mt-7 text-sm font-black tracking-[0.16em]" style={{ color: GOLD_LIGHT }}>FACTUREZ. ENCAISSEZ. AVANCEZ.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.12 }} className="relative">
              <div className="absolute inset-8 rounded-full blur-[70px]" style={{ background: 'rgba(6,182,212,0.18)' }} />
              <div className="relative rounded-[2rem] border border-cyan-300/20 bg-[#090716]/90 p-6 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/7 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10"><Bot className="h-6 w-6 text-cyan-300" /></div>
                    <div><p className="font-black">Cockpit HainoFlow</p><p className="text-xs text-white/35">Facturation automatisée</p></div>
                  </div>
                  <span className="rounded-full bg-amber-300/10 px-3 py-1 text-xs font-bold text-amber-200">Aperçu</span>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {[
                    ['Facturé ce mois', '8 420 €', CYAN],
                    ['Paiements reçus', '6 980 €', '#34D399'],
                    ['À relancer', '1 140 €', GOLD_LIGHT],
                    ['Automatisations', '12 actives', PURPLE],
                  ].map(([label, value, color]) => (
                    <div key={label} className="rounded-2xl border border-white/6 bg-white/[0.025] p-4">
                      <p className="text-[11px] text-white/35">{label}</p>
                      <p className="mt-2 text-xl font-black" style={{ color }}>{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl border border-white/6 bg-white/[0.025] p-4">
                  <div className="flex items-center gap-3"><Workflow className="h-5 w-5 text-cyan-300" /><div><p className="text-sm font-bold">Relance automatique préparée</p><p className="text-xs text-white/35">3 factures arrivent à échéance</p></div></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {capabilities.map(({ icon: Icon, title, text }, index) => (
            <motion.article key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="rounded-3xl border border-white/8 bg-white/[0.025] p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10"><Icon className="h-5 w-5 text-cyan-300" /></div>
              <h2 className="mt-5 font-black">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/42">{text}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="tarifs" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: GOLD }}>Des tarifs simples</p>
          <h2 className="mt-3 text-4xl font-black" style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}>Choisissez votre niveau d’automatisation</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/42">Chaque abonnement peut être acheté seul. Un tarif groupé s’applique lorsque HainoFlow accompagne un pack JS‑Innov.IA.</p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {HAINOFLOW_PLANS.map((plan, index) => (
            <motion.article key={plan.id} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="rounded-3xl border p-7" style={{ borderColor: `${plan.color}30`, background: 'rgba(10,8,22,0.9)' }}>
              <p className="text-xs font-black uppercase tracking-widest" style={{ color: plan.color }}>HainoFlow</p>
              <h3 className="mt-1 text-2xl font-black">{plan.name}</h3>
              <p className="mt-3 min-h-10 text-sm text-white/40">{plan.target}</p>
              <div className="mt-6 flex items-baseline gap-1"><span className="text-4xl font-black" style={{ color: plan.color }}>{formatEuro(plan.monthlyPrice)}</span><span className="text-sm text-white/35">/mois HTVA</span></div>
              <p className="mt-2 text-xs text-white/35">ou {formatEuro(plan.yearlyPrice)}/an</p>
              <div className="my-6 rounded-2xl p-4" style={{ background: `${plan.color}0c`, border: `1px solid ${plan.color}20` }}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/35">Avec un pack JS‑Innov.IA</p>
                <p className="mt-1 text-xl font-black" style={{ color: plan.color }}>{formatEuro(plan.bundledMonthlyPrice)}/mois</p>
              </div>
              <FeatureList features={plan.features} color={plan.color} />
              <Link to="/saas-contact" className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-black" style={{ color: plan.color, background: `${plan.color}10`, border: `1px solid ${plan.color}28` }}>
                Choisir {plan.name} <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-24 pt-12">
        <div className="rounded-3xl border border-yellow-300/20 bg-yellow-300/[0.04] p-9 text-center">
          <Layers3 className="mx-auto h-8 w-8" style={{ color: GOLD }} />
          <h2 className="mt-4 text-2xl font-black">Déjà client JS‑Innov.IA ?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/45">Ajoutez HainoFlow depuis votre configuration : votre site, votre chatbot et votre facturation pourront travailler dans le même écosystème.</p>
          <Link to="/saas-contact" className="mt-6 inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-black text-black" style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})` }}>
            Ajouter HainoFlow <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
