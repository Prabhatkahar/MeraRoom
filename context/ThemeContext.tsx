
import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeColor = 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate';

interface ThemeConfig {
  id: ThemeColor;
  name: string;
  primary: string;     // indigo-600
  primaryLight: string; // indigo-50
  primaryDark: string;  // indigo-700
  text: string;        // text-indigo-600
  bg: string;          // bg-indigo-600
  border: string;      // border-indigo-100
  ring: string;        // ring-indigo-500
  accent: string;      // amber-400 (for highlights)
}

const THEMES: Record<ThemeColor, ThemeConfig> = {
  indigo: {
    id: 'indigo',
    name: 'Classic Indigo',
    primary: 'indigo-600',
    primaryLight: 'indigo-50',
    primaryDark: 'indigo-700',
    text: 'text-indigo-600',
    bg: 'bg-indigo-600',
    border: 'border-indigo-100',
    ring: 'focus:ring-indigo-500',
    accent: 'amber-400',
  },
  emerald: {
    id: 'emerald',
    name: 'Forest Emerald',
    primary: 'emerald-600',
    primaryLight: 'emerald-50',
    primaryDark: 'emerald-700',
    text: 'text-emerald-600',
    bg: 'bg-emerald-600',
    border: 'border-emerald-100',
    ring: 'focus:ring-emerald-500',
    accent: 'indigo-400',
  },
  rose: {
    id: 'rose',
    name: 'Sunset Rose',
    primary: 'rose-600',
    primaryLight: 'rose-50',
    primaryDark: 'rose-700',
    text: 'text-rose-600',
    bg: 'bg-rose-600',
    border: 'border-rose-100',
    ring: 'focus:ring-rose-500',
    accent: 'slate-900',
  },
  amber: {
    id: 'amber',
    name: 'Royal Amber',
    primary: 'amber-600',
    primaryLight: 'amber-50',
    primaryDark: 'amber-700',
    text: 'text-amber-600',
    bg: 'bg-amber-600',
    border: 'border-amber-100',
    ring: 'focus:ring-amber-500',
    accent: 'indigo-600',
  },
  slate: {
    id: 'slate',
    name: 'Onyx Slate',
    primary: 'slate-800',
    primaryLight: 'slate-50',
    primaryDark: 'slate-950',
    text: 'text-slate-800',
    bg: 'bg-slate-800',
    border: 'border-slate-200',
    ring: 'focus:ring-slate-800',
    accent: 'indigo-500',
  }
};

interface ThemeContextType {
  theme: ThemeConfig;
  isDarkMode: boolean;
  setTheme: (color: ThemeColor) => void;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeId] = useState<ThemeColor>(() => {
    return (localStorage.getItem('app_theme') as ThemeColor) || 'indigo';
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('app_dark_mode') === 'true';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('app_dark_mode', String(isDarkMode));
  }, [isDarkMode]);

  const setTheme = (color: ThemeColor) => {
    setThemeId(color);
    localStorage.setItem('app_theme', color);
  };

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{ theme: THEMES[themeId], isDarkMode, setTheme, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
