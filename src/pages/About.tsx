import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCartContext } from "@/context/CartContext";

const About = () => {
  const { items, addItem, removeItem, clearCart, totalItems, totalPrice, isOpen, setIsOpen } = useCartContext();

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={totalItems} onCartClick={() => setIsOpen(true)} />

      <section id="om-oss" className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-3">Om oss</h1>
            <p className="text-muted-foreground text-lg">
              Vi lager fersk, smakfull mat med lokale råvarer og raske leveringer.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 md:p-8 space-y-4">
            <p className="text-card-foreground leading-relaxed">
              FreshBite ble startet med et enkelt mål: gjøre det lett å spise godt i en travel hverdag.
              Vi samarbeider med lokale produsenter, lager maten fra bunnen av og leverer med fokus på kvalitet i hvert eneste måltid.
            </p>
            <p className="text-card-foreground leading-relaxed">
              Enten du bestiller lunsj på farten eller middag til hele familien, skal opplevelsen være trygg,
              enkel og like god hver gang.
            </p>

            <div className="pt-2">
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <a href="/#meny">Se menyen</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <CartDrawer
        open={isOpen}
        onOpenChange={setIsOpen}
        items={items}
        onAdd={addItem}
        onRemove={removeItem}
        onClear={clearCart}
        totalPrice={totalPrice}
      />
    </div>
  );
};

export default About;
