import React, { useState } from 'react';
import { platform } from '@/api/platformClient';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, X } from 'lucide-react';

export default function AITagSuggester() {
  const [user, setUser] = useState(null);
  const [showSuggester, setShowSuggester] = useState(false);
  const [projectDescription, setProjectDescription] = useState('');
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    platform.auth.me().then(u => setUser(u)).catch(() => {});
  }, []);

  const generateSuggestions = async () => {
    setLoading(true);
    try {
      const response = await platform.integrations.Core.InvokeLLM({
        prompt: `En tant qu'expert en IA, analyse cette description de projet et suggère:
1. La catégorie la plus appropriée parmi: Création artistique, Automatisation, Application IA, Template vidéo, Analyse de données, Chatbot, Vision par ordinateur, Autre
2. Les techniques IA utilisées (ex: GPT-4, DALL-E, Stable Diffusion, Computer Vision, NLP, etc.)
3. Des tags pertinents pour le projet

Description du projet:
${projectDescription}`,
        response_json_schema: {
          type: "object",
          properties: {
            category: { type: "string" },
            ai_techniques: { type: "array", items: { type: "string" } },
            tags: { type: "array", items: { type: "string" } }
          }
        }
      });
      setSuggestions(response);
    } catch (error) {
      console.error('Erreur:', error);
    }
    setLoading(false);
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="mb-8">
      <Button
        onClick={() => setShowSuggester(!showSuggester)}
        variant="outline"
        className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        {showSuggester ? 'Masquer' : 'Suggérer tags & catégories par IA'}
      </Button>

      <AnimatePresence>
        {showSuggester && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-400" />
                Assistant IA de Catégorisation
              </h3>
              <button
                onClick={() => setShowSuggester(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <Textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Décrivez votre projet en quelques phrases..."
              className="mb-4 bg-black/30 border-gray-700 text-white placeholder:text-gray-500 min-h-[120px]"
            />

            <Button
              onClick={generateSuggestions}
              disabled={loading || !projectDescription.trim()}
              className="mb-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:shadow-lg hover:shadow-pink-500/50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Générer les suggestions
                </>
              )}
            </Button>

            {suggestions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 p-4 rounded-xl bg-black/30 border border-pink-500/20"
              >
                <div>
                  <div className="text-sm font-medium text-gray-400 mb-2">Catégorie suggérée :</div>
                  <Badge className="bg-purple-600 text-white">
                    {suggestions.category}
                  </Badge>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-400 mb-2">Techniques IA :</div>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.ai_techniques?.map((tech, i) => (
                      <Badge key={i} className="bg-cyan-600 text-white">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-400 mb-2">Tags recommandés :</div>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.tags?.map((tag, i) => (
                      <span key={i} className="text-xs px-3 py-1 rounded-full bg-gray-800 text-gray-300">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-gray-500 italic">
                  💡 Copiez ces suggestions lors de la création de votre projet showcase
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}