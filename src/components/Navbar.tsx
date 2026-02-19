import { ShoppingCart, Leaf, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
}

interface NavLinkItem {
  label: string;
  to?: string;
  scrollTo?: string;
}

const navLinks: NavLinkItem[] = [
  { scrollTo: "meny", label: "Meny" },
  { to: "/om-oss", label: "Om oss" },
  { scrollTo: "kontakt", label: "Kontakt" },
];

const scrollToElement = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

const Navbar = ({ cartCount, onCartClick }: NavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = (link: NavLinkItem) => {
    if (link.to) {
      navigate(link.to);
    } else if (link.scrollTo) {
      // If not on home page, navigate home first then scroll
      if (window.location.hash !== "#/" && window.location.hash !== "") {
        navigate("/");
        setTimeout(() => scrollToElement(link.scrollTo!), 100);
      } else {
        scrollToElement(link.scrollTo);
      }
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        <Link to="/" className="flex items-center gap-2">
          <Leaf className="h-7 w-7 text-primary" />
          <span className="font-display text-2xl font-bold text-foreground">
            FreshBite
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link)}
              className="text-muted-foreground hover:text-foreground transition-colors font-medium bg-transparent border-none cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
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

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Åpne meny"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  handleNavClick(link);
                  setMobileOpen(false);
                }}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2 bg-transparent border-none cursor-pointer text-left"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
