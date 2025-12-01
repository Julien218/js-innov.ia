import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { BookOpen, Clock, Tag, Search, Calendar, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SectionHeader from '../components/shared/SectionHeader';
import PowerWord from '../components/shared/PowerWord';

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: () => base44.entities.BlogPost.filter({ status: 'publié' }, '-published_date', 50),
  });

  const categories = [
    'all',
    'Intelligence Artificielle',
    'Automatisation', 
    'SEO Local',
    'Cas Pratiques',
    'Tutoriels',
    'Actualités'
  ];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPost = filteredPosts[0];
  const otherPosts = filteredPosts.slice(1);

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          icon={BookOpen}
          title="Blog IA & Automatisation"
          subtitle={
            <span>
              Découvrez nos articles sur l'<PowerWord>intelligence artificielle</PowerWord>, 
              l'<PowerWord>automatisation</PowerWord> et le <PowerWord>SEO local</PowerWord> pour PME
            </span>
          }
        />

        {/* Recherche et Filtres */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                type="text"
                placeholder="Rechercher un article..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-purple-500/30 text-white"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category 
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600' 
                  : 'border-purple-500/30 text-gray-300 hover:bg-purple-500/20'}
                size="sm"
              >
                {category === 'all' ? 'Tous' : category}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-400">Aucun article trouvé</h3>
            <p className="text-gray-500 mt-2">Les articles arrivent bientôt !</p>
          </div>
        ) : (
          <>
            {/* Article à la une */}
            {featuredPost && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
              >
                <Link to={createPageUrl(`BlogPost?slug=${featuredPost.slug}`)}>
                  <article className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-600/20 via-purple-600/20 to-cyan-600/20 border border-purple-500/30">
                    <div className="grid md:grid-cols-2 gap-0">
                      <div className="relative h-64 md:h-auto">
                        <img
                          src={featuredPost.cover_image || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800'}
                          alt={featuredPost.title}
                          className="absolute inset-0 w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent md:hidden" />
                      </div>
                      <div className="p-8 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-400 text-xs font-medium">
                            À la une
                          </span>
                          <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-medium">
                            {featuredPost.category}
                          </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-pink-400 transition-colors">
                          {featuredPost.title}
                        </h2>
                        <p className="text-gray-400 mb-6 line-clamp-3">
                          {featuredPost.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(featuredPost.published_date).toLocaleDateString('fr-FR')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {featuredPost.reading_time || 5} min
                          </span>
                        </div>
                        <div className="mt-6 flex items-center gap-2 text-pink-400 font-medium group-hover:gap-4 transition-all">
                          <span>Lire l'article</span>
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>
            )}

            {/* Grille d'articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={createPageUrl(`BlogPost?slug=${post.slug}`)}>
                    <article className="group h-full rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 overflow-hidden hover:border-pink-500/50 transition-all">
                      <div className="relative h-48">
                        <img
                          src={post.cover_image || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600'}
                          alt={post.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-3 left-3">
                          <span className="px-2 py-1 rounded-full bg-purple-500/80 text-white text-xs font-medium">
                            {post.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-pink-400 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.published_date).toLocaleDateString('fr-FR')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.reading_time || 5} min
                          </span>
                        </div>
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {post.tags.slice(0, 3).map((tag, i) => (
                              <span key={i} className="flex items-center gap-1 text-xs text-gray-500">
                                <Tag className="w-3 h-3" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* CTA SEO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 p-8 rounded-3xl bg-gradient-to-br from-pink-600/20 via-purple-600/20 to-cyan-600/20 border border-purple-500/30 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Besoin d'aide pour votre <PowerWord>stratégie IA</PowerWord> ?
          </h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Nos experts en automatisation et intelligence artificielle accompagnent les 
            indépendants et PME de Dour et du Hainaut dans leur transformation digitale.
          </p>
          <Link
            to={createPageUrl('Contact')}
            className="inline-block px-8 py-4 rounded-xl bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-all"
          >
            Demander un devis gratuit
          </Link>
        </motion.div>
      </div>
    </div>
  );
}