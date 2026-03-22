'use client';
import { createContext, useContext, useEffect, useState } from 'react';

export const themes = {
  dark: {
    id: 'dark',
    label: 'Dark',
    icon: '🌙',
    vars: {
      '--bg-base':      '#020817',
      '--bg-surface':   '#0f172a',
      '--bg-surface-2': '#1e293b',
      '--bg-surface-3': '#334155',
      '--border':       'rgba(148,163,184,0.10)',
      '--accent':       '#6366f1',
      '--accent-light': '#818cf8',
      '--accent-glow':  'rgba(99,102,241,0.25)',
      '--text-primary': '#f1f5f9',
      '--text-secondary':'#94a3b8',
      '--text-muted':   '#64748b',
      '--sidebar-bg':   'rgba(15,23,42,0.85)',
      '--navbar-bg':    'rgba(2,8,23,0.85)',
    },
    body: 'bg-[#020817] text-slate-100',
  },
  light: {
    id: 'light',
    label: 'Light',
    icon: '☀️',
    vars: {
      '--bg-base':      '#f8fafc',
      '--bg-surface':   '#ffffff',
      '--bg-surface-2': '#f1f5f9',
      '--bg-surface-3': '#e2e8f0',
      '--border':       'rgba(15,23,42,0.10)',
      '--accent':       '#4f46e5',
      '--accent-light': '#6366f1',
      '--accent-glow':  'rgba(79,70,229,0.15)',
      '--text-primary': '#0f172a',
      '--text-secondary':'#475569',
      '--text-muted':   '#94a3b8',
      '--sidebar-bg':   'rgba(255,255,255,0.92)',
      '--navbar-bg':    'rgba(248,250,252,0.92)',
    },
    body: 'bg-slate-50 text-slate-900',
  },
  purple: {
    id: 'purple',
    label: 'Midnight Purple',
    icon: '🔮',
    vars: {
      '--bg-base':      '#0d0414',
      '--bg-surface':   '#160b22',
      '--bg-surface-2': '#221133',
      '--bg-surface-3': '#341a4a',
      '--border':       'rgba(192,132,252,0.12)',
      '--accent':       '#a855f7',
      '--accent-light': '#c084fc',
      '--accent-glow':  'rgba(168,85,247,0.30)',
      '--text-primary': '#f5f0ff',
      '--text-secondary':'#c4b5fd',
      '--text-muted':   '#7c3aed',
      '--sidebar-bg':   'rgba(13,4,20,0.90)',
      '--navbar-bg':    'rgba(13,4,20,0.90)',
    },
    body: 'bg-[#0d0414] text-purple-50',
  },
  forest: {
    id: 'forest',
    label: 'Forest Green',
    icon: '🌿',
    vars: {
      '--bg-base':      '#051a0f',
      '--bg-surface':   '#0a2218',
      '--bg-surface-2': '#112d20',
      '--bg-surface-3': '#1a3d2c',
      '--border':       'rgba(74,222,128,0.12)',
      '--accent':       '#22c55e',
      '--accent-light': '#4ade80',
      '--accent-glow':  'rgba(34,197,94,0.25)',
      '--text-primary': '#ecfdf5',
      '--text-secondary':'#86efac',
      '--text-muted':   '#4ade80',
      '--sidebar-bg':   'rgba(5,26,15,0.90)',
      '--navbar-bg':    'rgba(5,26,15,0.90)',
    },
    body: 'bg-[#051a0f] text-emerald-50',
  },
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState('dark');

  // Load saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem('pp-theme');
    if (saved && themes[saved]) setThemeId(saved);
  }, []);

  // Apply CSS vars + body class whenever theme changes
  useEffect(() => {
    const theme = themes[themeId];
    const root = document.documentElement;
    Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v));
    // Store
    localStorage.setItem('pp-theme', themeId);
  }, [themeId]);

  return (
    <ThemeContext.Provider value={{ themeId, setThemeId, theme: themes[themeId] }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
