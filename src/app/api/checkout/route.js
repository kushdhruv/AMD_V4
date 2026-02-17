
import Stripe from "stripe";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { planId, userId, email } = await request.json();

    if (!planId || !userId) {
      return Response.json({ error: "Missing planId or userId" }, { status: 400 });
    }

    // Map planId to Stripe Price ID (Replace with real Price IDs)
    const PLANS = {
      creator: {
        priceId: process.env.STRIPE_PRICE_CREATOR, // e.g. price_123...
        credits: 1000,
        name: "Creator Plan"
      },
      pro: {
        priceId: process.env.STRIPE_PRICE_PRO,
        credits: 5000,
        name: "Pro Agency Plan"
      }
    };

    const selectedPlan = PLANS[planId];
    if (!selectedPlan) {
      return Response.json({ error: "Invalid plan" }, { status: 400 });
    }

    const origin = headers().get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: email, // Pre-fill email
      line_items: [
        {
          price: selectedPlan.priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId,
        planId: planId,
        credits: selectedPlan.credits,
      },
      success_url: `${origin}/dashboard/pricing?success=true`,
      cancel_url: `${origin}/dashboard/pricing?canceled=true`,
    });

    return Response.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    console.error("Stripe Checkout Error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
