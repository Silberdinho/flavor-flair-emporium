// supabase/functions/send-order-email/index.ts
// Deploy: supabase functions deploy send-order-email --no-verify-jwt
// Secrets: supabase secrets set RESEND_API_KEY=re_...

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not set");
    }

    const { orderId, customerName, customerEmail, totalPrice, items } = await req.json();

    if (!customerEmail || !orderId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const itemRows = (items ?? [])
      .map((item: { name: string; quantity: number; price: number }) =>
        `<tr><td style="padding:6px 12px">${item.quantity}x ${item.name}</td><td style="padding:6px 12px;text-align:right">${item.price * item.quantity} kr</td></tr>`,
      )
      .join("");

    const html = `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#16a34a">Takk for bestillingen, ${customerName}!</h2>
        <p>Vi har mottatt bestillingen din og jobber med den nå.</p>
        <p><strong>Ordrenummer:</strong> ${orderId.slice(0, 8).toUpperCase()}</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <thead><tr style="border-bottom:1px solid #e5e7eb">
            <th style="text-align:left;padding:6px 12px">Vare</th>
            <th style="text-align:right;padding:6px 12px">Pris</th>
          </tr></thead>
          <tbody>${itemRows}</tbody>
          <tfoot><tr style="border-top:2px solid #16a34a">
            <td style="padding:8px 12px;font-weight:bold">Totalt</td>
            <td style="padding:8px 12px;text-align:right;font-weight:bold">${totalPrice} kr</td>
          </tr></tfoot>
        </table>
        <p style="color:#6b7280;font-size:14px">Hilsen FreshBite-teamet</p>
      </div>
    `;

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "FreshBite <onboarding@resend.dev>",
        to: [customerEmail],
        subject: `Ordrebekreftelse — ${orderId.slice(0, 8).toUpperCase()}`,
        html,
      }),
    });

    if (!emailRes.ok) {
      const errBody = await emailRes.text();
      throw new Error(`Resend API error: ${errBody}`);
    }

    const emailData = await emailRes.json();

    return new Response(
      JSON.stringify({ success: true, emailId: emailData.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
