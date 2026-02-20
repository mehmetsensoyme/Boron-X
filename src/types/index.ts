export interface Cafe {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  description?: string;
  website?: string;
  menu_url?: string;
  created_at: string;
}

export interface CoffeePrice {
  id: string;
  cafe_id: string;
  item_name: string; // örn: "Latte", "Americano"
  price: number;
  currency: string; // örn: "TRY", "USD"
  updated_at: string;
}

export interface Review {
  id: string;
  cafe_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface CafeWithPrices extends Cafe {
  prices: CoffeePrice[];
  avg_rating?: number;
}
