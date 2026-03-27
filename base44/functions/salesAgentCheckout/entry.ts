import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import Stripe from 'npm:stripe@14.11.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'), {
  apiVersion: '2023-10-16',
});

const PLANS = {
  Starter: { name: 'Plan Starter', price: 19, description: 'AI SEO + Content Generator, 50 générations/mois' },
  Pro: { name: 'Plan Pro', price: 39, description: 'SEO + Content + AI Music, 200 générations/mois' },
  Business: { name: 'Plan Business', price: 79, description: 'Tout inclus + Automation Agents, illimité' }
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { plan, email } = await req.json();

    const planData = PLANS[plan];
    if (!planData) {
      return Response.json({ error: 'Plan invalide' }, { status: 400 });
    }

    const origin = new URL(req.url).origin;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email || undefined,
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: planData.name,
            description: planData.description,
          },
          unit_amount: planData.price * 100,
          recurring: { interval: 'month' }
        },
        quantity: 1,
      }],
      success_url: `${origin}/#/PaymentSuccess?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#/PaymentCancel`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});