const sizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-4',
  xl: 'w-16 h-16 border-4',
};

export default function LoadingSpinner({ size = 'md', className = '' }) {
  return (
    <div
      className={`${sizes[size]} rounded-full border-slate-600 border-t-blue-500 animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="xl" />
        <p className="text-slate-400 animate-pulse">Loading…</p>
      </div>
    </div>
  );
}
