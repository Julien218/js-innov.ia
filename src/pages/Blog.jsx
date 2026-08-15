import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { platform } from '@/api/platformClient';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { BookOpen, Clock, Tag, Search, Calendar, ArrowRight, Sparkles } from 'lucide-react';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const PURPLE = '#8B5CF6';
const CYAN = '#06B6D4';

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

const CATS = ['all', 'Intelligence Artificielle', 'Automatisation', 'SEO Local', 'Cas Pratiques', 'Tutoriels', 'Actualités'];
const CAT_COLORS = {
  'Intelligence Artificielle': GOLD,
  'Automatisation': PURPLE,
  'SEO Local': CYAN,
  'Cas Pratiques': '#22c55e',
  'Tutoriels': '#F59E0B',
  'Actualités': '#EC4899',
};

export default function Blog() {
  const [selectedCat, setSelectedCat] = useState('all');
  const [search, setSearch] = useState('');

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: () => platform.entities.BlogPost.filter({ status: 'publié' }, '-published_date', 50),
  });

  const filtered = posts.filter(p => {
    const matchCat = selectedCat === 'all' || p.category === selectedCat;
    const matchSearch = !search ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt?.toLowerCase().includes(search.toLowerCase()) ||
      p.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="min-h-screen" style={{ color: 'white' }}>

      {/* HERO */}
      <section className="pt-20 pb-12 px-5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.07, 0.12, 0.07] }} transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-0 right-0 w-[600px] h-[500px] blur-[130px] rounded-full"
            style={{ background: `radial-gradient(ellipse, ${PURPLE}40, transparent 70%)`, transform: 'translate(30%, -20%)' }} />
          <motion.div animate={{ scale: [1, 1.07, 1], opacity: [0.06, 0.1, 0.06] }} transition={{ duration: 12, repeat: Infinity, delay: 2 }}
            className="absolute bottom-0 left-0 w-[500px] h-[400px] blur-[110px] rounded-full"
            style={{ background: `radial-gradient(ellipse, ${GOLD}35, transparent 70%)`, transform: 'translate(-20%, 20%)' }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
            <div>
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-bold tracking-widest uppercase"
                style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid rgba(212,175,55,0.3)`, color: GOLD }}>
                <BookOpen className="w-3.5 h-3.5" /> Blog IA & Automatisation
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }}
                className="text-3xl md:text-5xl font-black leading-tight font-cinzel">
                <span className="text-white">Nos articles</span>{' '}
                <span style={{ background: `linear-gradient(135deg, ${GOLD}, ${PURPLE}, ${CYAN})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  & insights
                </span>
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
                className="mt-2 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Intelligence artificielle, automatisation, SEO local — pour les PME
              </motion.p>
            </div>

            {/* Search */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(212,175,55,0.5)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher un article..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.18)', color: 'white' }} />
            </motion.div>
          </div>

          {/* Category filters */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="flex flex-wrap gap-2">
            {CATS.map(cat => {
              const isActive = selectedCat === cat;
              const color = cat === 'all' ? GOLD : (CAT_COLORS[cat] || GOLD);
              return (
                <button key={cat} onClick={() => setSelectedCat(cat)}
                  className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
                  style={{
                    background: isActive ? `${color}18` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isActive ? color + '55' : 'rgba(255,255,255,0.08)'}`,
                    color: isActive ? color : 'rgba(255,255,255,0.45)',
                    boxShadow: isActive ? `0 0 15px ${color}25` : 'none'
                  }}>
                  {cat === 'all' ? 'Tous' : cat}
                </button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="px-5 pb-24 max-w-7xl mx-auto">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-72 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-14 h-14 mx-auto mb-4" style={{ color: 'rgba(212,175,55,0.3)' }} />
            <p className="text-lg" style={{ color: 'rgba(255,255,255,0.4)' }}>Aucun article trouvé</p>
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured && (
              <Reveal>
                <Link to={createPageUrl(`BlogPost?slug=${featured.slug}`)}>
                  <motion.article whileHover={{ y: -4 }} transition={{ duration: 0.2 }}
                    className="group relative overflow-hidden rounded-3xl mb-10"
                    style={{ background: 'rgba(10,8,22,0.9)', border: `1px solid rgba(212,175,55,0.2)`, boxShadow: '0 0 50px rgba(212,175,55,0.05)' }}>
                    <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, ${PURPLE}, transparent)` }} />
                    <div className="grid md:grid-cols-2">
                      <div className="relative h-64 md:h-full min-h-[240px] overflow-hidden">
                        <img src={featured.cover_image || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800'}
                          alt={featured.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(14,14,28,0.7), rgba(14,14,28,0.2))' }} />
                        {/* À la une badge */}
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1.5 rounded-full text-xs font-black text-black"
                            style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>✨ À la une</span>
                        </div>
                      </div>
                      <div className="p-8 md:p-10 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-xs px-3 py-1 rounded-full font-semibold"
                            style={{ background: `${CAT_COLORS[featured.category] || GOLD}15`, color: CAT_COLORS[featured.category] || GOLD, border: `1px solid ${CAT_COLORS[featured.category] || GOLD}30` }}>
                            {featured.category}
                          </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-white mb-3 group-hover:text-amber-300 transition-colors leading-tight">
                          {featured.title}
                        </h2>
                        <p className="text-sm leading-relaxed mb-5 line-clamp-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
                          {featured.excerpt}
                        </p>
                        <div className="flex items-center gap-4 mb-6 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />
                            {new Date(featured.published_date).toLocaleDateString('fr-FR')}</span>
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />
                            {featured.reading_time || 5} min</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-bold group-hover:gap-4 transition-all" style={{ color: GOLD }}>
                          Lire l'article <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </motion.article>
                </Link>
              </Reveal>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((post, idx) => {
                const catColor = CAT_COLORS[post.category] || GOLD;
                return (
                  <Reveal key={post.id} delay={idx * 0.07}>
                    <Link to={createPageUrl(`BlogPost?slug=${post.slug}`)}>
                      <motion.article whileHover={{ y: -8 }} transition={{ duration: 0.2 }}
                        className="group h-full rounded-2xl overflow-hidden relative"
                        style={{ background: 'rgba(10,8,22,0.85)', border: `1px solid ${catColor}18` }}>
                        <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ background: `linear-gradient(90deg, transparent, ${catColor}60, transparent)` }} />
                        <div className="relative h-44 overflow-hidden">
                          <img src={post.cover_image || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600'}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-600" />
                          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,8,22,0.95), rgba(10,8,22,0.2))' }} />
                          <div className="absolute bottom-3 left-3">
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                              style={{ background: `${catColor}18`, color: catColor, border: `1px solid ${catColor}35` }}>
                              {post.category}
                            </span>
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="text-base font-black text-white mb-2 line-clamp-2 group-hover:text-amber-300 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-xs leading-relaxed mb-4 line-clamp-2" style={{ color: 'rgba(255,255,255,0.42)' }}>
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(post.published_date).toLocaleDateString('fr-FR')}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.reading_time || 5} min</span>
                          </div>
                          {post.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {post.tags.slice(0, 3).map((tag, i) => (
                                <span key={i} className="text-xs flex items-center gap-1" style={{ color: 'rgba(212,175,55,0.4)' }}>
                                  <Tag className="w-2.5 h-2.5" />#{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.article>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </>
        )}

        {/* CTA */}
        <Reveal delay={0.2}>
          <div className="mt-20 relative p-10 rounded-3xl text-center overflow-hidden"
            style={{ background: 'rgba(10,8,22,0.9)', border: `1px solid rgba(212,175,55,0.2)` }}>
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, ${CYAN}, transparent)` }} />
            <Sparkles className="w-8 h-8 mx-auto mb-3" style={{ color: GOLD }} />
            <h3 className="text-2xl font-black text-white mb-2">Besoin d'aide pour votre stratégie IA ?</h3>
            <p className="text-sm mb-6 max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Nos experts accompagnent les indépendants et PME dans leur transformation digitale.
            </p>
            <Link to={createPageUrl('Contact')}>
              <motion.button whileHover={{ scale: 1.05, boxShadow: `0 0 35px rgba(212,175,55,0.35)` }} whileTap={{ scale: 0.97 }}
                className="px-7 py-3 rounded-xl font-black text-black text-sm"
                style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>
                Demander un devis gratuit →
              </motion.button>
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}