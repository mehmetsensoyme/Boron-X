'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { Check, X, ShieldAlert, ShieldCheck, LogOut, ArrowLeft, Coffee, Clock, User } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const { currentUser, pendingApprovals, approvePrice, rejectPrice, logout } = useAppStore();

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/login');
    }
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== 'admin') return null;

  return (
    <main className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Admin Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card border border-secondary/10 p-6 rounded-[32px] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-primary p-3 rounded-2xl">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter">YÖNETİM PANELİ</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">Fiyat Onay Merkezi</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-xs font-bold">{currentUser.email}</span>
              <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded font-black uppercase">Super Admin</span>
            </div>
            <button onClick={() => router.push('/')} className="p-3 hover:bg-muted rounded-xl transition-all" title="Siteye Dön">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button onClick={() => { logout(); router.push('/login'); }} className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all" title="Çıkış Yap">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stats */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-card p-6 rounded-[32px] border border-secondary/10 space-y-2">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Bekleyen Onay</p>
              <p className="text-4xl font-black text-primary">{pendingApprovals.length}</p>
            </div>
            <div className="bg-card p-6 rounded-[32px] border border-secondary/10 space-y-2 opacity-60">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Toplam İşlem</p>
              <p className="text-4xl font-black">1,248</p>
            </div>
          </div>

          {/* Approval List */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Bekleyen Bildirimler
            </h2>
            
            {pendingApprovals.length > 0 ? (
              <div className="space-y-3">
                {pendingApprovals.map((item) => (
                  <div key={item.id} className="bg-card border border-secondary/5 p-5 rounded-[24px] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/20 transition-all group">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <Coffee className="w-5 h-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-sm">{item.cafeName}</h3>
                        <p className="text-xs text-muted-foreground">{item.itemName} — <span className="font-black text-foreground">{item.price} {item.currency}</span></p>
                        <div className="flex items-center gap-2 mt-1">
                          <User className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">{item.user}</span>
                          <span className="w-1 h-1 rounded-full bg-secondary/30" />
                          <span className="text-[10px] text-muted-foreground">{item.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-auto">
                      <button 
                        onClick={() => rejectPrice(item.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-[10px] font-black uppercase transition-all"
                      >
                        <X className="w-3 h-3" /> Reddet
                      </button>
                      <button 
                        onClick={() => approvePrice(item.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-xl text-[10px] font-black uppercase transition-all shadow-lg shadow-green-500/10"
                      >
                        <Check className="w-3 h-3" /> Onayla
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-muted/30 border border-dashed border-secondary/10 p-12 rounded-[32px] text-center">
                <ShieldCheck className="w-12 h-12 text-green-500/50 mx-auto mb-4" />
                <p className="font-bold text-muted-foreground">Tüm bildirimler incelendi.</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Şu an onay bekleyen yeni veri yok.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
