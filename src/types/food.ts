export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  badge?: string;
}

export interface CartItem extends FoodItem {
  quantity: number;
}
