'use client';
import { useState, useRef, useEffect } from 'react';
import { useTheme, themes } from '../lib/ThemeContext';

export default function ThemeSwitcher() {
  const { themeId, setThemeId } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = themes[themeId];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-200 text-sm font-medium"
        style={{
          background: 'var(--bg-surface-2)',
          borderColor: 'var(--border)',
          color: 'var(--text-secondary)',
        }}
        title="Switch theme"
      >
        <span>{current.icon}</span>
        <span className="hidden sm:inline">{current.label}</span>
        <svg
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-52 rounded-2xl border shadow-2xl z-50 overflow-hidden"
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
        >
          <div className="p-1.5 space-y-0.5">
            {Object.values(themes).map((theme) => (
              <button
                key={theme.id}
                onClick={() => { setThemeId(theme.id); setOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-sm text-left group"
                style={{
                  background: themeId === theme.id ? 'var(--bg-surface-3)' : 'transparent',
                  color: themeId === theme.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-2)'}
                onMouseLeave={e => e.currentTarget.style.background = themeId === theme.id ? 'var(--bg-surface-3)' : 'transparent'}
              >
                {/* Color swatch */}
                <span className="text-lg leading-none">{theme.icon}</span>
                <div className="flex-1">
                  <p className="font-medium text-xs" style={{ color: 'var(--text-primary)' }}>{theme.label}</p>
                </div>
                {/* Accent dot preview */}
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: theme.vars['--accent'] }}
                />
                {themeId === theme.id && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5 flex-shrink-0" style={{ color: theme.vars['--accent'] }}>
                    <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            ))}
          </div>
          <div className="px-3 py-2 border-t text-xs" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
            Theme is saved automatically
          </div>
        </div>
      )}
    </div>
  );
}
