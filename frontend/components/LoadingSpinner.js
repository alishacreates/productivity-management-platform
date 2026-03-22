export default function LoadingSpinner({ size = 'md', text }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className={`${sizes[size]} border-2 rounded-full animate-spin`}
        style={{ borderColor: 'color-mix(in srgb, var(--accent) 30%, transparent)', borderTopColor: 'var(--accent)' }} />
      {text && <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{text}</p>}
    </div>
  );
}
