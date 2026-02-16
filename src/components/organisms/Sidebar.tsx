'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Info, CreditCard, User, Bell, Shield, Globe, Monitor, Type, Coffee, ExternalLink, MapPin, Coins, ChevronLeft, Plus } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { currencyService } from '@/services/currencyService';
import { useState } from 'react';

const Sidebar = () => {
  const { 
    isSidebarOpen, 
    setSidebarOpen, 
    sidebarType, 
    selectedCafe, 
    theme, setTheme, 
    language, setLanguage,
    currency, setCurrency,
    rates,
    fontSize, setFontSize 
  } = useAppStore();

  const [reportData, setReportData] = useState({ item: '', price: '' });

  if (!isSidebarOpen) return null;

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simüle edilmiş kayıt işlemi
    alert(`${selectedCafe?.name} için ${reportData.item} fiyatı (${reportData.price} ${currency}) başarıyla bildirildi!`);
    setSidebarOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex justify-end overflow-hidden pointer-events-none">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto"
        />

        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md h-full bg-background border-l border-secondary/10 shadow-2xl pointer-events-auto flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-secondary/5 flex items-center justify-between bg-card/30">
            <div className="flex items-center gap-3">
              {sidebarType === 'report' && (
                <button onClick={() => setSidebarOpen(true, 'details')} className="p-1 hover:bg-muted rounded-lg transition-colors mr-1">
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              <h2 className="font-black tracking-tight text-xl uppercase italic">
                {sidebarType === 'settings' ? 'Ayarlar' : sidebarType === 'report' ? 'Fiyat Bildir' : 'Mekan Detay'}
              </h2>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-muted rounded-xl transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
            {sidebarType === 'settings' ? (
              <>
                {/* 1. Genel - Para Birimi eklendi */}
                <section className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <Globe className="w-3 h-3" /> Bölge ve Birim
                  </h3>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <button onClick={() => setLanguage('tr')} className={`flex-1 p-3 rounded-2xl border text-xs font-bold transition-all ${language === 'tr' ? 'bg-primary/10 border-primary text-primary' : 'border-secondary/10 bg-card'}`}>Türkçe</button>
                      <button onClick={() => setLanguage('en')} className={`flex-1 p-3 rounded-2xl border text-xs font-bold transition-all ${language === 'en' ? 'bg-primary/10 border-primary text-primary' : 'border-secondary/10 bg-card'}`}>English</button>
                    </div>
                    <select 
                      value={currency} 
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full p-4 bg-card rounded-2xl border border-secondary/10 text-xs font-bold outline-none appearance-none"
                    >
                      <option value="TRY">TRY (₺) - Türk Lirası</option>
                      <option value="USD">USD ($) - US Dollar</option>
                      <option value="EUR">EUR (€) - Euro</option>
                      <option value="GBP">GBP (£) - British Pound</option>
                    </select>
                  </div>
                </section>

                {/* 2. Görünüm */}
                <section className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <Monitor className="w-3 h-3" /> Görünüm
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-card rounded-2xl border border-secondary/5">
                      <span className="text-xs font-bold">Tema</span>
                      <div className="flex bg-muted p-1 rounded-xl">
                        {['light', 'dark', 'system'].map(t => (
                          <button key={t} onClick={() => setTheme(t as any)} className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${theme === t ? 'bg-background shadow-sm text-primary' : 'opacity-50'}`}>{t}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              </>
            ) : sidebarType === 'report' ? (
              <form onSubmit={handleReportSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-center gap-3">
                  <Coffee className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-[10px] font-bold text-primary uppercase">Mekan:</p>
                    <p className="text-sm font-black italic">{selectedCafe?.name}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Kategori / Ürün</label>
                    <input 
                      required 
                      placeholder="Örn: Latte, Americano..."
                      className="w-full p-4 bg-card border border-secondary/10 rounded-2xl text-sm font-bold focus:border-primary outline-none transition-all"
                      value={reportData.item}
                      onChange={e => setReportData({...reportData, item: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Fiyat ({currency})</label>
                    <input 
                      required 
                      type="number" 
                      placeholder="0.00"
                      className="w-full p-4 bg-card border border-secondary/10 rounded-2xl text-sm font-bold focus:border-primary outline-none transition-all"
                      value={reportData.price}
                      onChange={e => setReportData({...reportData, price: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full p-5 bg-primary text-white rounded-[24px] font-black text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  BİLDİRİMİ GÖNDER <Plus className="w-4 h-4" />
                </button>
              </form>
            ) : selectedCafe ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-4">
                  <div className="w-full h-48 bg-muted rounded-[32px] flex items-center justify-center overflow-hidden border border-secondary/10 group">
                    <Coffee className="w-12 h-12 text-primary opacity-20 group-hover:scale-125 transition-transform duration-700" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black tracking-tighter leading-tight italic">{selectedCafe.name}</h3>
                    <p className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                      <MapPin className="w-3 h-3 text-primary" /> {selectedCafe.address}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <a href={selectedCafe.website || '#'} className="flex items-center justify-center gap-2 p-4 bg-card border border-secondary/10 rounded-2xl text-xs font-bold hover:border-primary/30 transition-all">
                    <ExternalLink className="w-4 h-4" /> Web Sitesi
                  </a>
                  <button onClick={() => setSidebarOpen(true, 'report')} className="flex items-center justify-center gap-2 p-4 bg-primary text-white rounded-2xl text-xs font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
                    <Plus className="w-4 h-4" /> Fiyat Bildir
                  </button>
                </div>

                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2"><Coins className="w-3 h-3" /> Fiyat Endeksi</h4>
                    <span className="text-[8px] font-black bg-muted px-2 py-1 rounded italic uppercase tracking-widest">{currency} Bazlı Gösterim</span>
                  </div>
                  <div className="space-y-2">
                    {selectedCafe.prices && selectedCafe.prices.length > 0 ? (
                      selectedCafe.prices.map((p, i) => {
                        const convertedPrice = currencyService.convert(p.price, p.currency, currency, rates);
                        return (
                          <div key={i} className="flex items-center justify-between p-4 bg-card rounded-2xl border border-secondary/5 group hover:border-primary/20 transition-all">
                            <span className="text-xs font-bold">{p.item_name}</span>
                            <div className="text-right">
                              <p className="text-sm font-black text-primary">{convertedPrice.toFixed(2)} {currency}</p>
                              {p.currency !== currency && <p className="text-[8px] text-muted-foreground opacity-50 uppercase font-bold">Orijinal: {p.price} {p.currency}</p>}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-10 text-center border-2 border-dashed border-secondary/10 rounded-[32px] group hover:border-primary/20 transition-all cursor-pointer" onClick={() => setSidebarOpen(true, 'report')}>
                        <p className="text-xs text-muted-foreground italic">Henüz fiyat bildirilmemiş.</p>
                        <p className="mt-4 text-[10px] font-black text-primary uppercase tracking-widest flex items-center justify-center gap-1 group-hover:gap-2 transition-all">İlk Bildirimi Sen Yap <Plus className="w-3 h-3" /></p>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            ) : null}
          </div>

          <div className="p-6 bg-muted/30 border-t border-secondary/5">
            <div className="flex items-center justify-between opacity-50">
              <span className="text-[8px] font-black tracking-widest uppercase italic">Boron-X Engine v0.0.1-alpha</span>
              <div className="flex gap-4">
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[8px] font-black uppercase">Live Rates</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Sidebar;
