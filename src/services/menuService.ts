import { menuItems as fallbackMenuItems } from "@/data/menu";
import { supabase } from "@/lib/supabase";
import { FoodItem } from "@/types/food";

export const getMenuItems = async (): Promise<FoodItem[]> => {
  if (!supabase) {
    return fallbackMenuItems;
  }

  const { data, error } = await supabase
    .from("menu_items")
    .select("id, name, description, price, category, image, badge")
    .order("name", { ascending: true });

  if (error || !data) {
    return fallbackMenuItems;
  }

  // Deduplicate by name — keep the first occurrence of each unique item
  const seen = new Set<string>();
  const unique = data.filter((item) => {
    const key = item.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return unique;
};
