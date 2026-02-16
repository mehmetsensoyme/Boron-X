'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Coffee, Map as MapIcon, Settings, Info, RefreshCw, Navigation, Globe } from 'lucide-react';
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
  const { cafes, fetchCafes, fetchRates, isLoading, setSidebarOpen, currency } = useAppStore();
  const [userLocation, setUserLocation] = useState<[number, number]>([41.0082, 28.9784]);

  const handleLocationRequest = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        fetchCafes(latitude, longitude);
      });
    }
  };

  useEffect(() => {
    fetchCafes(userLocation[0], userLocation[1]);
    fetchRates(); // Döviz kurlarını çek
  }, []);

  return (
    <main className="min-h-screen p-4 md:p-8 space-y-8 bg-background text-foreground selection:bg-primary selection:text-white transition-all duration-700">
      <ThemeProvider />
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-secondary opacity-50 z-[100]" />
      
      <Sidebar />

      {/* Header */}
      <header className="flex items-center justify-between max-w-7xl mx-auto w-full relative z-10">
        <div className="flex items-center gap-4 group">
          <div className="bg-primary p-3 rounded-2xl shadow-xl shadow-primary/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 cursor-pointer">
            <Coffee className="text-white w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter leading-none">BORON-X</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-black opacity-70">Global Coffee Index</p>
          </div>
        </div>
        
        <nav className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 bg-card border border-secondary/10 px-4 py-2 rounded-2xl shadow-sm">
             <Globe className="w-3 h-3 text-primary" />
             <span className="text-[10px] font-black uppercase tracking-widest">{currency} Modu Aktif</span>
          </div>
          <button 
            onClick={handleLocationRequest}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-muted hover:bg-primary/10 rounded-2xl transition-all text-xs font-bold text-muted-foreground hover:text-primary border border-secondary/5"
          >
            <Navigation className="w-3 h-3" /> Konumumu Bul
          </button>
          <div className="w-px h-6 bg-secondary/10 mx-2" />
          <button 
            onClick={() => fetchCafes(userLocation[0], userLocation[1])}
            className={`p-3 bg-muted hover:bg-muted/80 rounded-2xl transition-all text-muted-foreground hover:text-primary ${isLoading ? 'animate-spin-slow text-primary shadow-inner' : ''}`}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setSidebarOpen(true, 'settings')}
            className="p-3 bg-card border border-secondary/10 hover:border-primary/50 rounded-2xl transition-all text-muted-foreground hover:text-primary shadow-sm hover:shadow-md active:scale-95"
          >
            <Settings className="w-5 h-5" />
          </button>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto w-full space-y-12">
        {/* Hero Section */}
        <section className="max-w-4xl space-y-6 pt-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Real-Time Currency Sync
          </div>
          <h2 className="text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter text-balance">
            Kahve Endeksini <br/>
            <span className="text-primary underline decoration-secondary/30 decoration-8 underline-offset-8">Yeniden Tanımla.</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl font-medium opacity-80 text-pretty">
            Global fiyatları anlık kurlarla yerel para biriminize çevirin. Dünyanın en büyük topluluk tabanlı kahve veri ağına hoş geldiniz.
          </p>
        </section>

        {/* Map Section */}
        <section className="relative space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20">
                <MapIcon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-black text-xl tracking-tight leading-none italic">Keşif Radarı</h3>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Akıllı Fiyat Takibi</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="hidden sm:flex items-center gap-2 bg-card px-4 py-2 rounded-2xl border border-secondary/10 shadow-sm">
                  <span className="text-[10px] font-black text-muted-foreground uppercase">Veri Kaynağı:</span>
                  <span className="text-[10px] font-black text-primary uppercase tracking-wider italic">BORON-X HYBRID</span>
               </div>
               <button 
                onClick={() => setSidebarOpen(true, 'report')}
                className="group relative overflow-hidden bg-primary px-6 py-3 rounded-2xl font-black text-xs text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
               >
                <span className="relative z-10 flex items-center gap-2 uppercase">Hemen Bildir <span className="text-lg leading-none">+</span></span>
                <div className="absolute inset-0 bg-white/10 group-hover:translate-x-full transition-transform duration-500" />
               </button>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-6 bg-gradient-to-tr from-primary/10 via-transparent to-accent/10 rounded-[60px] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative z-10">
              <CoffeeMap cafes={cafes} center={userLocation} />
            </div>
          </div>
        </section>

        {/* Live Stats Bar */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-12">
          {[
            { label: "Mekan Endeksi", value: cafes.length, color: "text-primary" },
            { label: "Aktif Döviz", value: "160+", color: "text-accent" },
            { label: "Topluluk", value: "850+", color: "text-secondary" },
            { label: "Uptime", value: "99.9%", color: "text-green-500" }
          ].map((stat, i) => (
            <div key={i} className="bg-card/50 backdrop-blur-md border border-secondary/10 p-6 rounded-[32px] hover:border-primary/20 transition-all group cursor-default">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 group-hover:text-primary transition-colors">{stat.label}</p>
              <p className={`text-3xl font-black tracking-tighter ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </section>
      </div>

      <footer className="max-w-7xl mx-auto w-full pt-16 pb-12 text-[10px] font-black text-muted-foreground/60 border-t border-secondary/10 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="uppercase tracking-[0.3em] font-black text-primary">Boron-X Global © 2026</p>
            <p className="opacity-50 tracking-widest uppercase">Global coffee pricing index engine powered by next.js</p>
          </div>
          <div className="flex items-center gap-10 uppercase tracking-[0.2em]">
            <a href="#" className="hover:text-primary transition-all hover:tracking-[0.4em]">Github</a>
            <a href="#" className="hover:text-primary transition-all hover:tracking-[0.4em]">Exchange API</a>
            <a href="#" className="hover:text-primary transition-all hover:tracking-[0.4em]">Support</a>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}
