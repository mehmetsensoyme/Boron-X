'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Coffee, Map as MapIcon, Settings, RefreshCw, Navigation, Globe, Search, Plus, Star, BookOpen, ChevronRight } from 'lucide-react';
import { useAppStore, SortType } from '@/store/useAppStore';
import Sidebar from '@/components/organisms/Sidebar';
import { currencyService } from '@/services/currencyService';

const CoffeeMap = dynamic(() => import('@/components/organisms/CoffeeMap'), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-screen animate-pulse bg-background flex flex-col items-center justify-center space-y-4">
      <div className="w-20 h-20 bg-primary/10 rounded-[40px] animate-bounce flex items-center justify-center border border-primary/20">
        <Coffee className="w-10 h-10 text-primary" />
      </div>
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.6em] animate-pulse">Boron-X Core Init...</p>
    </div>
  ),
});

export default function Home() {
  const { 
    cafes, fetchCafes, fetchRates, isLoading, 
    setSidebarOpen, currency, mapCenter, setMapCenter, version, 
    currentUser, setSelectedCafe, rates,
    searchQuery, setSearchQuery, sortType, setSortType,
    uiScale
  } = useAppStore();

  const [mounted, setMounted] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Dynamic sizing based on uiScale
  const iconSizeClass = uiScale === 'compact' ? 'w-4 h-4' : uiScale === 'large' ? 'w-6 h-6' : 'w-5 h-5';
  const buttonPadding = uiScale === 'compact' ? 'p-2' : uiScale === 'large' ? 'p-4' : 'p-3';
  const logoIconSize = uiScale === 'compact' ? 'w-5 h-5' : uiScale === 'large' ? 'w-7 h-7' : 'w-6 h-6';

  useEffect(() => {
    setMounted(true);
    fetchRates().then(() => {
      fetchCafes(mapCenter[0], mapCenter[1], true);
    });
  }, []);

  const handleLocationRequest = () => {
    if (!("geolocation" in navigator)) {
      alert("Tarayıcınız konum servislerini desteklemiyor.");
      return;
    }

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLoc: [number, number] = [latitude, longitude];
        setMapCenter(newLoc);
        fetchCafes(latitude, longitude);
      },
      (error) => {
        console.error("Konum Hatası Kodu:", error.code, "Mesaj:", error.message);
        
        // Hata kodlarına göre daha kullanıcı dostu uyarılar
        switch(error.code) {
          case 1: // PERMISSION_DENIED
            alert("Konum erişimi reddedildi. Eğer HTTPS kullanmıyorsanız veya izni engellediyseniz tarayıcı konumu vermeyecektir. Lütfen kilit simgesinden izinleri kontrol edin.");
            break;
          case 2: // POSITION_UNAVAILABLE
            alert("Konum bilgisi şu an alınamıyor. Şebeke veya GPS sinyalinizi kontrol edin.");
            break;
          case 3: // TIMEOUT
            alert("Konum alma isteği zaman aşımına uğradı. Lütfen tekrar deneyin.");
            break;
          default:
            alert("Konum belirlenirken bir sorun oluştu.");
        }
      },
      options
    );
  };

  const filteredAndSortedCafes = useMemo(() => {
    let result = [...cafes];
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      result = result.filter(cafe => 
        cafe.name.toLowerCase().includes(searchLower) || 
        (cafe.address && cafe.address.toLowerCase().includes(searchLower))
      );
    }
    if (sortType === 'price_asc') {
      result.sort((a, b) => {
        const minA = a.prices?.length ? Math.min(...a.prices.map(p => currencyService.convert(p.price, p.currency, currency, rates))) : Infinity;
        const minB = b.prices?.length ? Math.min(...b.prices.map(p => currencyService.convert(p.price, p.currency, currency, rates))) : Infinity;
        return minA - minB;
      });
    } else if (sortType === 'rating_desc') {
      result.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0));
    } else if (sortType === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }
    return result;
  }, [cafes, searchQuery, sortType, currency, rates]);

  if (!mounted) return null;

  return (
    <main className="h-screen w-screen overflow-hidden bg-[#0f0a08] text-foreground relative flex flex-col font-sans">
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-secondary opacity-50 z-[2000]" />
      <Sidebar />

      {/* 1. NEW INTEGRATED PREMIUM HEADER */}
      <header className="absolute top-6 left-0 w-full z-[500] px-4 md:px-8 pointer-events-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 pointer-events-auto">
          
          <div className="flex items-center gap-5 bg-card/90 backdrop-blur-3xl border border-secondary/10 px-6 py-4 rounded-[32px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] group transition-all hover:border-primary/30 shrink-0">
            <div className={`bg-primary ${buttonPadding} rounded-2xl text-white shadow-lg shadow-primary/20 shrink-0 transition-all duration-500 group-hover:scale-105 group-hover:rotate-6`}>
              <Coffee className={logoIconSize} />
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-5 leading-none">
              <div className="flex flex-col">
                <h1 className="text-lg font-black tracking-tighter uppercase italic tracking-[0.1em] text-foreground transition-colors duration-500 group-hover:text-primary">BORON-X</h1>
                <p className="text-[8px] font-black text-primary uppercase tracking-[0.3em] mt-1.5 opacity-60">Global Index</p>
              </div>
              <div className="hidden sm:block h-6 w-px bg-secondary/10 mx-1" />
              <p className="text-[10px] md:text-xs font-black uppercase tracking-tight text-muted-foreground leading-tight max-w-[140px] md:max-w-none">
                Kahve Endeksini <br className="md:hidden"/>
                <span className="text-primary italic underline decoration-secondary/30 decoration-2 underline-offset-4 font-black">Yeniden Tanımla.</span>
              </p>
            </div>
          </div>

          <div className="w-full md:w-auto flex flex-1 max-w-2xl items-center gap-3">
            <div className="flex-1 bg-card/90 backdrop-blur-3xl border border-secondary/20 p-2 rounded-[36px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] flex items-center gap-2 relative border-gradient-primary">
              <div className="flex-1 flex items-center gap-3 px-5 py-3.5 bg-muted/40 rounded-[28px] border border-secondary/5 focus-within:border-primary/30 transition-all relative">
                <Search className={iconSizeClass + " text-muted-foreground"} />
                <input 
                  type="text" 
                  placeholder="Mekan tara..." 
                  className="bg-transparent border-none outline-none text-[12px] font-black w-full placeholder:text-muted-foreground/30 uppercase tracking-tighter" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  onFocus={() => setIsSearchFocused(true)} 
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)} 
                />

                {isSearchFocused && searchQuery && (
                  <div className="absolute top-[calc(100%+16px)] left-0 right-0 bg-card/98 backdrop-blur-3xl border border-secondary/20 rounded-[40px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] overflow-hidden max-h-[400px] overflow-y-auto animate-in fade-in zoom-in-95 duration-300 z-[1000]">
                    {filteredAndSortedCafes.length > 0 ? (
                      filteredAndSortedCafes.slice(0, 8).map(cafe => (
                        <div 
                          key={`search-${cafe.id}`} 
                          className="p-6 hover:bg-primary/5 cursor-pointer flex items-center gap-5 border-b border-secondary/5 last:border-0 transition-all group" 
                          onMouseDown={() => setSelectedCafe(cafe)}
                        >
                          <div className={`rounded-[20px] bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-primary/5 ${buttonPadding}`}><Coffee className={iconSizeClass} /></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-black italic truncate group-hover:text-primary transition-colors">{cafe.name}</p>
                            <p className="text-[10px] text-muted-foreground font-bold truncate mt-1 uppercase opacity-50 tracking-tight">{cafe.address || 'Global Satellite Data'}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-12 text-center opacity-30 text-[10px] font-black uppercase tracking-[0.4em]">Sonuç Yok</div>
                    )}
                  </div>
                )}
              </div>
              
              <button onClick={() => setSidebarOpen(true, 'settings')} className={`${buttonPadding} bg-primary text-white rounded-[24px] shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all group`}>
                <Settings className={iconSizeClass + " group-hover:rotate-90 transition-transform duration-700"} />
              </button>
            </div>

            <button onClick={handleLocationRequest} className={`${buttonPadding} bg-accent text-white rounded-[28px] shadow-2xl shadow-accent/40 hover:scale-110 active:scale-95 transition-all shrink-0`}>
              <Navigation className={iconSizeClass} />
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-center pointer-events-auto">
           <div className="bg-card/80 backdrop-blur-2xl border border-secondary/10 p-2 rounded-[24px] shadow-2xl flex items-center gap-1.5 overflow-x-auto scrollbar-hide max-w-full">
              {(['price_asc', 'rating_desc', 'none'] as SortType[]).map((id) => (
                <button 
                  key={id}
                  onClick={() => setSortType(id)}
                  className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-tighter transition-all shrink-0 ${sortType === id ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                >
                  {id === 'price_asc' ? 'En Ucuz' : id === 'rating_desc' ? 'Popüler' : 'Tümü'}
                </button>
              ))}
           </div>
        </div>
      </header>

      {/* 2. INFINITY MAP & CINEMATIC OVERLAY */}
      <div className="flex-1 relative">
        <CoffeeMap cafes={filteredAndSortedCafes} center={mapCenter} />
        
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.15)_100%)]" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-background/30 via-transparent to-background/40" />
        
        <div className="absolute bottom-10 left-10 z-[400] bg-card/90 backdrop-blur-2xl border border-secondary/10 px-6 py-4 rounded-[28px] flex items-center gap-4 shadow-2xl hidden md:flex">
           <div className="relative flex items-center justify-center">
              <div className={`w-2.5 h-2.5 rounded-full ${isLoading ? 'bg-primary animate-pulse' : 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]'}`} />
           </div>
           <div className="flex flex-col">
              <span className="text-[9px] font-black text-foreground uppercase tracking-[0.2em] leading-none">Boron-X Core {version}</span>
              <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-1.5">{isLoading ? 'Syncing Radar...' : 'Satellite Synced'}</span>
           </div>
        </div>
      </div>

      {/* 3. DISCOVERY DECK (Bottom Carousel) */}
      <div className="absolute bottom-10 left-0 w-full z-[500] pointer-events-none">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex flex-col gap-6 md:gap-8">
          
          <div className="flex justify-center">
            <button 
              onClick={() => fetchCafes(mapCenter[0], mapCenter[1])}
              className="pointer-events-auto flex items-center gap-4 px-10 py-5 bg-primary text-white rounded-full text-[11px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-[0_20px_40px_rgba(111,78,55,0.4)] group"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-1000'}`} />
              Bölgeyi Yeniden Tara
            </button>
          </div>

          {(sortType !== 'none' || searchQuery) && filteredAndSortedCafes.length > 0 && (
            <div className="pointer-events-auto flex gap-5 md:gap-6 overflow-x-auto pb-8 scrollbar-hide mask-fade-right animate-in slide-in-from-bottom-16 duration-1000">
              {filteredAndSortedCafes.slice(0, 15).map((cafe) => {
                const minPrice = cafe.prices?.length 
                  ? Math.min(...cafe.prices.map(p => currencyService.convert(p.price, p.currency, currency, rates))) 
                  : null;
                return (
                  <div 
                    key={`deck-${cafe.id}`} 
                    onClick={() => setSelectedCafe(cafe)}
                    className="min-w-[280px] md:min-w-[320px] bg-card/95 backdrop-blur-3xl border border-secondary/10 p-6 md:p-8 rounded-[40px] md:rounded-[48px] cursor-pointer hover:border-primary/50 hover:-translate-y-4 transition-all shadow-2xl group relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className={`bg-primary/10 rounded-[24px] text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-xl shadow-primary/5 ${buttonPadding}`}>
                        <Coffee className={iconSizeClass} />
                      </div>
                      <div className="flex flex-col items-end gap-2.5">
                        {cafe.avg_rating && (
                          <div className="flex items-center gap-2 text-[12px] font-black text-accent bg-accent/5 px-4 py-2 rounded-2xl border border-accent/20">
                            <Star className="w-4 h-4 fill-current" /> {cafe.avg_rating.toFixed(1)}
                          </div>
                        )}
                        {cafe.menu_url && <BookOpen className={`${iconSizeClass} text-primary animate-pulse`} />}
                      </div>
                    </div>
                    <h4 className="text-base md:text-lg font-black uppercase tracking-tighter truncate leading-tight group-hover:text-primary transition-colors">{cafe.name}</h4>
                    <p className="text-[11px] text-muted-foreground font-bold truncate mb-6 uppercase tracking-widest opacity-40">{cafe.address || 'Satellite Index Data'}</p>
                    <div className="flex items-center justify-between pt-6 border-t border-secondary/10">
                      {minPrice !== null ? (
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.3em] leading-none mb-2">Market Price</span>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl md:text-3xl font-black text-primary leading-none tracking-tighter">{minPrice.toFixed(0)}</span>
                            <span className="text-[12px] font-black text-muted-foreground uppercase">{currency}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-[11px] font-black text-muted-foreground/20 uppercase tracking-[0.4em] italic">Waiting for Data</span>
                      )}
                      <div className={`flex items-center justify-center bg-muted rounded-[20px] md:rounded-[24px] group-hover:bg-primary group-hover:text-white transition-all ${buttonPadding}`}>
                        <Plus className={iconSizeClass} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
