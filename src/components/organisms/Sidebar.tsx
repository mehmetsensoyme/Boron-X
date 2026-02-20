'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Globe, Monitor, Coffee, ExternalLink, MapPin, Coins, ChevronLeft, Plus, History, CheckCircle2, LogOut, User as UserIcon, BookOpen } from 'lucide-react';
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
    version,
    releaseNotes,
    currentUser,
    logout 
  } = useAppStore();

  const [reportData, setReportData] = useState({ item: '', price: '' });

  if (!isSidebarOpen) return null;

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`${selectedCafe?.name} için ${reportData.item} fiyatı başarıyla bildirildi!`);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] pointer-events-none">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-md pointer-events-auto"
        />

        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          className="fixed top-0 right-0 w-full sm:max-w-md h-full bg-background border-l border-secondary/10 shadow-2xl pointer-events-auto flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-secondary/5 flex items-center justify-between bg-card/30 shrink-0">
            <div className="flex items-center gap-3">
              {sidebarType === 'about' ? (
                <button onClick={() => setSidebarOpen(true, 'settings')} className="p-2 hover:bg-muted rounded-xl transition-colors">
                  <ChevronLeft className="w-5 h-5 text-primary" />
                </button>
              ) : sidebarType === 'report' ? (
                <button onClick={() => setSidebarOpen(true, 'details')} className="p-2 hover:bg-muted rounded-xl transition-colors">
                  <ChevronLeft className="w-5 h-5 text-primary" />
                </button>
              ) : null}
              <h2 className="font-black tracking-tight text-xl uppercase italic">
                {sidebarType === 'settings' ? 'Ayarlar' : 
                 sidebarType === 'report' ? 'Fiyat Bildir' : 
                 sidebarType === 'about' ? 'Sürüm Notları' : 'Mekan Detay'}
              </h2>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="p-3 hover:bg-muted rounded-2xl transition-all active:scale-90">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
            {sidebarType === 'settings' ? (
              <div className="space-y-8 animate-in fade-in duration-500">
                {/* User Session Info */}
                {currentUser && (
                  <section className="p-5 bg-primary/5 border border-primary/10 rounded-3xl space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary p-2.5 rounded-2xl text-white shadow-lg shadow-primary/20">
                        <UserIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Aktif Oturum</p>
                        <p className="text-sm font-black italic truncate max-w-[200px]">{currentUser.email}</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="w-full p-3 bg-red-500/10 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all"
                    >
                      <LogOut className="w-3.5 h-3.5" /> ÇIKIŞ YAP
                    </button>
                  </section>
                )}

                <section className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <Globe className="w-3 h-3" /> Bölge ve Birim
                  </h3>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <button onClick={() => setLanguage('tr')} className={`flex-1 p-4 rounded-2xl border text-xs font-bold transition-all ${language === 'tr' ? 'bg-primary/10 border-primary text-primary' : 'border-secondary/10 bg-card'}`}>Türkçe</button>
                      <button onClick={() => setLanguage('en')} className={`flex-1 p-4 rounded-2xl border text-xs font-bold transition-all ${language === 'en' ? 'bg-primary/10 border-primary text-primary' : 'border-secondary/10 bg-card'}`}>English</button>
                    </div>
                    <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full p-5 bg-card rounded-2xl border border-secondary/10 text-xs font-bold outline-none appearance-none">
                      <option value="TRY">TRY (₺) - Türk Lirası</option>
                      <option value="USD">USD ($) - US Dollar</option>
                      <option value="EUR">EUR (€) - Euro</option>
                    </select>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <Monitor className="w-3 h-3" /> Görünüm
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-5 bg-card rounded-2xl border border-secondary/5">
                      <span className="text-xs font-bold">Tema Seçimi</span>
                      <div className="flex bg-muted p-1.5 rounded-xl">
                        {['light', 'dark', 'system'].map(t => (
                          <button key={t} onClick={() => setTheme(t as any)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${theme === t ? 'bg-background shadow-md text-primary' : 'opacity-40 hover:opacity-100'}`}>{t}</button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 p-5 bg-card rounded-2xl border border-secondary/5">
                      <span className="text-xs font-bold">Arayüz Ölçeği</span>
                      <div className="flex bg-muted p-1.5 rounded-xl w-full">
                        {[
                          { id: 'compact', label: 'Küçük' },
                          { id: 'standard', label: 'Standart' },
                          { id: 'large', label: 'Büyük' }
                        ].map(s => (
                          <button 
                            key={s.id} 
                            onClick={() => useAppStore.getState().setUIScale(s.id as any)} 
                            className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${useAppStore.getState().uiScale === s.id ? 'bg-background shadow-md text-primary' : 'opacity-40 hover:opacity-100'}`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
                
                <section className="space-y-4 pt-4 border-t border-secondary/5">
                  <button 
                    onClick={() => setSidebarOpen(true, 'about')}
                    className="w-full p-5 bg-muted/50 hover:bg-primary/5 rounded-[24px] flex items-center justify-between transition-all group border border-secondary/5"
                  >
                    <div className="flex items-center gap-3">
                      <History className="w-5 h-5 text-primary" />
                      <span className="text-xs font-bold">Sürüm Notları & Hakkında</span>
                    </div>
                    <span className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1.5 rounded-full">{version}</span>
                  </button>
                </section>
              </div>
            ) : sidebarType === 'about' ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-center space-y-3 pb-6">
                  <div className="bg-primary w-20 h-20 rounded-[28px] flex items-center justify-center mx-auto shadow-2xl shadow-primary/30 rotate-3">
                    <Coffee className="text-white w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-black italic tracking-tighter">BORON-X</h3>
                  <p className="text-[10px] font-bold text-primary bg-primary/5 inline-block px-4 py-1.5 rounded-full uppercase tracking-[0.3em]">{version}</p>
                </div>

                <section className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <History className="w-3 h-3" /> Gelişim Günlüğü
                  </h4>
                  <div className="space-y-3">
                    {releaseNotes.map((note, i) => (
                      <div key={i} className="flex gap-4 p-5 bg-card border border-secondary/5 rounded-3xl hover:border-primary/20 transition-all group">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <p className="text-xs font-semibold leading-relaxed opacity-80 group-hover:opacity-100">{note}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="p-8 bg-muted rounded-[40px] space-y-4 text-center">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">Architectural Quality Standards</p>
                  <div className="flex justify-center gap-6 text-[9px] font-black text-primary/40 uppercase">
                    <span className="border-b border-primary/10 pb-1">ISO 9241-210</span>
                    <span className="border-b border-primary/10 pb-1">ISO/IEC 25010</span>
                  </div>
                </div>
              </div>
            ) : sidebarType === 'report' ? (
              <form onSubmit={handleReportSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="p-5 bg-primary/5 border border-primary/10 rounded-3xl flex items-center gap-4">
                  <div className="bg-primary p-2 rounded-xl text-white"><Coffee className="w-5 h-5" /></div>
                  <div>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Seçili Mekan</p>
                    <p className="text-base font-black italic">{selectedCafe?.name}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <input required placeholder="Ürün Adı" className="w-full p-5 bg-card border border-secondary/10 rounded-2xl text-sm font-bold focus:border-primary outline-none" value={reportData.item} onChange={e => setReportData({...reportData, item: e.target.value})} />
                  <input required type="number" placeholder={`Fiyat (${currency})`} className="w-full p-5 bg-card border border-secondary/10 rounded-2xl text-sm font-bold focus:border-primary outline-none" value={reportData.price} onChange={e => setReportData({...reportData, price: e.target.value})} />
                </div>
                <button type="submit" className="w-full p-6 bg-primary text-white rounded-[32px] font-black text-xs shadow-2xl shadow-primary/30 hover:scale-[1.02] transition-all">BİLDİRİMİ GÖNDER</button>
              </form>
            ) : selectedCafe ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-5">
                  <div className="w-full h-56 bg-muted rounded-[40px] flex items-center justify-center overflow-hidden border border-secondary/10 group relative">
                    <Coffee className="w-16 h-16 text-primary opacity-10 group-hover:scale-150 transition-all duration-1000" />
                  </div>
                  <div>
                    <h3 className="text-4xl font-black tracking-tighter leading-[0.9] italic">{selectedCafe.name}</h3>
                    <p className="flex items-center gap-2 text-sm text-muted-foreground mt-4 font-medium">
                      <MapPin className="w-4 h-4 text-primary shrink-0" /> {selectedCafe.address}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <a href={selectedCafe.website || '#'} target="_blank" className="flex items-center justify-center gap-2 p-5 bg-card border border-secondary/10 rounded-3xl text-xs font-bold hover:border-primary/30 transition-all">
                    <ExternalLink className="w-4 h-4" /> Web Sitesi
                  </a>
                  {selectedCafe.menu_url ? (
                    <a href={selectedCafe.menu_url} target="_blank" className="flex items-center justify-center gap-2 p-5 bg-accent text-white rounded-3xl text-xs font-bold shadow-xl shadow-accent/20 hover:scale-[1.02] transition-all">
                      <BookOpen className="w-4 h-4" /> Dijital Menü
                    </a>
                  ) : (
                    <button onClick={() => setSidebarOpen(true, 'report')} className="flex items-center justify-center gap-2 p-5 bg-primary text-white rounded-3xl text-xs font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
                      <Plus className="w-4 h-4" /> Fiyat Bildir
                    </button>
                  )}
                </div>
                <section className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2"><Coins className="w-3 h-3" /> Fiyat Endeksi</h4>
                    <span className="text-[9px] font-black bg-primary/10 text-primary px-3 py-1 rounded-full italic uppercase">{currency}</span>
                  </div>
                  <div className="space-y-3">
                    {selectedCafe.prices?.map((p, i) => {
                      const convertedPrice = currencyService.convert(p.price, p.currency, currency, rates);
                      return (
                        <div key={i} className="flex items-center justify-between p-5 bg-card rounded-3xl border border-secondary/5 hover:border-primary/20 transition-all group">
                          <span className="text-sm font-bold opacity-80">{p.item_name}</span>
                          <div className="text-right">
                            <p className="text-lg font-black text-primary leading-none">{convertedPrice.toFixed(2)} {currency}</p>
                            {p.currency !== currency && <p className="text-[9px] text-muted-foreground font-bold opacity-40 uppercase mt-1">Org: {p.price} {p.currency}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>
            ) : null}
          </div>

          <div className="p-6 bg-muted/30 border-t border-secondary/5 shrink-0">
            <div className="flex items-center justify-between opacity-40">
              <span className="text-[9px] font-black tracking-[0.2em] uppercase italic">Boron-X Core {version}</span>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[9px] font-black uppercase">Sync Active</span>
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
