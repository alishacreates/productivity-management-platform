'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/',       label: 'Dashboard', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg> },
  { href: '/tasks',  label: 'Tasks',     icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { href: '/habits', label: 'Habits',    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { href: '/focus',  label: 'Focus',     icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { href: '/goals',  label: 'Goals',     icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> },
  { href: '/notes',  label: 'Notes',     icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round"/><polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round"/><line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round"/><line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round"/></svg> },
  { href: '/areas',  label: 'Life Areas', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M12 21s-6.5-4.35-9-8.5C1.2 9.3 3.1 5 7.2 5c2.2 0 3.5 1.2 4.8 2.8C13.3 6.2 14.6 5 16.8 5 20.9 5 22.8 9.3 21 12.5 18.5 16.65 12 21 12 21z" strokeLinecap="round" strokeLinejoin="round"/></svg> },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed left-0 top-0 h-full w-60 flex flex-col z-40 backdrop-blur-xl border-r" style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--border)' }}>
      <div className="px-6 py-6 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent)', boxShadow: '0 4px 14px var(--accent-glow)' }}>
            <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </div>
          <div>
            <p className="text-sm font-semibold leading-none" style={{ color: 'var(--text-primary)' }}>Productivity</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(({ href, label, icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: active ? 'color-mix(in srgb, var(--accent) 15%, transparent)' : 'transparent',
                color: active ? 'var(--accent-light)' : 'var(--text-secondary)',
                border: active ? '1px solid color-mix(in srgb, var(--accent) 25%, transparent)' : '1px solid transparent',
              }}
            >
              <span style={{ color: active ? 'var(--accent)' : 'var(--text-muted)' }}>{icon}</span>
              {label}
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>v1.0.0 · Stay focused 🎯</p>
      </div>
    </aside>
  );
}
