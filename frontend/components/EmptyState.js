export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
        {icon}
      </div>
      <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>{title}</h3>
      {description && <p className="text-sm mb-4 max-w-xs" style={{ color: 'var(--text-muted)' }}>{description}</p>}
      {action}
    </div>
  );
}
