import { loadStripe, Stripe } from "@stripe/stripe-js";

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.trim() ?? "";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? "";

export const isStripeConfigured = Boolean(stripePublishableKey);

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = () => {
  if (!stripePromise && isStripeConfigured) {
    stripePromise = loadStripe(stripePublishableKey);
  }
  return stripePromise;
};

export const createPaymentIntent = async (
  amount: number,
  metadata?: Record<string, string>,
): Promise<string> => {
  const res = await fetch(`${supabaseUrl}/functions/v1/create-payment-intent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify({ amount, currency: "nok", metadata }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Kunne ikke opprette betaling.");
  }

  const { clientSecret } = await res.json();
  return clientSecret;
};
