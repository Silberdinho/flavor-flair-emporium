import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FoodItem } from "@/types/food";

interface FoodCardProps {
  item: FoodItem;
  onAdd: (item: FoodItem) => void;
}

const FoodCard = ({ item, onAdd }: FoodCardProps) => {
  return (
    <div className="group bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden h-48">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {item.badge && (
          <span className="absolute top-3 left-3 bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full">
            {item.badge}
          </span>
        )}
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold text-card-foreground">
            {item.name}
          </h3>
          <span className="text-primary font-bold whitespace-nowrap">
            {item.price} kr
          </span>
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed">
          {item.description}
        </p>

        <Button
          onClick={() => onAdd(item)}
          className="w-full mt-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-1" />
          Legg til
        </Button>
      </div>
    </div>
  );
};

export default FoodCard;
