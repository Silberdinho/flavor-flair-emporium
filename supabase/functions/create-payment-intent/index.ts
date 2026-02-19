// supabase/functions/create-payment-intent/index.ts
// Deploy: supabase functions deploy create-payment-intent --no-verify-jwt
// Secret: supabase secrets set STRIPE_SECRET_KEY=sk_test_...

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.11.0?target=deno";

const allowedOrigin = Deno.env.get("ALLOWED_ORIGIN") || "https://silberdinho.github.io";

const corsHeaders = {
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple in-memory rate limiter (per Edge Function instance)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 10; // max 10 payment intents per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimitMap.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= RATE_LIMIT_MAX) return true;
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return false;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(clientIp)) {
    return new Response(
      JSON.stringify({ error: "For mange forespørsler. Prøv igjen om litt." }),
      { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const { amount, currency = "nok", metadata } = await req.json();

    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: "Invalid amount" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Stripe amounts are in smallest unit (øre for NOK)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
      metadata: metadata ?? {},
    });

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
