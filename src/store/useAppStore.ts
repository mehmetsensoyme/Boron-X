import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CafeWithPrices } from '@/types';
import { cafeService } from '@/services/cafeService';
import { mapService } from '@/services/mapService';
import { currencyService } from '@/services/currencyService';
import { APP_CONFIG, MOCK_PENDING, DEFAULT_RATES, INITIAL_MAP_CENTER } from '@/lib/constants';

// Types
export interface User {
  email: string;
  role: 'admin' | 'user';
  isAuthenticated: boolean;
}

export type SidebarType = 'settings' | 'details' | 'report' | 'about';
export type SortType = 'name' | 'price_asc' | 'rating_desc' | 'none';
export type UIScale = 'compact' | 'standard' | 'large';

interface UIState {
  theme: 'light' | 'dark' | 'system';
  language: 'tr' | 'en';
  uiScale: UIScale;
  isSidebarOpen: boolean;
  sidebarType: SidebarType;
  isLoading: boolean;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (lang: 'tr' | 'en') => void;
  setUIScale: (scale: UIScale) => void;
  setSidebarOpen: (isOpen: boolean, type?: SidebarType) => void;
  setLoading: (isLoading: boolean) => void;
}

interface AuthState {
  currentUser: User | null;
  login: (email: string, role: 'admin' | 'user') => void;
  logout: () => void;
}

interface FilterState {
  searchQuery: string;
  sortType: SortType;
  setSearchQuery: (query: string) => void;
  setSortType: (type: SortType) => void;
}

interface DataState {
  version: string;
  releaseNotes: string[];
  cafes: CafeWithPrices[];
  selectedCafe: CafeWithPrices | null;
  mapCenter: [number, number];
  pendingApprovals: any[];
  currency: string;
  rates: any;
  setSelectedCafe: (cafe: CafeWithPrices | null) => void;
  setMapCenter: (center: [number, number]) => void;
  setCurrency: (currency: string) => void;
  approvePrice: (id: string) => void;
  rejectPrice: (id: string) => void;
  fetchCafes: (lat?: number, lon?: number, bypassLoading?: boolean) => Promise<void>;
  fetchRates: () => Promise<void>;
  fetchMenuForCafe: (cafeId: string) => Promise<void>;
}

export type AppState = UIState & AuthState & FilterState & DataState;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // UI State
      theme: 'system',
      language: 'tr',
      uiScale: 'standard',
      isSidebarOpen: false,
      sidebarType: 'details',
      isLoading: false,

      setTheme: (theme) => set({ theme }),
      setLanguage: (lang) => set({ language: lang }),
      setUIScale: (uiScale) => set({ uiScale }),
      setSidebarOpen: (isOpen, type = 'details') => set({ isSidebarOpen: isOpen, sidebarType: type }),
      setLoading: (isLoading) => set({ isLoading }),

      // Auth State
      currentUser: null,
      login: (email, role) => set({ currentUser: { email, role, isAuthenticated: true } }),
      logout: () => set({ currentUser: null }),

      // Filter State
      searchQuery: '',
      sortType: 'none',
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSortType: (sortType) => set({ sortType }),

      // Data State
      version: APP_CONFIG.VERSION,
      releaseNotes: APP_CONFIG.RELEASE_NOTES,
      cafes: [],
      selectedCafe: null,
      mapCenter: INITIAL_MAP_CENTER,
      pendingApprovals: MOCK_PENDING,
      currency: 'TRY',
      rates: DEFAULT_RATES,

      setSelectedCafe: (cafe) => {
        set({ 
          selectedCafe: cafe, 
          isSidebarOpen: !!cafe, 
          sidebarType: cafe ? 'details' : get().sidebarType 
        });
        if (cafe && !cafe.menu_url) {
          get().fetchMenuForCafe(cafe.id);
        }
      },
      
      setMapCenter: (newCenter) => {
        const currentCenter = get().mapCenter;
        const isDifferent = Math.abs(currentCenter[0] - newCenter[0]) > 0.0005 || 
                           Math.abs(currentCenter[1] - newCenter[1]) > 0.0005;
        if (isDifferent) set({ mapCenter: newCenter });
      },
      
      setCurrency: (currency) => set({ currency }),

      approvePrice: (id) => set((state) => ({
        pendingApprovals: state.pendingApprovals.filter(p => p.id !== id)
      })),
      rejectPrice: (id) => set((state) => ({
        pendingApprovals: state.pendingApprovals.filter(p => p.id !== id)
      })),
      
      fetchCafes: async (lat, lon, bypassLoading = false) => {
        const targetLat = lat ?? get().mapCenter[0];
        const targetLon = lon ?? get().mapCenter[1];
        
        if (!bypassLoading) set({ isLoading: true });
        
        try {
          const [dbCafes, osmCafes] = await Promise.allSettled([
            cafeService.getAllCafes(),
            mapService.fetchNearbyCafes(targetLat, targetLon)
          ]).then(results => [
            results[0].status === 'fulfilled' ? results[0].value : [],
            results[1].status === 'fulfilled' ? results[1].value : []
          ]);

          const currentCafes = get().cafes;
          const newCafes = [...currentCafes];

          dbCafes.forEach(dbCafe => {
            const index = newCafes.findIndex(c => c.id === dbCafe.id);
            if (index !== -1) {
              newCafes[index] = { ...newCafes[index], ...dbCafe };
            } else {
              newCafes.push(dbCafe);
            }
          });

          osmCafes.forEach(osmCafe => {
            const exists = newCafes.some(c => 
              c.name.toLowerCase() === osmCafe.name.toLowerCase() && 
              Math.abs(c.latitude - osmCafe.latitude) < 0.0001
            );
            if (!exists) {
              newCafes.push(osmCafe);
            }
          });

          set({ 
            cafes: newCafes, 
            isLoading: false, 
            mapCenter: [targetLat, targetLon] 
          });
        } catch (err) {
          console.error('Fetch Cafes Error:', err);
          set({ isLoading: false });
        }
      },

      fetchRates: async () => {
        try {
          const rates = await currencyService.getExchangeRates();
          if (rates) set({ rates });
        } catch (err) {
          console.error('Fetch Rates Error:', err);
        }
      },

      fetchMenuForCafe: async (cafeId) => {
        const cafe = get().cafes.find(c => c.id === cafeId);
        if (!cafe) return;

        let probableMenu = `https://www.google.com/search?q=${encodeURIComponent(cafe.name + ' menu pdf')}`;
        
        if (cafe.website && cafe.website.includes('http')) {
          probableMenu = cafe.website.endsWith('/') ? `${cafe.website}menu` : `${cafe.website}/menu`;
        }

        const updatedCafes = get().cafes.map(c => 
          c.id === cafeId ? { ...c, menu_url: probableMenu } : c
        );

        set({ 
          cafes: updatedCafes,
          selectedCafe: get().selectedCafe?.id === cafeId ? { ...get().selectedCafe!, menu_url: probableMenu } : get().selectedCafe
        });
      }
    }),
    {
      name: 'boron-x-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        theme: state.theme, 
        language: state.language, 
        currency: state.currency,
        currentUser: state.currentUser,
        mapCenter: state.mapCenter,
        cafes: state.cafes,
        uiScale: state.uiScale
      }),
    }
  )
);
