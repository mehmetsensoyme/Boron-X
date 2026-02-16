import { supabase } from '@/lib/supabase';
import { CafeWithPrices } from '@/types';

const MOCK_CAFES: CafeWithPrices[] = [
  {
    id: 'mock-1',
    name: 'Boron-X Lab Coffee',
    latitude: 41.0122,
    longitude: 28.9760,
    address: 'Sultanahmet, İstanbul',
    prices: [
      { id: 'p1', cafe_id: 'mock-1', item_name: 'Latte', price: 85, currency: 'TRY', updated_at: new Date().toISOString() },
      { id: 'p2', cafe_id: 'mock-1', item_name: 'Americano', price: 70, currency: 'TRY', updated_at: new Date().toISOString() }
    ],
    avg_rating: 4.9,
    created_at: new Date().toISOString()
  }
];

export const cafeService = {
  async getAllCafes(): Promise<CafeWithPrices[]> {
    try {
      const { data, error } = await supabase
        .from('cafes')
        .select('*, prices(*), reviews(rating)');

      if (error || !data) throw error;

      return (data as any[]).map(cafe => ({
        ...cafe,
        avg_rating: cafe.reviews?.length 
          ? cafe.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / cafe.reviews.length 
          : 0
      }));
    } catch (error) {
      // Supabase bağlı değilse veya hata verirse mock verileri dön
      console.warn('Supabase not connected, using offline mock data.');
      return MOCK_CAFES;
    }
  },

  async updatePrice(cafeId: string, itemName: string, price: number, currency: string) {
    try {
      const { data, error } = await supabase
        .from('prices')
        .upsert({ 
          cafe_id: cafeId, 
          item_name: itemName, 
          price, 
          currency, 
          updated_at: new Date().toISOString() 
        });
      if (error) throw error;
      return data;
    } catch (e) {
      return null;
    }
  }
};
