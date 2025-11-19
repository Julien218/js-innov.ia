import React from 'react';
import HeroSection from '../components/home/HeroSection';
import SectionHeader from '../components/shared/SectionHeader';
import RecommendationsSection from '../components/recommendations/RecommendationsSection';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Lightbulb, Wand2, Bot, Rocket, ArrowRight } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Lightbulb,
      title: 'Innovations IA',
      description: 'Découvrez nos idées révolutionnaires et nos visions pour demain',
      link: 'Innovations',
      gradient: 'from-pink-600 to-rose-600'
    },
    {
      icon: Wand2,
      title: 'Templates Vidéo',
      description: 'Bibliothèque de templates IA pour vos créations visuelles',
      link: 'Templates',
      gradient: 'from-purple-600 to-indigo-600'
    },
    {
      icon: Bot,
      title: 'Automatisations',
      description: 'Solutions intelligentes prêtes à l\'emploi pour votre entreprise',
      link: 'Automations',
      gradient: 'from-cyan-600 to-teal-600'
    },
    {
      icon: Rocket,
      title: 'Applications IA',
      description: 'Créations sur mesure et applications innovantes',
      link: 'Applications',
      gradient: 'from-amber-600 to-orange-600'
    }
  ];

  return (
    <div>
      <HeroSection />

      {/* Recommendations Section */}
      <RecommendationsSection />

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <SectionHeader
          title="Nos Services"
          subtitle="Des solutions IA complètes pour transformer vos projets"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={createPageUrl(feature.link)}
                className="block group"
              >
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 p-8 hover:border-pink-500/50 transition-all duration-300">
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  
                  <div className="relative">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-pink-400 transition-colors">
                      {feature.title}
                    </h3>

                    <p className="text-gray-400 mb-6">
                      {feature.description}
                    </p>

                    <div className="flex items-center gap-2 text-pink-400 font-medium group-hover:gap-4 transition-all">
                      <span>Explorer</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-600/20 via-purple-600/20 to-cyan-600/20 border border-purple-500/30 p-12 lg:p-16 text-center"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
          
          <div className="relative">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Prêt à transformer votre vision en réalité ?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Discutons de votre projet et découvrons ensemble comment l'IA peut propulser votre entreprise vers le futur.
            </p>
            <Link
              to={createPageUrl('Contact')}
              className="inline-block px-8 py-4 rounded-xl bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
            >
              Démarrer un projet
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}