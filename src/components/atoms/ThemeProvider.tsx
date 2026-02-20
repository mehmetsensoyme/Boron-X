'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export const ThemeProvider = () => {
  const theme = useAppStore((state) => state.theme);
  const uiScale = useAppStore((state) => state.uiScale);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Theme logic
    if (theme === 'system') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }

    // UI Scale logic
    // Define base sizes that will be multiplied by the scale
    const scales = {
      compact: { icon: '14px', spacing: '0.8' },
      standard: { icon: '18px', spacing: '1' },
      large: { icon: '24px', spacing: '1.2' }
    };

    const currentScale = scales[uiScale] || scales.standard;
    root.style.setProperty('--ui-icon-size', currentScale.icon);
    root.style.setProperty('--ui-spacing-multiplier', currentScale.spacing);
    
    // Set a data attribute for conditional tailwind scaling if needed
    root.setAttribute('data-scale', uiScale);
  }, [theme, uiScale]);

  return null;
};
