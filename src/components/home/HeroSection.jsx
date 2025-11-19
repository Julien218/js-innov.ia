import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/30 border border-purple-500/30 mb-8"
          >
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span className="text-sm text-gray-300">Intelligence Artificielle Nouvelle Génération</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="gradient-text">Innovons le futur</span>
            <br />
            <span className="text-white">avec l'IA</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto"
          >
            Créations artistiques, automatisations intelligentes et applications sur mesure.
            Explorez nos solutions IA clé en main pour transformer votre vision en réalité.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to={createPageUrl('Innovations')}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold hover:shadow-2xl hover:shadow-pink-500/50 transition-all transform hover:scale-105"
            >
              Découvrir nos innovations
            </Link>
            <Link
              to={createPageUrl('Contact')}
              className="px-8 py-4 rounded-xl bg-white/5 backdrop-blur-sm border border-purple-500/30 text-white font-semibold hover:bg-white/10 transition-all"
            >
              Demander un devis
            </Link>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20"
          >
            {[
              {
                icon: Sparkles,
                title: 'Templates IA',
                description: 'Vidéos et designs générés par IA'
              },
              {
                icon: Zap,
                title: 'Automatisations',
                description: 'Solutions clé en main pour votre business'
              },
              {
                icon: Cpu,
                title: 'Applications',
                description: 'Créations sur mesure et innovantes'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-purple-500/20 hover:border-pink-500/50 transition-all group"
              >
                <feature.icon className="w-10 h-10 text-pink-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}