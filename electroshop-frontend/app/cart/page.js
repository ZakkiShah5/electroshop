'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import Button from '@/components/ui/Button';

export default function CartPage() {
  const { cartItems, clearCart, cartCount } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center py-20">
        <div className="text-center max-w-sm mx-auto px-4">
          <div className="w-24 h-24 bg-blue-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-11 h-11 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-white font-bold text-2xl mb-3">Your cart is empty</h2>
          <p className="text-slate-400 mb-8">Looks like you haven't added anything yet.</p>
          <Link href="/products">
            <Button size="lg" fullWidth>
              Browse Products
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Shopping Cart</h1>
            <p className="text-slate-400 mt-1">{cartCount} {cartCount === 1 ? 'item' : 'items'}</p>
          </div>
          <button
            onClick={clearCart}
            className="text-sm text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map((item) => (
              <CartItem key={item._id} item={item} />
            ))}

            <Link
              href="/products"
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium pt-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Continue Shopping
            </Link>
          </div>

          {/* Summary */}
          <div>
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
