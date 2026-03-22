'use client';
import { usePathname } from 'next/navigation';
import ThemeSwitcher from './ThemeSwitcher';

const PAGE_TITLES = {
  '/':       'Dashboard',
  '/tasks':  'Task Management',
  '/habits': 'Habit Tracker',
  '/focus':  'Focus Mode',
  '/goals':  'Goals',
  '/notes':  'Notes',
};

export default function Navbar() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] || 'Productivity Platform';
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <header className="h-16 border-b backdrop-blur-xl flex items-center px-6 gap-4"
      style={{ background: 'var(--navbar-bg)', borderColor: 'var(--border)' }}>
      <div className="flex-1">
        <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h1>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{dateStr}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Switcher */}
        <ThemeSwitcher />

        {/* Status indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.20)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400 font-medium">Connected</span>
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: 'color-mix(in srgb, var(--accent) 20%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)' }}>
          <span className="text-xs font-semibold" style={{ color: 'var(--accent-light)' }}>U</span>
        </div>
      </div>
    </header>
  );
}
