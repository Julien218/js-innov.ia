import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Zap, Target, TrendingUp } from 'lucide-react';
import SectionHeader from '../components/shared/SectionHeader';
import ContentGenerator from '../components/seo/ContentGenerator';
import PowerWord from '../components/shared/PowerWord';

export default function ContentStudio() {
  const handleContentGenerated = (content) => {
    console.log('Contenu généré:', content);
  };

  const features = [
    {
      icon: Zap,
      title: 'Génération instantanée',
      description: 'Créez du contenu de qualité en quelques secondes'
    },
    {
      icon: Target,
      title: 'Optimisé SEO',
      description: 'Contenu structuré et optimisé pour les moteurs de recherche'
    },
    {
      icon: TrendingUp,
      title: 'Ton personnalisable',
      description: 'Choisissez entre formel, amical ou technique'
    },
    {
      icon: FileText,
      title: 'Formats variés',
      description: 'Pages complètes, sections, descriptions ou articles'
    }
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          icon={FileText}
          title="Studio de Création de Contenu IA"
          subtitle={
            <span>
              Générez du contenu <PowerWord>optimisé</PowerWord> et <PowerWord>professionnel</PowerWord> en quelques clics
            </span>
          }
        />

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20"
            >
              <div className="p-3 rounded-xl bg-gradient-to-br from-pink-600/20 to-purple-600/20 inline-flex mb-4">
                <feature.icon className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Content Generator */}
        <ContentGenerator onContentGenerated={handleContentGenerated} />

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-pink-600/10 via-purple-600/10 to-cyan-600/10 border border-purple-500/20"
        >
          <h3 className="text-2xl font-bold text-white mb-4">Comment ça marche ?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-300">
            <div>
              <div className="text-3xl font-bold text-pink-400 mb-2">1</div>
              <h4 className="font-semibold text-white mb-2">Définissez vos besoins</h4>
              <p className="text-sm">Saisissez vos mots-clés, le ton souhaité et le type de contenu</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-2">2</div>
              <h4 className="font-semibold text-white mb-2">L'IA génère</h4>
              <p className="text-sm">Notre IA crée un contenu optimisé SEO et aligné avec votre style</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-400 mb-2">3</div>
              <h4 className="font-semibold text-white mb-2">Utilisez directement</h4>
              <p className="text-sm">Copiez le contenu généré et intégrez-le à votre site</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}