'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import StarRating from '@/components/ui/StarRating';
import { formatPrice, calculateDiscount, getStockStatus } from '@/lib/utils';

export default function ProductCard({ product }) {
  const { addToCart, isInCart } = useCart();
  const discount = calculateDiscount(product.price, product.comparePrice);
  const stockStatus = getStockStatus(product.stock);
  const inCart = isInCart(product._id);
  const imageSrc = product.images?.[0] || `https://placehold.co/400x400/1e293b/3b82f6?text=${encodeURIComponent(product.name?.split(' ')[0] ?? 'Product')}`;

  return (
    <div className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 hover:shadow-xl hover:shadow-slate-950/50 hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
      {/* Image */}
      <Link href={`/products/${product._id}`} className="relative block bg-slate-800/50 overflow-hidden" style={{ aspectRatio: '1' }}>
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          className="object-contain p-5 group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {!!discount && (
          <div className="absolute top-3 left-3 bg-blue-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
            {discount}
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center">
            <span className="text-slate-300 font-semibold text-sm bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
              Out of Stock
            </span>
          </div>
        )}
        {inCart && product.stock > 0 && (
          <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full p-1 shadow-md">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-blue-400 text-[11px] font-semibold uppercase tracking-widest mb-1">{product.brand}</p>
        <Link href={`/products/${product._id}`}>
          <h3 className="text-slate-100 font-semibold text-sm leading-snug line-clamp-2 mb-2 hover:text-blue-400 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1.5 mb-3">
          <StarRating rating={product.rating} />
          <span className="text-slate-500 text-xs">({product.numReviews})</span>
        </div>

        <div className="flex items-baseline gap-2 mb-4 mt-auto">
          <span className="text-white font-bold text-lg">{formatPrice(product.price)}</span>
          {product.comparePrice > product.price && (
            <span className="text-slate-500 text-sm line-through">{formatPrice(product.comparePrice)}</span>
          )}
        </div>

        <button
          onClick={() => stockStatus.available && addToCart(product, 1)}
          disabled={!stockStatus.available}
          className={[
            'w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2',
            stockStatus.available
              ? inCart
                ? 'bg-green-900/20 text-green-400 border border-green-800/50 hover:bg-green-900/30'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 active:scale-95'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed',
          ].join(' ')}
        >
          {stockStatus.available ? (
            inCart ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                In Cart
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Add to Cart
              </>
            )
          ) : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}
