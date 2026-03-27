import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

// Fonction de calcul du devis
function calculateQuoteEstimate(formData) {
  let baseLow = 0;
  let baseHigh = 0;

  // Base selon le type de projet
  if (formData.type_projet === 'Création de site Internet') {
    baseLow = 1500;
    baseHigh = 3000;
  } else if (formData.type_projet === 'Rénovation de site existant') {
    baseLow = 1000;
    baseHigh = 2500;
  } else if (formData.type_projet === 'Ajout de fonctionnalités / innovation') {
    baseLow = 800;
    baseHigh = 2000;
  }

  // Coût par fonctionnalité
  const fonctionnaliteCosts = {
    'Formulaire avancé': { low: 200, high: 500 },
    'Devis automatique': { low: 500, high: 1200 },
    'Paiement en ligne': { low: 800, high: 1500 },
    'Prise de rendez-vous': { low: 400, high: 800 },
    'Espace client': { low: 1000, high: 2000 },
    'Chat / chatbot': { low: 600, high: 1200 },
    'Newsletter': { low: 200, high: 400 },
    'Multilingue': { low: 500, high: 1000 },
    'SEO avancé': { low: 600, high: 1200 },
    'Automatisations internes': { low: 800, high: 1800 },
    'Maintenance & sécurité': { low: 300, high: 600 }
  };

  // Ajouter les coûts des fonctionnalités
  formData.fonctionnalites.forEach(fonc => {
    if (fonctionnaliteCosts[fonc]) {
      baseLow += fonctionnaliteCosts[fonc].low;
      baseHigh += fonctionnaliteCosts[fonc].high;
    }
  });

  // Ajustement selon l'urgence
  if (formData.delai === 'Urgent') {
    baseLow *= 1.3;
    baseHigh *= 1.3;
  } else if (formData.delai === 'Standard') {
    baseLow *= 1.1;
    baseHigh *= 1.1;
  }

  // Ajustement selon le style (créatif = plus cher)
  if (formData.style_souhaite === 'Luxe' || formData.style_souhaite === 'Créatif') {
    baseLow *= 1.2;
    baseHigh *= 1.2;
  }

  return {
    fourchette_basse: Math.round(baseLow),
    fourchette_haute: Math.round(baseHigh)
  };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const formData = await req.json();

    // Créer ou mettre à jour le client
    const existingCustomers = await base44.asServiceRole.entities.Customer.filter({
      email: formData.email
    });

    let customer;
    if (existingCustomers.length > 0) {
      customer = existingCustomers[0];
      await base44.asServiceRole.entities.Customer.update(customer.id, {
        prenom: formData.prenom,
        nom: formData.nom,
        telephone: formData.telephone || customer.telephone,
        entreprise: formData.entreprise || customer.entreprise,
        secteur_activite: formData.secteur_activite || customer.secteur_activite
      });
    } else {
      customer = await base44.asServiceRole.entities.Customer.create({
        prenom: formData.prenom,
        nom: formData.nom,
        email: formData.email,
        telephone: formData.telephone,
        entreprise: formData.entreprise,
        secteur_activite: formData.secteur_activite
      });
    }

    // Créer le projet
    const project = await base44.asServiceRole.entities.Project.create({
      customer_id: customer.id,
      type_projet: formData.type_projet,
      url_site_existant: formData.url_site_existant,
      problemes_site: formData.problemes_site,
      ameliorations_site: formData.ameliorations_site,
      objectifs: formData.objectifs,
      fonctionnalites: formData.fonctionnalites,
      style_souhaite: formData.style_souhaite,
      liens_reference: formData.liens_reference,
      budget_indicatif: formData.budget_indicatif,
      delai: formData.delai
    });

    // Calculer le devis
    const estimate = calculateQuoteEstimate(formData);

    // Créer le résumé de la demande
    const resume = `${formData.prenom} ${formData.nom} (${formData.email}) souhaite ${formData.type_projet.toLowerCase()}. 
Objectifs: ${formData.objectifs.join(', ')}. 
Fonctionnalités: ${formData.fonctionnalites.join(', ')}. 
Style: ${formData.style_souhaite}. 
Budget: ${formData.budget_indicatif}. 
Délai: ${formData.delai}.`;

    // Créer le devis
    const quote = await base44.asServiceRole.entities.Quote.create({
      project_id: project.id,
      customer_id: customer.id,
      fourchette_basse: estimate.fourchette_basse,
      fourchette_haute: estimate.fourchette_haute,
      statut: 'À valider',
      date_soumission: new Date().toISOString(),
      resume_demande: resume
    });

    // Envoyer l'email de confirmation immédiat
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: formData.email,
      subject: 'Nous avons bien reçu votre demande de devis',
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8b5cf6;">Bonjour ${formData.prenom},</h2>
          <p>Merci pour votre demande de devis pour votre projet : <strong>${formData.type_projet}</strong>.</p>
          <p>Nous analysons actuellement votre demande afin de vous envoyer une estimation personnalisée.</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p style="margin: 0; font-size: 18px;">⏱️ Vous recevrez votre devis par email sous environ <strong style="color: #ec4899;">40 minutes</strong>.</p>
          </div>
          <p>Cordialement,</p>
          <p><strong>L'équipe JS-INNOV.IA</strong></p>
        </div>
      `
    });

    // Déclencher la fonction de workflow différé (elle attendra 40 minutes)
    // On utilise une fonction asynchrone non bloquante
    fetch(`${Deno.env.get('BASE44_FUNCTION_URL') || 'https://app.base44.com'}/api/functions/sendDelayedQuote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.get('Authorization')
      },
      body: JSON.stringify({
        quote_id: quote.id,
        customer_email: formData.email,
        customer_prenom: formData.prenom,
        type_projet: formData.type_projet,
        fonctionnalites: formData.fonctionnalites,
        fourchette_basse: estimate.fourchette_basse,
        fourchette_haute: estimate.fourchette_haute
      })
    }).catch(err => console.error('Erreur déclenchement workflow:', err));

    return Response.json({
      success: true,
      quote_id: quote.id,
      message: 'Demande enregistrée avec succès'
    });

  } catch (error) {
    console.error('Erreur:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});