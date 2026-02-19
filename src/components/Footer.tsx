import { Leaf } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string, scrollTo?: string) => {
    const isHome = location.pathname === "/";

    if (path === "/" && isHome && scrollTo) {
      // Already on home — just scroll to the section
      document.getElementById(scrollTo)?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    navigate(path);
    // Wait for page render, then scroll
    setTimeout(() => {
      if (scrollTo) {
        document.getElementById(scrollTo)?.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 150);
  };

  return (
    <footer id="kontakt" className="bg-foreground text-primary-foreground py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Leaf className="h-6 w-6" />
              <span className="font-display text-xl font-bold">FreshBite</span>
            </div>
            <p className="text-primary-foreground/70 text-sm">
              Fersk mat laget med kjærlighet. Vi bruker kun lokale råvarer av høyeste kvalitet.
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button onClick={() => handleNavigate("/", "meny")} className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors bg-transparent border-none cursor-pointer">Meny</button>
              <button onClick={() => handleNavigate("/om-oss")} className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors bg-transparent border-none cursor-pointer">Om oss</button>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-3">Åpningstider</h4>
            <div className="space-y-1 text-sm text-primary-foreground/70">
              <p>Man – Fre: 10:00 – 22:00</p>
              <p>Lør: 11:00 – 23:00</p>
              <p>Søn: 12:00 – 21:00</p>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-3">Kontakt</h4>
            <div className="space-y-1 text-sm text-primary-foreground/70">
              <p>Storgata 1, 0155 Oslo</p>
              <p>post@freshbite.no</p>
              <p>+47 22 33 44 55</p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-sm text-primary-foreground/50">
          © 2026 FreshBite. Alle rettigheter reservert.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
