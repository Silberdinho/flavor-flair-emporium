import { supabase } from "@/lib/supabase";
import { CartItem } from "@/types/food";
import { CheckoutContactInfo } from "@/types/order";

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const createUuid = () => {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  const bytes = new Uint8Array(16);
  globalThis.crypto.getRandomValues(bytes);

  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

export const createOrder = async (
  items: CartItem[],
  totalPrice: number,
  contactInfo: CheckoutContactInfo,
  paymentReference: string,
): Promise<string> => {
  if (!supabase) {
    throw new Error("Supabase er ikke konfigurert.");
  }

  if (items.length === 0) {
    throw new Error("Handlekurven er tom.");
  }

  if (!paymentReference.trim()) {
    throw new Error("Betaling må fullføres før bestilling.");
  }

  const orderId = createUuid();

  const normalizedContact = {
    fullName: contactInfo.fullName.trim(),
    email: contactInfo.email.trim().toLowerCase(),
    phone: contactInfo.phone.trim(),
    address: contactInfo.address.trim(),
    postalCode: contactInfo.postalCode.trim(),
    city: contactInfo.city.trim(),
    comment: contactInfo.comment?.trim() || null,
  };

  const { error: orderError } = await supabase
    .from("orders")
    .insert({
      id: orderId,
      total_price: totalPrice,
      status: "pending",
      customer_name: normalizedContact.fullName,
      customer_email: normalizedContact.email,
      customer_phone: normalizedContact.phone,
      customer_address: normalizedContact.address,
      customer_postal_code: normalizedContact.postalCode,
      customer_city: normalizedContact.city,
      customer_comment: normalizedContact.comment,
      payment_status: "paid",
      payment_method: "card_test",
      payment_reference: paymentReference,
    });

  if (orderError) {
    if (
      orderError.message.includes("schema cache") ||
      orderError.message.includes("Could not find the") ||
      orderError.message.includes("customer_")
    ) {
      throw new Error(
        "Databasen mangler checkout-kolonner. Kjør `supabase/schema.sql` på nytt i Supabase SQL Editor, og kjør deretter `select pg_notify('pgrst', 'reload schema');`.",
      );
    }

    throw new Error(`Kunne ikke opprette bestilling. (${orderError.message})`);
  }

  const orderItems = items.map((item) => ({
    order_id: orderId,
    menu_item_id: uuidRegex.test(item.id) ? item.id : null,
    item_name: item.name,
    quantity: item.quantity,
    unit_price: item.price,
    line_total: item.price * item.quantity,
  }));

  const { error: orderItemsError } = await supabase.from("order_items").insert(orderItems);

  if (orderItemsError) {
    throw new Error(`Kunne ikke lagre bestillingslinjer. (${orderItemsError.message})`);
  }

  return orderId;
};
