import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { platform } from '@/api/platformClient';
import { Sparkles, Edit, Trash2, Save,
  Loader2, BookOpen, TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SectionHeader from '../components/shared/SectionHeader';

const ARTICLE_TOPICS = [
  { value: 'ia-pme', label: "L'IA pour les PME : guide pratique", category: 'Intelligence Artificielle' },
  { value: 'automatisation-taches', label: 'Automatiser ses tâches répétitives', category: 'Automatisation' },
  { value: 'seo-local-belgique', label: 'SEO local en Belgique : les bases', category: 'SEO Local' },
  { value: 'chatbot-service-client', label: 'Chatbot IA pour service client', category: 'Cas Pratiques' },
  { value: 'gains-temps-ia', label: 'Gagner 10h/semaine avec l\'IA', category: 'Automatisation' },
  { value: 'courtier-ia', label: 'IA pour courtiers : opportunités', category: 'Cas Pratiques' },
  { value: 'independant-productivite', label: 'Productivité indépendant avec IA', category: 'Tutoriels' },
  { value: 'tendances-ia-2024', label: 'Tendances IA 2024', category: 'Actualités' }
];

export default function BlogAdmin() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Intelligence Artificielle',
    tags: '',
    cover_image: '',
    seo_keywords: '',
    status: 'brouillon'
  });

  const queryClient = useQueryClient();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['admin-blog-posts'],
    queryFn: () => platform.entities.BlogPost.list('-created_date', 100),
  });

  const createMutation = useMutation({
    mutationFn: (data) => platform.entities.BlogPost.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => platform.entities.BlogPost.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => platform.entities.BlogPost.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] })
  });

  const resetForm = () => {
    setEditingPost(null);
    setFormData({
      title: '', slug: '', excerpt: '', content: '',
      category: 'Intelligence Artificielle', tags: '',
      cover_image: '', seo_keywords: '', status: 'brouillon'
    });
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const generateArticle = async () => {
    const topic = customTopic || ARTICLE_TOPICS.find(t => t.value === selectedTopic)?.label;
    if (!topic) return;

    setIsGenerating(true);

    try {
      const result = await platform.integrations.Core.InvokeLLM({
        prompt: `Tu es un expert en rédaction SEO pour JS-INNOV.IA, spécialisé dans l'automatisation et l'IA pour indépendants et PME en Belgique (Dour, Hainaut).

Rédige un article de blog complet et optimisé SEO sur le sujet : "${topic}"

L'article doit :
- Être rédigé en français belge professionnel
- Contenir entre 800 et 1200 mots
- Inclure des mots-clés locaux : Dour, Hainaut, Belgique, indépendants, PME, automatisation, IA
- Avoir une structure claire avec H2 et H3
- Inclure des exemples concrets et pratiques
- Terminer par un appel à l'action vers JS-INNOV.IA

Format markdown.`,
        response_json_schema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            excerpt: { type: 'string' },
            content: { type: 'string' },
            category: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            seo_keywords: { type: 'array', items: { type: 'string' } },
            suggested_cover_query: { type: 'string' }
          }
        }
      });

      const article = result?.data || result;

      if (article) {
        const coverImages = {
          'Intelligence Artificielle': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200',
          'Automatisation': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200',
          'SEO Local': 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=1200',
          'Cas Pratiques': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200',
          'Tutoriels': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200',
          'Actualités': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200'
        };

        setFormData({
          title: article.title || topic,
          slug: generateSlug(article.title || topic),
          excerpt: article.excerpt || '',
          content: article.content || '',
          category: article.category || 'Intelligence Artificielle',
          tags: (article.tags || []).join(', '),
          cover_image: coverImages[article.category] || coverImages['Intelligence Artificielle'],
          seo_keywords: (article.seo_keywords || []).join(', '),
          status: 'brouillon'
        });
      }
    } catch (error) {
      console.error('Erreur génération:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const optimizeSEO = async () => {
    if (!formData.content) return;
    setIsGenerating(true);

    try {
      const result = await platform.integrations.Core.InvokeLLM({
        prompt: `Analyse et optimise le SEO de cet article pour JS-INNOV.IA (automatisation & IA à Dour, Belgique).

Titre: ${formData.title}
Contenu: ${formData.content.substring(0, 2000)}

Fournis :
1. Un titre optimisé SEO (max 60 caractères)
2. Une meta description optimisée (max 160 caractères)
3. 5-8 mots-clés SEO pertinents incluant mots-clés locaux
4. 5-8 tags pour l'article
5. Un score SEO estimé (0-100)
6. 3 suggestions d'amélioration`,
        response_json_schema: {
          type: 'object',
          properties: {
            optimized_title: { type: 'string' },
            meta_description: { type: 'string' },
            seo_keywords: { type: 'array', items: { type: 'string' } },
            tags: { type: 'array', items: { type: 'string' } },
            seo_score: { type: 'number' },
            suggestions: { type: 'array', items: { type: 'string' } }
          }
        }
      });

      const seo = result?.data || result;

      if (seo) {
        setFormData(prev => ({
          ...prev,
          title: seo.optimized_title || prev.title,
          excerpt: seo.meta_description || prev.excerpt,
          seo_keywords: (seo.seo_keywords || []).join(', '),
          tags: (seo.tags || []).join(', ')
        }));

        if (seo.suggestions) {
          alert(`Score SEO: ${seo.seo_score}/100\n\nSuggestions:\n${seo.suggestions.join('\n')}`);
        }
      }
    } catch (error) {
      console.error('Erreur optimisation SEO:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = () => {
    const postData = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      seo_keywords: formData.seo_keywords.split(',').map(k => k.trim()).filter(Boolean),
      reading_time: Math.ceil(formData.content.split(' ').length / 200),
      ai_generated: !editingPost,
      published_date: formData.status === 'publié' ? new Date().toISOString() : null,
      seo_score: 75
    };

    if (editingPost) {
      updateMutation.mutate({ id: editingPost.id, data: postData });
    } else {
      createMutation.mutate(postData);
    }
  };

  const editPost = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      category: post.category || 'Intelligence Artificielle',
      tags: (post.tags || []).join(', '),
      cover_image: post.cover_image || '',
      seo_keywords: (post.seo_keywords || []).join(', '),
      status: post.status || 'brouillon'
    });
  };

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          icon={BookOpen}
          title="Gestion du Blog"
          subtitle="Créez et gérez vos articles avec l'aide de l'IA"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire */}
          <div className="lg:col-span-2 space-y-6">
            {/* Génération IA */}
            <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Sparkles className="w-5 h-5 text-pink-400" />
                  Générer un article avec l'IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                  <SelectTrigger className="bg-black/30 border-purple-500/30">
                    <SelectValue placeholder="Choisir un sujet suggéré..." />
                  </SelectTrigger>
                  <SelectContent>
                    {ARTICLE_TOPICS.map(topic => (
                      <SelectItem key={topic.value} value={topic.value}>
                        {topic.label} ({topic.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="text-center text-gray-400 text-sm">ou</div>
                <Input
                  placeholder="Entrez votre propre sujet..."
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  className="bg-black/30 border-purple-500/30"
                />
                <Button
                  onClick={generateArticle}
                  disabled={isGenerating || (!selectedTopic && !customTopic)}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Générer l'article
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Éditeur */}
            <Card className="bg-white/5 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">
                  {editingPost ? 'Modifier l\'article' : 'Nouvel article'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Titre</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          title: e.target.value,
                          slug: generateSlug(e.target.value)
                        });
                      }}
                      className="bg-black/30 border-purple-500/30"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Slug URL</label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="bg-black/30 border-purple-500/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Résumé (meta description)</label>
                  <Textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    className="bg-black/30 border-purple-500/30 h-20"
                    maxLength={160}
                  />
                  <span className="text-xs text-gray-500">{formData.excerpt.length}/160</span>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Contenu (Markdown)</label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="bg-black/30 border-purple-500/30 h-64 font-mono text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Catégorie</label>
                    <Select
                      value={formData.category}
                      onValueChange={(v) => setFormData({ ...formData, category: v })}
                    >
                      <SelectTrigger className="bg-black/30 border-purple-500/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Intelligence Artificielle">Intelligence Artificielle</SelectItem>
                        <SelectItem value="Automatisation">Automatisation</SelectItem>
                        <SelectItem value="SEO Local">SEO Local</SelectItem>
                        <SelectItem value="Cas Pratiques">Cas Pratiques</SelectItem>
                        <SelectItem value="Tutoriels">Tutoriels</SelectItem>
                        <SelectItem value="Actualités">Actualités</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Statut</label>
                    <Select
                      value={formData.status}
                      onValueChange={(v) => setFormData({ ...formData, status: v })}
                    >
                      <SelectTrigger className="bg-black/30 border-purple-500/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="brouillon">Brouillon</SelectItem>
                        <SelectItem value="publié">Publié</SelectItem>
                        <SelectItem value="planifié">Planifié</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Image de couverture (URL)</label>
                  <Input
                    value={formData.cover_image}
                    onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                    className="bg-black/30 border-purple-500/30"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Tags (séparés par des virgules)</label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="bg-black/30 border-purple-500/30"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Mots-clés SEO (séparés par des virgules)</label>
                  <Input
                    value={formData.seo_keywords}
                    onChange={(e) => setFormData({ ...formData, seo_keywords: e.target.value })}
                    className="bg-black/30 border-purple-500/30"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={optimizeSEO}
                    disabled={isGenerating || !formData.content}
                    variant="outline"
                    className="gap-2"
                  >
                    <TrendingUp className="w-4 h-4" />
                    Optimiser SEO
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!formData.title || !formData.content}
                    className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {editingPost ? 'Mettre à jour' : 'Enregistrer'}
                  </Button>
                  {editingPost && (
                    <Button variant="outline" onClick={resetForm}>
                      Annuler
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Liste des articles */}
          <div>
            <Card className="bg-white/5 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Articles ({posts.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
                {isLoading ? (
                  <div className="text-gray-500 text-center py-4">Chargement...</div>
                ) : posts.length === 0 ? (
                  <div className="text-gray-500 text-center py-4">Aucun article</div>
                ) : (
                  posts.map((post) => (
                    <div
                      key={post.id}
                      className="p-3 rounded-lg bg-black/30 border border-purple-500/20"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white text-sm truncate">
                            {post.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              post.status === 'publié' ? 'bg-green-500/20 text-green-400' :
                              post.status === 'planifié' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {post.status}
                            </span>
                            <span className="text-xs text-gray-500">{post.category}</span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => editPost(post)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-red-400"
                            onClick={() => {
                              if (confirm('Supprimer cet article ?')) {
                                deleteMutation.mutate(post.id);
                              }
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}