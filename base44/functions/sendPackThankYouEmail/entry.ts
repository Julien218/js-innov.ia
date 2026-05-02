import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body_data = await req.json();

    // Support both direct call and entity automation payload
    const lead = body_data.data || body_data;
    const clientName = lead.name || `${lead.firstName || ''} ${lead.lastName || ''}`.trim() || '';
    const clientEmail = lead.email || body_data.clientEmail;
    const pack = lead.recommendedPack || body_data.pack || 'votre pack';
    const rawOptions = body_data.options || lead.need || '';
    const options = Array.isArray(rawOptions)
      ? rawOptions
      : (rawOptions ? rawOptions.split(', ').filter(Boolean) : []);
    const estimatedPrice = lead.budget || body_data.estimatedPrice || 'Sur devis';

    if (!clientEmail) {
      return Response.json({ error: 'Missing clientEmail' }, { status: 400 });
    }

    const firstName = clientName ? clientName.split(' ')[0] : 'là';
    const optionsList = options && options.length > 0
      ? options.map(o => `• ${o}`).join('\n')
      : '• Aucune option supplémentaire';

    const body = `Bonjour ${firstName},

Merci d'avoir configuré votre projet sur Js-Innov.IA ! 🎉

Voici le récapitulatif de votre sélection :

🎯 Pack choisi : ${pack}
${optionsList}
💰 Estimation : ${estimatedPrice}

Julien Pagin va personnellement étudier votre dossier et vous envoyer une proposition détaillée sous 24h.

En attendant, n'hésitez pas à le contacter directement :
📱 WhatsApp : +32 494 11 90 90
📧 info@jsinnovia.com

À très bientôt,
Julien Pagin
Js-Innov.IA — Grand Rue 52, 7370 Dour
BCE 0877926214`;

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: clientEmail,
      from_name: 'Julien — Js-Innov.IA',
      subject: `✅ Votre configuration ${pack} a bien été reçue !`,
      body,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});