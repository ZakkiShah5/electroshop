import Link from 'next/link';

export const metadata = {
  title: '404 — Product Not Found | ElectroShop',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center py-20 px-4">
      <div className="text-center max-w-lg mx-auto">
        {/* Illustration */}
        <div className="relative mb-8 flex justify-center">
          <div className="w-48 h-48 bg-blue-900/20 rounded-full flex items-center justify-center relative">
            <svg className="w-28 h-28 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {/* Error badge */}
            <div className="absolute -top-2 -right-2 w-14 h-14 bg-red-900/40 rounded-full flex items-center justify-center border-4 border-[#0f172a]">
              <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>

        {/* 404 */}
        <div className="text-8xl font-black text-slate-800 leading-none mb-4 select-none">404</div>

        <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
          This page has been discontinued.
        </h1>
        <p className="text-slate-400 text-base mb-2 leading-relaxed">
          Looks like this page went out of stock — permanently.
        </p>
        <p className="text-slate-500 text-sm mb-10">
          No warranty, no refund, no page. Try one of these instead:
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 w-full sm:w-auto justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go Home
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 font-semibold px-6 py-3 rounded-xl transition-all w-full sm:w-auto justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Browse Products
          </Link>
        </div>

        {/* Quick links */}
        <div className="border-t border-slate-800 pt-8">
          <p className="text-slate-500 text-xs mb-4 uppercase tracking-wider font-medium">Popular Categories</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { label: 'Smartphones', href: '/products?category=phones' },
              { label: 'Laptops', href: '/products?category=laptops' },
              { label: 'Tablets', href: '/products?category=tablets' },
              { label: 'Accessories', href: '/products?category=accessories' },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-blue-400 bg-slate-900 border border-slate-800 hover:border-blue-800/50 px-3 py-1.5 rounded-lg transition-all"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
