'use client';

import LoadingSpinner from './LoadingSpinner';

const variants = {
  primary:   'bg-blue-600 hover:bg-blue-700 text-white shadow-sm',
  secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700',
  outline:   'border border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white hover:border-blue-600',
  ghost:     'text-slate-400 hover:text-white hover:bg-slate-800',
  danger:    'bg-red-600 hover:bg-red-700 text-white shadow-sm',
  success:   'bg-green-600 hover:bg-green-700 text-white shadow-sm',
};

const sizes = {
  xs: 'px-2.5 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  fullWidth = false,
  type = 'button',
  onClick,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold',
        'transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-slate-900',
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" />}
      {children}
    </button>
  );
}
