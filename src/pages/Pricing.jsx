import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Sparkles, Zap, Shield, ArrowRight, BarChart3, FileText, Music, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 19,
    description: 'Parfait pour démarrer avec l\'IA',
    border: 'border-gray-700',
    cardBg: 'bg-white/[0.03]',
    btn: 'bg-white/10 hover:bg-white/20 text-white border border-white/10',
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
    id: 'pro',
    name: 'Pro',
    price: 39,
    description: 'Pour les entrepreneurs ambitieux',
    border: 'border-pink-500/60',
    cardBg: 'bg-gradient-to-br from-pink-600/15 to-purple-600/15',
    btn: 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-500/30',
    popular: true,
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
    id: 'business',
    name: 'Business',
    price: 79,
    description: 'Pour les PME qui veulent tout automatiser',
    border: 'border-purple-500/60',
    cardBg: 'bg-white/[0.03]',
    btn: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white',
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

const TOOLS = [
  { icon: BarChart3, name: 'AI SEO Analyzer', starter: true, pro: true, business: true },
  { icon: FileText, name: 'AI Content Generator', starter: true, pro: true, business: true },
  { icon: Music, name: 'AI Music Generator', starter: false, pro: true, business: true },
  { icon: Bot, name: 'Automation Agents', starter: false, pro: false, business: true },
];

const FAQS = [
  { q: 'Puis-je annuler à tout moment ?', a: 'Oui, vous pouvez annuler votre abonnement à tout moment sans frais supplémentaires. Votre accès reste actif jusqu\'à la fin de la période payée.' },
  { q: 'Qu\'est-ce qu\'une génération ?', a: 'Une génération correspond à une création IA : un article, une analyse SEO complète, une musique ou un rapport automatisé.' },
  { q: 'Y a-t-il un essai gratuit ?', a: 'Oui, vous bénéficiez d\'une analyse SEO gratuite et sans inscription pour tester la qualité de nos outils IA.' },
  { q: 'Comment fonctionne la facturation ?', a: 'La facturation est mensuelle via Stripe, la plateforme de paiement la plus sécurisée au monde. Une facture est envoyée chaque mois.' },
  { q: 'Puis-je changer de plan ?', a: 'Oui, vous pouvez upgrader ou downgrader votre plan à tout moment depuis votre tableau de bord.' },
];

export default function Pricing() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-600/20 to-purple-600/20 border border-pink-500/30 mb-6">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span className="text-pink-300 text-sm font-medium">Tarifs simples et transparents</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Choisissez votre plan IA</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Commencez dès 19€/mois · Sans engagement · Annulez à tout moment
          </p>
        </motion.div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 items-start">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-8 rounded-3xl border ${plan.border} ${plan.cardBg} ${plan.popular ? 'md:-mt-4 shadow-2xl shadow-pink-500/20' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-pink-600 to-purple-600 text-white border-0 px-6 py-1.5 text-sm">
                    ⭐ Le plus populaire
                  </Badge>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                <p className="text-gray-400 text-sm mt-1">{plan.description}</p>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-5xl font-bold text-white">{plan.price}€</span>
                  <span className="text-gray-400">/mois</span>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <div key={f.text} className="flex items-center gap-3">
                    {f.ok ? (
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-green-400" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                        <X className="w-3 h-3 text-gray-600" />
                      </div>
                    )}
                    <span className={`text-sm ${f.ok ? 'text-gray-300' : 'text-gray-600 line-through'}`}>
                      {f.text}
                    </span>
                  </div>
                ))}
              </div>

              <Link to={createPageUrl('Contact')}>
                <Button className={`w-full py-6 rounded-xl font-semibold text-base ${plan.btn}`}>
                  Commencer avec {plan.name}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Feature comparison table */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20 p-8 rounded-3xl bg-white/[0.02] border border-gray-800"
        >
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Comparatif des outils IA</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-4 pr-8 text-gray-400 font-medium text-sm">Outil</th>
                  <th className="text-center py-4 px-4 text-gray-400 font-medium text-sm">Starter</th>
                  <th className="text-center py-4 px-4 text-pink-400 font-semibold text-sm">Pro</th>
                  <th className="text-center py-4 px-4 text-purple-400 font-medium text-sm">Business</th>
                </tr>
              </thead>
              <tbody>
                {TOOLS.map((tool) => (
                  <tr key={tool.name} className="border-b border-gray-800/50">
                    <td className="py-4 pr-8">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-white/5">
                          <tool.icon className="w-4 h-4 text-gray-400" />
                        </div>
                        <span className="text-gray-300 text-sm">{tool.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {tool.starter ? <Check className="w-5 h-5 text-green-400 mx-auto" /> : <X className="w-4 h-4 text-gray-700 mx-auto" />}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {tool.pro ? <Check className="w-5 h-5 text-green-400 mx-auto" /> : <X className="w-4 h-4 text-gray-700 mx-auto" />}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {tool.business ? <Check className="w-5 h-5 text-green-400 mx-auto" /> : <X className="w-4 h-4 text-gray-700 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Guarantees */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            { icon: Shield, title: 'Sans engagement', desc: 'Annulez quand vous voulez, sans frais ni question.' },
            { icon: Zap, title: 'Accès immédiat', desc: 'Tous les outils IA disponibles dès votre inscription.' },
            { icon: Sparkles, title: 'Mises à jour incluses', desc: 'Nouvelles fonctionnalités IA incluses automatiquement.' }
          ].map((g) => (
            <div key={g.title} className="flex items-start gap-4 p-6 rounded-2xl bg-white/[0.03] border border-gray-800">
              <div className="p-2 rounded-lg bg-gradient-to-br from-pink-600/20 to-purple-600/20 flex-shrink-0">
                <g.icon className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                <div className="font-semibold text-white mb-1">{g.title}</div>
                <div className="text-sm text-gray-400">{g.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-10">Questions fréquentes</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white/[0.03] border border-gray-800 cursor-pointer hover:border-gray-700 transition-colors"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium text-white">{faq.q}</span>
                  <span className="text-gray-500 text-xl flex-shrink-0">{openFaq === i ? '−' : '+'}</span>
                </div>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.p
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="text-gray-400 text-sm leading-relaxed overflow-hidden"
                    >
                      {faq.a}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center p-12 rounded-3xl bg-gradient-to-br from-pink-600/10 to-purple-600/10 border border-pink-500/20"
        >
          <h2 className="text-3xl font-bold text-white mb-3">Encore des questions ?</h2>
          <p className="text-gray-400 mb-6">Notre équipe est là pour vous aider à choisir le bon plan.</p>
          <Link to={createPageUrl('Contact')}>
            <Button className="bg-gradient-to-r from-pink-600 to-purple-600 px-8 py-5 rounded-xl text-base">
              Parler à un expert
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}