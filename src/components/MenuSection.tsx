import { useEffect, useMemo, useState } from "react";
import FoodCard from "./FoodCard";
import { menuItems as fallbackMenuItems } from "@/data/menu";
import { FoodItem } from "@/types/food";
import { getMenuItems } from "@/services/menuService";

interface MenuSectionProps {
  onAddToCart: (item: FoodItem) => void;
}

const MenuSection = ({ onAddToCart }: MenuSectionProps) => {
  const [activeCategory, setActiveCategory] = useState("Alle");
  const [menuItems, setMenuItems] = useState<FoodItem[]>(fallbackMenuItems);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMenu = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedItems = await getMenuItems();
      setMenuItems(fetchedItems);
    } catch {
      setError("Kunne ikke laste menyen. Viser hurtigmeny i mellomtiden.");
      setMenuItems(fallbackMenuItems);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadMenu();
  }, []);

  const categories = useMemo(
    () => ["Alle", ...Array.from(new Set(menuItems.map((item) => item.category)))],
    [menuItems],
  );

  const filtered =
    activeCategory === "Alle"
      ? menuItems
      : menuItems.filter((i) => i.category === activeCategory);

  return (
    <section id="meny" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            Vår Meny
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Utforsk våre ferske og smakfulle retter laget med lokale råvarer
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full font-medium text-sm transition-all ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {error && (
          <div className="text-center mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg max-w-md mx-auto">
            <p className="text-sm text-destructive mb-2">{error}</p>
            <button
              onClick={() => void loadMenu()}
              className="text-sm font-medium text-primary hover:underline"
            >
              Prøv igjen
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card rounded-lg border border-border overflow-hidden animate-pulse">
                <div className="h-48 bg-muted" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-muted rounded w-2/3" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-10 bg-muted rounded w-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, i) => (
            <div
              key={item.id}
              className="animate-fade-in-up h-full"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <FoodCard item={item} onAdd={onAddToCart} />
            </div>
          ))}
        </div>
        )}
      </div>
    </section>
  );
};

export default MenuSection;
