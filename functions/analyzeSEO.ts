import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { url, email, competitors = [] } = await req.json();

    if (!url || !email) {
      return Response.json({ error: 'URL et email requis' }, { status: 400 });
    }

    // Récupérer le contenu du site avec l'API fetch_website
    let markdown = '';
    let html = '';

    try {
      const scrapeResult = await fetch(url);
      html = await scrapeResult.text();
      markdown = html.substring(0, 3000); // Fallback simple
    } catch (scrapeError) {
      console.error('Erreur scraping:', scrapeError);
      html = 'Site non accessible';
      markdown = 'Contenu non disponible';
    }

    // Données par défaut
    const defaultAnalysis = {
      global_score: 50,
      scores: { technique: 50, contenu: 50, performance: 50, accessibilite: 50 },
      strengths: ['Site analysé avec succès'],
      critical_issues: [],
      recommendations: [
        {
          title: 'Optimisation SEO recommandée',
          description: 'Contactez-nous pour une analyse personnalisée approfondie',
          priority: 'medium',
          impact: 'Amélioration du référencement'
        }
      ]
    };

    // Analyser avec l'IA
    let analysis = { ...defaultAnalysis };
    try {
      const llmResult = await base44.integrations.Core.InvokeLLM({
        prompt: `Expert SEO: analyse ${url}. HTML: ${html.substring(0, 4000)}

Scores 0-100: technique, contenu, performance, accessibilité, global_score.
Points forts (strengths), problèmes critiques (critical_issues), recommandations avec title, description, priority (high/medium/low), impact.`,
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
            strengths: { type: 'array', items: { type: 'string' } },
            critical_issues: { type: 'array', items: { type: 'string' } },
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

      // Extraire les données - l'API peut retourner {data: {...}} ou directement {...}
      const aiResponse = llmResult?.data || llmResult;
      
      if (aiResponse && typeof aiResponse === 'object') {
        const gs = aiResponse.global_score;
        if (typeof gs === 'number' && !isNaN(gs)) {
          analysis.global_score = gs;
        }
        
        if (aiResponse.scores && typeof aiResponse.scores === 'object') {
          const st = aiResponse.scores.technique;
          const sc = aiResponse.scores.contenu;
          const sp = aiResponse.scores.performance;
          const sa = aiResponse.scores.accessibilite;
          
          if (typeof st === 'number' && !isNaN(st)) analysis.scores.technique = st;
          if (typeof sc === 'number' && !isNaN(sc)) analysis.scores.contenu = sc;
          if (typeof sp === 'number' && !isNaN(sp)) analysis.scores.performance = sp;
          if (typeof sa === 'number' && !isNaN(sa)) analysis.scores.accessibilite = sa;
        }
        
        if (Array.isArray(aiResponse.strengths)) {
          const validStrengths = aiResponse.strengths.filter(s => s && typeof s === 'string' && s.trim());
          if (validStrengths.length > 0) analysis.strengths = validStrengths;
        }
        
        if (Array.isArray(aiResponse.critical_issues)) {
          const validIssues = aiResponse.critical_issues.filter(i => i && typeof i === 'string' && i.trim());
          if (validIssues.length > 0) analysis.critical_issues = validIssues;
        }
        
        if (Array.isArray(aiResponse.recommendations)) {
          const validRecs = aiResponse.recommendations
            .filter(r => r && typeof r === 'object' && r.title)
            .map(r => ({
              title: String(r.title || ''),
              description: String(r.description || ''),
              priority: String(r.priority || 'medium'),
              impact: String(r.impact || '')
            }));
          if (validRecs.length > 0) analysis.recommendations = validRecs;
        }
      }
    } catch (llmError) {
      console.error('LLM Error:', llmError);
    }

    // Construire reportData avec validation stricte de toutes les valeurs
    const reportData = {
      url: String(url || ''),
      analyzed_at: new Date().toISOString(),
      global_score: Number(analysis.global_score) || 50,
      scores: {
        technique: Number(analysis.scores?.technique || 50),
        contenu: Number(analysis.scores?.contenu || 50),
        performance: Number(analysis.scores?.performance || 50),
        accessibilite: Number(analysis.scores?.accessibilite || 50)
      },
      strengths: Array.isArray(analysis.strengths) ? analysis.strengths.filter(s => s && typeof s === 'string') : [],
      critical_issues: Array.isArray(analysis.critical_issues) ? analysis.critical_issues.filter(i => i && typeof i === 'string') : [],
      recommendations: Array.isArray(analysis.recommendations) 
        ? analysis.recommendations
            .filter(r => r && typeof r === 'object')
            .map(rec => ({
              title: String(rec.title || 'Recommandation'),
              description: String(rec.description || 'Amélioration suggérée'),
              priority: String(rec.priority || 'medium'),
              impact: String(rec.impact || 'Optimisation SEO')
            }))
        : []
    };

    // Analyse comparative avec concurrents
    if (competitors && Array.isArray(competitors) && competitors.length > 0) {
      try {
        const competitorAnalyses = [];
        
        for (const competitorUrl of competitors.slice(0, 3)) {
          try {
            let compHtml = 'Non accessible';
            try {
              const compFetch = await fetch(competitorUrl, { 
                signal: AbortSignal.timeout(8000),
                headers: { 'User-Agent': 'Mozilla/5.0' }
              });
              compHtml = await compFetch.text();
            } catch (fetchErr) {
              console.log('Fetch competitor failed:', competitorUrl);
            }
            
            const compResult = await base44.integrations.Core.InvokeLLM({
              prompt: `Analyse SEO rapide pour ${competitorUrl}. HTML: ${compHtml.substring(0, 3000)}
              
              Fournis des scores (0-100) pour: technique, contenu, performance, accessibilité et un score global.`,
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
                  }
                }
              }
            });

            const compResponse = compResult?.data || compResult;
            const compGlobalScore = typeof compResponse?.global_score === 'number' ? compResponse.global_score : 50;
            const compScores = compResponse?.scores || {};

            competitorAnalyses.push({
              url: String(competitorUrl || ''),
              global_score: Number(compGlobalScore) || 50,
              scores: {
                technique: Number(compScores.technique) || 50,
                contenu: Number(compScores.contenu) || 50,
                performance: Number(compScores.performance) || 50,
                accessibilite: Number(compScores.accessibilite) || 50
              }
            });
          } catch (compErr) {
            console.error('Erreur analyse concurrent:', competitorUrl, compErr);
          }
        }

        if (competitorAnalyses.length > 0) {
          reportData.comparison = competitorAnalyses;

          // Générer des insights comparatifs
          try {
            const insightsPrompt = `Compare ce site avec ses concurrents:

Votre site: Score ${reportData.global_score}/100
Technique: ${reportData.scores.technique}, Contenu: ${reportData.scores.contenu}, Performance: ${reportData.scores.performance}, Accessibilité: ${reportData.scores.accessibilite}

Concurrents:
${competitorAnalyses.map(c => `${c.url}: Score ${c.global_score}/100 - Technique: ${c.scores.technique}, Contenu: ${c.scores.contenu}, Performance: ${c.scores.performance}, Accessibilité: ${c.scores.accessibilite}`).join('\n')}

Fournis 3-4 insights comparatifs sur les forces/faiblesses relatives et opportunités d'amélioration.`;

            const insightsResult = await base44.integrations.Core.InvokeLLM({
              prompt: insightsPrompt,
              response_json_schema: {
                type: 'object',
                properties: {
                  insights: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        category: { type: 'string' },
                        insight: { type: 'string' },
                        recommendation: { type: 'string' }
                      }
                    }
                  }
                }
              }
            });

            const insightsResponse = insightsResult?.data || insightsResult;
            const rawInsights = insightsResponse?.insights;
            
            reportData.competitive_insights = Array.isArray(rawInsights)
              ? rawInsights
                  .filter(ins => ins && typeof ins === 'object')
                  .map(ins => ({
                    category: String(ins.category || 'Comparaison'),
                    insight: String(ins.insight || ''),
                    recommendation: String(ins.recommendation || '')
                  }))
              : [];
          } catch (insightsErr) {
            console.error('Erreur insights:', insightsErr);
            reportData.competitive_insights = [];
          }
        }
      } catch (comparisonErr) {
        console.error('Erreur analyse comparative:', comparisonErr);
      }
    }

    // Sauvegarder le lead
    try {
      await base44.asServiceRole.entities.SEOLead.create({
        email: String(email),
        website_url: String(url),
        global_score: Number(reportData.global_score),
        audit_data: reportData
      });
    } catch (dbError) {
      console.error('Erreur sauvegarde lead:', dbError);
    }

    // Formater l'email - Validation stricte de toutes les valeurs
    const safeUrl = String(url || 'votre site');
    const safeGlobalScore = Number(reportData.global_score) || 50;
    const safeScores = {
      technique: Number(reportData.scores?.technique) || 50,
      contenu: Number(reportData.scores?.contenu) || 50,
      performance: Number(reportData.scores?.performance) || 50,
      accessibilite: Number(reportData.scores?.accessibilite) || 50
    };
    
    const emailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 30px; border-radius: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #ff006e; margin: 0;">🎯 Votre Audit SEO Complet</h1>
          <p style="color: #888;">Rapport généré pour ${safeUrl}</p>
        </div>

        <div style="background: linear-gradient(135deg, rgba(255,0,110,0.1), rgba(131,56,236,0.1)); padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 30px;">
          <div style="font-size: 60px; font-weight: bold; color: ${safeGlobalScore >= 80 ? '#10b981' : safeGlobalScore >= 50 ? '#f59e0b' : '#ef4444'};">
            ${safeGlobalScore}/100
          </div>
          <p style="color: #aaa;">Score SEO Global</p>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #8338ec; border-bottom: 2px solid #8338ec; padding-bottom: 10px;">📊 Scores Détaillés</h2>
          ${Object.entries(safeScores).map(([cat, score]) => `
            <div style="display: flex; justify-content: space-between; padding: 10px; background: rgba(255,255,255,0.05); margin-bottom: 10px; border-radius: 8px;">
              <span style="text-transform: capitalize;">${cat}</span>
              <strong style="color: ${score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'};">${score}%</strong>
            </div>
          `).join('')}
        </div>

        ${Array.isArray(reportData.strengths) && reportData.strengths.length > 0 ? `
          <div style="margin-bottom: 30px;">
            <h2 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 10px;">✅ Points Forts</h2>
            <ul style="color: #ccc;">
              ${reportData.strengths.filter(s => s && typeof s === 'string').map(s => `<li style="margin-bottom: 8px;">${s}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${Array.isArray(reportData.critical_issues) && reportData.critical_issues.length > 0 ? `
          <div style="margin-bottom: 30px;">
            <h2 style="color: #ef4444; border-bottom: 2px solid #ef4444; padding-bottom: 10px;">⚠️ Problèmes Critiques</h2>
            <ul style="color: #ccc;">
              ${reportData.critical_issues.filter(i => i && typeof i === 'string').map(i => `<li style="margin-bottom: 8px;">${i}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${Array.isArray(reportData.recommendations) && reportData.recommendations.length > 0 ? `
          <div style="margin-bottom: 30px;">
            <h2 style="color: #8338ec; border-bottom: 2px solid #8338ec; padding-bottom: 10px;">🚀 Recommandations</h2>
            ${reportData.recommendations.slice(0, 5).map(rec => `
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
    try {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: String(email),
        subject: `🎯 Votre Audit SEO pour ${safeUrl} - Score: ${safeGlobalScore}/100`,
        body: emailHTML
      });
    } catch (emailError) {
      console.error('Erreur envoi email:', emailError);
    }

    // Validation finale: sérialisation sécurisée sans undefined
    try {
      // Première passe: nettoyer les undefined
      const jsonString = JSON.stringify(reportData, (key, value) => {
        return value === undefined ? null : value;
      });
      
      // Seconde passe: parser et re-sérialiser pour garantir la validité
      const parsedData = JSON.parse(jsonString);
      
      return new Response(JSON.stringify(parsedData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (jsonError) {
      console.error('JSON Error:', jsonError);
      // Fallback: retourner un objet minimal valide
      return Response.json({
        url: String(url),
        global_score: 50,
        scores: { technique: 50, contenu: 50, performance: 50, accessibilite: 50 },
        strengths: [],
        critical_issues: [],
        recommendations: []
      });
    }

  } catch (error) {
    console.error('Erreur analyse SEO:', error);
    return Response.json({ 
      error: 'Erreur lors de l\'analyse',
      details: error.message 
    }, { status: 500 });
  }
});