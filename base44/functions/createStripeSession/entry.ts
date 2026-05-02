import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const stripe = await import('npm:stripe');
const stripeClient = new stripe.default(Deno.env.get('STRIPE_SECRET_KEY'));

const PACK_PRICES = {
  'Pack Starter': { amount: 49000, currency: 'eur', description: 'Pack Starter - Site vitrine' },
  'Pack Business': { amount: 99000, currency: 'eur', description: 'Pack Business - Génération de leads' },
  'Pack Automation': { amount: 149000, currency: 'eur', description: 'Pack Automation - Automatisations' },
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { pack, email, firstName, lastName } = body;

    if (!pack || !PACK_PRICES[pack]) {
      return Response.json({ error: 'Pack invalide' }, { status: 400 });
    }

    const priceInfo = PACK_PRICES[pack];

    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: priceInfo.currency,
            product_data: {
              name: pack,
              description: priceInfo.description,
              images: ['https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68ae1c019dacc474a322f2b2/f9316a8c1_Js-innovIA.png']
            },
            unit_amount: priceInfo.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: email || user.email,
      client_reference_id: user.id,
      metadata: {
        pack: pack,
        clientName: firstName && lastName ? `${firstName} ${lastName}` : user.full_name,
        clientEmail: email || user.email,
      },
      success_url: `${req.headers.get('origin')}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/payment-cancel`,
    });

    return Response.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});