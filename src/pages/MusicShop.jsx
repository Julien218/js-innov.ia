import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import SectionHeader from '../components/shared/SectionHeader';
import MusicProductCard from '../components/music/MusicProductCard';
import CustomMusicCard from '../components/music/CustomMusicCard';

import PowerWord from '../components/shared/PowerWord';
import { motion } from 'framer-motion';
import { Music, TrendingDown, Shield, Volume2 } from 'lucide-react';

export default function MusicShop() {
  const [selectedStyle, setSelectedStyle] = useState('all');

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['music-products'],
    queryFn: () => base44.entities.MusicProduct.list('-created_date'),
  });

  const styles = ['all', 'Lounge', 'Jazz', 'Pop', 'Électronique', 'Classique', 'Ambiance', 'Énergique', 'Relaxante'];

  const filteredProducts = selectedStyle === 'all'
    ? products
    : products.filter(p => p.style === selectedStyle);

  const popularProducts = products.filter(p => p.popular);

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          icon={Music}
          title="Musiques pour Commerces"
          subtitle={
            <span>
              <PowerWord>Économisez</PowerWord> sur les droits SABAM avec nos bandes sonores <PowerWord>libres de droits</PowerWord>
            </span>
          }
        />

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          <div className="p-6 rounded-2xl bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30">
            <TrendingDown className="w-10 h-10 text-green-400 mb-3" />
            <h3 className="text-xl font-bold text-white mb-2">Économies garanties</h3>
            <p className="text-gray-300 text-sm">
              Évitez les frais SABAM coûteux. Paiement unique, usage illimité.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30">
            <Shield className="w-10 h-10 text-blue-400 mb-3" />
            <h3 className="text-xl font-bold text-white mb-2">100% Légal</h3>
            <p className="text-gray-300 text-sm">
              Licence commerciale complète. Aucun risque juridique pour votre commerce.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30">
            <Volume2 className="w-10 h-10 text-purple-400 mb-3" />
            <h3 className="text-xl font-bold text-white mb-2">Qualité Studio</h3>
            <p className="text-gray-300 text-sm">
              Compositions professionnelles créées pour améliorer l'ambiance de votre espace.
            </p>
          </div>
        </motion.div>

        {/* CTA Alert */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/30"
        >
          <div className="flex items-center gap-4">
            <div className="text-4xl">💰</div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">
                Solution pour commerçants : Musique sans frais mensuels
              </h3>
              <p className="text-gray-300 text-sm">
                Face à la vie coûteuse et aux charges croissantes, nous proposons des musiques d'ambiance à prix unique,
                sans abonnement SABAM ni frais récurrents. <PowerWord>Soutenez votre commerce</PowerWord> avec des économies durables.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Popular Products */}
        {popularProducts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-2xl">⭐</span> Les plus populaires
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularProducts.map((product, index) => (
                <MusicProductCard key={product.id} product={product} index={index} popular />
              ))}
              <CustomMusicCard />
            </div>
          </div>
        )}

        {/* Style Filter */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-white mb-4">Filtrer par style</h3>
          <div className="flex flex-wrap gap-3">
            {styles.map((style) => (
              <button
                key={style}
                onClick={() => setSelectedStyle(style)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedStyle === style
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-500/30'
                    : 'bg-white/5 text-gray-400 border border-purple-500/20 hover:border-pink-500/50'
                }`}
              >
                {style === 'all' ? 'Tous les styles' : style}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white/5 rounded-3xl h-96"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Aucun produit disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <MusicProductCard key={product.id} product={product} index={index} />
            ))}
            <CustomMusicCard />
          </div>
        )}
      </div>

    </div>
  );
}