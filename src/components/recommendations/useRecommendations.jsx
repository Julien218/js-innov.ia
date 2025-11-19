import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

export function useNavigationTracking() {
  const trackView = (type, item) => {
    const history = JSON.parse(localStorage.getItem('navigationHistory') || '[]');
    const entry = {
      type,
      id: item.id,
      name: item.name || item.title,
      category: item.category,
      timestamp: new Date().toISOString()
    };
    
    history.unshift(entry);
    const trimmed = history.slice(0, 50);
    localStorage.setItem('navigationHistory', JSON.stringify(trimmed));
  };

  const getHistory = () => {
    return JSON.parse(localStorage.getItem('navigationHistory') || '[]');
  };

  return { trackView, getHistory };
}

export function useRecommendations(currentType = null, currentItem = null) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getHistory } = useNavigationTracking();

  useEffect(() => {
    generateRecommendations();
  }, [currentType, currentItem?.id]);

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      const history = getHistory();
      
      // Fetch all data
      const [innovations, templates, automations, applications] = await Promise.all([
        base44.entities.Innovation.list('-created_date', 10),
        base44.entities.Template.list('-created_date', 10),
        base44.entities.Automation.list('-created_date', 10),
        base44.entities.Application.list('-created_date', 10)
      ]);

      // Build context for AI
      const userContext = {
        recentViews: history.slice(0, 10).map(h => ({
          type: h.type,
          name: h.name,
          category: h.category
        })),
        currentContext: currentItem ? {
          type: currentType,
          name: currentItem.name || currentItem.title,
          category: currentItem.category
        } : null,
        categoryInterests: getCategoryInterests(history)
      };

      const availableItems = {
        innovations: innovations.map(i => ({ id: i.id, title: i.title, category: i.category, featured: i.featured })),
        templates: templates.map(t => ({ id: t.id, name: t.name, category: t.category })),
        automations: automations.map(a => ({ id: a.id, name: a.name, category: a.category, popular: a.popular })),
        applications: applications.map(a => ({ id: a.id, name: a.name, category: a.category, status: a.status }))
      };

      // Use AI to generate recommendations
      const prompt = `Tu es un système de recommandation intelligent pour un site web d'IA.

Contexte utilisateur:
${JSON.stringify(userContext, null, 2)}

Items disponibles:
${JSON.stringify(availableItems, null, 2)}

Analyse le comportement de l'utilisateur et recommande 4-6 items pertinents (mix d'innovations, templates, automatisations, applications).
Priorise:
- Items similaires au contexte actuel
- Items des catégories d'intérêt de l'utilisateur
- Diversité des types de contenu
- Items populaires/vedettes

Exclus le contenu actuel si fourni.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string", enum: ["innovation", "template", "automation", "application"] },
                  id: { type: "string" },
                  reason: { type: "string" }
                }
              }
            }
          }
        }
      });

      // Map IDs to actual items
      const recs = response.recommendations.map(rec => {
        let item;
        switch(rec.type) {
          case 'innovation':
            item = innovations.find(i => i.id === rec.id);
            break;
          case 'template':
            item = templates.find(t => t.id === rec.id);
            break;
          case 'automation':
            item = automations.find(a => a.id === rec.id);
            break;
          case 'application':
            item = applications.find(a => a.id === rec.id);
            break;
        }
        
        return item ? { ...item, type: rec.type, reason: rec.reason } : null;
      }).filter(Boolean);

      setRecommendations(recs);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      // Fallback to simple recommendations
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  return { recommendations, loading, refresh: generateRecommendations };
}

function getCategoryInterests(history) {
  const categories = {};
  history.forEach(h => {
    if (h.category) {
      categories[h.category] = (categories[h.category] || 0) + 1;
    }
  });
  return Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cat]) => cat);
}