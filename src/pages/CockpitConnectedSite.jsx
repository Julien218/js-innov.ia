import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Database,
  Globe2,
  Layers3,
  LineChart,
  MessageSquareText,
  MonitorCog,
  PlugZap,
  ShieldCheck,
  Sparkles,
  Workflow,
  Zap,
} from 'lucide-react';
import { sendToCockpit, getCockpitStatus } from '@/lib/cockpitClient';

const GOLD = '#D4AF37';
const GOLD_LIGHT = '#F5CF41';
const NIGHT = '#070710';
const CYAN = '#06B6D4';
const PURPLE = '#7C3AED';
const GREEN = '#22C55E';

const products = [
  {
    icon: MonitorCog,
    title: 'Cockpit IA local',
    tag: 'Produit signature',
    desc: 'Un centre de commande connecté au CRM, aux leads, aux projets, aux contenus, aux devis et aux automatisations.',
  },
  {
    icon: Bot,
    title: 'Agents IA métiers',
    tag: 'Modules vendables',
    desc: 'Agents pour assurances, commerces, restaurants, infirmiers, associations, communes et plateformes locales.',
  },
  {
    icon: Globe2,
    title: 'Sites web connectés',
    tag: 'Acquisition',
    desc: 'Landing pages, sites vitrines, e-commerce et mini SaaS branchés au cockpit pour transformer chaque visite en action.',
  },
  {
    icon: Workflow,
    title: 'Automatisations business',
    tag: 'Gain de temps',
    desc: 'Make, Supabase, GitHub, Railway, réseaux sociaux, emails, WhatsApp, tableaux de bord et relances automatiques.',
  },
  {
    icon: Sparkles,
    title: 'Contenus IA premium',
    tag: 'Visibilité',
    desc: 'Prompts, vidéos, vignettes, posts, scripts, voix off, campagnes TikTok, Facebook, LinkedIn et YouTube.',
  },
  {
    icon: Layers3,
    title: 'Brand system & SaaS',
    tag: 'Échelle',
    desc: 'ADN visuel, design system, packs premium, dashboards clients, offres récurrentes et espaces personnalisés.',
  },
];

const cockpitModules = [
  'CRM & pipeline commercial',
  'Création automatique de leads',
  'Brief IA enrichi',
  'Devis & packs vendables',
  'Planning contenus',
  'Suivi production',
  'Dashboard client',
  'Relances email / WhatsApp',
  'Bibliothèque prompts',
  'Synchronisation GitHub',
  'Automatisations Make / n8n',
  'IA locale Ollama / ComfyUI',
];

const offers = [
  {
    name: 'Starter Connecté',
    price: 'à partir de 490€',
    desc: 'Pour une présence propre et mesurable.',
    features: ['Landing page premium', 'Formulaire cockpit', 'CRM lead', '1 automatisation', 'Tracking conversion'],
  },
  {
    name: 'Business IA',
    price: 'à partir de 1.490€',
    desc: 'Pour vendre, suivre et relancer automatiquement.',
    features: ['Site complet', 'Cockpit client', 'Agent IA métier', 'Automatisations', 'Pack contenus 30 jours'],
    featured: true,
  },
  {
    name: 'SaaS Local OS',
    price: 'sur devis',
    desc: 'Pour communes, associations, réseaux ou plateformes.',
    features: ['Architecture SaaS', 'Multi-espaces', 'Base de données', 'Modules métiers', 'Déploiement GitHub/Railway'],
  },
];

function Badge({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white/60">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: GOLD }} />
      {children}
    </span>
  );
}

function SectionTitle({ eyebrow, title, children }) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center">
      <Badge>{eyebrow}</Badge>
      <h2 className="mt-5 text-3xl font-black leading-tight text-white md:text-5xl">{title}</h2>
      {children && <p className="mt-4 text-base leading-7 text-white/55 md:text-lg">{children}</p>}
    </div>
  );
}

function LeadForm() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    need: 'site-cockpit',
    budget: 'à définir',
    message: '',
  });

  const status = useMemo(() => getCockpitStatus(), []);

  const inputClass = 'w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#D4AF37]/60';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await sendToCockpit({
        type: 'lead_site_cockpit',
        priority: form.budget.includes('3000') || form.need.includes('saas') ? 'high' : 'normal',
        form,
      });
      setDone(true);
    } catch (err) {
      setError(err.message || 'Connexion cockpit impossible.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-[2rem] border border-emerald-400/20 bg-emerald-400/10 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12" style={{ color: GREEN }} />
        <h3 className="mt-4 text-2xl font-black text-white">Projet envoyé au cockpit.</h3>
        <p className="mt-3 text-sm leading-6 text-white/55">
          Le lead est capturé avec sa source, son contexte et son besoin. Mode actuel : {status}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl md:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-white">Créer un lead cockpit</h3>
          <p className="mt-1 text-sm text-white/45">Connexion : {status}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
          <PlugZap className="h-6 w-6" style={{ color: GOLD }} />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <input className={inputClass} required placeholder="Nom / prénom" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className={inputClass} required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className={inputClass} placeholder="Téléphone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input className={inputClass} placeholder="Entreprise / activité" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
        <select className={inputClass} value={form.need} onChange={(e) => setForm({ ...form, need: e.target.value })}>
          <option value="site-cockpit">Site connecté au cockpit</option>
          <option value="agent-ia">Agent IA métier</option>
          <option value="automation">Automatisation business</option>
          <option value="content-system">Système contenus IA</option>
          <option value="saas-local">Plateforme SaaS locale</option>
        </select>
        <select className={inputClass} value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })}>
          <option>à définir</option>
          <option>500€ - 1500€</option>
          <option>1500€ - 3000€</option>
          <option>3000€ - 6000€</option>
          <option>6000€ +</option>
        </select>
      </div>

      <textarea className={`${inputClass} mt-3 min-h-28 resize-none`} placeholder="Explique le projet, les outils à connecter, les réseaux, le CRM, le site ou le client visé…" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />

      {error && <p className="mt-3 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p>}

      <button disabled={loading} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-black text-black transition hover:scale-[1.01] disabled:opacity-60" style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})` }}>
        {loading ? 'Connexion au cockpit…' : 'Envoyer dans le cockpit'}
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}

export default function CockpitConnectedSite() {
  return (
    <main className="min-h-screen overflow-hidden" style={{ background: NIGHT, color: 'white' }}>
      <div className="pointer-events-none fixed inset-0 opacity-70" style={{ background: `radial-gradient(circle at 20% 10%, ${PURPLE}35, transparent 32%), radial-gradient(circle at 80% 20%, ${GOLD}24, transparent 28%), radial-gradient(circle at 50% 90%, ${CYAN}24, transparent 30%)` }} />

      <section className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-5 py-24 md:grid-cols-[1.1fr_0.9fr] md:px-8">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <Badge>JS-INNOV.IA · Cockpit Intelligent</Badge>
          <h1 className="mt-6 text-4xl font-black leading-[0.95] text-white md:text-7xl">
            Le site vitrine qui pilote tout ton business.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60 md:text-xl">
            JS-Innov.IA devient une plateforme commerciale connectée : chaque formulaire, projet, contenu, client et automatisation alimente ton cockpit IA local.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#lead" className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-black text-black" style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})` }}>
              Configurer un projet <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#produits" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-bold text-white/75">
              Voir les produits vendables
            </a>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
            {[
              ['24/7', 'automatisé'],
              ['1', 'cockpit central'],
              ['360°', 'site + IA + CRM'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="text-2xl font-black" style={{ color: GOLD }}>{value}</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-white/35">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.15 }} className="relative">
          <div className="rounded-[2rem] border border-white/10 bg-black/40 p-4 shadow-2xl backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <div>
                <div className="text-sm font-black text-white">Cockpit OS</div>
                <div className="text-xs text-white/35">Local IA · Supabase · GitHub · Make</div>
              </div>
              <span className="rounded-full px-3 py-1 text-xs font-black" style={{ background: `${GREEN}20`, color: GREEN }}>ONLINE</span>
            </div>
            <div className="grid gap-3">
              {[
                [BrainCircuit, 'Agent IA analyse le brief', 'Score potentiel : 92%'],
                [Database, 'Lead synchronisé CRM', 'Source : site JS-Innov.IA'],
                [LineChart, 'Pipeline commercial', 'Relance prévue automatiquement'],
                [MessageSquareText, 'Contenu généré', 'Email + post + devis brouillon'],
              ].map(([Icon, title, detail]) => (
                <div key={title} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="rounded-xl bg-white/5 p-3"><Icon className="h-5 w-5" style={{ color: GOLD }} /></div>
                  <div>
                    <div className="text-sm font-black text-white">{title}</div>
                    <div className="mt-1 text-xs text-white/35">{detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <section id="produits" className="relative mx-auto max-w-7xl px-5 py-20 md:px-8">
        <SectionTitle eyebrow="Offres vendables" title="Transformer tes qualités en produits clairs">
          Le site présente ton vrai positionnement : créatif, automatisation, IA locale, stratégie business et livraison concrète.
        </SectionTitle>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map(({ icon: Icon, title, tag, desc }) => (
            <div key={title} className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-[#D4AF37]/40">
              <div className="mb-5 flex items-center justify-between">
                <div className="rounded-2xl bg-white/5 p-3"><Icon className="h-6 w-6" style={{ color: GOLD }} /></div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-white/40">{tag}</span>
              </div>
              <h3 className="text-xl font-black text-white">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/50">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 py-20 md:px-8">
        <SectionTitle eyebrow="Architecture cockpit" title="Un site connecté à un système de production">
          La landing ne fait pas que vendre. Elle capture, classe, enrichit, déclenche et prépare la production.
        </SectionTitle>
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
          {cockpitModules.map((module) => (
            <div key={module} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 p-4">
              <CheckCircle2 className="h-5 w-5 flex-none" style={{ color: GREEN }} />
              <span className="text-sm font-semibold text-white/65">{module}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 py-20 md:px-8">
        <SectionTitle eyebrow="Packs commerciaux" title="Des offres simples à vendre">
          Chaque pack peut devenir une fiche produit dans ton cockpit avec suivi, statut, acompte, tâches et livrables.
        </SectionTitle>
        <div className="grid gap-5 lg:grid-cols-3">
          {offers.map((offer) => (
            <div key={offer.name} className={`rounded-[2rem] border p-6 ${offer.featured ? 'border-[#D4AF37]/50 bg-[#D4AF37]/10' : 'border-white/10 bg-white/[0.04]'}`}>
              {offer.featured && <div className="mb-4 inline-flex rounded-full bg-white px-3 py-1 text-xs font-black text-black">Recommandé</div>}
              <h3 className="text-2xl font-black text-white">{offer.name}</h3>
              <div className="mt-3 text-2xl font-black" style={{ color: GOLD }}>{offer.price}</div>
              <p className="mt-3 text-sm leading-6 text-white/50">{offer.desc}</p>
              <div className="mt-6 space-y-3">
                {offer.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-sm text-white/65">
                    <CheckCircle2 className="h-4 w-4" style={{ color: GREEN }} />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="lead" className="relative mx-auto grid max-w-7xl gap-10 px-5 py-24 md:grid-cols-[0.9fr_1.1fr] md:px-8">
        <div>
          <Badge>Connexion cockpit</Badge>
          <h2 className="mt-5 text-3xl font-black leading-tight text-white md:text-5xl">Chaque demande devient une action.</h2>
          <p className="mt-5 text-lg leading-8 text-white/55">
            Le formulaire envoie les données vers un webhook ou une API cockpit. Sans variable d’environnement, il sauvegarde en local pour éviter de perdre les tests.
          </p>
          <div className="mt-8 space-y-4">
            {[
              [Zap, 'Capture lead', 'Nom, contact, activité, besoin, budget et message.'],
              [Clock3, 'Relance intelligente', 'Le cockpit peut créer une tâche et préparer un message.'],
              [ShieldCheck, 'Mode local sécurisé', 'Aucune clé secrète dans le front. Les secrets restent côté cockpit.'],
            ].map(([Icon, title, desc]) => (
              <div key={title} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <Icon className="mt-1 h-5 w-5 flex-none" style={{ color: GOLD }} />
                <div>
                  <div className="font-black text-white">{title}</div>
                  <div className="mt-1 text-sm leading-6 text-white/45">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <LeadForm />
      </section>
    </main>
  );
}
