const variants = {
  default: 'bg-slate-700 text-slate-300',
  success: 'bg-green-900/60 text-green-400 border border-green-800',
  warning: 'bg-yellow-900/60 text-yellow-400 border border-yellow-800',
  error: 'bg-red-900/60 text-red-400 border border-red-800',
  info: 'bg-blue-900/60 text-blue-400 border border-blue-800',
  primary: 'bg-blue-600 text-white',
  purple: 'bg-purple-900/60 text-purple-400 border border-purple-800',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
