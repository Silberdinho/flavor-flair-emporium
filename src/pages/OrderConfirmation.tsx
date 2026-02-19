import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCartContext } from "@/context/CartContext";
import { useLocation, Navigate, Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderConfirmationState {
  orderId: string;
  totalPrice: number;
  customerName: string;
  customerEmail: string;
  items: Array<{ name: string; quantity: number; price: number }>;
}

const OrderConfirmation = () => {
  const { totalItems, setIsOpen } = useCartContext();
  const location = useLocation();
  const order = location.state as OrderConfirmationState | null;

  if (!order) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={totalItems} onCartClick={() => setIsOpen(true)} />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-lg">
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              Takk for bestillingen!
            </h1>
            <p className="text-muted-foreground text-lg">
              Vi har mottatt bestillingen din og jobber med den nå.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <span className="text-muted-foreground text-sm">Ordrenummer</span>
              <span className="font-mono font-semibold text-foreground">
                {order.orderId.slice(0, 8).toUpperCase()}
              </span>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Bestilt av</h3>
              <p className="text-card-foreground text-sm">{order.customerName}</p>
              <p className="text-muted-foreground text-sm">{order.customerEmail}</p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Varer</h3>
              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-card-foreground">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="text-muted-foreground">
                      {item.price * item.quantity} kr
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-border pt-3">
              <span className="font-semibold text-foreground">Totalt</span>
              <span className="text-xl font-display font-bold text-primary">
                {order.totalPrice} kr
              </span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/">Tilbake til menyen</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
