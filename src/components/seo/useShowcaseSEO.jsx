import { useEffect } from 'react';

export function useShowcaseSEO(project) {
  useEffect(() => {
    if (!project) return;

    // Generate optimized title
    const techniques = project.ai_techniques?.slice(0, 2).join(', ') || 'IA';
    const title = `${project.title} - ${project.category} | JS-INNOV.IA Portfolio`;
    
    // Generate optimized meta description
    const tags = project.tags?.slice(0, 3).join(', ') || '';
    const client = project.client ? `Pour ${project.client}. ` : '';
    const results = project.results ? `${project.results}. ` : '';
    const description = `${client}${project.description.substring(0, 100)}... ${results}Technologies: ${techniques}. ${tags}`;

    // Update title
    document.title = title;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = description.substring(0, 160);

    // Update keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    const keywords = [
      project.category,
      ...(project.ai_techniques || []),
      ...(project.tags || []),
      'JS-INNOV.IA',
      'intelligence artificielle',
      'IA',
      'portfolio'
    ].join(', ');
    metaKeywords.content = keywords;

    // Update Open Graph tags
    const ogTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description.substring(0, 160) },
      { property: 'og:type', content: 'article' },
      { property: 'og:image', content: project.image_url || 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68ae1c019dacc474a322f2b2/f9316a8c1_Js-innovIA.png' }
    ];

    ogTags.forEach(tag => {
      let metaTag = document.querySelector(`meta[property="${tag.property}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', tag.property);
        document.head.appendChild(metaTag);
      }
      metaTag.content = tag.content;
    });

    // Cleanup function to reset to default on unmount
    return () => {
      document.title = 'Portfolio IA | JS-INNOV.IA - Cas d\'Usage & Réalisations en Intelligence Artificielle';
      if (metaDescription) {
        metaDescription.content = 'Portfolio de projets IA réalisés par JS-INNOV.IA : créations artistiques, automatisations, chatbots, applications sur mesure. Cas d\'usage concrets avec résultats mesurables.';
      }
    };
  }, [project]);
}