'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Coffee, Map as MapIcon, Settings, RefreshCw, Navigation, Globe, Search, Plus, Star } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import Sidebar from '@/components/organisms/Sidebar';
import { ThemeProvider } from '@/components/atoms/ThemeProvider';

const CoffeeMap = dynamic(() => import('@/components/organisms/CoffeeMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full animate-pulse rounded-[40px] bg-muted flex items-center justify-center border border-secondary/10">
      <p className="text-muted-foreground font-medium italic tracking-widest">Harita Hazırlanıyor...</p>
    </div>
  ),
});

export default function Home() {
  const cafes = useAppStore(state => state.cafes);
  const fetchCafes = useAppStore(state => state.fetchCafes);
  const fetchRates = useAppStore(state => state.fetchRates);
  const isLoading = useAppStore(state => state.isLoading);
  const setSidebarOpen = useAppStore(state => state.setSidebarOpen);
  const currency = useAppStore(state => state.currency);
  const mapCenter = useAppStore(state => state.mapCenter);
  const version = useAppStore(state => state.version);
  const currentUser = useAppStore(state => state.currentUser);
  const setSelectedCafe = useAppStore(state => state.setSelectedCafe);

  const [mounted, setMounted] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number]>([41.0082, 28.9784]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    fetchCafes(userLocation[0], userLocation[1]);
    fetchRates();
  }, []);

  const handleLocationRequest = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const newLoc: [number, number] = [latitude, longitude];
        setUserLocation(newLoc);
        fetchCafes(latitude, longitude);
      });
    }
  };

  const filteredCafes = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    return cafes.filter(cafe => 
      cafe.name.toLowerCase().includes(searchLower) || 
      (cafe.address && cafe.address.toLowerCase().includes(searchLower))
    );
  }, [cafes, searchQuery]);

  if (!mounted) return null;

  return (
    <main className="min-h-screen p-4 md:p-8 space-y-8 bg-background text-foreground selection:bg-primary selection:text-white transition-all duration-700">
      <ThemeProvider />
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-secondary opacity-50 z-[100]" />
      
      <Sidebar />

      {/* Header */}
      <header className="max-w-7xl mx-auto w-full relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card/30 backdrop-blur-md p-4 rounded-[32px] border border-secondary/5 shadow-sm">
          <div className="flex items-center gap-4 group">
            <div className="bg-primary p-3 rounded-2xl shadow-xl shadow-primary/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 cursor-pointer">
              <Coffee className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter leading-none">BORON-X</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-black opacity-70">Global Coffee Index</p>
            </div>
          </div>
          
          <nav className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 bg-muted/50 px-4 py-2.5 rounded-2xl border border-secondary/5">
               <Globe className="w-3.5 h-3.5 text-primary" />
               <span className="text-[10px] font-black uppercase tracking-widest">{currency} Modu</span>
            </div>

            <div className="h-8 w-px bg-secondary/10 mx-1 hidden sm:block" />

            <div className="flex items-center gap-2 bg-background/50 p-1.5 rounded-[20px] border border-secondary/5">
              <button onClick={handleLocationRequest} className="flex items-center gap-2 px-4 py-2 hover:bg-primary/10 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary active:scale-95">
                <Navigation className="w-3.5 h-3.5" /> <span className="hidden lg:inline">Konum</span>
              </button>
              
              <button onClick={() => fetchCafes(mapCenter[0], mapCenter[1])} className={`p-2.5 hover:bg-primary/10 rounded-xl transition-all text-muted-foreground hover:text-primary active:scale-95 ${isLoading ? 'animate-spin text-primary' : ''}`}>
                <RefreshCw className="w-4 h-4" />
              </button>

              <button onClick={() => setSidebarOpen(true, 'settings')} className="flex items-center gap-2 pl-3 pr-4 py-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all group">
                <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">MENÜ</span>
              </button>
            </div>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto w-full space-y-12">
        <section className="max-w-4xl space-y-6 pt-6 text-pretty">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Boron-X Engine {version}
          </div>
          <h2 className="text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter">
            Kahve Endeksini <br/>
            <span className="text-primary underline decoration-secondary/30 decoration-8 underline-offset-8 italic">Yeniden Tanımla.</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl font-medium opacity-80">
            Filtrele, keşfet ve bildir. Boron-X ile global kahve piyasası parmaklarının ucunda.
          </p>
        </section>

        <section className="relative space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20">
                <MapIcon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-black text-xl tracking-tight leading-none italic uppercase">Keşif Radarı</h3>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Akıllı Alan Tarayıcı</p>
              </div>
            </div>
            
            <button onClick={() => setSidebarOpen(true, 'report')} className="group relative overflow-hidden bg-primary px-6 py-3 rounded-2xl font-black text-xs text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
              <span className="relative z-10 flex items-center gap-2 uppercase tracking-tighter">Yeni Fiyat Bildir <Plus className="w-4 h-4" /></span>
              <div className="absolute inset-0 bg-white/10 group-hover:translate-x-full transition-transform duration-500" />
            </button>
          </div>
          
          <div className="relative group">
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-lg px-4">
              <div className="bg-background/80 backdrop-blur-xl border border-secondary/20 p-2 rounded-[24px] shadow-2xl relative">
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-muted/50 rounded-xl">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <input type="text" placeholder="Mekan veya adres ara..." className="bg-transparent border-none outline-none text-xs font-bold w-full placeholder:text-muted-foreground/50" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => setIsSearchFocused(true)} onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)} />
                  </div>
                  <button onClick={() => fetchCafes(mapCenter[0], mapCenter[1])} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20">
                    {isLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                    Bölgede Ara
                  </button>
                </div>

                {isSearchFocused && searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-secondary/10 rounded-2xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                    {filteredCafes.length > 0 ? (
                      filteredCafes.slice(0, 5).map(cafe => (
                        <div key={cafe.id} className="p-3 hover:bg-muted cursor-pointer flex items-center gap-3 border-b border-secondary/5 last:border-0" onClick={() => setSelectedCafe(cafe)}>
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary"><Coffee className="w-4 h-4" /></div>
                          <div>
                            <p className="text-xs font-bold">{cafe.name}</p>
                            <p className="text-[10px] text-muted-foreground truncate max-w-[200px]">{cafe.address}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-muted-foreground">Sonuç bulunamadı.</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="absolute -inset-6 bg-gradient-to-tr from-primary/10 via-transparent to-accent/10 rounded-[60px] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative z-10">
              <CoffeeMap cafes={filteredCafes} center={userLocation} />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-12">
          {[
            { label: "Mekan Endeksi", value: filteredCafes.length, color: "text-primary", icon: <Coffee className="w-3 h-3" /> },
            { label: "Bölge Puanı", value: "4.8", color: "text-accent", icon: <Star className="w-3 h-3" /> },
            { label: "Topluluk", value: "850+", color: "text-secondary", icon: <Globe className="w-3 h-3" /> },
            { label: "Uptime", value: "99.9%", color: "text-green-500", icon: <RefreshCw className="w-3 h-3" /> }
          ].map((stat, i) => (
            <div key={i} className="bg-card/50 backdrop-blur-md border border-secondary/10 p-6 rounded-[32px] hover:border-primary/20 transition-all group cursor-default">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest group-hover:text-primary transition-colors">{stat.label}</p>
                <div className={`${stat.color} opacity-30`}>{stat.icon}</div>
              </div>
              <p className={`text-3xl font-black tracking-tighter ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </section>
      </div>

      <footer className="max-w-7xl mx-auto w-full pt-16 pb-12 text-[10px] font-black text-muted-foreground/60 border-t border-secondary/10 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="uppercase tracking-[0.3em] font-black text-primary">Boron-X Global © 2026 | {version}</p>
            <p className="opacity-50 tracking-widest uppercase italic font-medium">Global coffee pricing index engine powered by next.js</p>
          </div>
          <div className="flex items-center gap-10 uppercase tracking-[0.2em]">
            {currentUser?.isAuthenticated && currentUser?.role === 'admin' && (
              <a href="/admin" className="text-primary hover:tracking-[0.4em] transition-all font-black">ADMIN PANEL</a>
            )}
            <a href="https://github.com/mehmetsensoyme/Boron-X" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-all hover:tracking-[0.4em]">Github</a>
            <a href="#" className="hover:text-primary transition-all hover:tracking-[0.4em]">Exchange API</a>
            <a href="#" className="hover:text-primary transition-all hover:tracking-[0.4em]">Support</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
