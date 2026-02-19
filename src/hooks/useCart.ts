import { useState, useCallback, useEffect } from "react";
import { CartItem, FoodItem } from "@/types/food";

const STORAGE_KEY = "freshbite-cart";

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // Corrupted data — start fresh
  }
  return [];
}

function saveCart(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const [isOpen, setIsOpen] = useState(false);

  // Persist to localStorage whenever items change
  useEffect(() => {
    saveCart(items);
  }, [items]);

  const addItem = useCallback((food: FoodItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === food.id);
      if (existing) {
        return prev.map((i) =>
          i.id === food.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...food, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing && existing.quantity > 1) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return { items, addItem, removeItem, clearCart, totalItems, totalPrice, isOpen, setIsOpen };
}
