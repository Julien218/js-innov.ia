import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import Stripe from 'npm:stripe@14.11.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'), {
  apiVersion: '2023-10-16',
});

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { sessionId } = await req.json();

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return Response.json({
      status: session.payment_status,
      customerEmail: session.customer_email,
      amountTotal: session.amount_total / 100,
      metadata: session.metadata,
    });
  } catch (error) {
    console.error('Error retrieving payment status:', error);
    return Response.json({ 
      error: 'Erreur lors de la récupération du statut de paiement' 
    }, { status: 500 });
  }
});