'use client';

import { ThemeProvider } from '@/components/atoms/ThemeProvider';
import { ReactNode, useEffect, useState } from 'react';

export function ClientProviders({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <>
      <ThemeProvider />
      {children}
    </>
  );
}
