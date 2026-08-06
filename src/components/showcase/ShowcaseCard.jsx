import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Calendar, Clock, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ShowcaseCard({ project, featured = false, index = 0, onView }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      onClick={() => onView && onView(project)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: featured ? 0 : index * 0.1 }}
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 hover:border-pink-500/50 transition-all duration-300 ${
        featured ? 'lg:row-span-1' : ''
      }`}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-gradient-to-r from-pink-600 to-purple-600 text-white border-none px-3 py-1">
            <Award className="w-3 h-3 mr-1" />
            Phare
          </Badge>
        </div>
      )}

      {/* Image */}
      {project.image_url && (
        <div className={`relative ${featured ? 'h-80' : 'h-64'} overflow-hidden bg-black/30`}>
          <img
            src={project.image_url}
            alt={project.title}
            className={`w-full h-full object-cover transition-all duration-500 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            } group-hover:scale-110`}
            onLoad={() => setImageLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Category & Client */}
        <div className="flex items-center justify-between mb-3">
          <Badge className="bg-purple-900/30 text-purple-300 border border-purple-500/20">
            {project.category}
          </Badge>
          {project.client && (
            <span className="text-xs text-gray-500">Client: {project.client}</span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-400 mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* AI Techniques */}
        {project.ai_techniques && project.ai_techniques.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-2">Technologies IA :</div>
            <div className="flex flex-wrap gap-2">
              {project.ai_techniques.slice(0, 3).map((tech, i) => (
                <Badge key={i} variant="outline" className="text-xs border-cyan-500/30 text-cyan-400">
                  {tech}
                </Badge>
              ))}
              {project.ai_techniques.length > 3 && (
                <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-400">
                  +{project.ai_techniques.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {project.tags.slice(0, 4).map((tag, i) => (
              <span key={i} className="text-xs px-2 py-1 rounded-full bg-gray-800/50 text-gray-400">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
          {project.duration && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {project.duration}
            </div>
          )}
          {project.created_date && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(project.created_date).toLocaleDateString('fr-FR')}
            </div>
          )}
        </div>

        {/* Results */}
        {project.results && (
          <div className="mb-4 p-3 rounded-lg bg-green-900/20 border border-green-500/20">
            <div className="text-xs text-green-400 font-medium mb-1">Résultats :</div>
            <p className="text-xs text-gray-300">{project.results}</p>
          </div>
        )}

        {/* Demo Link */}
        {project.demo_url && (
          <Button
            variant="outline"
            className="w-full border-pink-500/30 text-pink-400 hover:bg-pink-500/10"
            onClick={() => window.open(project.demo_url, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Voir le projet
          </Button>
        )}
      </div>
    </motion.div>
  );
}