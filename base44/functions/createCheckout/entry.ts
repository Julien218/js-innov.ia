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

    const { productType, productId, productName, price } = await req.json();

    // Get app URL from request
    const url = new URL(req.url);
    const origin = url.origin;

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: productName,
              description: `${productType} - ${productName}`,
            },
            unit_amount: Math.round(price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        user_id: user.id,
        user_email: user.email,
        product_type: productType,
        product_id: productId,
      },
      success_url: `${origin}/#/PaymentSuccess?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#/PaymentCancel`,
    });

    return Response.json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error) {
    console.error('Stripe error:', error);
    return Response.json({ 
      error: error.message || 'Erreur lors de la création de la session de paiement' 
    }, { status: 500 });
  }
});