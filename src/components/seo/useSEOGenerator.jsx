import { useState, useEffect } from 'react';
import { platform } from '@/api/platformClient';

export default function useSEOGenerator(pageName, pageContent = '') {
  const [seoData, setSeoData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const generateSEO = async () => {
      // Vérifier si on a déjà généré le SEO pour cette page
      const cached = localStorage.getItem(`seo_${pageName}`);
      if (cached) {
        setSeoData(JSON.parse(cached));
        return;
      }

      setIsGenerating(true);

      try {
        const pageContexts = {
          'Home': 'Page d\'accueil présentant JS-INNOV.IA, société spécialisée en intelligence artificielle, automatisations, templates vidéo, applications IA sur mesure et musiques pour commerces.',
          'News': 'Page d\'actualités sur l\'intelligence artificielle avec les derniers scoops d\'OpenAI, Google AI, Meta AI et autres innovations IA.',
          'Innovations': 'Page présentant les innovations et idées révolutionnaires en intelligence artificielle développées par JS-INNOV.IA.',
          'Showcase': 'Portfolio de projets IA réalisés : créations artistiques, automatisations, chatbots, applications sur mesure avec résultats concrets.',
          'MusicShop': 'Boutique de musiques libres de droits pour commerces. Économie sur les frais SABAM. Bandes sonores professionnelles pour boutiques, restaurants, salons.',
          'Templates': 'Bibliothèque de templates vidéo professionnels générés par IA pour marketing, réseaux sociaux, présentations.',
          'Automations': 'Solutions d\'automatisations intelligentes clé en main pour productivité, marketing, e-commerce et service client.',
          'Applications': 'Développement d\'applications sur mesure propulsées par l\'IA : assistants intelligents, analyse de données, CRM.',
          'Partners': 'Nos partenaires et outils technologiques pour créer des solutions IA innovantes.',
          'Contact': 'Page de contact pour demandes de devis, projets IA et consultations personnalisées.'
        };

        const context = pageContexts[pageName] || pageContent;

        const response = await platform.integrations.Core.InvokeLLM({
          prompt: `Tu es un expert SEO. Génère des meta-descriptions et mots-clés optimisés pour le référencement Google.

Page: ${pageName}
Contexte: ${context}

INSTRUCTIONS:
- Meta-description: 150-160 caractères, attractive, avec call-to-action
- Keywords: 10-15 mots-clés pertinents, séparés par virgules
- Title suggestions: 3 variations de titre optimisés SEO (55-60 caractères)

Utilise des mots-clés liés à: intelligence artificielle, IA, automatisation, innovation, France, solutions sur mesure.

Réponds UNIQUEMENT avec un JSON valide (pas de markdown, pas de \`\`\`).`,
          response_json_schema: {
            type: 'object',
            properties: {
              meta_description: { type: 'string' },
              keywords: { type: 'string' },
              title_suggestions: {
                type: 'array',
                items: { type: 'string' }
              }
            }
          }
        });

        const generatedSEO = response.data;
        
        // Sauvegarder dans le cache
        localStorage.setItem(`seo_${pageName}`, JSON.stringify(generatedSEO));
        setSeoData(generatedSEO);
      } catch (error) {
        console.error('Erreur génération SEO:', error);
      } finally {
        setIsGenerating(false);
      }
    };

    if (pageName && !seoData) {
      generateSEO();
    }
  }, [pageName, pageContent]);

  const regenerateSEO = async () => {
    localStorage.removeItem(`seo_${pageName}`);
    setSeoData(null);
  };

  return { seoData, isGenerating, regenerateSEO };
}