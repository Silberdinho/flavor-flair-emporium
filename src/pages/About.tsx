import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCartContext } from "@/context/CartContext";
import { Link } from "react-router-dom";
import { Leaf, Truck, Heart } from "lucide-react";

const About = () => {
  const { items, addItem, removeItem, clearCart, totalItems, totalPrice, isOpen, setIsOpen } = useCartContext();

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={totalItems} onCartClick={() => setIsOpen(true)} />

      {/* Hero banner */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&h=600&fit=crop"
          alt="Restaurant mat"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-foreground/60" />
        <div className="relative container mx-auto px-4 max-w-3xl text-center">
          <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
            Om FreshBite
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto">
            Vi lager fersk, smakfull mat med lokale råvarer og raske leveringer — hver eneste dag.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="flex justify-center mb-3">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-card-foreground mb-2">Lokale råvarer</h3>
              <p className="text-muted-foreground text-sm">
                Vi samarbeider med lokale produsenter for å sikre de ferskeste ingrediensene.
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="flex justify-center mb-3">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-card-foreground mb-2">Laget med kjærlighet</h3>
              <p className="text-muted-foreground text-sm">
                Hver rett lages fra bunnen av med fokus på kvalitet og smak.
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="flex justify-center mb-3">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-card-foreground mb-2">Rask levering</h3>
              <p className="text-muted-foreground text-sm">
                Bestill enkelt og få maten levert raskt rett hjem til deg.
              </p>
            </div>
          </div>

          {/* Story */}
          <div className="bg-card border border-border rounded-lg p-6 md:p-8 space-y-4 text-center max-w-2xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-card-foreground">Vår historie</h2>
            <p className="text-card-foreground leading-relaxed">
              FreshBite ble startet med et enkelt mål: gjøre det lett å spise godt i en travel hverdag.
              Vi samarbeider med lokale produsenter, lager maten fra bunnen av og leverer med fokus på kvalitet i hvert eneste måltid.
            </p>
            <p className="text-card-foreground leading-relaxed">
              Enten du bestiller lunsj på farten eller middag til hele familien, skal opplevelsen være trygg,
              enkel og like god hver gang.
            </p>

            <div className="pt-4">
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/">Se menyen</Link>
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
