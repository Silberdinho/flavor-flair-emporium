const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? "";

interface OrderEmailPayload {
  orderId: string;
  customerName: string;
  customerEmail: string;
  totalPrice: number;
  items: Array<{ name: string; quantity: number; price: number }>;
}

export const sendOrderConfirmationEmail = async (payload: OrderEmailPayload): Promise<void> => {
  try {
    const res = await fetch(`${supabaseUrl}/functions/v1/send-order-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.warn("E-postbekreftelse feilet:", await res.text());
    }
  } catch (err) {
    // Non-critical: don't block order flow
    console.warn("Kunne ikke sende e-postbekreftelse:", err);
  }
};
