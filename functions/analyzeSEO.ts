import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { url, email } = await req.json();

    if (!url || !email) {
      return Response.json({ error: 'URL et email requis' }, { status: 400 });
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

    const reportData = {
      url,
      analyzed_at: new Date().toISOString(),
      ...analysis
    };

    // Sauvegarder le lead
    await base44.asServiceRole.entities.SEOLead.create({
      email,
      website_url: url,
      global_score: analysis.global_score,
      audit_data: reportData
    });

    // Formater l'email
    const emailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 30px; border-radius: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #ff006e; margin: 0;">🎯 Votre Audit SEO Complet</h1>
          <p style="color: #888;">Rapport généré pour ${url}</p>
        </div>

        <div style="background: linear-gradient(135deg, rgba(255,0,110,0.1), rgba(131,56,236,0.1)); padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 30px;">
          <div style="font-size: 60px; font-weight: bold; color: ${analysis.global_score >= 80 ? '#10b981' : analysis.global_score >= 50 ? '#f59e0b' : '#ef4444'};">
            ${analysis.global_score}/100
          </div>
          <p style="color: #aaa;">Score SEO Global</p>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #8338ec; border-bottom: 2px solid #8338ec; padding-bottom: 10px;">📊 Scores Détaillés</h2>
          ${Object.entries(analysis.scores || {}).map(([cat, score]) => `
            <div style="display: flex; justify-content: space-between; padding: 10px; background: rgba(255,255,255,0.05); margin-bottom: 10px; border-radius: 8px;">
              <span style="text-transform: capitalize;">${cat.replace('_', ' ')}</span>
              <strong style="color: ${score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'};">${score}%</strong>
            </div>
          `).join('')}
        </div>

        ${analysis.strengths?.length ? `
          <div style="margin-bottom: 30px;">
            <h2 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 10px;">✅ Points Forts</h2>
            <ul style="color: #ccc;">
              ${analysis.strengths.map(s => `<li style="margin-bottom: 8px;">${s}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${analysis.critical_issues?.length ? `
          <div style="margin-bottom: 30px;">
            <h2 style="color: #ef4444; border-bottom: 2px solid #ef4444; padding-bottom: 10px;">⚠️ Problèmes Critiques</h2>
            <ul style="color: #ccc;">
              ${analysis.critical_issues.map(i => `<li style="margin-bottom: 8px;">${i}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${analysis.recommendations?.length ? `
          <div style="margin-bottom: 30px;">
            <h2 style="color: #8338ec; border-bottom: 2px solid #8338ec; padding-bottom: 10px;">🚀 Recommandations</h2>
            ${analysis.recommendations.slice(0, 5).map(rec => `
              <div style="background: rgba(255,255,255,0.05); padding: 15px; margin-bottom: 15px; border-radius: 10px; border-left: 4px solid ${rec.priority === 'high' ? '#ef4444' : rec.priority === 'medium' ? '#f59e0b' : '#3b82f6'};">
                <strong style="color: #fff;">${rec.title}</strong>
                <p style="color: #aaa; margin: 5px 0;">${rec.description}</p>
                <small style="color: #666;">💡 ${rec.impact}</small>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <div style="text-align: center; background: linear-gradient(135deg, rgba(255,0,110,0.2), rgba(131,56,236,0.2)); padding: 30px; border-radius: 15px; margin-top: 40px;">
          <h3 style="color: #fff; margin-bottom: 15px;">Besoin d'aide pour améliorer votre SEO ?</h3>
          <p style="color: #ccc; margin-bottom: 20px;">Nos experts peuvent mettre en place ces recommandations</p>
          <a href="https://js-innovia.com/Contact" style="display: inline-block; background: linear-gradient(135deg, #ff006e, #8338ec); color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold;">
            Demander un Devis Gratuit
          </a>
        </div>

        <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
          <p>© 2024 JS-INNOV.IA - Intelligence Artificielle & Solutions SEO</p>
        </div>
      </div>
    `;

    // Envoyer l'email
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: email,
      subject: `🎯 Votre Audit SEO pour ${url} - Score: ${analysis.global_score}/100`,
      body: emailHTML
    });

    return Response.json(reportData);

  } catch (error) {
    console.error('Erreur analyse SEO:', error);
    return Response.json({ 
      error: 'Erreur lors de l\'analyse',
      details: error.message 
    }, { status: 500 });
  }
});