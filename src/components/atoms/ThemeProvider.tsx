'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export const ThemeProvider = () => {
  const theme = useAppStore((state) => state.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'system') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return null;
};
