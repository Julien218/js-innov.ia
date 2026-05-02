import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { email, name, phone, activity, needs, visual_style, colors, budget, message } = body;

    if (!email || !activity) {
      return Response.json({ error: 'Email et activité requis' }, { status: 400 });
    }

    // Store the project
    const project = await base44.asServiceRole.entities.ClientProject.create({
      email, name, phone, activity, needs, visual_style, colors, budget, message,
      status: 'nouveau',
    });

    // Generate personalized offer via LLM
    const needsList = (needs || []).join(', ') || 'à définir';
    const offerResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `Tu es un expert en digital et business. Un client a soumis une demande :
      
Activité : ${activity}
Besoins : ${needsList}
Style visuel : ${visual_style || 'moderne'}
Budget : ${budget || 'non précisé'}
Message : ${message || ''}

Génère une offre personnalisée concise (3-4 paragraphes max) qui :
1. Récapitule le projet avec ses mots
2. Propose une solution claire adaptée à ses besoins
3. Donne une fourchette de prix réaliste
4. Explique le délai de livraison (48h à 7 jours)
5. Finit par un appel à l'action chaleureux

Ton : professionnel, chaleureux, orienté résultats. Ne pas mentionner l'IA.`,
    });

    // Update project with offer
    await base44.asServiceRole.entities.ClientProject.update(project.id, {
      offer_text: offerResult,
    });

    // Send immediate confirmation email to client
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: email,
      subject: '✅ Votre projet a bien été reçu — JS-Innov.IA',
      body: `Bonjour ${name || ''},

Merci pour votre demande ! Nous avons bien reçu votre projet.

📋 Récapitulatif :
• Activité : ${activity}
• Besoins : ${needsList}
• Budget : ${budget || 'à définir'}

Notre équipe prépare votre offre personnalisée. Vous la recevrez dans les prochaines heures.

En attendant, n'hésitez pas à nous contacter sur WhatsApp : +32 494 11 90 90

À très vite,
Julien — JS-Innov.IA`,
    });

    // Notify admin
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: 'contact@js-innov.ia',
      subject: `🆕 Nouveau projet reçu — ${activity} (${name || email})`,
      body: `Nouveau projet soumis via le formulaire.\n\nEmail: ${email}\nNom: ${name}\nActivité: ${activity}\nBesoins: ${needsList}\nBudget: ${budget}\n\nOffre générée:\n${offerResult}\n\nConnectez-vous au dashboard pour traiter cette demande.`,
    });

    // Create admin notification
    await base44.asServiceRole.entities.Validation.create({
      type: 'autre',
      title: `🆕 Nouveau projet — ${activity} (${email})`,
      content: `**Client :** ${name || email}\n**Activité :** ${activity}\n**Besoins :** ${needsList}\n**Budget :** ${budget}\n\n**Offre générée :**\n${offerResult}`,
      status: 'en attente',
      urgency: 'normale',
      agentName: 'ProjectForm',
    });

    return Response.json({
      success: true,
      project_id: project.id,
      offer: offerResult,
      message: 'Projet créé et offre générée avec succès',
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});