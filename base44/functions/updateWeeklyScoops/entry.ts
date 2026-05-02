import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Fetch latest AI news via LLM with internet context
    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `Tu es un expert en veille technologique IA. Recherche les 8 actualités les plus importantes et récentes sur l'intelligence artificielle de cette semaine (semaine du ${new Date().toLocaleDateString('fr-FR')}).

Pour chaque actualité, fournis:
- Un titre accrocheur en français
- Un résumé clair de 2-3 phrases en français  
- La source (ex: OpenAI, Google DeepMind, Meta AI, Mistral, etc.)
- L'URL source si disponible
- Une catégorie parmi: "Modèles de langage", "Vision par ordinateur", "Robotique", "IA Générative", "Recherche", "Entreprise", "Réglementation", "Autre"
- Des tags pertinents (3-5 tags)
- Si c'est un scoop majeur (is_scoop: true si vraiment exceptionnel)

Assure-toi de couvrir les dernières sorties de modèles, annonces d'entreprises, percées de recherche, et réglementations.`,
      add_context_from_internet: true,
      model: 'gemini_3_flash',
      response_json_schema: {
        type: 'object',
        properties: {
          news: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                summary: { type: 'string' },
                content: { type: 'string' },
                source: { type: 'string' },
                source_url: { type: 'string' },
                category: { type: 'string' },
                tags: { type: 'array', items: { type: 'string' } },
                is_scoop: { type: 'boolean' },
              }
            }
          }
        }
      }
    });

    const newsItems = result?.news || [];
    if (newsItems.length === 0) {
      return Response.json({ error: 'No news returned from LLM' }, { status: 500 });
    }

    // Delete old news older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const existingNews = await base44.asServiceRole.entities.News.list('-created_date', 200);
    const toDelete = existingNews.filter(n => new Date(n.created_date) < thirtyDaysAgo);
    
    await Promise.all(toDelete.map(n => base44.asServiceRole.entities.News.delete(n.id)));

    // Insert new news items
    const now = new Date().toISOString();
    const created = await Promise.all(
      newsItems.map(item =>
        base44.asServiceRole.entities.News.create({
          title: item.title,
          summary: item.summary,
          content: item.content || item.summary,
          source: item.source || 'IA Watch',
          source_url: item.source_url || '',
          category: item.category || 'Autre',
          tags: item.tags || [],
          is_scoop: item.is_scoop || false,
          published_date: now,
        })
      )
    );

    return Response.json({
      success: true,
      inserted: created.length,
      deleted: toDelete.length,
      message: `${created.length} actualités IA insérées, ${toDelete.length} anciennes supprimées.`
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});