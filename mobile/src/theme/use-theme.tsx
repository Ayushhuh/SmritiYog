import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { colorTokens, type ThemeColors, type ThemeName } from './tokens';

type ThemeContextValue = {
  scheme: ThemeName;
  setScheme: (mode: ThemeName) => void;
  toggleScheme: () => void;
  colors: ThemeColors;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [scheme, setScheme] = useState<ThemeName>('light');

  const value = useMemo<ThemeContextValue>(() => {
    const resolved: ThemeName = scheme === 'dark' ? 'dark' : 'light';
    return {
      scheme: resolved,
      setScheme,
      toggleScheme: () => setScheme((s) => (s === 'dark' ? 'light' : 'dark')),
      colors: colorTokens[resolved] as ThemeColors,
    };
  }, [scheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
export { colorTokens };
