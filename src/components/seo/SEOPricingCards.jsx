import { motion } from 'framer-motion';
import { Check, Zap, Crown, Rocket, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';

const plans = [
  {
    id: 'free',
    name: 'Audit Gratuit',
    price: 0,
    description: 'Analyse rapide de votre site',
    icon: Gift,
    color: 'from-gray-600 to-gray-700',
    borderColor: 'border-gray-500/30',
    features: [
      'Score SEO global',
      '7 catégories mesurées',
      'Points forts identifiés',
      'Problèmes critiques',
      'Rapport HTML téléchargeable',
    ],
    cta: 'Analyser gratuitement',
    popular: false,
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 49,
    period: '/audit',
    description: 'Pour les indépendants',
    icon: Zap,
    color: 'from-blue-600 to-cyan-600',
    borderColor: 'border-blue-500/30',
    features: [
      'Tout de l\'audit gratuit',
      'Analyse de 3 concurrents',
      'Recommandations détaillées',
      'Plan d\'action prioritaire',
      'Mots-clés suggérés',
      'Support email 48h',
    ],
    cta: 'Choisir Basic',
    popular: false,
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 149,
    period: '/mois',
    description: 'Pour les PME ambitieuses',
    icon: Rocket,
    color: 'from-purple-600 to-pink-600',
    borderColor: 'border-purple-500/50',
    features: [
      'Tout du plan Basic',
      'Audit mensuel automatisé',
      'Suivi du positionnement',
      'Analyse backlinks',
      'Rapport détaillé téléchargeable',
      'Optimisation continue',
      'Support prioritaire',
    ],
    cta: 'Choisir Standard',
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 349,
    period: '/mois',
    description: 'Accompagnement complet',
    icon: Crown,
    color: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-500/50',
    features: [
      'Tout du plan Standard',
      'Audit hebdomadaire',
      'Rédaction SEO (2 articles/mois)',
      'Optimisation technique',
      'Stratégie de contenu',
      'Création de backlinks',
      'Appel mensuel stratégique',
      'Accès dashboard dédié',
    ],
    cta: 'Choisir Pro',
    popular: false,
  },
];

export default function SEOPricingCards({ onSelectPlan }) {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Choisissez votre <span className="gradient-text">formule SEO</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          De l'audit gratuit à l'accompagnement complet, trouvez la solution adaptée à vos besoins
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative rounded-2xl p-6 ${
              plan.popular
                ? 'bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-2 border-purple-500/50 scale-105 z-10'
                : `bg-gradient-to-br from-white/5 to-white/[0.02] border ${plan.borderColor}`
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold">
                Populaire
              </div>
            )}

            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${plan.color} mb-4`}>
              <plan.icon className="w-6 h-6 text-white" />
            </div>

            <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
            <p className="text-gray-400 text-sm mb-4">{plan.description}</p>

            <div className="mb-6">
              <span className="text-4xl font-bold text-white">{plan.price}€</span>
              {plan.period && <span className="text-gray-400 text-sm">{plan.period}</span>}
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    plan.popular ? 'text-pink-400' : 'text-green-400'
                  }`} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {plan.id === 'free' ? (
              <Button
                onClick={() => onSelectPlan && onSelectPlan(plan)}
                className={`w-full ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-pink-500/50'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {plan.cta}
              </Button>
            ) : (
              <Link to={createPageUrl('Contact')}>
                <Button
                  className={`w-full ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-pink-500/50'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
            )}
          </motion.div>
        ))}
      </div>

      {/* Trust badges */}
      <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-green-400" />
          Sans engagement
        </div>
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-green-400" />
          Paiement sécurisé
        </div>
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-green-400" />
          Support réactif
        </div>
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-green-400" />
          Satisfait ou remboursé
        </div>
      </div>
    </section>
  );
}
