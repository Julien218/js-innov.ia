import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { Sparkles, Lightbulb, Wand2, Bot, Rocket, ArrowRight, Loader2 } from 'lucide-react';
import { useRecommendations } from './useRecommendations';

const typeConfig = {
  innovation: {
    icon: Lightbulb,
    label: 'Innovation',
    page: 'Innovations',
    gradient: 'from-pink-600 to-rose-600'
  },
  template: {
    icon: Wand2,
    label: 'Template',
    page: 'Templates',
    gradient: 'from-purple-600 to-indigo-600'
  },
  automation: {
    icon: Bot,
    label: 'Automatisation',
    page: 'Automations',
    gradient: 'from-cyan-600 to-teal-600'
  },
  application: {
    icon: Rocket,
    label: 'Application',
    page: 'Applications',
    gradient: 'from-amber-600 to-orange-600'
  }
};

export default function RecommendationsSection({ currentType = null, currentItem = null, compact = false }) {
  const { recommendations, loading } = useRecommendations(currentType, currentItem);

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-8 h-8 text-pink-400 mx-auto mb-3 animate-spin" />
        <p className="text-gray-400 text-sm">Génération de recommandations IA...</p>
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <div className={compact ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-gradient-to-br from-pink-600/20 to-purple-600/20 border border-pink-500/30">
            <Sparkles className="w-6 h-6 text-pink-400" />
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-white">
              Recommandations pour vous
            </h2>
            <p className="text-gray-400 text-sm">Sélections personnalisées par IA</p>
          </div>
        </div>

        {/* Recommendations Grid */}
        <div className={`grid grid-cols-1 ${compact ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
          {recommendations.map((item, index) => {
            const config = typeConfig[item.type];
            const Icon = config.icon;
            
            return (
              <motion.div
                key={`${item.type}-${item.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={createPageUrl(config.page)}
                  className="block group h-full"
                >
                  <div className="relative h-full overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 hover:border-pink-500/50 transition-all duration-300 p-6">
                    {/* Type Badge */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${config.gradient}`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                        {config.label}
                      </span>
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-pink-400 transition-colors line-clamp-2">
                      {item.name || item.title}
                    </h3>

                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                      {item.description}
                    </p>

                    {/* Category */}
                    {item.category && (
                      <span className="inline-block px-3 py-1 rounded-full bg-purple-900/30 text-purple-300 text-xs border border-purple-500/20 mb-4">
                        {item.category}
                      </span>
                    )}

                    {/* AI Reason */}
                    {item.reason && (
                      <div className="mt-4 pt-4 border-t border-gray-800">
                        <p className="text-xs text-gray-500 italic flex items-start gap-2">
                          <Sparkles className="w-3 h-3 text-pink-400 mt-0.5 flex-shrink-0" />
                          <span>{item.reason}</span>
                        </p>
                      </div>
                    )}

                    {/* Hover Arrow */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-5 h-5 text-pink-400" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}