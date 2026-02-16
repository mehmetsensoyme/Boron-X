import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CafeWithPrices } from '@/types';
import { cafeService } from '@/services/cafeService';
import { mapService } from '@/services/mapService';
import { currencyService } from '@/services/currencyService';

// Mock Pending Data for Admin Demo
const MOCK_PENDING = [
  { id: 'p-1', cafeName: 'Starbucks Beşiktaş', itemName: 'Latte Grande', price: 125, currency: 'TRY', user: 'ahmet@demo.com', date: '2024-02-16' },
  { id: 'p-2', cafeName: 'Espresso Lab Ortaköy', itemName: 'Cortado', price: 95, currency: 'TRY', user: 'mehmet@demo.com', date: '2024-02-16' },
];

interface User {
  email: string;
  role: 'admin' | 'user';
  isAuthenticated: boolean;
}

interface AppState {
  version: string;
  releaseNotes: string[];
  theme: 'light' | 'dark' | 'system';
  language: 'tr' | 'en';
  currency: string;
  rates: any;
  fontSize: 'compact' | 'comfortable';
  
  // Data
  cafes: CafeWithPrices[];
  selectedCafe: CafeWithPrices | null;
  mapCenter: [number, number];
  pendingApprovals: any[]; // Admin için bekleyenler
  
  // UI States
  isSidebarOpen: boolean;
  sidebarType: 'settings' | 'details' | 'report' | 'about';
  isLoading: boolean;
  
  // Auth
  currentUser: User | null;
  
  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (lang: 'tr' | 'en') => void;
  setCurrency: (currency: string) => void;
  setFontSize: (size: 'compact' | 'comfortable') => void;
  setSelectedCafe: (cafe: CafeWithPrices | null) => void;
  setMapCenter: (center: [number, number]) => void;
  setSidebarOpen: (isOpen: boolean, type?: 'settings' | 'details' | 'report' | 'about') => void;
  login: (email: string, role: 'admin' | 'user') => void;
  logout: () => void;
  approvePrice: (id: string) => void;
  rejectPrice: (id: string) => void;
  
  // Async
  fetchCafes: (lat?: number, lon?: number) => Promise<void>;
  fetchRates: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      version: 'v0.1.4-beta',
      releaseNotes: [
        // v0.1.4-beta
        'Sürüm numaraları tüm site genelinde dinamik hale getirildi.',
        'Footer ve Sidebar için senkronizasyon kontrolü yapıldı.',
        // v0.1.3-beta
        'Çıkış yapıldığında Admin Panel linkinin görünmesi engellendi.',
        'Ayarlar menüsüne güvenli çıkış butonu eklendi.',
        // v0.1.2-beta
        'Footer temizliği yapıldı ve Support linki geri eklendi.',
        // v0.1.0-beta
        'Admin paneli ve kalıcı hafıza (localStorage) entegrasyonu tamamlandı.'
      ],
      theme: 'system',
      language: 'tr',
      currency: 'TRY',
      rates: { "TRY": 31.2, "USD": 1, "EUR": 0.92, "GBP": 0.78 },
      fontSize: 'comfortable',
      cafes: [],
      selectedCafe: null,
      mapCenter: [41.0082, 28.9784],
      pendingApprovals: MOCK_PENDING,
      isSidebarOpen: false,
      sidebarType: 'details',
      isLoading: false,
      currentUser: null,

      setTheme: (theme) => set({ theme }),
      setLanguage: (lang) => set({ language: lang }),
      setCurrency: (currency) => set({ currency }),
      setFontSize: (size) => set({ fontSize: size }),
      setSelectedCafe: (cafe) => set({ selectedCafe: cafe, isSidebarOpen: !!cafe, sidebarType: 'details' }),
      
      setMapCenter: (newCenter) => {
        const currentCenter = get().mapCenter;
        const isDifferent = Math.abs(currentCenter[0] - newCenter[0]) > 0.0001 || 
                           Math.abs(currentCenter[1] - newCenter[1]) > 0.0001;
        if (isDifferent) set({ mapCenter: newCenter });
      },
      
      setSidebarOpen: (isOpen, type = 'details') => set({ isSidebarOpen: isOpen, sidebarType: type }),

      login: (email, role) => set({ currentUser: { email, role, isAuthenticated: true } }),
      logout: () => set({ currentUser: null }),

      approvePrice: (id) => set((state) => ({
        pendingApprovals: state.pendingApprovals.filter(p => p.id !== id)
      })),
      rejectPrice: (id) => set((state) => ({
        pendingApprovals: state.pendingApprovals.filter(p => p.id !== id)
      })),
      
      fetchCafes: async (lat, lon) => {
        const targetLat = lat ?? get().mapCenter[0];
        const targetLon = lon ?? get().mapCenter[1];
        set({ isLoading: true });
        try {
          const [dbCafes, osmCafes] = await Promise.all([
            cafeService.getAllCafes(),
            mapService.fetchNearbyCafes(targetLat, targetLon)
          ]);
          const combinedCafes = [...dbCafes];
          osmCafes.forEach(osmCafe => {
            if (!combinedCafes.some(c => c.name.toLowerCase() === osmCafe.name.toLowerCase())) {
              combinedCafes.push(osmCafe);
            }
          });
          set({ cafes: combinedCafes, isLoading: false, mapCenter: [targetLat, targetLon] });
        } catch (err) {
          set({ isLoading: false });
        }
      },

      fetchRates: async () => {
        try {
          const rates = await currencyService.getExchangeRates();
          if (rates) set({ rates });
        } catch (err) {}
      }
    }),
    {
      name: 'boron-x-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        theme: state.theme, 
        language: state.language, 
        currency: state.currency,
        currentUser: state.currentUser
      }),
    }
  )
);
