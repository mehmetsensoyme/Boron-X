import { create } from 'zustand';
import { CafeWithPrices } from '@/types';
import { cafeService } from '@/services/cafeService';
import { mapService } from '@/services/mapService';
import { currencyService } from '@/services/currencyService';

interface AppState {
  theme: 'light' | 'dark' | 'system';
  language: 'tr' | 'en';
  currency: string;
  rates: any;
  fontSize: 'compact' | 'comfortable';
  cafes: CafeWithPrices[];
  selectedCafe: CafeWithPrices | null;
  isSidebarOpen: boolean;
  sidebarType: 'settings' | 'details' | 'report';
  isLoading: boolean;
  
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (lang: 'tr' | 'en') => void;
  setCurrency: (currency: string) => void;
  setFontSize: (size: 'compact' | 'comfortable') => void;
  setSelectedCafe: (cafe: CafeWithPrices | null) => void;
  setSidebarOpen: (isOpen: boolean, type?: 'settings' | 'details' | 'report') => void;
  fetchCafes: (lat?: number, lon?: number) => Promise<void>;
  fetchRates: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  theme: 'system',
  language: 'tr',
  currency: 'TRY',
  rates: null,
  fontSize: 'comfortable',
  cafes: [],
  selectedCafe: null,
  isSidebarOpen: false,
  sidebarType: 'details',
  isLoading: false,
  
  setTheme: (theme) => set({ theme }),
  setLanguage: (lang) => set({ language: lang }),
  setCurrency: (currency) => set({ currency }),
  setFontSize: (size) => set({ fontSize: size }),
  setSelectedCafe: (cafe) => set({ selectedCafe: cafe, isSidebarOpen: !!cafe, sidebarType: 'details' }),
  setSidebarOpen: (isOpen, type = 'details') => set({ isSidebarOpen: isOpen, sidebarType: type }),
  
  fetchCafes: async (lat = 41.0082, lon = 28.9784) => {
    set({ isLoading: true });
    const [dbCafes, osmCafes] = await Promise.all([
      cafeService.getAllCafes(),
      mapService.fetchNearbyCafes(lat, lon)
    ]);
    const combinedCafes = [...dbCafes];
    osmCafes.forEach(osmCafe => {
      if (!combinedCafes.find(c => c.name === osmCafe.name)) {
        combinedCafes.push(osmCafe);
      }
    });
    set({ cafes: combinedCafes, isLoading: false });
  },

  fetchRates: async () => {
    const rates = await currencyService.getExchangeRates();
    set({ rates });
  }
}));
