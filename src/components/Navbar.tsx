import { ShoppingCart, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
}

const Navbar = ({ cartCount, onCartClick }: NavbarProps) => {
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        <div className="flex items-center gap-2">
          <Leaf className="h-7 w-7 text-primary" />
          <span className="font-display text-2xl font-bold text-foreground">
            FreshBite
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#meny" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
            Meny
          </a>
          <a href="#om-oss" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
            Om oss
          </a>
          <a href="#kontakt" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
            Kontakt
          </a>
        </div>

        <Button
          onClick={onCartClick}
          variant="outline"
          className="relative border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all"
        >
          <ShoppingCart className="h-5 w-5" />
          <span className="ml-2 hidden sm:inline">Handlekurv</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-scale-in">
              {cartCount}
            </span>
          )}
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
