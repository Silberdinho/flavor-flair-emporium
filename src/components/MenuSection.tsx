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

  useEffect(() => {
    const loadMenu = async () => {
      const fetchedItems = await getMenuItems();
      setMenuItems(fetchedItems);
    };

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, i) => (
            <div
              key={item.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <FoodCard item={item} onAdd={onAddToCart} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
