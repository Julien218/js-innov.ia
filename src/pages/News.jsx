import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { platform } from '@/api/platformClient';
import SectionHeader from '../components/shared/SectionHeader';
import PowerWord from '../components/shared/PowerWord';
import { motion } from 'framer-motion';
import { Newspaper, Calendar, ExternalLink, Sparkles, Tag, Flame } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function News() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: news = [], isLoading } = useQuery({
    queryKey: ['news'],
    queryFn: () => platform.entities.News.list('-created_date'),
  });

  const categories = [
    'all',
    'Modèles de langage',
    'Vision par ordinateur',
    'Robotique',
    'IA Générative',
    'Recherche',
    'Entreprise',
    'Réglementation',
    'Autre'
  ];

  const categoryDescriptions = {
    'all': 'Toutes les actualités IA du moment',
    'Modèles de langage': 'GPT, LLaMA, Claude et autres LLMs',
    'Vision par ordinateur': 'Reconnaissance d\'images et analyse visuelle',
    'Robotique': 'Robots intelligents et systèmes autonomes',
    'IA Générative': 'Création de contenu par IA',
    'Recherche': 'Avancées scientifiques et publications',
    'Entreprise': 'Annonces business et levées de fonds',
    'Réglementation': 'Lois, éthique et gouvernance de l\'IA',
    'Autre': 'Autres actualités pertinentes'
  };

  const filteredNews = selectedCategory === 'all'
    ? news
    : news.filter(n => n.category === selectedCategory);

  const scoops = news.filter(n => n.is_scoop);

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          icon={Newspaper}
          title="Actualités IA"
          subtitle={
            <span>
              Les dernières <PowerWord>innovations</PowerWord> et{' '}
              <PowerWord>découvertes</PowerWord> en intelligence artificielle
            </span>
          }
        />

        {/* Scoops Section */}
        {scoops.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <Flame className="w-6 h-6 text-orange-500" />
              <h2 className="text-2xl font-bold text-white">Scoops du moment</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {scoops.slice(0, 2).map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600/20 via-red-600/20 to-pink-600/20 border-2 border-orange-500/50 p-6"
                >
                  <div className="absolute top-4 right-4">
                    <div className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold shadow-lg flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      SCOOP
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3 text-xs text-gray-400">
                    <span className="px-2 py-1 rounded-md bg-orange-900/30 text-orange-400 border border-orange-500/30">
                      {item.source}
                    </span>
                    <Calendar className="w-3 h-3" />
                    <span>
                      {format(new Date(item.created_date), 'd MMM yyyy', { locale: fr })}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-300 text-sm mb-4">{item.summary}</p>

                  {item.source_url && (
                    <a
                      href={item.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-orange-400 text-sm font-medium hover:gap-3 transition-all"
                    >
                      Lire l'article complet
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Category Filter */}
        <div className="mb-16">
          <div className="flex flex-wrap gap-3 justify-center mb-6">
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

          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <p className="text-gray-400 text-sm italic">
              {categoryDescriptions[selectedCategory]}
            </p>
          </motion.div>
        </div>

        {/* News Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white/5 rounded-3xl h-96"></div>
              </div>
            ))}
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-20">
            <Newspaper className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              Aucune actualité pour le moment. Notre agent recherche les dernières innovations !
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 hover:border-pink-500/50 transition-all duration-300 h-full flex flex-col">
                  {/* Image */}
                  {item.image_url && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Source & Date */}
                    <div className="flex items-center gap-3 mb-3 text-xs flex-wrap">
                      <span className="px-3 py-1 rounded-full bg-purple-600/20 text-purple-400 border border-purple-500/30">
                        {item.source}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-pink-600/20 text-pink-400 border border-pink-500/30">
                        {item.category}
                      </span>
                      <span className="text-gray-500 flex items-center gap-1 ml-auto">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(item.created_date), 'd MMM', { locale: fr })}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-pink-400 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                      {item.summary}
                    </p>

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 rounded-md bg-cyan-900/30 text-cyan-300 border border-cyan-500/20 flex items-center gap-1"
                          >
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {item.source_url && (
                      <a
                        href={item.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-400 text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all mt-auto"
                      >
                        <span>Lire l'article</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {/* Scoop Badge */}
                  {item.is_scoop && (
                    <div className="absolute top-4 right-4">
                      <div className="px-2 py-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold shadow-lg flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        SCOOP
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Agent Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 p-8 rounded-3xl bg-gradient-to-br from-cyan-600/10 via-blue-600/10 to-purple-600/10 border border-cyan-500/30"
        >
          <div className="flex items-start gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/30">
              <Sparkles className="w-8 h-8 text-cyan-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">
                Propulsé par notre Agent IA
              </h3>
              <p className="text-gray-400 mb-4">
                Notre <PowerWord>agent intelligent</PowerWord> recherche automatiquement chaque jour les dernières{' '}
                <PowerWord>innovations</PowerWord> et <PowerWord>découvertes</PowerWord> auprès des sources officielles
                (OpenAI, Google AI, Meta AI, Anthropic...) pour vous tenir informé des <PowerWord>scoops</PowerWord> et
                tendances émergentes.
              </p>
              <a
                href={platform.agents.getWhatsAppConnectURL('news_hunter')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
              >
                💬 Discuter avec l'agent sur WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}