'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { productAPI } from '@/lib/api';
import ProductGrid from '@/components/products/ProductGrid';

const CATEGORIES = [
  {
    label: 'Smartphones', value: 'phones', desc: 'Latest flagships & budget picks',
    color: 'bg-blue-900/20 border-blue-800/30 hover:border-blue-600/50 hover:bg-blue-900/30',
    iconBg: 'bg-blue-900/30', iconColor: 'text-blue-400',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: 'Laptops', value: 'laptops', desc: 'Power & portability combined',
    color: 'bg-violet-900/20 border-violet-800/30 hover:border-violet-600/50 hover:bg-violet-900/30',
    iconBg: 'bg-violet-900/30', iconColor: 'text-violet-400',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: 'Tablets', value: 'tablets', desc: 'Work, draw & create anywhere',
    color: 'bg-emerald-900/20 border-emerald-800/30 hover:border-emerald-600/50 hover:bg-emerald-900/30',
    iconBg: 'bg-emerald-900/30', iconColor: 'text-emerald-400',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: 'Accessories', value: 'accessories', desc: 'Audio, cases & more',
    color: 'bg-orange-900/20 border-orange-800/30 hover:border-orange-600/50 hover:bg-orange-900/30',
    iconBg: 'bg-orange-900/30', iconColor: 'text-orange-400',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
  },
];

const WHY_US = [
  {
    title: 'Secure Payments', desc: 'Industry-standard SSL encryption on all transactions.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    bg: 'bg-blue-900/20 border-blue-800/20', iconColor: 'text-blue-400',
  },
  {
    title: 'Fast Shipping', desc: 'Free delivery on orders over $50. Express options available.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
    bg: 'bg-green-900/20 border-green-800/20', iconColor: 'text-green-400',
  },
  {
    title: '30-Day Returns', desc: 'Not satisfied? Easy hassle-free returns within 30 days.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    bg: 'bg-orange-900/20 border-orange-800/20', iconColor: 'text-orange-400',
  },
  {
    title: 'Genuine Products', desc: '100% authentic from authorized dealers worldwide.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    bg: 'bg-violet-900/20 border-violet-800/20', iconColor: 'text-violet-400',
  },
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    productAPI.getProducts({ pageSize: 8 })
      .then(({ data }) => setProducts(data.products ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a]">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full translate-x-1/3 -translate-y-1/4 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full -translate-x-1/4 translate-y-1/3 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(to right, #fff 1px, transparent 1px)', backgroundSize: '72px 72px' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold px-4 py-2 rounded-full mb-8">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
              New Arrivals — Galaxy S24 & iPhone 15 Pro In Stock
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-[0.95] tracking-tight mb-6">
              Premium Tech,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Better Prices.
              </span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
              Smartphones, laptops, tablets and accessories from the world's top brands. Free shipping on orders over $50.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 hover:-translate-y-0.5">
                Shop Now
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link href="/products?category=phones" className="inline-flex items-center gap-2 border border-white/20 text-white/80 hover:text-white hover:border-white/40 font-semibold px-7 py-3.5 rounded-xl transition-all hover:-translate-y-0.5">
                Browse Deals
              </Link>
            </div>

            <div className="flex flex-wrap gap-x-10 gap-y-4 mt-16 pt-10 border-t border-white/10">
              {[['10K+', 'Happy Customers'], ['500+', 'Products'], ['50+', 'Top Brands'], ['4.9', 'Avg. Rating']].map(([n, l]) => (
                <div key={l}>
                  <p className="text-white font-bold text-2xl">{n}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Shop by Category</h2>
            <p className="text-slate-400 max-w-md mx-auto">Browse our curated collection of premium consumer electronics</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map(({ label, value, desc, color, iconBg, iconColor, icon }) => (
              <Link
                key={value}
                href={`/products?category=${value}`}
                className={`group relative border rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-950/50 ${color}`}
              >
                <div className={`w-14 h-14 ${iconBg} rounded-xl flex items-center justify-center ${iconColor} mb-4 group-hover:scale-105 transition-transform`}>
                  {icon}
                </div>
                <h3 className="text-white font-bold mb-1">{label}</h3>
                <p className="text-slate-400 text-sm leading-snug">{desc}</p>
                <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────────────── */}
      <section className="py-20 bg-[#0f172a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Featured Products</h2>
              <p className="text-slate-400">Hand-picked premium electronics</p>
            </div>
            <Link href="/products" className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors whitespace-nowrap">
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <ProductGrid products={products} loading={loading} columns={4} />
        </div>
      </section>

      {/* ── Promo Banner ──────────────────────────────────────────────────── */}
      <section className="py-10 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12 md:px-14">
            <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-wider uppercase">
                  Limited Time
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-2">Save Up to 30% Off</h2>
                <p className="text-blue-100 text-lg">On selected laptops and smartphones.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <Link href="/products?category=laptops" className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-7 py-3 rounded-xl transition-colors text-sm text-center">
                  Shop Laptops
                </Link>
                <Link href="/products?category=phones" className="bg-white/10 hover:bg-white/20 text-white border border-white/25 font-bold px-7 py-3 rounded-xl transition-colors text-sm text-center">
                  Shop Phones
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why ElectroShop ───────────────────────────────────────────────── */}
      <section className="py-20 bg-[#0f172a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Why ElectroShop?</h2>
            <p className="text-slate-400">We're committed to the best shopping experience</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_US.map(({ title, desc, icon, bg, iconColor }) => (
              <div key={title} className={`${bg} border rounded-2xl p-6 text-center transition-all hover:border-opacity-60`}>
                <div className={`w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4 ${iconColor}`}>
                  {icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-950 border-t border-slate-800">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-14 h-14 bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Stay in the Loop</h2>
          <p className="text-slate-400 mb-8">Exclusive deals, new arrivals, and tech news — straight to your inbox.</p>
          {subscribed ? (
            <div className="bg-green-900/20 border border-green-800/50 text-green-400 rounded-2xl px-6 py-4 font-medium flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Thanks for subscribing! Look out for our next newsletter.
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
              />
              <button
                onClick={() => email && setSubscribed(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors whitespace-nowrap shadow-lg shadow-blue-600/20"
              >
                Subscribe
              </button>
            </div>
          )}
          <p className="text-slate-600 text-xs mt-4">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  );
}
