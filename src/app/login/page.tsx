'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { Coffee, ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const login = useAppStore(state => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo amaçlı basit doğrulama
    if (email && password) {
      const role = isAdmin ? 'admin' : 'user';
      login(email, role);
      if (isAdmin) {
        router.push('/admin');
      } else {
        router.push('/');
      }
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="bg-primary w-16 h-16 rounded-[24px] flex items-center justify-center mx-auto shadow-xl shadow-primary/20 rotate-3">
            <Coffee className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter">BORON-X</h1>
          <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Kullanıcı Girişi</p>
        </div>

        <form onSubmit={handleLogin} className="bg-card border border-secondary/10 p-8 rounded-[32px] shadow-2xl space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground ml-2">E-Posta</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="email" 
                  required
                  placeholder="ornek@boronx.com"
                  className="w-full p-4 pl-12 bg-muted/50 rounded-2xl text-sm font-bold border border-transparent focus:border-primary focus:bg-background outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground ml-2">Parola</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full p-4 pl-12 bg-muted/50 rounded-2xl text-sm font-bold border border-transparent focus:border-primary focus:bg-background outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-secondary/5 cursor-pointer hover:bg-muted/50 transition-all" onClick={() => setIsAdmin(!isAdmin)}>
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isAdmin ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                {isAdmin && <ShieldCheck className="w-3 h-3 text-white" />}
              </div>
              <span className="text-xs font-bold">Yönetici (Admin) Girişi</span>
            </div>
            {isAdmin && <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-1 rounded">ON</span>}
          </div>

          <button type="submit" className="w-full p-5 bg-primary text-white rounded-[24px] font-black text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            GİRİŞ YAP <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground font-medium">
          Hesabın yok mu? <a href="#" className="text-primary hover:underline">Hemen Kayıt Ol</a>
        </p>
      </div>
    </main>
  );
}
