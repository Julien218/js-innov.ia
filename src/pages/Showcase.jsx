import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import SectionHeader from '../components/shared/SectionHeader';
import ShowcaseCard from '../components/showcase/ShowcaseCard';
import ShowcaseFilters from '../components/showcase/ShowcaseFilters';
import AITagSuggester from '../components/showcase/AITagSuggester';
import ShowcaseSEOWrapper from '../components/seo/ShowcaseSEOWrapper';
import { motion } from 'framer-motion';
import { Sparkles, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Showcase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTechniques, setSelectedTechniques] = useState([]);
  const [viewedProject, setViewedProject] = useState(null);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['showcase'],
    queryFn: () => base44.entities.Showcase.list('-created_date'),
    initialData: [],
  });

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = searchQuery === '' || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;

    const matchesTechniques = selectedTechniques.length === 0 || 
      selectedTechniques.every(tech => project.ai_techniques?.includes(tech));

    return matchesSearch && matchesCategory && matchesTechniques;
  });

  const featuredProjects = filteredProjects.filter(p => p.featured);
  const regularProjects = filteredProjects.filter(p => !p.featured);

  return (
    <ShowcaseSEOWrapper project={viewedProject}>
      <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          icon={Sparkles}
          title="Portfolio & Réalisations"
          subtitle="Découvrez nos projets IA et cas d'usage concrets"
        />

        {/* AI Tag Suggester (Admin only) */}
        <AITagSuggester />

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un projet, client, ou tag..."
              className="pl-12 py-6 bg-black/30 border-gray-700 text-white placeholder:text-gray-500 rounded-xl"
            />
          </div>
        </motion.div>

        {/* Filters */}
        <ShowcaseFilters
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedTechniques={selectedTechniques}
          onTechniquesChange={setSelectedTechniques}
          allProjects={projects}
        />

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-pink-400" />
              Projets Phares
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredProjects.map((project) => (
                <ShowcaseCard key={project.id} project={project} featured onView={setViewedProject} />
              ))}
            </div>
          </div>
        )}

        {/* Regular Projects */}
        <div>
          {featuredProjects.length > 0 && (
            <h3 className="text-2xl font-bold text-white mb-6">Tous les Projets</h3>
          )}
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-96 rounded-2xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : regularProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-gray-400 text-lg">
                {filteredProjects.length === 0 && projects.length > 0
                  ? 'Aucun projet ne correspond à vos critères'
                  : 'Aucun projet disponible pour le moment'}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularProjects.map((project, index) => (
                <ShowcaseCard key={project.id} project={project} index={index} onView={setViewedProject} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </ShowcaseSEOWrapper>
  );
}