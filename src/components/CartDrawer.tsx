import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { CartItem } from "@/types/food";
import { toast } from "sonner";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  totalPrice: number;
}

const CartDrawer = ({
  open,
  onOpenChange,
  items,
  onAdd,
  onRemove,
  onClear,
  totalPrice,
}: CartDrawerProps) => {
  const handleOrder = () => {
    toast.success("Bestilling sendt! 🎉", {
      description: `Total: ${totalPrice} kr. Du vil motta en bekreftelse snart.`,
    });
    onClear();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-background flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-display text-xl flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Handlekurv
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p className="font-medium">Kurven er tom</p>
              <p className="text-sm mt-1">Legg til noe godt fra menyen!</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-3 mt-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 bg-card p-3 rounded-lg border border-border"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-md object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-card-foreground truncate">
                      {item.name}
                    </p>
                    <p className="text-primary font-semibold text-sm">
                      {item.price * item.quantity} kr
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onRemove(item.id)}
                      className="h-7 w-7 rounded-full bg-muted flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onAdd(item)}
                      className="h-7 w-7 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-3 mt-auto">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Totalt</span>
                <span className="text-xl font-display font-bold text-foreground">
                  {totalPrice} kr
                </span>
              </div>
              <Button
                onClick={handleOrder}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg font-semibold"
              >
                Bestill nå
              </Button>
              <Button
                onClick={onClear}
                variant="ghost"
                className="w-full text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Tøm kurven
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
