import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight, Tag, Palette, Monitor, BarChart3, Bot, Star, X } from 'lucide-react';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';

const CATEGORIES = ['Tous', 'Fashionist4Art', 'Miss et Mister Dour', 'Site vitrine', 'Dashboard admin', 'Automatisation IA', 'Création visuelle'];

const CATEGORY_ICONS = {
  'Fashionist4Art': Palette,
  'Miss et Mister Dour': Star,
  'Site vitrine': Monitor,
  'Dashboard admin': BarChart3,
  'Automatisation IA': Bot,
  'Création visuelle': Palette,
};

const CATEGORY_COLORS = {
  'Fashionist4Art': '#EC4899',
  'Miss et Mister Dour': '#8B5CF6',
  'Site vitrine': '#06B6D4',
  'Dashboard admin': '#F59E0B',
  'Automatisation IA': '#22c55e',
  'Création visuelle': '#EC4899',
};

const PLACEHOLDER_GRADIENTS = {
  'Fashionist4Art': 'linear-gradient(135deg, #1a0a1a 0%, #2d0a2d 50%, #1a0010 100%)',
  'Miss et Mister Dour': 'linear-gradient(135deg, #0a0a2a 0%, #1a0a3a 50%, #0a0020 100%)',
  'Site vitrine': 'linear-gradient(135deg, #0a1a2a 0%, #0a2a3a 50%, #001020 100%)',
  'Dashboard admin': 'linear-gradient(135deg, #1a1a0a 0%, #2a200a 50%, #100a00 100%)',
  'Automatisation IA': 'linear-gradient(135deg, #0a1a0a 0%, #0a2a0a 50%, #001000 100%)',
  'Création visuelle': 'linear-gradient(135deg, #1a0a1a 0%, #2d0a2d 50%, #1a0010 100%)',
};

const projects = [
  {
    id: 1,
    title: 'Fashionist4Art',
    category: 'Fashionist4Art',
    description: "Création artistique complète, identité visuelle forte, univers mode et art. Visuels premium, storytelling digital et branding cohérent pour une marque à l'esthétique unique.",
    technologies: ['Adobe CC', 'IA générative', 'Motion Design', 'Branding'],
    featured: true,
    result: 'Identité visuelle complète livrée en 5 jours'
  },
  {
    id: 2,
    title: 'Miss et Mister Dour',
    category: 'Miss et Mister Dour',
    description: "Projet événementiel local, visibilité digitale maximale, présentation des candidats, communication efficace et mise en avant sur les réseaux sociaux pour cet événement emblématique de Dour.",
    technologies: ['React', 'Design événementiel', 'Réseaux sociaux', 'SEO local'],
    featured: true,
    result: '+2400 vues lors de l\'événement'
  },
  {
    id: 3,
    title: 'Création de votre site web',
    category: 'Site vitrine',
    description: "Site vitrine professionnel, 100% responsive, optimisé SEO, formulaire de contact intégré, pages services, design premium adapté à votre identité visuelle.",
    technologies: ['React', 'SEO', 'Design premium', 'Contact form'],
    result: 'Livraison en 3 à 7 jours'
  },
  {
    id: 4,
    title: 'Vitrine de vente',
    category: 'Site vitrine',
    description: "Catalogue produits ou services clair et attractif, paiement en ligne intégré, tunnel de conversion simple, offres mises en valeur, upsell et relance automatique.",
    technologies: ['Stripe', 'React', 'Automatisation', 'Tunnel de vente'],
    result: 'Premiers paiements en 24h'
  },
  {
    id: 5,
    title: 'Dashboard administrateur',
    category: 'Dashboard admin',
    description: "Espace admin mobile-first pour gérer pages, contenus, clients, demandes, crédits IA et automatisations. Interface intuitive, accès par rôle, notifications en temps réel.",
    technologies: ['React', 'Base44', 'Mobile-first', 'Rôles & sécurité'],
    result: 'Dashboard livré en 5 jours'
  },
  {
    id: 6,
    title: 'Support clients intégré',
    category: 'Dashboard admin',
    description: "Centre de support complet avec tickets, messages, suivi demandes, intervention manuelle par super admin. Historique complet, notes internes et statuts personnalisables.",
    technologies: ['Ticketing', 'Email auto', 'CRM', 'WhatsApp'],
    result: 'Réduction 60% du temps support'
  },
  {
    id: 7,
    title: 'Automatisation email IA',
    category: 'Automatisation IA',
    description: "Séquence email humanisée avec délai configurable. Scoring automatique des leads, relances personnalisées, logs complets. L'IA travaille, vous dormez.",
    technologies: ['IA générative', 'Automatisation', 'Email marketing', 'Lead scoring'],
    result: '+35% taux de réponse clients'
  },
  {
    id: 8,
    title: 'Identité visuelle complète',
    category: 'Création visuelle',
    description: "Logo, palette couleurs, typographie, charte graphique, visuels réseaux sociaux, templates posts. Une identité cohérente sur tous vos supports.",
    technologies: ['Design', 'IA visuelle', 'Branding', 'Templates'],
    result: 'Identité complète en 3 jours'
  },
];

function PlaceholderImage({ category, title, featured }) {
  const color = CATEGORY_COLORS[category] || GOLD;
  const Icon = CATEGORY_ICONS[category] || Monitor;
  return (
    <div className={`relative w-full ${featured ? 'h-56' : 'h-44'} rounded-xl flex items-center justify-center overflow-hidden`}
      style={{ background: PLACEHOLDER_GRADIENTS[category] || 'linear-gradient(135deg, #0a0a1a, #1a1a2a)' }}>
      <div className="absolute inset-0 opacity-30"
        style={{ background: `radial-gradient(circle at 50% 40%, ${color}30, transparent 65%)` }} />
      <div className="relative z-10 text-center p-4">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3"
          style={{ background: `${color}18`, border: `1px solid ${color}35` }}>
          <Icon className="w-8 h-8" style={{ color }} />
        </div>
        <p className="text-xs font-bold" style={{ color: `${color}cc` }}>{title}</p>
      </div>
      {/* Decorative lines */}
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}50, transparent)` }} />
      <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}30, transparent)` }} />
    </div>
  );
}

function ProjectModal({ project, onClose }) {
  const color = CATEGORY_COLORS[project.category] || GOLD;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden"
        style={{ background: '#0d0d1a', border: '1px solid rgba(212,175,55,0.2)' }}
        onClick={e => e.stopPropagation()}>
        <PlaceholderImage category={project.category} title={project.title} featured />
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
                {project.category}
              </span>
              <h3 className="text-xl font-black text-white mt-3">{project.title}</h3>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.55)' }}>{project.description}</p>
          {project.result && (
            <div className="flex items-center gap-2 mb-5 px-4 py-3 rounded-xl" style={{ background: `${color}10`, border: `1px solid ${color}20` }}>
              <Star className="w-4 h-4 flex-shrink-0" style={{ color }} />
              <span className="text-sm font-semibold" style={{ color }}>{project.result}</span>
            </div>
          )}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.map(t => (
              <span key={t} className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {t}
              </span>
            ))}
          </div>
          <Link to="/webos-contact" onClick={onClose}>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 rounded-2xl font-black text-black text-sm"
              style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>
              Demander un projet similaire →
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function WebOSPortfolio() {
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [selectedProject, setSelectedProject] = useState(null);

  const filtered = activeCategory === 'Tous' ? projects : projects.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen px-4 pt-8 pb-20" style={{ background: '#070710', color: 'white' }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: GOLD }}>Portfolio</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Nos réalisations</h1>
          <p className="text-base" style={{ color: 'rgba(255,255,255,0.45)' }}>Sites, dashboards, automatisations et créations visuelles</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <motion.button key={cat} whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-all"
              style={activeCategory === cat
                ? { background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, color: '#000' }
                : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filtered.map((project, i) => {
              const color = CATEGORY_COLORS[project.category] || GOLD;
              return (
                <motion.div key={project.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -6 }}
                  className="group rounded-2xl overflow-hidden cursor-pointer"
                  style={{ background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.06)' }}
                  onClick={() => setSelectedProject(project)}>
                  <PlaceholderImage category={project.category} title={project.title} featured={project.featured} />
                  <div className="p-5">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}>
                      {project.category}
                    </span>
                    <h3 className="font-black text-white text-base mt-3 mb-2">{project.title}</h3>
                    <p className="text-xs leading-relaxed line-clamp-2 mb-4" style={{ color: 'rgba(255,255,255,0.42)' }}>
                      {project.description}
                    </p>
                    <div className="flex gap-2">
                      <button className="flex-1 py-2.5 rounded-xl text-xs font-bold text-black"
                        style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>
                        Voir le projet
                      </button>
                      <Link to="/webos-contact" onClick={e => e.stopPropagation()}
                        className="px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center"
                        style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <Link to="/webos-contact">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              className="px-8 py-4 rounded-2xl font-black text-black"
              style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, boxShadow: `0 0 30px rgba(212,175,55,0.3)` }}>
              Demander un projet similaire →
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
      </AnimatePresence>
    </div>
  );
}