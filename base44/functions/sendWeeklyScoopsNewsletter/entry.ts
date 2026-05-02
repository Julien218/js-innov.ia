import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Fetch latest news (scoops) from this week
    const news = await base44.asServiceRole.entities.News.list('-created_date', 8);

    if (news.length === 0) {
      return Response.json({ message: 'Aucune actualité à envoyer.' });
    }

    // Fetch all users
    const users = await base44.asServiceRole.entities.User.list();
    const emails = users.filter(u => u.email).map(u => u.email);

    if (emails.length === 0) {
      return Response.json({ message: 'Aucun abonné trouvé.' });
    }

    // Build HTML email body
    const scoopsHtml = news.map(item => `
      <div style="margin-bottom:28px; padding:20px; background:#1a1a2e; border-radius:12px; border-left:4px solid #D4AF37;">
        ${item.is_scoop ? '<span style="background:#D4AF37;color:#000;font-size:11px;font-weight:700;padding:3px 8px;border-radius:20px;text-transform:uppercase;letter-spacing:1px;">🔥 SCOOP</span><br/><br/>' : ''}
        <h3 style="margin:0 0 8px;color:#F5CF41;font-size:16px;">${item.title}</h3>
        <p style="margin:0 0 8px;color:#cccccc;font-size:14px;line-height:1.6;">${item.summary}</p>
        <span style="font-size:12px;color:#888;background:#0d0d1a;padding:3px 10px;border-radius:20px;">${item.source}</span>
        ${item.source_url ? `<a href="${item.source_url}" style="margin-left:10px;font-size:12px;color:#D4AF37;text-decoration:none;">Lire l'article →</a>` : ''}
      </div>
    `).join('');

    const emailBody = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#0e0e1c;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:40px;">
      <div style="display:inline-block;padding:12px 28px;border-radius:30px;background:rgba(212,175,55,0.1);border:1px solid rgba(212,175,55,0.3);">
        <span style="color:#D4AF37;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">⚡ Veille IA — Semaine du ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
      </div>
      <h1 style="color:#ffffff;font-size:28px;margin:20px 0 8px;font-weight:900;">Les Scoops IA de la semaine</h1>
      <p style="color:#888;font-size:15px;margin:0;">Les actualités les plus importantes de l'intelligence artificielle, sélectionnées pour vous.</p>
    </div>

    <!-- Divider -->
    <div style="height:1px;background:linear-gradient(90deg,transparent,#D4AF37,#8B5CF6,transparent);margin-bottom:36px;"></div>

    <!-- News items -->
    ${scoopsHtml}

    <!-- Divider -->
    <div style="height:1px;background:linear-gradient(90deg,transparent,#D4AF37,transparent);margin:36px 0;"></div>

    <!-- CTA -->
    <div style="text-align:center;margin-bottom:36px;">
      <a href="https://js-innov.ia/News" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#D4AF37,#F5CF41);color:#000;font-weight:800;border-radius:12px;text-decoration:none;font-size:15px;">
        Voir toutes les actualités →
      </a>
    </div>

    <!-- Footer -->
    <div style="text-align:center;color:#555;font-size:12px;line-height:1.8;">
      <p style="margin:0;">© 2025 <strong style="color:#D4AF37;">JS-INNOV.IA</strong> · Julien Pagin · Dour, Belgique</p>
      <p style="margin:4px 0 0;">contact@js-innov.ia · +32 494 11 90 90</p>
    </div>
  </div>
</body>
</html>`;

    // Send to all users
    const results = await Promise.allSettled(
      emails.map(email =>
        base44.asServiceRole.integrations.Core.SendEmail({
          to: email,
          subject: `⚡ Scoops IA de la semaine — ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}`,
          body: emailBody,
          from_name: 'JS-INNOV.IA · Veille IA',
        })
      )
    );

    const sent = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return Response.json({
      success: true,
      sent,
      failed,
      total_users: emails.length,
      news_count: news.length,
      message: `Newsletter envoyée à ${sent}/${emails.length} abonnés avec ${news.length} scoops.`
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});