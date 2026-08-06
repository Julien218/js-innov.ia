import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

export default function ShowcaseFilters({
  selectedCategory,
  onCategoryChange,
  selectedTechniques,
  onTechniquesChange,
  allProjects
}) {
  const categories = [
    'all',
    'Création artistique',
    'Automatisation',
    'Application IA',
    'Template vidéo',
    'Analyse de données',
    'Chatbot',
    'Vision par ordinateur',
    'Autre'
  ];

  // Extract unique AI techniques from all projects
  const allTechniques = [...new Set(
    allProjects.flatMap(p => p.ai_techniques || [])
  )].sort();

  const toggleTechnique = (tech) => {
    if (selectedTechniques.includes(tech)) {
      onTechniquesChange(selectedTechniques.filter(t => t !== tech));
    } else {
      onTechniquesChange([...selectedTechniques, tech]);
    }
  };

  return (
    <div className="mb-12 space-y-6">
      {/* Category Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-sm font-medium text-gray-400 mb-3">Catégories :</div>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-500/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-purple-500/20'
              }`}
            >
              {category === 'all' ? 'Tous' : category}
            </button>
          ))}
        </div>
      </motion.div>

      {/* AI Techniques Filters */}
      {allTechniques.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="text-sm font-medium text-gray-400 mb-3">Technologies IA :</div>
          <div className="flex flex-wrap gap-2">
            {allTechniques.map((tech) => {
              const isSelected = selectedTechniques.includes(tech);
              return (
                <Badge
                  key={tech}
                  onClick={() => toggleTechnique(tech)}
                  className={`cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cyan-600 text-white hover:bg-cyan-700'
                      : 'bg-cyan-900/20 text-cyan-400 border-cyan-500/30 hover:bg-cyan-900/40'
                  }`}
                >
                  {tech}
                  {isSelected && <X className="w-3 h-3 ml-1" />}
                </Badge>
              );
            })}
          </div>
          {selectedTechniques.length > 0 && (
            <button
              onClick={() => onTechniquesChange([])}
              className="mt-3 text-xs text-pink-400 hover:text-pink-300 transition-colors"
            >
              Effacer les filtres techniques
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}