import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import SectionHeader from '../components/shared/SectionHeader';
import DemoModal from '../components/automations/DemoModal';
import { motion } from 'framer-motion';
import { Bot, Zap, Clock, TrendingUp, Star, Play } from 'lucide-react';

export default function Automations() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [demoAutomation, setDemoAutomation] = useState(null);

  const { data: automations = [], isLoading } = useQuery({
    queryKey: ['automations'],
    queryFn: () => base44.entities.Automation.list('-created_date'),
  });

  const categories = ['all', 'Marketing', 'Productivité', 'E-commerce', 'Service Client', 'Gestion de données', 'Autre'];

  const filteredAutomations = selectedCategory === 'all'
    ? automations
    : automations.filter(a => a.category === selectedCategory);

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          icon={Bot}
          title="Automatisations Intelligentes"
          subtitle="Solutions clé en main pour automatiser et optimiser votre business avec l'IA"
        />

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg shadow-cyan-500/30'
                  : 'bg-white/5 text-gray-400 border border-purple-500/20 hover:border-cyan-500/50'
              }`}
            >
              {category === 'all' ? 'Toutes' : category}
            </button>
          ))}
        </div>

        {/* Automations Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white/5 rounded-3xl h-72"></div>
              </div>
            ))}
          </div>
        ) : filteredAutomations.length === 0 ? (
          <div className="text-center py-20">
            <Bot className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Aucune automatisation disponible. Revenez bientôt !</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredAutomations.map((automation, index) => (
              <motion.div
                key={automation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 hover:border-cyan-500/50 transition-all duration-300 p-8">
                  {/* Popular Badge */}
                  {automation.popular && (
                    <div className="absolute top-4 right-4">
                      <div className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold flex items-center gap-1 shadow-lg">
                        <Star className="w-3 h-3 fill-current" />
                        Populaire
                      </div>
                    </div>
                  )}

                  {/* Icon */}
                  <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-cyan-600 to-teal-600 mb-6 group-hover:scale-110 transition-transform">
                    <Zap className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 rounded-full bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 text-xs">
                      {automation.category}
                    </span>
                    {automation.setup_time && (
                      <span className="text-gray-500 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Setup: {automation.setup_time}
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                    {automation.name}
                  </h3>

                  <p className="text-gray-400 mb-6">
                    {automation.description}
                  </p>

                  {/* Benefits */}
                  {automation.benefits && automation.benefits.length > 0 && (
                    <div className="mb-6 space-y-2">
                      {automation.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                          <TrendingUp className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Price & CTA */}
                  <div className="space-y-3 pt-6 border-t border-gray-800">
                    <div className="flex items-center justify-between">
                      <div>
                        {automation.price ? (
                          <>
                            <div className="text-sm text-gray-500">À partir de</div>
                            <div className="text-3xl font-bold text-white">
                              {automation.price}€
                            </div>
                          </>
                        ) : (
                          <div className="text-lg font-semibold text-gray-400">Sur devis</div>
                        )}
                      </div>
                      <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-medium hover:shadow-xl hover:shadow-cyan-500/50 transition-all transform hover:scale-105">
                        Commander
                      </button>
                    </div>
                    <button
                      onClick={() => setDemoAutomation(automation)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-cyan-500/30 text-cyan-400 font-medium hover:bg-cyan-600/10 hover:border-cyan-500/50 transition-all flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Essayer la démo interactive
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Demo Modal */}
        <DemoModal
          automation={demoAutomation}
          isOpen={!!demoAutomation}
          onClose={() => setDemoAutomation(null)}
        />
      </div>
    </div>
  );
}