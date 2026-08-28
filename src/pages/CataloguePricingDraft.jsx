import { motion } from 'framer-motion';
import {
  BadgeEuro,
  Bot,
  Check,
  FileText,
  Globe,
  Layers3,
  LockKeyhole,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { HAINOFLOW_PLANS, SERVICE_PACKS, formatEuro } from '@/config/catalog';
import { useDraftPageMeta } from '@/lib/useDraftPageMeta';

const GOLD = '#D4AF37';
const GOLD_LIGHT = '#F5CF41';
const CYAN = '#06B6D4';

const PACK_ICONS = {
  globe: Globe,
  'trending-up': TrendingUp,
  zap: Zap,
};

function DraftBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-amber-200">
      <LockKeyhole className="h-3.5 w-3.5" /> Brouillon interne — non publié
    </div>
  );
}

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

export default function CataloguePricingDraft() {
  useDraftPageMeta('Brouillon interne — Catalogue JS‑Innov.IA');

  return (
    <main className="min-h-screen px-5 pb-24 pt-14 text-white">
      <section className="mx-auto max-w-6xl text-center">
        <DraftBadge />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-yellow-300/20 bg-yellow-300/10">
            <BadgeEuro className="h-8 w-8" style={{ color: GOLD_LIGHT }} />
          </div>
          <h1 className="mt-6 text-4xl font-black md:text-6xl">Catalogue tarifaire 2026</h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/50 md:text-lg">
            Deux familles distinctes : les prestations JS‑Innov.IA vendues comme projets, et HainoFlow vendu comme logiciel autonome ou comme option avantageuse dans un pack.
          </p>
        </motion.div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest" style={{ color: GOLD }}>
              <Layers3 className="h-4 w-4" /> Prestations JS‑Innov.IA
            </div>
            <h2 className="mt-2 text-3xl font-black">Création, acquisition et automatisation</h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-white/40">
            Trois packs confirmés, exprimés hors TVA. Le périmètre exact, les délais et les options restent validés dans le devis.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {SERVICE_PACKS.map((pack, index) => {
            const PackIcon = PACK_ICONS[pack.icon];
            return (
            <motion.article
              key={pack.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="relative overflow-hidden rounded-3xl border p-7"
              style={{ background: 'rgba(10,8,22,0.88)', borderColor: `${pack.color}2f` }}
            >
              <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${pack.color}, transparent)` }} />
              {pack.popular && (
                <span className="absolute right-5 top-5 rounded-full px-3 py-1 text-[10px] font-black uppercase text-black" style={{ background: GOLD_LIGHT }}>
                  Recommandé
                </span>
              )}
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: `${pack.color}14`, border: `1px solid ${pack.color}30` }}>
                  <PackIcon className="h-6 w-6" style={{ color: pack.color }} />
                </div>
                <h3 className="text-xl font-black">{pack.name}</h3>
              </div>
              <p className="mt-5 min-h-12 text-sm leading-relaxed text-white/48">{pack.description}</p>
              <div className="my-6 rounded-2xl border border-white/5 bg-white/[0.025] p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">À partir de</p>
                <p className="mt-1 text-3xl font-black" style={{ color: pack.color }}>{formatEuro(pack.price)}</p>
                <p className="mt-1 text-[11px] text-white/30">HTVA · périmètre confirmé par devis</p>
              </div>
              <FeatureList features={pack.features} color={pack.color} />
              <div className="mt-6 rounded-xl px-4 py-3 text-xs font-bold" style={{ color: pack.color, background: `${pack.color}0c` }}>
                {pack.recurringLabel}
              </div>
            </motion.article>
          )})}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest" style={{ color: CYAN }}>
            <FileText className="h-4 w-4" /> HainoFlow
          </div>
          <h2 className="mt-2 text-3xl font-black">Facturation autonome ou intégrée</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/42">
            HainoFlow reste un produit indépendant. Le client peut aussi l’ajouter à son projet JS‑Innov.IA à un tarif groupé plus avantageux.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {HAINOFLOW_PLANS.map((plan, index) => (
            <motion.article
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="rounded-3xl border p-7"
              style={{ background: 'linear-gradient(145deg, rgba(10,8,22,.96), rgba(18,12,35,.82))', borderColor: `${plan.color}30` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest" style={{ color: plan.color }}>HainoFlow</p>
                  <h3 className="mt-1 text-2xl font-black">{plan.name}</h3>
                </div>
                <Bot className="h-7 w-7" style={{ color: plan.color }} />
              </div>
              <p className="mt-3 min-h-10 text-sm text-white/42">{plan.target}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-black" style={{ color: plan.color }}>{formatEuro(plan.monthlyPrice)}</span>
                <span className="text-sm text-white/35">/mois HTVA</span>
              </div>
              <p className="mt-2 text-xs text-white/35">ou {formatEuro(plan.yearlyPrice)}/an — deux mois offerts</p>
              <div className="my-6 rounded-2xl border p-4" style={{ borderColor: `${plan.color}25`, background: `${plan.color}0b` }}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/35">Ajouté à un pack</p>
                <p className="mt-1 text-xl font-black" style={{ color: plan.color }}>+ {formatEuro(plan.bundledMonthlyPrice)}/mois</p>
                <p className="mt-1 text-[11px] text-white/30">Tarif groupé non cumulable</p>
              </div>
              <FeatureList features={plan.features} color={plan.color} />
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl rounded-3xl border border-white/10 bg-white/[0.025] p-7 md:p-9">
        <div className="flex items-start gap-4">
          <Sparkles className="mt-1 h-6 w-6 shrink-0" style={{ color: GOLD }} />
          <div>
            <h2 className="text-lg font-black">Règles commerciales proposées</h2>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-white/50">
              <li>• Les tarifs sont exprimés hors TVA et restent « à partir de » tant que le périmètre n’est pas validé.</li>
              <li>• Le tarif HainoFlow groupé reste actif avec une maintenance JS‑Innov.IA, ou pendant les 12 premiers mois après l’achat d’un pack.</li>
              <li>• Les réductions annuelles et les réductions de pack ne sont pas cumulables.</li>
              <li>• Les partenariats, partages de revenus et offres réservées aux réseaux restent hors du catalogue public.</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
