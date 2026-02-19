import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MenuSection from "@/components/MenuSection";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { useCart } from "@/hooks/useCart";

const Index = () => {
  const { items, addItem, removeItem, clearCart, totalItems, totalPrice, isOpen, setIsOpen } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={totalItems} onCartClick={() => setIsOpen(true)} />
      <HeroSection />
      <MenuSection onAddToCart={addItem} />
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

export default Index;
