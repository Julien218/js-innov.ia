import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const EMAIL_TEMPLATES = [
  {
    step: 1,
    subject: "Votre projet est en cours d'analyse",
    body: (prenom) => `Bonjour ${prenom},

J'ai pris quelques minutes pour regarder votre demande et la configuration de votre projet.

Votre base est intéressante, et il y a un vrai potentiel pour obtenir un résultat professionnel rapidement.

Je vais préparer une première orientation adaptée à votre activité.

Si vous avez un objectif précis comme plus de visibilité, plus de clients, une meilleure image ou plus d'automatisation, vous pouvez simplement répondre à ce message.

À très vite,
Julien
JS-Innov.ia`
  },
  {
    step: 2,
    subject: "Première recommandation pour votre projet",
    body: (prenom) => `Bonjour ${prenom},

Après analyse, je vous recommande de commencer par une base simple, claire et professionnelle : une page d'accueil forte, une offre lisible, un formulaire de contact efficace et une structure SEO propre.

Je peux ensuite ajouter les automatisations selon votre objectif.

Julien – JS-Innov.ia`
  },
  {
    step: 3,
    subject: "Voulez-vous que je prépare une première structure ?",
    body: (prenom) => `Bonjour ${prenom},

Je peux vous préparer une première structure de site adaptée à votre activité : couleurs, sections, textes, pages et logique de conversion.

Répondez simplement à ce message avec "oui" et je m'en occupe.

Julien – JS-Innov.ia`
  },
  {
    step: 4,
    subject: "Dernier suivi concernant votre projet",
    body: (prenom) => `Bonjour ${prenom},

Je reviens vers vous une dernière fois concernant votre demande.

Si le projet est toujours d'actualité, je peux vous proposer une base claire : site vitrine, vitrine de vente, dashboard admin ou automatisation.

Julien – JS-Innov.ia`
  }
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { project_request_id, step } = body;

    // Get the project request
    const requests = await base44.asServiceRole.entities.ProjectRequest.filter({ id: project_request_id });
    if (!requests || requests.length === 0) {
      return Response.json({ error: 'Project request not found' }, { status: 404 });
    }
    const pr = requests[0];

    if (!pr.email_sequence_enabled) {
      return Response.json({ message: 'Email sequence disabled for this request' });
    }

    const template = EMAIL_TEMPLATES.find(t => t.step === step);
    if (!template) {
      return Response.json({ error: 'Template not found' }, { status: 404 });
    }

    const prenom = pr.prenom || pr.name?.split(' ')[0] || 'vous';
    const emailBody = template.body(prenom);

    // Send email
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: pr.email,
      subject: template.subject,
      body: emailBody,
      from_name: 'Julien — JS-Innov.ia',
    });

    // Log the email
    await base44.asServiceRole.entities.EmailLog.create({
      project_request_id: project_request_id,
      client_email: pr.email,
      client_name: pr.name,
      subject: template.subject,
      body: emailBody,
      status: 'envoyé',
      sequence_step: step,
      sent_at: new Date().toISOString(),
    });

    // Update sequence step on the request
    await base44.asServiceRole.entities.ProjectRequest.update(project_request_id, {
      email_sequence_step: step,
    });

    return Response.json({ success: true, step, email: pr.email });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});