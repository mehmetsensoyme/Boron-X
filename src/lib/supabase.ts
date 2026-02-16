import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Eğer anahtarlar eksikse uygulamayı kırmak yerine bir uyarı veriyoruz
// ve dummy bir istemci oluşturuyoruz (opsiyonel hata yönetimi için).
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('BORON-X WARNING: Supabase credentials missing. App running in offline/mock mode.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);
