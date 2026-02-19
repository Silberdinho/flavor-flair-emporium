import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { CartItem } from "@/types/food";
import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "@/services/orderService";
import { sendOrderConfirmationEmail } from "@/services/emailService";
import { isStripeConfigured } from "@/services/stripeService";
import StripeCardPayment from "@/components/StripeCardPayment";
import { CheckoutContactInfo } from "@/types/order";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  totalPrice: number;
}

const CartDrawer = ({
  open,
  onOpenChange,
  items,
  onAdd,
  onRemove,
  onClear,
  totalPrice,
}: CartDrawerProps) => {
  const navigate = useNavigate();
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);
  const [contactInfo, setContactInfo] = useState<CheckoutContactInfo>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    postalCode: "",
    city: "",
    comment: "",
  });

  const updateContactField = (field: keyof CheckoutContactInfo, value: string) => {
    setContactInfo((prev) => ({ ...prev, [field]: value }));
  };

  const invalidatePayment = () => {
    setIsPaymentCompleted(false);
    setPaymentReference(null);
  };

  const validateContactInfo = () => {
    const requiredFields: Array<keyof CheckoutContactInfo> = [
      "fullName",
      "email",
      "phone",
      "address",
      "postalCode",
      "city",
    ];

    const missingField = requiredFields.find((field) => !contactInfo[field]?.trim());
    if (missingField) {
      return "Fyll ut navn, e-post, telefon og adresse for å fullføre kjøpet.";
    }

    if (contactInfo.fullName.trim().length < 2) {
      return "Navn må være minst 2 tegn.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactInfo.email.trim())) {
      return "E-postadressen ser ugyldig ut.";
    }

    if (!/^[\d\s+\-()]{3,20}$/.test(contactInfo.phone.trim())) {
      return "Telefonnummer ser ugyldig ut.";
    }

    if (!/^\d{4}$/.test(contactInfo.postalCode.trim())) {
      return "Postnummer må være 4 siffer.";
    }

    return null;
  };

  const handleOrder = async () => {
    if (!isPaymentCompleted || !paymentReference) {
      toast.error("Betaling kreves", {
        description: "Fullfør betaling før du sender bestillingen.",
      });
      return;
    }

    const validationError = validateContactInfo();
    if (validationError) {
      toast.error("Mangler kontaktinformasjon", {
        description: validationError,
      });
      return;
    }

    try {
      setIsSubmittingOrder(true);
      const orderId = await createOrder(items, totalPrice, contactInfo, paymentReference);

      const orderSummary = {
        orderId,
        totalPrice,
        customerName: contactInfo.fullName,
        customerEmail: contactInfo.email,
        items: items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      // Fire-and-forget email confirmation
      sendOrderConfirmationEmail(orderSummary);

      onClear();
      invalidatePayment();
      setContactInfo({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        postalCode: "",
        city: "",
        comment: "",
      });
      onOpenChange(false);

      navigate("/bekreftelse", { state: orderSummary });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Noe gikk galt ved bestilling.";
      toast.error("Kunne ikke sende bestilling", {
        description: message,
      });
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-background flex flex-col sm:max-w-lg w-full">
        <SheetHeader>
          <SheetTitle className="font-display text-xl flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Handlekurv
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p className="font-medium">Kurven er tom</p>
              <p className="text-sm mt-1">Legg til noe godt fra menyen!</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 mt-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 bg-card p-3 rounded-lg border border-border"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-md object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-card-foreground truncate">
                      {item.name}
                    </p>
                    <p className="text-primary font-semibold text-sm">
                      {item.price * item.quantity} kr
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        onRemove(item.id);
                        invalidatePayment();
                      }}
                      aria-label={`Fjern én ${item.name}`}
                      className="h-7 w-7 rounded-full bg-muted flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold" aria-label={`Antall: ${item.quantity}`}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => {
                        onAdd(item);
                        invalidatePayment();
                      }}
                      aria-label={`Legg til én ${item.name}`}
                      className="h-7 w-7 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="border border-border rounded-lg p-3 space-y-3">
                <h3 className="font-semibold text-foreground">Kontaktinformasjon</h3>
                <Input
                  value={contactInfo.fullName}
                  onChange={(event) => updateContactField("fullName", event.target.value)}
                  placeholder="Fullt navn"
                  required
                  minLength={2}
                  maxLength={100}
                />
                <Input
                  value={contactInfo.email}
                  onChange={(event) => updateContactField("email", event.target.value)}
                  placeholder="E-post"
                  type="email"
                  required
                  maxLength={254}
                />
                <Input
                  value={contactInfo.phone}
                  onChange={(event) => updateContactField("phone", event.target.value)}
                  placeholder="Telefon (f.eks. +47 123 45 678)"
                  required
                  inputMode="tel"
                  maxLength={20}
                />
                <Input
                  value={contactInfo.address}
                  onChange={(event) => updateContactField("address", event.target.value)}
                  placeholder="Gateadresse"
                  required
                  minLength={2}
                  maxLength={200}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={contactInfo.postalCode}
                    onChange={(event) => updateContactField("postalCode", event.target.value)}
                    placeholder="Postnr"
                    required
                    inputMode="numeric"
                    pattern="[0-9]{4}"
                    maxLength={4}
                  />
                  <Input
                    value={contactInfo.city}
                    onChange={(event) => updateContactField("city", event.target.value)}
                    placeholder="Sted"
                    required
                    minLength={1}
                    maxLength={100}
                  />
                </div>
                <Input
                  value={contactInfo.comment || ""}
                  onChange={(event) => updateContactField("comment", event.target.value)}
                  placeholder="Kommentar til bestilling (valgfritt)"
                />
              </div>

              <div className="border border-border rounded-lg p-3 space-y-3">
                <h3 className="font-semibold text-foreground">Betaling</h3>
                {isStripeConfigured ? (
                  <StripeCardPayment
                    totalPrice={totalPrice}
                    onPaymentSuccess={(ref) => {
                      setPaymentReference(ref);
                      setIsPaymentCompleted(true);
                    }}
                    isPaymentCompleted={isPaymentCompleted}
                  />
                ) : (
                  <p className="text-sm text-destructive">
                    Betaling er ikke tilgjengelig. Stripe er ikke konfigurert.
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-3 mt-auto">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Totalt</span>
                <span className="text-xl font-display font-bold text-foreground">
                  {totalPrice} kr
                </span>
              </div>
              <Button
                onClick={handleOrder}
                disabled={isSubmittingOrder}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg font-semibold"
              >
                {isSubmittingOrder ? "Sender..." : "Bestill nå"}
              </Button>
              <Button
                onClick={onClear}
                variant="ghost"
                className="w-full text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Tøm kurven
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
