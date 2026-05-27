'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';

export default function CartSummary({ onCheckout, checkoutLoading = false }) {
  const { cartTotal, cartItems } = useCart();
  const shipping = cartTotal > 100 ? 0 : cartTotal === 0 ? 0 : 10;
  const total = cartTotal + shipping;

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 sticky top-24">
      <h2 className="text-white font-semibold text-lg mb-6">Order Summary</h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Subtotal ({cartItems.reduce((s, i) => s + i.qty, 0)} items)</span>
          <span className="text-white font-medium">{formatPrice(cartTotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Shipping</span>
          <span className={shipping === 0 ? 'text-green-400 font-medium' : 'text-white font-medium'}>
            {shipping === 0 ? (cartTotal > 0 ? 'Free' : '—') : formatPrice(shipping)}
          </span>
        </div>
        {cartTotal > 0 && cartTotal <= 100 && (
          <p className="text-xs text-blue-400 bg-blue-900/20 border border-blue-900/40 rounded-lg px-3 py-2">
            Add {formatPrice(100 - cartTotal)} more for free shipping
          </p>
        )}
        <div className="border-t border-slate-700 pt-3">
          <div className="flex justify-between">
            <span className="text-white font-semibold">Total</span>
            <span className="text-white font-bold text-xl">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {onCheckout ? (
        <Button
          fullWidth
          size="lg"
          loading={checkoutLoading}
          onClick={onCheckout}
          disabled={cartItems.length === 0}
        >
          Proceed to Checkout
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Button>
      ) : (
        <Link href="/checkout">
          <Button fullWidth size="lg" disabled={cartItems.length === 0}>
            Proceed to Checkout
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Button>
        </Link>
      )}

      <Link href="/products" className="block text-center mt-3 text-sm text-slate-400 hover:text-blue-400 transition-colors">
        ← Continue Shopping
      </Link>

      {/* Trust badges */}
      <div className="mt-6 pt-5 border-t border-slate-700/50 grid grid-cols-3 gap-3">
        {[
          { icon: '🔒', text: 'Secure Checkout' },
          { icon: '🚚', text: 'Fast Delivery' },
          { icon: '↩️', text: 'Easy Returns' },
        ].map(({ icon, text }) => (
          <div key={text} className="flex flex-col items-center text-center gap-1">
            <span className="text-lg">{icon}</span>
            <span className="text-slate-500 text-[10px] font-medium leading-tight">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
