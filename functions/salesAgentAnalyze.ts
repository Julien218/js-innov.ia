import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { url } = await req.json();

    if (!url) {
      return Response.json({ error: 'URL requise' }, { status: 400 });
    }

    let html = '';
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(8000), headers: { 'User-Agent': 'Mozilla/5.0' } });
      html = await res.text();
    } catch {
      html = 'Site non accessible';
    }

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `Tu es un expert SEO. Analyse ce site: ${url}
HTML (extrait): ${html.substring(0, 3000)}

Réponds UNIQUEMENT EN FRANÇAIS. Sois concis et actionnable.`,
      response_json_schema: {
        type: 'object',
        properties: {
          global_score: { type: 'number' },
          issues: { type: 'array', items: { type: 'string' } },
          opportunities: { type: 'array', items: { type: 'string' } },
          recommended_plan: { type: 'string', enum: ['Starter', 'Pro', 'Business'] },
          summary: { type: 'string' }
        }
      }
    });

    const data = result?.data || result;

    return Response.json({
      global_score: Number(data?.global_score) || 45,
      issues: Array.isArray(data?.issues) ? data.issues.slice(0, 4) : ['Balises meta manquantes', 'Vitesse de chargement lente'],
      opportunities: Array.isArray(data?.opportunities) ? data.opportunities.slice(0, 4) : ['Optimiser les mots-clés', 'Améliorer les backlinks'],
      recommended_plan: data?.recommended_plan || 'Pro',
      summary: data?.summary || 'Votre site a un potentiel d\'amélioration significatif.'
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});