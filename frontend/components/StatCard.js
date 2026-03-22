export default function StatCard({ title, value, subtitle, icon, color = 'accent', trend }) {
  // Map named colors to fixed palette values (don't rely on tailwind for themed cards)
  const colorStyles = {
    indigo:  { bg: 'color-mix(in srgb, #6366f1 12%, transparent)', text: '#818cf8', border: 'color-mix(in srgb, #6366f1 25%, transparent)' },
    emerald: { bg: 'color-mix(in srgb, #10b981 12%, transparent)', text: '#34d399', border: 'color-mix(in srgb, #10b981 25%, transparent)' },
    amber:   { bg: 'color-mix(in srgb, #f59e0b 12%, transparent)', text: '#fbbf24', border: 'color-mix(in srgb, #f59e0b 25%, transparent)' },
    rose:    { bg: 'color-mix(in srgb, #f43f5e 12%, transparent)', text: '#fb7185', border: 'color-mix(in srgb, #f43f5e 25%, transparent)' },
    violet:  { bg: 'color-mix(in srgb, #8b5cf6 12%, transparent)', text: '#a78bfa', border: 'color-mix(in srgb, #8b5cf6 25%, transparent)' },
    accent:  { bg: 'color-mix(in srgb, var(--accent) 12%, transparent)', text: 'var(--accent-light)', border: 'color-mix(in srgb, var(--accent) 25%, transparent)' },
  };
  const c = colorStyles[color] || colorStyles.accent;

  return (
    <div className="card group cursor-default">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl border flex items-center justify-center"
          style={{ background: c.bg, color: c.text, borderColor: c.border }}>
          {icon}
        </div>
        {trend !== undefined && (
          <span className="text-xs font-medium px-2 py-1 rounded-full"
            style={{ background: trend >= 0 ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)', color: trend >= 0 ? '#34d399' : '#f87171' }}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-3xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>{value}</p>
        <p className="text-sm font-medium mt-1" style={{ color: 'var(--text-secondary)' }}>{title}</p>
        {subtitle && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
      </div>
    </div>
  );
}
