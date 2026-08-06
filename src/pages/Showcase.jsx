import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ExternalLink, Sparkles, Globe, Users, Calendar, Store, Scissors } from 'lucide-react';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const CYAN = '#06B6D4';
const PURPLE = '#7C3AED';
const NIGHT = '#0F172A';

function Reveal({ children, delay = 0, y = 30 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

const CATEGORY_COLORS = {
  'Evenement': GOLD,
  'ASBL': CYAN,
  'Landing page': PURPLE,
  'Site vitrine': '#10B981',
  'Creation visuelle': '#F59E0B',
};

const CATEGORY_ICONS = {
  'Evenement': Calendar,
  'ASBL': Users,
  'Landing page': Globe,
  'Site vitrine': Store,
  'Creation visuelle': Sparkles,
  'Coiffeur': Scissors,
};

const PROJECTS = [
  {
    id: 1,
    title: 'Miss & Mister Dour 2026',
    client_name: 'Olivier Trevis — ASBL Dour',
    category: 'Evenement',
    description: "Plateforme officielle du concours Miss & Mister Dour 2026. Inscriptions en ligne, galerie candidats, votes du public, backoffice multi-roles, certificats blockchain et partage social. Une experience immersive sur le theme Lady Gaga Night.",
    image_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
    project_url: 'https://www.missetmisterdour.be',
    technologies: ['React', 'IA', 'Stripe', 'RBAC', 'Blockchain'],
    featured: true,
    color: GOLD,
  },
  {
    id: 2,
    title: 'Synergie Dour',
    client_name: 'Association Synergie Dour',
    category: 'ASBL',
    description: "Plateforme citoyenne et commerciale pour les independants de Dour. Annuaire public, systeme d'authentification, tableaux de bord personnalises, partage d'actualites et collaboration entre commercants.",
    image_url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80',
    project_url: 'https://www.synergiedour.be',
    technologies: ['React', 'Dashboard', 'Auth', 'CRM'],
    featured: true,
    color: CYAN,
  },
  {
    id: 3,
    title: "Fashionist'ART Dour",
    client_name: 'Fashionist\'ART — Evenement mode',
    category: 'Evenement',
    description: "Site evenementiel immersif pour le grand defile de mode de Dour 2026. Galerie video IA, portraits des candidats, teaser cinematique. Production visuelle complete par JS-Innov.IA.",
    image_url: 'https://drive.google.com/uc?export=view&id=1gn5mYDoRSAGirZi_BSsS9F1gDpQ8hDkm',
    project_url: 'https://www.fashionistartdour.be',
    technologies: ['IA Video', 'React', 'Motion', 'Canva'],
    featured: true,
    color: PURPLE,
  },
  {
    id: 4,
    title: 'Olivier Trevis',
    client_name: 'Olivier Trevis — Personnalite locale',
    category: 'Landing page',
    description: "Landing page personnelle premium pour Olivier Trevis, figure incontournable de Dour. Presentation de ses engagements, du Tour de Dour, Miss & Mister Dour et de son ASBL. Design cinematique et immersif.",
    image_url: 'https://drive.google.com/uc?export=view&id=1LBm-mBHLEA9mDLr0YTkIDatlm8qVjOjq',
    project_url: 'https://www.oliviertrevis.be',
    technologies: ['React', 'Motion', 'SEO', 'Premium design'],
    featured: false,
    color: '#10B981',
  },
  {
    id: 5,
    title: 'JS-Innov.IA — Cockpit',
    client_name: 'JS-Innov.IA',
    category: 'Dashboard admin',
    description: "Plateforme de commande interne JS-Innov.IA : gestion clients, devis, projets, stagiaires, leads et automatisations. Tableau de bord centralise pour piloter toute l'agence en temps reel.",
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    project_url: 'https://app.base44.com',
    technologies: ['React', 'IA', 'CRM', 'Automatisations', 'Dashboard'],
    featured: false,
    color: GOLD,
  },
];

const FILTERS = ['Tous', 'Evenement', 'ASBL', 'Landing page', 'Site vitrine', 'Dashboard admin'];

export default function Showcase() {
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [hovered, setHovered] = useState(null);

  const filtered = activeFilter === 'Tous'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === activeFilter);

  const featured = filtered.filter(p => p.featured);
  const regular = filtered.filter(p => !p.featured);

  return (
    <div className="min-h-screen pb-24" style={{ color: 'white' }}>

      {/* HERO */}
      <section className="pt-20 pb-14 px-5 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.07, 1], opacity: [0.06, 0.12, 0.06] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] blur-[120px] rounded-full"
            style={{ background: `radial-gradient(ellipse, ${PURPLE}40, transparent 70%)` }}
          />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6 text-xs font-bold tracking-widest uppercase"
            style={{ background: 'rgba(124,58,237,0.08)', border: `1px solid rgba(124,58,237,0.28)`, color: PURPLE }}>
            <Sparkles className="w-3.5 h-3.5" /> Nos realisations
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.8 }}
            className="text-4xl md:text-6xl font-black mb-5 leading-tight font-cinzel">
            <span className="text-white">Portfolio</span>{' '}
            <span style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L}, ${PURPLE})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              & Realisations
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="text-lg leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.4)' }}>
            Sites, plateformes, evenements et experiences digitales crees pour nos clients a Dour et en Belgique.
          </motion.p>
        </div>
      </section>

      {/* FILTRES */}
      <section className="px-5 mb-12 max-w-5xl mx-auto">
        <Reveal>
          <div className="flex flex-wrap gap-2 justify-center">
            {FILTERS.map((f) => (
              <motion.button
                key={f}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(f)}
                className="px-4 py-2 rounded-full text-xs font-bold transition-all"
                style={activeFilter === f
                  ? { background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, color: '#000' }
                  : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {f}
              </motion.button>
            ))}
          </div>
        </Reveal>
      </section>

      {/* PROJETS PHARES */}
      {featured.length > 0 && (
        <section className="px-5 mb-10 max-w-6xl mx-auto">
          <Reveal>
            <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5" style={{ color: GOLD }} />
              Projets phares
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {featured.map((project, i) => (
              <Reveal key={project.id} delay={i * 0.08}>
                <ProjectCard project={project} hovered={hovered} setHovered={setHovered} large />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* AUTRES PROJETS */}
      {regular.length > 0 && (
        <section className="px-5 max-w-6xl mx-auto">
          <Reveal>
            <h2 className="text-xl font-black text-white mb-6">Autres projets</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {regular.map((project, i) => (
              <Reveal key={project.id} delay={i * 0.08}>
                <ProjectCard project={project} hovered={hovered} setHovered={setHovered} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="px-5 mt-20 max-w-2xl mx-auto text-center">
        <Reveal>
          <div className="p-10 rounded-3xl relative overflow-hidden"
            style={{ background: 'linear-gradient(145deg, rgba(212,175,55,0.07), rgba(124,58,237,0.05))', border: '1px solid rgba(212,175,55,0.16)' }}>
            <h3 className="text-2xl font-black text-white mb-3 font-cinzel">Votre projet est le prochain.</h3>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.38)' }}>
              On construit des experiences digitales qui marquent. Parlons de votre vision.
            </p>
            <a href="/Contact">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: `0 0 40px rgba(212,175,55,0.22)` }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 rounded-2xl font-black text-sm text-black"
                style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` }}>
                Demarrer mon projet →
              </motion.button>
            </a>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function ProjectCard({ project, hovered, setHovered, large }) {
  const color = project.color || GOLD;
  const Icon = CATEGORY_ICONS[project.category] || Globe;
  const isHov = hovered === project.id;

  return (
    <motion.div
      onHoverStart={() => setHovered(project.id)}
      onHoverEnd={() => setHovered(null)}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.25 }}
      className="relative rounded-3xl overflow-hidden flex flex-col"
      style={{
        background: 'rgba(8,6,20,0.9)',
        border: `1px solid ${isHov ? color + '44' : color + '16'}`,
        boxShadow: isHov ? `0 0 50px ${color}22` : 'none',
        minHeight: large ? 420 : 300,
      }}>

      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: large ? 220 : 160 }}>
        <img
          src={project.image_url}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ transform: isHov ? 'scale(1.06)' : 'scale(1)' }}
          onError={(e) => { e.target.src = `https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80`; }}
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 50%, rgba(8,6,20,0.95) 100%)` }} />
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{ background: `${color}22`, color, border: `1px solid ${color}33`, backdropFilter: 'blur(8px)' }}>
            <Icon className="w-3 h-3" />
            {project.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <p className="text-xs mb-1 font-semibold" style={{ color: 'rgba(255,255,255,0.3)' }}>{project.client_name}</p>
        <h3 className="text-lg font-black text-white mb-2 leading-tight">{project.title}</h3>
        <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: 'rgba(255,255,255,0.42)' }}>
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.technologies.map((t) => (
            <span key={t} className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: `${color}0e`, color: 'rgba(255,255,255,0.45)', border: `1px solid ${color}16` }}>
              {t}
            </span>
          ))}
        </div>

        {/* Link */}
        <a href={project.project_url} target="_blank" rel="noopener noreferrer">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            style={{ background: `${color}10`, color, border: `1px solid ${color}24` }}>
            <ExternalLink className="w-3.5 h-3.5" />
            Voir le site
          </motion.button>
        </a>
      </div>
    </motion.div>
  );
}
