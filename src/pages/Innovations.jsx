import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import SectionHeader from '../components/shared/SectionHeader';
import RecommendationsSection from '../components/recommendations/RecommendationsSection';
import { useNavigationTracking } from '../components/recommendations/useRecommendations';
import { motion } from 'framer-motion';
import { Lightbulb, Calendar, Tag, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Innovations() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewedInnovation, setViewedInnovation] = useState(null);
  const { trackView } = useNavigationTracking();

  const handleInnovationClick = (innovation) => {
    trackView('innovation', innovation);
    setViewedInnovation(innovation);
  };

  const { data: innovations = [], isLoading } = useQuery({
    queryKey: ['innovations'],
    queryFn: () => base44.entities.Innovation.list('-created_date'),
  });

  const categories = ['all', 'IA Générative', 'Automatisation', 'Vision par ordinateur', 'NLP', 'Robotique', 'Autre'];

  const filteredInnovations = selectedCategory === 'all'
    ? innovations
    : innovations.filter(i => i.category === selectedCategory);

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          icon={Lightbulb}
          title="Innovations & Idées"
          subtitle="Explorez nos dernières découvertes et visions pour le futur de l'intelligence artificielle"
        />

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-500/30'
                  : 'bg-white/5 text-gray-400 border border-purple-500/20 hover:border-pink-500/50'
              }`}
            >
              {category === 'all' ? 'Toutes' : category}
            </button>
          ))}
        </div>

        {/* Innovations Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white/5 rounded-3xl h-96"></div>
              </div>
            ))}
          </div>
        ) : filteredInnovations.length === 0 ? (
          <div className="text-center py-20">
            <Lightbulb className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Aucune innovation pour le moment. Revenez bientôt !</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredInnovations.map((innovation, index) => (
              <motion.div
                key={innovation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
                onClick={() => handleInnovationClick(innovation)}
              >
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 hover:border-pink-500/50 transition-all duration-300">
                  {/* Image */}
                  {innovation.image_url && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={innovation.image_url}
                        alt={innovation.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    {/* Category & Date */}
                    <div className="flex items-center gap-3 mb-3 text-xs">
                      <span className="px-3 py-1 rounded-full bg-pink-600/20 text-pink-400 border border-pink-500/30">
                        {innovation.category}
                      </span>
                      <span className="text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(innovation.created_date), 'd MMM yyyy', { locale: fr })}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-pink-400 transition-colors">
                      {innovation.title}
                    </h3>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {innovation.description}
                    </p>

                    {/* Tags */}
                    {innovation.tags && innovation.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {innovation.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 rounded-md bg-purple-900/30 text-purple-300 border border-purple-500/20"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <button className="text-pink-400 text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                      <span>Lire la suite</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Featured Badge */}
                  {innovation.featured && (
                    <div className="absolute top-4 right-4">
                      <div className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold shadow-lg">
                        ⭐ Vedette
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            </div>
            )}

            {/* Recommendations */}
            {viewedInnovation && (
            <div className="mt-20">
            <RecommendationsSection 
              currentType="innovation" 
              currentItem={viewedInnovation}
              compact={true}
            />
            </div>
            )}
            </div>
            </div>
            );
            }