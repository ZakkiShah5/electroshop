import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const isRealKey = (key) =>
  key && key.startsWith('sk_') && key.length > 40 && !key.includes('placeholder');

export async function POST(request) {
  const key = process.env.STRIPE_SECRET_KEY;

  // No real key configured — signal the client to use demo mode
  if (!isRealKey(key)) {
    return NextResponse.json({ demo: true });
  }

  try {
    const stripe = new Stripe(key);
    const { amount } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('[Stripe]', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
