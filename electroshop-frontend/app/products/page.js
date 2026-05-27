'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { productAPI } from '@/lib/api';
import ProductGrid from '@/components/products/ProductGrid';
import ProductSearch from '@/components/products/ProductSearch';
import CategoryFilter from '@/components/products/CategoryFilter';

const SORT_OPTIONS = [
  { value: '', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

export default function ProductsPage() {
  return <Suspense><ProductsContent /></Suspense>;
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, pageSize: 12 };
      if (search) params.q = search;
      if (category) params.category = category;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const { data } = await productAPI.getProducts(params);
      let results = data.products ?? [];

      if (sort === 'price_asc') results = [...results].sort((a, b) => a.price - b.price);
      if (sort === 'price_desc') results = [...results].sort((a, b) => b.price - a.price);
      if (sort === 'rating') results = [...results].sort((a, b) => b.rating - a.rating);

      setProducts(results);
      setTotal(data.total ?? 0);
      setPages(data.pages ?? 1);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, minPrice, maxPrice, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    const cat = searchParams.get('category') || '';
    const q = searchParams.get('q') || '';
    setCategory(cat);
    setSearch(q);
  }, [searchParams]);

  const handleCategoryChange = (val) => { setCategory(val); setPage(1); };
  const handleSearchChange = (val) => { setSearch(val); setPage(1); };

  const clearFilters = () => {
    setSearch(''); setCategory(''); setSort(''); setMinPrice(''); setMaxPrice(''); setPage(1);
  };

  const hasActiveFilters = search || category || sort || minPrice || maxPrice;

  return (
    <div className="min-h-screen bg-[#0f172a] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">All Products</h1>
          <p className="text-slate-400">{loading ? 'Loading…' : `${total} products found`}</p>
        </div>

        {/* Filters bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-8 space-y-4">
          {/* Search + Sort */}
          <div className="flex flex-col sm:flex-row gap-3">
            <ProductSearch value={search} onChange={handleSearchChange} />
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 sm:w-48 flex-shrink-0"
            >
              {SORT_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value} className="bg-slate-800">{label}</option>
              ))}
            </select>
          </div>

          {/* Category tabs */}
          <CategoryFilter selected={category} onChange={handleCategoryChange} />

          {/* Price range */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-slate-400 text-sm font-medium">Price:</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min $"
                value={minPrice}
                onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                className="w-24 bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 placeholder-slate-500"
              />
              <span className="text-slate-600">—</span>
              <input
                type="number"
                placeholder="Max $"
                value={maxPrice}
                onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                className="w-24 bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 placeholder-slate-500"
              />
            </div>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Grid */}
        <ProductGrid products={products} loading={loading} columns={4} />

        {/* Pagination */}
        {pages > 1 && !loading && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-400 rounded-xl text-sm hover:bg-slate-800 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={[
                  'w-10 h-10 rounded-xl text-sm font-medium transition-colors',
                  p === page
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white',
                ].join(' ')}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-400 rounded-xl text-sm hover:bg-slate-800 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
