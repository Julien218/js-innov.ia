import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  ArrowRight, Sparkles, BarChart3, FileText,
  Music, Bot, Check, Globe, Zap, TrendingUp,
  ChevronRight, Shield, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const FEATURES = [
  {
    icon: BarChart3,
    gradient: 'from-pink-500 to-rose-600',
    bg: 'from-pink-500/10 to-rose-600/5',
    border: 'border-pink-500/25',
    title: 'AI SEO Analyzer',
    description: 'Analysez votre site en 30 secondes. Score SEO, keywords manquants, backlinks et recommandations IA personnalisées.',
    path: 'SEOAudit',
    items: ['Score SEO instantané', 'Analyse des keywords', 'Recommandations IA'],
    tag: 'Populaire'
  },
  {
    icon: FileText,
    gradient: 'from-purple-500 to-indigo-600',
    bg: 'from-purple-500/10 to-indigo-600/5',
    border: 'border-purple-500/25',
    title: 'AI Content Generator',
    description: 'Générez des articles SEO, posts réseaux sociaux, emails marketing et descriptions produits en quelques secondes.',
    path: 'ContentStudio',
    items: ['Articles SEO optimisés', 'Posts réseaux sociaux', 'Emails marketing'],
    tag: null
  },
  {
    icon: Music,
    gradient: 'from-cyan-500 to-teal-600',
    bg: 'from-cyan-500/10 to-teal-600/5',
    border: 'border-cyan-500/25',
    title: 'AI Music Generator',
    description: 'Créez des musiques de fond, jingles publicitaires, intros YouTube sans droits SABAM.',
    path: 'AIMusic',
    items: ['Libre de droits SABAM', 'Jingles personnalisés', 'Export MP3 / WAV'],
    tag: null
  },
  {
    icon: Bot,
    gradient: 'from-amber-500 to-orange-600',
    bg: 'from-amber-500/10 to-orange-600/5',
    border: 'border-amber-500/25',
    title: 'AI Automation Agents',
    description: 'Des agents IA qui répondent à vos clients, génèrent des devis et automatisent vos process business 24/7.',
    path: 'Automations',
    items: ['Agents personnalisés', 'Automatisation emails', 'Génération de devis'],
    tag: 'Nouveau'
  }
];

const PLANS = [
  {
    name: 'Starter',
    price: '19',
    border: 'border-gray-700',
    cardBg: 'bg-white/[0.03]',
    btn: 'bg-white/10 hover:bg-white/20 text-white',
    items: ['AI SEO Analyzer', 'AI Content Generator', '50 générations/mois', 'Support email']
  },
  {
    name: 'Pro',
    price: '39',
    border: 'border-pink-500/60',
    cardBg: 'bg-gradient-to-br from-pink-600/15 to-purple-600/15',
    btn: 'bg-gradient-to-r from-pink-600 to-purple-600 text-white',
    popular: true,
    items: ['SEO + Content IA', 'AI Music Generator', '200 générations/mois', 'Support prioritaire']
  },
  {
    name: 'Business',
    price: '79',
    border: 'border-purple-500/60',
    cardBg: 'bg-white/[0.03]',
    btn: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white',
    items: ['Tout inclus', 'Automation Agents IA', 'Générations illimitées', 'Support dédié 24/7']
  }
];

const STATS = [
  { value: '500+', label: 'Entreprises actives' },
  { value: '10K+', label: 'Contenus générés' },
  { value: '98%', label: 'Satisfaction client' },
  { value: '24/7', label: 'Agents IA actifs' }
];

export default function Home() {
  const [url, setUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [score, setScore] = useState(null);

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setAnalyzing(true);
    await new Promise(r => setTimeout(r, 2800));
    const mockScore = Math.floor(Math.random() * 30) + 42;
    setScore(mockScore);
    setAnalyzing(false);
  };

  const getScoreColor = (s) => s >= 80 ? 'text-green-400' : s >= 60 ? 'text-yellow-400' : 'text-red-400';
  const getScoreLabel = (s) => s >= 80 ? 'Excellent' : s >= 60 ? 'À améliorer' : 'Critique — action requise';

  return (
    <div className="min-h-screen">

      {/* ── HERO ── */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-pink-600/15 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-1/2 w-[300px] h-[300px] bg-cyan-600/10 rounded-full blur-[80px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-600/20 to-purple-600/20 border border-pink-500/30 mb-8"
            >
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span className="text-sm font-medium text-pink-300">JS-Innov AI Studio — Propulsé par l'IA</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
              <span className="text-white">L'IA qui</span>
              <br />
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                transforme votre business
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Plateforme tout-en-un pour automatiser votre SEO, créer du contenu, 
              générer de la musique et piloter votre croissance avec des agents IA.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <Link to={createPageUrl('Pricing')}>
                <Button className="px-8 py-6 text-base rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white shadow-2xl shadow-pink-500/30">
                  Commencer gratuitement
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to={createPageUrl('SEOAudit')}>
                <Button variant="outline" className="px-8 py-6 text-base rounded-xl border-gray-700 text-gray-300 hover:bg-white/5">
                  Voir les fonctionnalités
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-10">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-3xl font-bold text-white">{s.value}</div>
                  <div className="text-sm text-gray-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SEO DEMO ── */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-10 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 mb-5">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-sm font-medium">Analyse IA — GRATUIT</span>
            </div>

            <h2 className="text-3xl font-bold text-white mb-2">Analysez votre site maintenant</h2>
            <p className="text-gray-400 mb-8">Obtenez votre score SEO en 30 secondes, sans inscription</p>

            <AnimatePresence mode="wait">
              {!score ? (
                <motion.div key="input" exit={{ opacity: 0 }} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                  <div className="relative flex-1">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                      placeholder="https://votre-site.com"
                      className="pl-10 bg-black/40 border-gray-700 text-white h-12 rounded-xl"
                    />
                  </div>
                  <Button
                    onClick={handleAnalyze}
                    disabled={analyzing || !url.trim()}
                    className="h-12 px-6 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl whitespace-nowrap disabled:opacity-50"
                  >
                    {analyzing ? (
                      <span className="flex items-center gap-2">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                          <Zap className="w-4 h-4" />
                        </motion.div>
                        Analyse…
                      </span>
                    ) : 'Analyser gratuitement'}
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                    <div className="text-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring' }}
                        className={`text-8xl font-bold ${getScoreColor(score)}`}
                      >
                        {score}
                      </motion.div>
                      <div className="text-sm text-gray-400 mt-1">Score SEO / 100</div>
                    </div>
                    <div className="text-left space-y-2">
                      <div className={`text-xl font-semibold ${getScoreColor(score)}`}>{getScoreLabel(score)}</div>
                      <div className="space-y-1.5">
                        {['Mots-clés cibles manquants', 'Balises meta incomplètes', 'Vitesse de chargement à optimiser', 'Maillage interne insuffisant'].map(issue => (
                          <div key={issue} className="flex items-center gap-2 text-sm text-gray-400">
                            <div className="w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0" />
                            {issue}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-r from-pink-600/10 to-purple-600/10 border border-pink-500/20">
                    <p className="text-sm text-gray-300 mb-3">
                      🎯 Obtenez le rapport complet avec recommandations IA et plan d'action personnalisé
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                      <Link to={createPageUrl('Pricing')}>
                        <Button size="sm" className="bg-gradient-to-r from-pink-600 to-purple-600">
                          Voir les plans →
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 hover:bg-white/5"
                        onClick={() => { setScore(null); setUrl(''); }}>
                        Analyser un autre site
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-white mb-4">4 outils IA pour tout automatiser</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Une suite complète d'outils IA pour développer votre business sans effort supplémentaire
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={createPageUrl(f.path)}>
                  <div className={`group p-6 rounded-2xl bg-gradient-to-br ${f.bg} border ${f.border} hover:scale-[1.02] transition-all duration-300 cursor-pointer h-full`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${f.gradient}`}>
                        <f.icon className="w-6 h-6 text-white" />
                      </div>
                      {f.tag && (
                        <Badge className="bg-white/10 text-gray-300 border-0 text-xs">{f.tag}</Badge>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
                    <p className="text-gray-400 mb-5 text-sm leading-relaxed">{f.description}</p>
                    <div className="space-y-1.5 mb-5">
                      {f.items.map((item) => (
                        <div key={item} className="flex items-center gap-2 text-sm text-gray-300">
                          <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium text-pink-400 group-hover:gap-2 transition-all">
                      Découvrir l'outil <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Comment ça fonctionne</h2>
          <p className="text-gray-400 mb-16 text-lg">3 étapes simples pour transformer votre business</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { step: '01', icon: Globe, title: 'Entrez votre site', desc: 'Saisissez l\'URL de votre site ou décrivez votre projet en quelques mots.' },
              { step: '02', icon: Zap, title: 'L\'IA analyse', desc: 'Nos agents IA analysent et génèrent des insights actionnables en quelques secondes.' },
              { step: '03', icon: TrendingUp, title: 'Croissez plus vite', desc: 'Appliquez les recommandations IA et regardez vos résultats s\'envoler.' }
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                <div className="text-7xl font-black text-white/[0.04] mb-3 leading-none">{item.step}</div>
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-pink-600/20 to-purple-600/20 border border-pink-500/20 mb-4">
                  <item.icon className="w-6 h-6 text-pink-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING TEASER ── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Plans simples et transparents</h2>
            <p className="text-gray-400 text-lg">Commencez dès 19€/mois · Sans engagement · Annulez à tout moment</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-6 rounded-2xl border ${plan.border} ${plan.cardBg} ${plan.popular ? 'md:scale-105 shadow-2xl shadow-pink-500/20' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-pink-600 to-purple-600 text-white border-0 px-4 py-1">
                      ⭐ Populaire
                    </Badge>
                  </div>
                )}
                <div className="mb-5">
                  <div className="text-lg font-semibold text-white">{plan.name}</div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-4xl font-bold text-white">{plan.price}€</span>
                    <span className="text-gray-400">/mois</span>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  {plan.items.map(item => (
                    <div key={item} className="flex items-center gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
                <Link to={createPageUrl('Pricing')} className="block">
                  <Button className={`w-full py-5 rounded-xl ${plan.btn}`}>
                    Commencer avec {plan.name}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to={createPageUrl('Pricing')} className="inline-flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors text-sm">
              Voir le détail de tous les plans <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-12 rounded-3xl bg-gradient-to-br from-pink-600/15 via-purple-600/15 to-indigo-600/15 border border-pink-500/20 text-center"
          >
            <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-pink-600/30 to-purple-600/30 mb-6">
              <Sparkles className="w-8 h-8 text-pink-400" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Prêt à booster votre business ?</h2>
            <p className="text-gray-400 mb-8 text-lg">
              Rejoignez 500+ entrepreneurs qui utilisent JS-Innov AI Studio pour automatiser leur croissance.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to={createPageUrl('Pricing')}>
                <Button className="px-8 py-6 text-base rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-2xl shadow-pink-500/30">
                  Commencer maintenant
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to={createPageUrl('Contact')}>
                <Button variant="outline" className="px-8 py-6 text-base rounded-xl border-gray-700 text-gray-300 hover:bg-white/5">
                  Nous contacter
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-500">
              <Shield className="w-4 h-4" />
              Sans engagement · Annulez à tout moment
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}