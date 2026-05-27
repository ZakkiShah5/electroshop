import ProductCard from './ProductCard';

function SkeletonCard() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="aspect-square skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-3 skeleton rounded-full w-14" />
        <div className="h-4 skeleton rounded-full w-full" />
        <div className="h-4 skeleton rounded-full w-4/5" />
        <div className="h-3 skeleton rounded-full w-20" />
        <div className="h-6 skeleton rounded-full w-24 mt-1" />
        <div className="h-10 skeleton rounded-xl w-full mt-2" />
      </div>
    </div>
  );
}

export default function ProductGrid({ products, loading, columns = 4 }) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }[columns] ?? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  if (loading) {
    return (
      <div className={`grid ${gridCols} gap-5`}>
        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mb-6">
          <svg className="w-9 h-9 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-white font-semibold text-lg mb-2">No products found</h3>
        <p className="text-slate-400 text-sm">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols} gap-5`}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
