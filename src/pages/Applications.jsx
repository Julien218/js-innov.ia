import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import SectionHeader from '../components/shared/SectionHeader';
import RecommendationsSection from '../components/recommendations/RecommendationsSection';
import ProductSEOWrapper from '../components/seo/ProductSEOWrapper';
import { useNavigationTracking } from '../components/recommendations/useRecommendations';
import { motion } from 'framer-motion';
import { Rocket, ExternalLink, Code2, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../components/cart/CartContext';

export default function Applications() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewedApplication, setViewedApplication] = useState(null);
  const { trackView } = useNavigationTracking();
  const { addToCart, isInCart } = useCart();

  const handleApplicationClick = (application) => {
    trackView('application', application);
    setViewedApplication(application);
  };

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: () => base44.entities.Application.list('-created_date'),
  });

  const categories = ['all', 'IA Générative', 'Assistant IA', 'Analyse de données', 'Création de contenu', 'CRM', 'Autre'];

  const filteredApplications = selectedCategory === 'all'
    ? applications
    : applications.filter(a => a.category === selectedCategory);

  const statusColors = {
    'En développement': 'bg-amber-600/20 text-amber-400 border-amber-500/30',
    'Disponible': 'bg-green-600/20 text-green-400 border-green-500/30',
    'Bientôt': 'bg-cyan-600/20 text-cyan-400 border-cyan-500/30'
  };

  return (
    <ProductSEOWrapper product={viewedApplication} type="application">
      <div className="min-h-screen py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          icon={Rocket}
          title="Applications IA"
          subtitle="Découvrez nos créations innovantes et applications sur mesure propulsées par l'intelligence artificielle"
        />

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/30'
                  : 'bg-white/5 text-gray-400 border border-purple-500/20 hover:border-amber-500/50'
              }`}
            >
              {category === 'all' ? 'Toutes' : category}
            </button>
          ))}
        </div>

        {/* Applications Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white/5 rounded-3xl h-96"></div>
              </div>
            ))}
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-20">
            <Rocket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Aucune application disponible. Revenez bientôt !</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredApplications.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
                onClick={() => handleApplicationClick(app)}
              >
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 hover:border-amber-500/50 transition-all duration-300">
                  {/* Image/Preview */}
                  <div className="relative h-56 bg-gradient-to-br from-amber-600/20 to-orange-600/20 flex items-center justify-center overflow-hidden">
                    {app.image_url ? (
                      <img
                        src={app.image_url}
                        alt={app.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <Rocket className="w-16 h-16 text-amber-400" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[app.status] || statusColors['Bientôt']}`}>
                        {app.status || 'Bientôt'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 rounded-full bg-amber-600/20 text-amber-400 border border-amber-500/30 text-xs">
                        {app.category}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                      {app.name}
                    </h3>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {app.description}
                    </p>

                    {/* Technologies */}
                    {app.technologies && app.technologies.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                          <Code2 className="w-3 h-3" />
                          <span>Technologies:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {app.technologies.slice(0, 4).map((tech, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-1 rounded-md bg-gray-800/50 text-gray-400 border border-gray-700"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Features */}
                    {app.features && app.features.length > 0 && (
                      <div className="mb-4 space-y-1">
                        {app.features.slice(0, 3).map((feature, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-gray-400">
                            <Check className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Price & Actions */}
                    {app.for_sale && app.price ? (
                      <div className="space-y-3">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-white">{app.price}€</span>
                          <span className="text-xs text-gray-500">TTC</span>
                        </div>
                        <div className="flex gap-2">
                          {app.demo_url && (
                            <a
                              href={app.demo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-white text-sm font-medium hover:bg-white/10 transition-all border border-gray-700"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span>Démo</span>
                            </a>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isInCart(app.id)) {
                                addToCart({
                                  id: app.id,
                                  name: app.name,
                                  price: app.price,
                                  image: app.image_url,
                                  type: 'application'
                                });
                              }
                            }}
                            disabled={isInCart(app.id)}
                            className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              isInCart(app.id)
                                ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                                : 'bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:shadow-lg hover:shadow-amber-500/50'
                            }`}
                          >
                            {isInCart(app.id) ? (
                              <>
                                <Check className="w-4 h-4" />
                                <span>Ajouté</span>
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="w-4 h-4" />
                                <span>Acheter</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      app.demo_url && app.status === 'Disponible' && (
                        <a
                          href={app.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-amber-500/50 transition-all"
                        >
                          <span>Voir la démo</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Recommendations */}
        {viewedApplication && (
          <div className="mt-20">
            <RecommendationsSection 
              currentType="application" 
              currentItem={viewedApplication}
              compact={true}
            />
          </div>
        )}
        </div>
      </div>
    </ProductSEOWrapper>
  );
}