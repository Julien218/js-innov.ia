import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Play, Filter, X, ExternalLink, Instagram, Facebook, Calendar, Zap, Star, ChevronRight, Download } from 'lucide-react';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const PURPLE = '#8B5CF6';
const CYAN = '#06B6D4';

const categories = [
  { id: 'all', label: 'Tous les visuels' },
  { id: 'event', label: 'Événements' },
  { id: 'social', label: 'Réseaux sociaux' },
  { id: 'promo', label: 'Promotions' },
  { id: 'branding', label: 'Branding' },
];

const visuels = [
  {
    id: 1,
    title: 'Soirée Lancement Produit',
    client: 'TechStart Paris',
    category: 'event',
    platform: ['Instagram', 'Facebook'],
    date: 'Mars 2025',
    size: 'large',
    bg: 'from-purple-900 via-black to-pink-900',
    accentColor: PURPLE,
    tags: ['Événement', 'Luxe', 'Soirée'],
    description: 'Campagne visuelle complète pour le lancement d\'une application IA',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
    results: '+2.4K inscriptions'
  },
  {
    id: 2,
    title: 'Festival IA & Innovation',
    client: 'Bordeaux Tech',
    category: 'event',
    platform: ['Affiche', 'Instagram'],
    date: 'Février 2025',
    size: 'medium',
    bg: 'from-blue-900 via-black to-purple-900',
    accentColor: CYAN,
    tags: ['Festival', 'Tech', 'Innovation'],
    description: 'Identité visuelle complète et déclinaisons réseaux sociaux',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    results: '8.7K portée'
  },
  {
    id: 3,
    title: 'Campagne Black Friday',
    client: 'Boutique Mode Locale',
    category: 'promo',
    platform: ['Facebook', 'Instagram'],
    date: 'Novembre 2024',
    size: 'medium',
    bg: 'from-yellow-900 via-black to-orange-900',
    accentColor: GOLD,
    tags: ['Promo', 'E-commerce', 'Urgence'],
    description: 'Série de posts et stories pour une campagne promotionnelle intense',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
    results: '+340% ventes'
  },
  {
    id: 4,
    title: 'Brunch Networking',
    client: 'Entrepreneurs Lyon',
    category: 'event',
    platform: ['Instagram', 'LinkedIn'],
    date: 'Janvier 2025',
    size: 'small',
    bg: 'from-emerald-900 via-black to-teal-900',
    accentColor: '#10b981',
    tags: ['Networking', 'Business', 'Élégant'],
    description: 'Invitation visuelle et stories de couverture pour un événement B2B',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80',
    results: '120 participants'
  },
  {
    id: 5,
    title: 'Stories Quotidiennes IA',
    client: 'JS-INNOV.IA',
    category: 'social',
    platform: ['Instagram Stories', 'Facebook'],
    date: 'Continu 2025',
    size: 'small',
    bg: 'from-violet-900 via-black to-indigo-900',
    accentColor: PURPLE,
    tags: ['Stories', 'IA', 'Personal Branding'],
    description: 'Templates stories animés pour communication quotidienne',
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80',
    results: '5K abonnés gagnés'
  },
  {
    id: 6,
    title: 'Soirée Gala Annuel',
    client: 'Chambre Commerce Paris',
    category: 'event',
    platform: ['Affiche A3', 'Instagram', 'LinkedIn'],
    date: 'Décembre 2024',
    size: 'large',
    bg: 'from-amber-900 via-black to-yellow-900',
    accentColor: GOLD,
    tags: ['Gala', 'Prestige', 'Institutionnel'],
    description: 'Campagne premium pour un événement institutionnel de prestige',
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80',
    results: '350 invités'
  },
  {
    id: 7,
    title: 'Pub Restaurant — Midi & Soir',
    client: 'Le Bisto Local',
    category: 'social',
    platform: ['Facebook Ads', 'Instagram Ads'],
    date: 'Continu 2025',
    size: 'medium',
    bg: 'from-red-900 via-black to-orange-900',
    accentColor: '#f97316',
    tags: ['Restauration', 'Local', 'Pub payante'],
    description: 'Visuels publicitaires Facebook & Instagram pour attirer la clientèle locale',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    results: '+60% réservations'
  },
  {
    id: 8,
    title: 'Identité Marque Digitale',
    client: 'StartUp NovaTech',
    category: 'branding',
    platform: ['Tous canaux'],
    date: 'Janvier 2025',
    size: 'small',
    bg: 'from-cyan-900 via-black to-blue-900',
    accentColor: CYAN,
    tags: ['Branding', 'Identité', 'StartUp'],
    description: 'Charte graphique complète et déclinaisons digitales multicanaux',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    results: 'Lancement réussi'
  },
  {
    id: 9,
    title: 'Campagne Soldes Été',
    client: 'Mode & Style Boutique',
    category: 'promo',
    platform: ['Instagram', 'Facebook Ads'],
    date: 'Juin 2024',
    size: 'medium',
    bg: 'from-pink-900 via-black to-rose-900',
    accentColor: '#ec4899',
    tags: ['Soldes', 'Mode', 'Urgence'],
    description: 'Série de visuels animés pour une campagne soldes avec compte à rebours',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
    results: '+280% trafic'
  },
];

function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function VisualCard({ v, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(v)}
      className="group cursor-pointer rounded-2xl overflow-hidden relative"
      style={{ border: `1px solid rgba(255,255,255,0.07)` }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: v.size === 'large' ? 280 : v.size === 'medium' ? 220 : 180 }}>
        <img src={v.image} alt={v.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className={`absolute inset-0 bg-gradient-to-t ${v.bg} opacity-70`} />
        <div className="absolute inset-0 flex items-end p-5">
          <div className="flex flex-wrap gap-1.5">
            {v.tags.map(t => (
              <span key={t} className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                style={{ background: `${v.accentColor}20`, color: v.accentColor, border: `1px solid ${v.accentColor}40`, backdropFilter: 'blur(8px)' }}>
                {t}
              </span>
            ))}
          </div>
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: `${v.accentColor}25`, border: `2px solid ${v.accentColor}` }}>
            <ExternalLink className="w-6 h-6" style={{ color: v.accentColor }} />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-5" style={{ background: 'rgba(8,8,20,0.95)' }}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-white text-sm leading-tight">{v.title}</h3>
          <span className="text-xs font-black px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ background: `${v.accentColor}15`, color: v.accentColor }}>
            {v.results}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{v.client}</span>
          <div className="flex items-center gap-1 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <Calendar className="w-3 h-3" />{v.date}
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-3">
          {v.platform.map(p => (
            <span key={p} className="text-xs px-2 py-0.5 rounded"
              style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.07)' }}>
              {p}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function Modal({ v, onClose }) {
  if (!v) return null;
  return (
    <AnimatePresence>
      <motion.div key="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}>
        <motion.div key="card" initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
          onClick={e => e.stopPropagation()}
          className="relative max-w-2xl w-full rounded-3xl overflow-hidden"
          style={{ background: 'rgba(8,8,20,0.98)', border: `1px solid ${v.accentColor}30`, boxShadow: `0 0 80px ${v.accentColor}15` }}>
          {/* Close */}
          <button onClick={onClose} className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all"
            style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>
            <X className="w-5 h-5" />
          </button>
          {/* Image */}
          <div className="relative h-64 overflow-hidden">
            <img src={v.image} alt={v.title} className="w-full h-full object-cover" />
            <div className={`absolute inset-0 bg-gradient-to-t ${v.bg} opacity-60`} />
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${v.accentColor}, transparent)` }} />
          </div>
          {/* Content */}
          <div className="p-8">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-2xl font-black text-white">{v.title}</h2>
                <p className="text-sm mt-1" style={{ color: v.accentColor }}>{v.client}</p>
              </div>
              <span className="text-lg font-black px-4 py-1.5 rounded-full" style={{ background: `${v.accentColor}15`, color: v.accentColor }}>
                {v.results}
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.55)' }}>{v.description}</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Plateformes</div>
                <div className="flex flex-wrap gap-1">
                  {v.platform.map(p => <span key={p} className="text-xs font-semibold text-white">{p}</span>)}
                </div>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Date</div>
                <div className="text-sm font-semibold text-white">{v.date}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {v.tags.map(t => (
                <span key={t} className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background: `${v.accentColor}12`, color: v.accentColor, border: `1px solid ${v.accentColor}25` }}>
                  {t}
                </span>
              ))}
            </div>
            <div className="flex gap-3">
              <a href="mailto:contact@js-innov.ia">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black text-black"
                  style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>
                  <Zap className="w-4 h-4" />
                  Projet similaire
                </motion.button>
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Visuels() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selected, setSelected] = useState(null);

  const filtered = activeCategory === 'all' ? visuels : visuels.filter(v => v.category === activeCategory);

  return (
    <div className="min-h-screen pb-28" style={{ background: '#060610' }}>
      {/* Hero */}
      <section className="relative pt-20 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full blur-[150px]"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)' }} />
          <div className="absolute top-0 right-1/4 w-[500px] h-[400px] rounded-full blur-[130px]"
            style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.1), transparent 70%)' }} />
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-bold"
            style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid rgba(212,175,55,0.25)`, color: GOLD }}>
            <Image className="w-3 h-3" />
            PORTFOLIO CRÉATIF — VISUELS & PUB
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }}
            className="text-5xl md:text-6xl font-black mb-5 leading-tight">
            <span className="text-white">Visuels qui</span>{' '}
            <span style={{
              background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L}, ${PURPLE}, ${CYAN})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>captivent & convertissent</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg max-w-2xl mx-auto mb-10" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Événements, réseaux sociaux, publicités digitales — chaque visuel conçu pour marquer les esprits et générer des résultats concrets.
          </motion.p>
          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
            className="flex flex-wrap justify-center gap-8">
            {[
              { val: '50+', label: 'Visuels créés' },
              { val: '30+', label: 'Clients satisfaits' },
              { val: '3x', label: 'Engagement moyen' },
              { val: '100%', label: 'IA-assisté' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-black" style={{ color: GOLD }}>{s.val}</div>
                <div className="text-xs mt-0.5 tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Filter bar */}
      <div className="sticky top-28 z-30 px-6 py-4" style={{ background: 'rgba(6,6,16,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-2">
          <Filter className="w-4 h-4 mr-1 flex-shrink-0" style={{ color: 'rgba(212,175,55,0.5)' }} />
          {categories.map(c => (
            <motion.button key={c.id} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => setActiveCategory(c.id)}
              className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
              style={activeCategory === c.id
                ? { background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, color: '#080808', boxShadow: `0 0 20px rgba(212,175,55,0.3)` }
                : { background: 'rgba(212,175,55,0.06)', color: 'rgba(212,175,55,0.6)', border: '1px solid rgba(212,175,55,0.15)' }}>
              {c.label}
            </motion.button>
          ))}
          <span className="ml-auto text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{filtered.length} visuels</span>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 mt-10">
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((v, i) => (
              <motion.div key={v.id} layout
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}>
                <VisualCard v={v} onClick={setSelected} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* CTA */}
      <div className="max-w-3xl mx-auto px-6 mt-20">
        <Reveal>
          <div className="relative p-10 rounded-3xl text-center overflow-hidden"
            style={{ background: 'rgba(10,8,22,0.98)', border: `1px solid rgba(212,175,55,0.2)`, boxShadow: '0 0 60px rgba(212,175,55,0.06)' }}>
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, ${PURPLE}, transparent)` }} />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-xs font-bold"
                style={{ background: 'rgba(212,175,55,0.08)', color: GOLD, border: `1px solid rgba(212,175,55,0.2)` }}>
                <Star className="w-3 h-3" /> Votre projet
              </div>
              <h2 className="text-3xl font-black text-white mb-3">Un visuel qui vous ressemble ?</h2>
              <p className="mb-8 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Événement, campagne pub, branding — on crée des visuels premium assistés par IA, rapides et efficaces.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a href="mailto:contact@js-innov.ia">
                  <motion.button whileHover={{ scale: 1.05, boxShadow: `0 0 40px rgba(212,175,55,0.4)` }} whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-black text-black text-sm"
                    style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>
                    <Zap className="w-4 h-4" />
                    Demander un visuel
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </a>
                <a href="tel:+32494119090">
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    className="px-8 py-3.5 rounded-xl font-semibold text-sm border"
                    style={{ borderColor: 'rgba(212,175,55,0.3)', color: GOLD, background: 'rgba(212,175,55,0.05)' }}>
                    0494/11.90.90
                  </motion.button>
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Modal */}
      {selected && <Modal v={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}