import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const data = await req.json();

    // Attendre 40 minutes (2400000 ms)
    await new Promise(resolve => setTimeout(resolve, 2400000));

    // Vérifier le statut du devis
    const quote = await base44.asServiceRole.entities.Quote.filter({
      id: data.quote_id
    });

    if (quote.length === 0) {
      return Response.json({
        success: false,
        error: 'Devis introuvable'
      });
    }

    const currentQuote = quote[0];

    // Envoyer le devis SEULEMENT si le statut est "Validé"
    if (currentQuote.statut === 'Validé') {
      // Envoyer l'email de devis
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: data.customer_email,
        subject: `Votre devis personnalisé – ${data.type_projet}`,
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #8b5cf6;">Bonjour ${data.customer_prenom},</h2>
            <p>Suite à votre demande, voici l'estimation pour votre projet :</p>
            
            <div style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); padding: 30px; border-radius: 15px; margin: 20px 0; color: white;">
              <h3 style="margin-top: 0; color: white;">📋 Détails du projet</h3>
              <p><strong>Type de projet :</strong> ${data.type_projet}</p>
              <p><strong>Fonctionnalités :</strong> ${data.fonctionnalites.join(', ')}</p>
              
              <div style="background: rgba(255,255,255,0.2); padding: 20px; border-radius: 10px; margin-top: 20px;">
                <h3 style="margin-top: 0; color: white;">💰 Budget estimatif</h3>
                <p style="font-size: 24px; margin: 10px 0; font-weight: bold; color: white;">
                  ${data.fourchette_basse} € – ${data.fourchette_haute} €
                </p>
              </div>
            </div>

            <p>Cette estimation est indicative et pourra être affinée après échange.</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <p style="margin: 0;">
                <strong>Prochaine étape :</strong> Vous pouvez répondre directement à cet email si vous souhaitez aller plus loin ou planifier un appel.
              </p>
            </div>

            <p>Nous restons à votre disposition pour toute question.</p>
            <p>Cordialement,</p>
            <p><strong>L'équipe JS-INNOV.IA</strong></p>
          </div>
        `
      });

      // Mettre à jour le statut du devis
      await base44.asServiceRole.entities.Quote.update(data.quote_id, {
        statut: 'Devis envoyé',
        date_envoi: new Date().toISOString()
      });

      return Response.json({
        success: true,
        message: 'Devis envoyé avec succès'
      });
    } else {
      return Response.json({
        success: false,
        message: `Devis non envoyé - Statut: ${currentQuote.statut}`
      });
    }

  } catch (error) {
    console.error('Erreur:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});