import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Vérifier que l'utilisateur est admin
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({
        success: false,
        error: 'Non autorisé'
      }, { status: 403 });
    }

    const { quote_id, statut, notes_internes } = await req.json();

    // Mettre à jour le statut du devis
    const updateData = { statut };
    if (notes_internes !== undefined) {
      updateData.notes_internes = notes_internes;
    }

    await base44.asServiceRole.entities.Quote.update(quote_id, updateData);

    return Response.json({
      success: true,
      message: 'Statut mis à jour'
    });

  } catch (error) {
    console.error('Erreur:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});