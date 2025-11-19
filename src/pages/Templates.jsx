import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import SectionHeader from '../components/shared/SectionHeader';
import { motion } from 'framer-motion';
import { Wand2, Play, Clock, ShoppingCart } from 'lucide-react';

export default function Templates() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: () => base44.entities.Template.list('-created_date'),
  });

  const categories = ['all', 'Vidéo Marketing', 'Réseaux Sociaux', 'Présentation', 'Animation 3D', 'Motion Design', 'Autre'];

  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          icon={Wand2}
          title="Templates Vidéo IA"
          subtitle="Bibliothèque de templates professionnels générés et optimisés par intelligence artificielle"
        />

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-white/5 text-gray-400 border border-purple-500/20 hover:border-purple-500/50'
              }`}
            >
              {category === 'all' ? 'Tous' : category}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white/5 rounded-3xl h-96"></div>
              </div>
            ))}
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-20">
            <Wand2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Aucun template disponible. Revenez bientôt !</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300">
                  {/* Preview */}
                  <div className="relative h-56 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 flex items-center justify-center overflow-hidden">
                    {template.preview_url ? (
                      <img
                        src={template.preview_url}
                        alt={template.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <Play className="w-16 h-16 text-purple-400" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="p-4 rounded-full bg-white/90 backdrop-blur-sm">
                        <Play className="w-8 h-8 text-gray-900" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 rounded-full bg-purple-600/20 text-purple-400 border border-purple-500/30 text-xs">
                        {template.category}
                      </span>
                      {template.duration && (
                        <span className="text-gray-500 text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {template.duration}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                      {template.name}
                    </h3>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {template.description}
                    </p>

                    {/* Features */}
                    {template.features && template.features.length > 0 && (
                      <div className="mb-4 space-y-1">
                        {template.features.slice(0, 3).map((feature, i) => (
                          <div key={i} className="text-xs text-gray-500 flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-purple-500"></div>
                            {feature}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                      <div>
                        {template.price ? (
                          <div className="text-2xl font-bold text-white">
                            {template.price}€
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">Sur devis</div>
                        )}
                      </div>
                      <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        Acheter
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}