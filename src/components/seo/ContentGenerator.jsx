import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Copy, CheckCircle, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';

export default function ContentGenerator({ onContentGenerated }) {
  const [keywords, setKeywords] = useState('');
  const [description, setDescription] = useState('');
  const [tone, setTone] = useState('amical');
  const [contentType, setContentType] = useState('page');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [copied, setCopied] = useState(false);

  const generateContent = async () => {
    if (!keywords.trim() && !description.trim()) return;

    setIsGenerating(true);
    setGeneratedContent(null);

    try {
      const toneInstructions = {
        formel: 'Ton professionnel, courtois et précis. Utilise le vouvoiement. Style corporate et sérieux.',
        amical: 'Ton chaleureux, accessible et enthousiaste. Utilise le tutoiement. Style convivial et engageant.',
        technique: 'Ton expert et détaillé. Met l\'accent sur les spécifications techniques et les détails. Style précis et informatif.'
      };

      const contentTypeInstructions = {
        page: 'Page complète avec titre H1, introduction engageante, 3-4 sections avec sous-titres H2, et conclusion avec call-to-action.',
        section: 'Section de contenu avec titre H2, 2-3 paragraphes détaillés et liste à puces des points clés.',
        description: 'Description courte et percutante de 150-200 mots, optimisée pour capter l\'attention.',
        article: 'Article de blog complet avec introduction, développement en plusieurs parties, et conclusion.'
      };

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Tu es un expert en rédaction web et SEO pour JS-INNOV.IA, une entreprise spécialisée en intelligence artificielle.

Mots-clés: ${keywords}
Description/Contexte: ${description}

TON: ${toneInstructions[tone]}

TYPE DE CONTENU: ${contentTypeInstructions[contentType]}

CONTEXTE JS-INNOV.IA:
- Solutions IA innovantes (templates vidéo, automatisations, applications sur mesure, musiques pour commerces)
- Focus sur l'innovation, la transformation digitale et l'économie pour les clients
- Valoriser la technologie IA accessible et les résultats concrets

INSTRUCTIONS SEO:
- Intègre naturellement les mots-clés fournis
- Utilise des verbes d'action et des termes impactants
- Crée des titres accrocheurs et optimisés
- Structure avec des balises HTML (h1, h2, h3, p, ul/li)
- Ajoute des émojis pertinents pour dynamiser
- Inclure des call-to-action stratégiques

Génère un contenu complet, prêt à être publié, en HTML avec balises.`,
        add_context_from_internet: false
      });

      const content = typeof response.data === 'string' ? response.data : response.data?.content || '';
      
      setGeneratedContent({
        html: content,
        wordCount: content.split(/\s+/).length,
        timestamp: new Date().toISOString()
      });

      if (onContentGenerated) {
        onContentGenerated(content);
      }
    } catch (error) {
      console.error('Erreur génération contenu:', error);
      alert('Erreur lors de la génération du contenu. Veuillez réessayer.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent.html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-pink-600/20 to-purple-600/20">
            <Wand2 className="w-6 h-6 text-pink-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Générateur de Contenu IA</h3>
            <p className="text-sm text-gray-400">Créez du contenu optimisé SEO en quelques clics</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Mots-clés <span className="text-pink-400">*</span>
            </label>
            <Input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="IA, automatisation, innovation..."
              className="bg-black/30 border-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Ton du contenu
            </label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger className="bg-black/30 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="formel">Formel</SelectItem>
                <SelectItem value="amical">Amical</SelectItem>
                <SelectItem value="technique">Technique</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Type de contenu
            </label>
            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger className="bg-black/30 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="page">Page complète</SelectItem>
                <SelectItem value="section">Section</SelectItem>
                <SelectItem value="description">Description courte</SelectItem>
                <SelectItem value="article">Article de blog</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description / Contexte
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez brièvement le sujet, l'objectif ou le contexte..."
              className="bg-black/30 border-gray-700 text-white min-h-[100px]"
            />
          </div>
        </div>

        <Button
          onClick={generateContent}
          disabled={isGenerating || (!keywords.trim() && !description.trim())}
          className="w-full mt-6 py-6 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:shadow-2xl hover:shadow-pink-500/50 transition-all"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Génération en cours...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Générer le contenu
            </>
          )}
        </Button>
      </motion.div>

      {/* Résultat */}
      <AnimatePresence>
        {generatedContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-green-500/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div>
                  <h4 className="font-semibold text-white">Contenu généré</h4>
                  <p className="text-xs text-gray-400">
                    {generatedContent.wordCount} mots • {new Date(generatedContent.timestamp).toLocaleTimeString('fr-FR')}
                  </p>
                </div>
              </div>
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Copié !
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copier
                  </>
                )}
              </Button>
            </div>

            <div className="bg-black/40 rounded-xl p-6 max-h-[500px] overflow-y-auto">
              <div 
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: generatedContent.html }}
              />
            </div>

            <div className="mt-4 p-4 bg-black/30 rounded-lg border border-gray-700">
              <p className="text-xs text-gray-400 mb-2">Code HTML:</p>
              <pre className="text-xs text-gray-300 overflow-x-auto">
                {generatedContent.html}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}