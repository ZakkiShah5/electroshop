'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex gap-4 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 group">
      {/* Image */}
      <Link href={`/products/${item._id}`} className="relative w-20 h-20 flex-shrink-0 bg-slate-900 rounded-xl overflow-hidden">
        <Image
          src={item.images?.[0] || 'https://via.placeholder.com/80x80/1e293b/3b82f6?text=?'}
          alt={item.name}
          fill
          className="object-contain p-1"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-blue-400 text-[10px] font-semibold uppercase tracking-widest">{item.brand}</p>
            <Link href={`/products/${item._id}`} className="text-white text-sm font-medium hover:text-blue-300 transition-colors line-clamp-2 leading-snug mt-0.5">
              {item.name}
            </Link>
          </div>
          <button
            onClick={() => removeFromCart(item._id)}
            className="flex-shrink-0 text-slate-600 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-900/20"
            aria-label="Remove item"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-between mt-3">
          {/* Qty controls */}
          <div className="flex items-center gap-1 bg-slate-900 rounded-xl border border-slate-700">
            <button
              onClick={() => updateQuantity(item._id, item.qty - 1)}
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="text-white text-sm font-semibold w-7 text-center">{item.qty}</span>
            <button
              onClick={() => updateQuantity(item._id, item.qty + 1)}
              disabled={item.qty >= item.stock}
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-white font-bold">{formatPrice(item.price * item.qty)}</p>
            {item.qty > 1 && (
              <p className="text-slate-500 text-xs">{formatPrice(item.price)} each</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
