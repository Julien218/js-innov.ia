import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Bot, CheckSquare, TrendingUp, Zap, Target, Sparkles, Search } from 'lucide-react';
import ContentGenerator from '../components/seo/ContentGenerator';
import NicheTab from '../components/studio/NicheTab';
import GenerationTab from '../components/studio/GenerationTab';
import ValidationTab from '../components/studio/ValidationTab';
import PerformanceTab from '../components/studio/PerformanceTab';
import SEOScoreDashboard from '../components/studio/SEOScoreDashboard';

const GOLD = '#D4AF37';
const GOLD_L = '#F5CF41';
const PURPLE = '#8B5CF6';
const CYAN = '#06B6D4';

const TABS = [
  { id: 'niches',     icon: Bot,         label: 'Niches',           color: CYAN },
  { id: 'generation', icon: Sparkles,     label: 'Génération IA',    color: GOLD },
  { id: 'validation', icon: CheckSquare,  label: 'À valider',        color: '#F59E0B' },
  { id: 'perf',       icon: TrendingUp,   label: 'Performances',     color: PURPLE },
  { id: 'seo',        icon: Search,       label: 'Scores SEO',       color: '#22c55e' },
  { id: 'classique',  icon: FileText,     label: 'Studio classique', color: 'rgba(255,255,255,0.4)' },
];

export default function ContentStudio() {
  const [activeTab, setActiveTab] = useState('niches');
  const [preselectedNiche, setPreselectedNiche] = useState(null);

  const handleGenerateContent = (niche) => {
    setPreselectedNiche(niche);
    setActiveTab('generation');
  };

  return (
    <div className="min-h-screen pt-8 pb-24 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-4 text-xs font-bold tracking-widest uppercase"
            style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid rgba(212,175,55,0.28)`, color: GOLD }}>
            <Sparkles className="w-3.5 h-3.5" /> Content Studio IA
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-black text-white mb-2 font-cinzel">
            Gestionnaire de contenus{' '}
            <span style={{ background: `linear-gradient(135deg, ${GOLD}, ${PURPLE}, ${CYAN})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              TikTok multi-niches
            </span>
          </motion.h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Créez des niches, générez hooks & scripts, validez et analysez les performances
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {TABS.map(tab => (
            <motion.button key={tab.id} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: activeTab === tab.id ? `${tab.color}15` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${activeTab === tab.id ? tab.color + '45' : 'rgba(255,255,255,0.07)'}`,
                color: activeTab === tab.id ? tab.color : 'rgba(255,255,255,0.45)',
                boxShadow: activeTab === tab.id ? `0 0 20px ${tab.color}18` : 'none',
              }}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Tab divider */}
        <div className="h-px mb-8" style={{ background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent)` }} />

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}>
            {activeTab === 'niches' && <NicheTab onGenerateContent={handleGenerateContent} />}
            {activeTab === 'generation' && <GenerationTab preselectedNiche={preselectedNiche} />}
            {activeTab === 'validation' && <ValidationTab />}
            {activeTab === 'perf' && <PerformanceTab />}
            {activeTab === 'seo' && <SEOScoreDashboard />}
            {activeTab === 'classique' && (
              <div>
                <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { icon: Zap,      title: 'Génération instantanée', desc: 'Créez du contenu de qualité en quelques secondes',           color: GOLD },
                    { icon: Target,   title: 'Optimisé SEO',           desc: 'Contenu structuré et optimisé pour les moteurs de recherche', color: CYAN },
                    { icon: TrendingUp, title: 'Ton personnalisable',  desc: 'Choisissez entre formel, amical ou technique',               color: PURPLE },
                    { icon: FileText, title: 'Formats variés',         desc: 'Pages complètes, sections, descriptions ou articles',        color: '#EC4899' },
                  ].map((f, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                      className="p-5 rounded-2xl"
                      style={{ background: 'rgba(10,8,22,0.85)', border: `1px solid ${f.color}18` }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                        style={{ background: `${f.color}12`, border: `1px solid ${f.color}25` }}>
                        <f.icon className="w-5 h-5" style={{ color: f.color }} />
                      </div>
                      <h3 className="font-bold text-white text-sm mb-1">{f.title}</h3>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{f.desc}</p>
                    </motion.div>
                  ))}
                </div>
                <ContentGenerator onContentGenerated={(c) => console.log('Contenu généré:', c)} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}