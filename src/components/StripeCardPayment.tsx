import { useState, useEffect } from "react";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getStripe, createPaymentIntent } from "@/services/stripeService";

interface StripeCardFormProps {
  totalPrice: number;
  onPaymentSuccess: (reference: string) => void;
  isPaymentCompleted: boolean;
}

const StripeCardForm = ({ totalPrice, onPaymentSuccess, isPaymentCompleted }: StripeCardFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) return;

    try {
      setIsProcessing(true);

      const clientSecret = await createPaymentIntent(totalPrice);
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error("Kortfelt ikke funnet.");
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (error) {
        throw new Error(error.message ?? "Betaling feilet.");
      }

      if (paymentIntent?.status === "succeeded") {
        onPaymentSuccess(paymentIntent.id);
        toast.success("Betaling godkjent", {
          description: `Referanse: ${paymentIntent.id.slice(0, 12)}`,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Noe gikk galt med betaling.";
      toast.error("Betaling feilet", { description: message });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="bg-background border border-input rounded-md p-3">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#1f2937",
                "::placeholder": { color: "#9ca3af" },
              },
            },
            hidePostalCode: true,
          }}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Stripe testmodus — bruk kortnummer 4242 4242 4242 4242, vilkårlig utløp og CVC.
      </p>
      <Button
        onClick={handlePay}
        disabled={isProcessing || !stripe}
        className="w-full"
        variant={isPaymentCompleted ? "secondary" : "default"}
      >
        {isProcessing
          ? "Behandler betaling..."
          : isPaymentCompleted
            ? "Betaling fullført"
            : `Betal ${totalPrice} kr`}
      </Button>
    </div>
  );
};

interface StripeCardPaymentProps {
  totalPrice: number;
  onPaymentSuccess: (reference: string) => void;
  isPaymentCompleted: boolean;
}

const StripeCardPayment = ({ totalPrice, onPaymentSuccess, isPaymentCompleted }: StripeCardPaymentProps) => {
  const [stripeReady, setStripeReady] = useState(false);
  const stripePromise = getStripe();

  useEffect(() => {
    if (stripePromise) {
      stripePromise.then((s) => setStripeReady(!!s));
    }
  }, [stripePromise]);

  if (!stripePromise || !stripeReady) {
    return null;
  }

  return (
    <Elements stripe={stripePromise}>
      <StripeCardForm
        totalPrice={totalPrice}
        onPaymentSuccess={onPaymentSuccess}
        isPaymentCompleted={isPaymentCompleted}
      />
    </Elements>
  );
};

export default StripeCardPayment;
