'use client';

const CATEGORIES = [
  { value: '', label: 'All', icon: '⚡' },
  { value: 'phones', label: 'Phones', icon: '📱' },
  { value: 'laptops', label: 'Laptops', icon: '💻' },
  { value: 'tablets', label: 'Tablets', icon: '📟' },
  { value: 'accessories', label: 'Accessories', icon: '🎧' },
];

export default function CategoryFilter({ selected, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map(({ value, label, icon }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={[
            'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
            selected === value
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
              : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700',
          ].join(' ')}
        >
          <span>{icon}</span>
          {label}
        </button>
      ))}
    </div>
  );
}
