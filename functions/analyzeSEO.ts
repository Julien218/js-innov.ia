import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { url } = await req.json();

    if (!url) {
      return Response.json({ error: 'URL requise' }, { status: 400 });
    }

    // Récupérer le contenu du site
    const websiteData = await fetch(`https://base44.io/api/scrape?url=${encodeURIComponent(url)}&formats=markdown,html`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!websiteData.ok) {
      return Response.json({ error: 'Impossible de récupérer le site' }, { status: 400 });
    }

    const { markdown, html } = await websiteData.json();

    // Analyser avec l'IA
    const analysis = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es un expert SEO. Analyse ce site web et fournis un rapport détaillé.

URL: ${url}
HTML: ${html.substring(0, 5000)}
Contenu: ${markdown.substring(0, 3000)}

Analyse les points suivants et attribue des scores (0-100):

1. **SEO Technique** (meta tags, structure HTML, robots.txt, sitemap)
2. **Contenu** (qualité, pertinence, mots-clés, longueur)
3. **Performance** (vitesse de chargement estimée, optimisation images)
4. **Accessibilité** (balises alt, hiérarchie titres, contraste)

Identifie:
- Points forts (ce qui est bien fait)
- Problèmes critiques (erreurs majeures)
- Recommandations d'amélioration avec priorité (high/medium/low)

Sois précis, constructif et fournis des actions concrètes.`,
      response_json_schema: {
        type: 'object',
        properties: {
          global_score: { type: 'number' },
          scores: {
            type: 'object',
            properties: {
              technique: { type: 'number' },
              contenu: { type: 'number' },
              performance: { type: 'number' },
              accessibilite: { type: 'number' }
            }
          },
          strengths: {
            type: 'array',
            items: { type: 'string' }
          },
          critical_issues: {
            type: 'array',
            items: { type: 'string' }
          },
          recommendations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                priority: { type: 'string' },
                impact: { type: 'string' }
              }
            }
          }
        }
      }
    });

    return Response.json({
      url,
      analyzed_at: new Date().toISOString(),
      ...analysis
    });

  } catch (error) {
    console.error('Erreur analyse SEO:', error);
    return Response.json({ 
      error: 'Erreur lors de l\'analyse',
      details: error.message 
    }, { status: 500 });
  }
});