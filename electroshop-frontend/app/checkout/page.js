'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { orderAPI, userAPI } from '@/lib/api';
import Button from '@/components/ui/Button';
import { formatPrice, getErrorMessage } from '@/lib/utils';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

const STRIPE_APPEARANCE = {
  theme: 'night',
  variables: {
    colorPrimary: '#3b82f6',
    colorBackground: '#1e293b',
    colorText: '#f1f5f9',
    colorDanger: '#ef4444',
    fontFamily: 'Inter, system-ui, sans-serif',
    borderRadius: '12px',
    spacingUnit: '4px',
  },
  rules: {
    '.Input': { border: '1px solid #334155', boxShadow: 'none' },
    '.Input:focus': { border: '1px solid #3b82f6', boxShadow: '0 0 0 2px rgba(59,130,246,.15)', outline: 'none' },
    '.Label': { color: '#94a3b8', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' },
    '.Tab': { border: '1px solid #334155', backgroundColor: '#0f172a' },
    '.Tab--selected': { border: '1px solid #3b82f6', backgroundColor: '#172554' },
    '.Tab:focus': { boxShadow: '0 0 0 2px rgba(59,130,246,.3)' },
    '.Error': { color: '#f87171' },
  },
};

// ── Progress steps ─────────────────────────────────────────────────────────────
function ProgressSteps({ current }) {
  const steps = [
    { n: 1, label: 'Shipping' },
    { n: 2, label: 'Payment' },
    { n: 3, label: 'Confirmed' },
  ];
  return (
    <div className="flex items-center justify-center">
      {steps.map((s, i) => (
        <div key={s.n} className="flex items-center">
          <div className={`flex items-center gap-2.5 transition-all ${s.n <= current ? 'opacity-100' : 'opacity-35'}`}>
            <div className={[
              'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300',
              s.n < current  ? 'bg-blue-600 border-blue-600 text-white' : '',
              s.n === current ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/40 ring-4 ring-blue-600/20' : '',
              s.n > current  ? 'bg-transparent border-slate-600 text-slate-500' : '',
            ].join(' ')}>
              {s.n < current
                ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                : s.n}
            </div>
            <span className={`text-sm font-medium hidden sm:block ${s.n === current ? 'text-white' : 'text-slate-500'}`}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-px w-12 sm:w-20 mx-3 transition-colors duration-500 ${s.n < current ? 'bg-blue-600' : 'bg-slate-700'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Order summary sidebar ──────────────────────────────────────────────────────
function OrderSummary({ cartItems, subtotal, shippingCost, tax, total }) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
      <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        Order Summary
      </h3>

      {/* Items list */}
      <div className="space-y-3 max-h-56 overflow-y-auto mb-5 pr-1">
        {cartItems.map((item) => (
          <div key={item._id} className="flex items-center gap-3">
            <div className="relative w-12 h-12 bg-slate-800 rounded-xl flex-shrink-0 overflow-hidden border border-slate-700/60">
              <Image
                src={item.images?.[0] || 'https://placehold.co/48x48/1e293b/3b82f6?text=?'}
                alt={item.name}
                fill
                className="object-contain p-1"
              />
              {item.qty > 1 && (
                <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {item.qty}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium line-clamp-2 leading-tight">{item.name}</p>
              <p className="text-slate-500 text-xs mt-0.5">{formatPrice(item.price)} each</p>
            </div>
            <span className="text-white text-xs font-bold flex-shrink-0">{formatPrice(item.price * item.qty)}</span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="space-y-2 pt-4 border-t border-slate-800 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">Subtotal</span>
          <span className="text-slate-200">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Shipping</span>
          <span className={shippingCost === 0 ? 'text-green-400 font-semibold' : 'text-slate-200'}>
            {shippingCost === 0 ? '✓ FREE' : formatPrice(shippingCost)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Tax (8%)</span>
          <span className="text-slate-200">{formatPrice(tax)}</span>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-slate-800">
          <span className="text-white font-bold">Total</span>
          <span className="text-white font-black text-xl">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Trust badges */}
      <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-2 gap-2">
        {[['🔒', 'SSL Encrypted'], ['💳', 'Stripe Secured'], ['🛡️', 'Fraud Protected'], ['↩️', '30-Day Returns']].map(([icon, label]) => (
          <div key={label} className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <span>{icon}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Shipping step ──────────────────────────────────────────────────────────────
function ShippingStep({ shipping, setShipping, onNext, loading }) {
  const set = (k) => (e) => setShipping((s) => ({ ...s, [k]: e.target.value }));
  const inp = 'w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all';
  const lbl = 'block text-slate-400 text-xs font-medium mb-1.5';

  const handleSubmit = (e) => {
    e.preventDefault();
    const missing = ['fullName', 'email', 'street', 'city', 'state', 'zip', 'country']
      .filter((f) => !shipping[f]?.trim());
    if (missing.length) { toast.error('Please fill in all required fields'); return; }
    if (!/\S+@\S+\.\S+/.test(shipping.email)) { toast.error('Please enter a valid email'); return; }
    onNext();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <h2 className="text-white font-bold text-xl mb-1">Shipping Information</h2>
        <p className="text-slate-400 text-sm mb-6">Where should we send your order?</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full name */}
            <div className="sm:col-span-2">
              <label className={lbl}>Full Name *</label>
              <input required value={shipping.fullName} onChange={set('fullName')} className={inp} placeholder="John Doe" />
            </div>
            {/* Email */}
            <div>
              <label className={lbl}>Email Address *</label>
              <input required type="email" value={shipping.email} onChange={set('email')} className={inp} placeholder="you@example.com" />
            </div>
            {/* Phone */}
            <div>
              <label className={lbl}>Phone Number</label>
              <input type="tel" value={shipping.phone} onChange={set('phone')} className={inp} placeholder="+1 (555) 000-0000" />
            </div>
            {/* Street */}
            <div className="sm:col-span-2">
              <label className={lbl}>Street Address *</label>
              <input required value={shipping.street} onChange={set('street')} className={inp} placeholder="123 Main St, Apt 4B" />
            </div>
            {/* City */}
            <div>
              <label className={lbl}>City *</label>
              <input required value={shipping.city} onChange={set('city')} className={inp} placeholder="New York" />
            </div>
            {/* State */}
            <div>
              <label className={lbl}>State / Province *</label>
              <input required value={shipping.state} onChange={set('state')} className={inp} placeholder="NY" />
            </div>
            {/* ZIP */}
            <div>
              <label className={lbl}>ZIP / Postal Code *</label>
              <input required value={shipping.zip} onChange={set('zip')} className={inp} placeholder="10001" />
            </div>
            {/* Country */}
            <div>
              <label className={lbl}>Country *</label>
              <select required value={shipping.country} onChange={set('country')} className={inp}>
                {[
                  ['US', 'United States'], ['CA', 'Canada'], ['GB', 'United Kingdom'],
                  ['AU', 'Australia'], ['PK', 'Pakistan'], ['IN', 'India'],
                  ['DE', 'Germany'], ['FR', 'France'], ['AE', 'UAE'], ['SG', 'Singapore'],
                  ['NL', 'Netherlands'], ['JP', 'Japan'], ['BR', 'Brazil'],
                ].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" size="lg" fullWidth loading={loading}>
              Continue to Payment
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Demo payment form (no real Stripe keys needed) ───────────────────────────
function DemoPaymentForm({ shipping, cartItems, subtotal, shippingCost, tax, total, onSuccess, clearCart, user }) {
  const [processing, setProcessing] = useState(false);
  const [card, setCard] = useState({ number: '4242 4242 4242 4242', expiry: '12 / 26', cvc: '123' });
  const set = (k) => (e) => setCard((s) => ({ ...s, [k]: e.target.value }));
  const inp = 'w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all font-mono tracking-widest';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 1800));
    try {
      const mockPaymentResult = {
        id: `pi_demo_${Date.now()}`,
        status: 'succeeded',
        update_time: new Date().toISOString(),
        email_address: shipping.email,
      };
      const orderPayload = {
        items: cartItems.map((i) => ({
          product: i._id,
          name: i.name,
          image: i.images?.[0] || '',
          qty: i.qty,
          price: i.price,
        })),
        shippingAddress: { street: shipping.street, city: shipping.city, country: shipping.country, zip: shipping.zip },
        paymentMethod: 'Stripe',
        paymentResult: mockPaymentResult,
        itemsPrice: subtotal,
        shippingPrice: shippingCost,
        taxPrice: tax,
        totalPrice: total,
      };
      const { data: order } = await orderAPI.createOrder(orderPayload);
      await orderAPI.payOrder(order._id, mockPaymentResult);
      try {
        if (user) await userAPI.updateProfile({ address: { street: shipping.street, city: shipping.city, country: shipping.country, zip: shipping.zip } });
      } catch {}
      clearCart();
      toast.success('Order placed successfully!');
      onSuccess(order._id);
    } catch (err) {
      toast.error(getErrorMessage(err));
      setProcessing(false);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
      <h2 className="text-white font-bold text-xl mb-1">Payment</h2>
      <p className="text-slate-400 text-sm mb-6">All transactions are secured and encrypted</p>

      {/* Demo mode notice */}
      <div className="flex items-start gap-3 bg-amber-950/40 border border-amber-700/50 rounded-xl p-4 mb-6">
        <span className="text-xl flex-shrink-0 mt-0.5">🎭</span>
        <div>
          <p className="text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">Demo Mode</p>
          <p className="text-slate-300 text-sm">No real Stripe keys detected. Card below is pre-filled — just click Pay to complete the demo order.</p>
          <p className="text-slate-500 text-xs mt-1.5">
            To enable real payments, add your{' '}
            <span className="font-mono text-amber-400">sk_test_...</span> key to <span className="font-mono text-amber-400">.env.local</span>.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mock card UI */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Card Details</p>
            <div className="flex gap-1.5">
              {['💳', '🔒'].map((i) => <span key={i} className="text-sm">{i}</span>)}
            </div>
          </div>
          <div>
            <label className="block text-slate-500 text-xs font-medium mb-1.5 uppercase tracking-wider">Card Number</label>
            <input value={card.number} onChange={set('number')} className={inp} placeholder="4242 4242 4242 4242" maxLength={19} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-500 text-xs font-medium mb-1.5 uppercase tracking-wider">Expiry</label>
              <input value={card.expiry} onChange={set('expiry')} className={inp} placeholder="MM / YY" maxLength={7} />
            </div>
            <div>
              <label className="block text-slate-500 text-xs font-medium mb-1.5 uppercase tracking-wider">CVC</label>
              <input value={card.cvc} onChange={set('cvc')} className={inp} placeholder="123" maxLength={4} />
            </div>
          </div>
        </div>

        <Button type="submit" size="lg" fullWidth loading={processing}>
          {processing ? 'Processing Payment…' : `Pay ${formatPrice(total)} — Demo`}
        </Button>

        <p className="text-slate-500 text-xs text-center flex items-center justify-center gap-1.5">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Demo mode — no real charge will be made
        </p>
      </form>
    </div>
  );
}

// ── Payment form — must be rendered inside <Elements> ─────────────────────────
function PaymentForm({ shipping, cartItems, subtotal, shippingCost, tax, total, onSuccess, clearCart, user }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setPaymentError('');

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
        confirmParams: {
          return_url: `${window.location.origin}/checkout`,
          payment_method_data: {
            billing_details: {
              name: shipping.fullName,
              email: shipping.email,
              phone: shipping.phone || undefined,
              address: {
                line1: shipping.street,
                city: shipping.city,
                state: shipping.state,
                postal_code: shipping.zip,
                country: shipping.country,
              },
            },
          },
        },
      });

      if (error) {
        setPaymentError(error.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        const paymentResult = {
          id: paymentIntent.id,
          status: paymentIntent.status,
          update_time: new Date().toISOString(),
          email_address: shipping.email,
        };

        const orderPayload = {
          items: cartItems.map((i) => ({
            product: i._id,
            name: i.name,
            image: i.images?.[0] || '',
            qty: i.qty,
            price: i.price,
          })),
          shippingAddress: {
            street: shipping.street,
            city: shipping.city,
            country: shipping.country,
            zip: shipping.zip,
          },
          paymentMethod: 'Stripe',
          paymentResult,
          itemsPrice: subtotal,
          shippingPrice: shippingCost,
          taxPrice: tax,
          totalPrice: total,
        };

        const { data: order } = await orderAPI.createOrder(orderPayload);
        await orderAPI.payOrder(order._id, paymentResult);

        // Save shipping address to profile (non-critical)
        try {
          if (user) {
            await userAPI.updateProfile({
              address: { street: shipping.street, city: shipping.city, country: shipping.country, zip: shipping.zip },
            });
          }
        } catch {}

        clearCart();
        toast.success('Payment successful!');
        onSuccess(order._id);
      }
    } catch (err) {
      setPaymentError(getErrorMessage(err));
      setProcessing(false);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
      <h2 className="text-white font-bold text-xl mb-1">Payment</h2>
      <p className="text-slate-400 text-sm mb-6">All transactions are secured and encrypted</p>

      {/* Test card banner */}
      <div className="flex items-start gap-3 bg-blue-950/50 border border-blue-800/40 rounded-xl p-4 mb-6">
        <span className="text-xl flex-shrink-0 mt-0.5">🧪</span>
        <div>
          <p className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-1.5">Test Mode Active</p>
          <p className="text-slate-300 text-sm leading-relaxed">
            Use card number{' '}
            <span className="font-mono font-bold text-white bg-slate-700/80 px-2 py-0.5 rounded-md text-xs tracking-widest">
              4242 4242 4242 4242
            </span>
          </p>
          <p className="text-slate-400 text-xs mt-1.5">Any future expiry date · Any 3-digit CVC · Any ZIP code</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <PaymentElement
          options={{
            layout: { type: 'tabs', defaultCollapsed: false },
            wallets: { applePay: 'never', googlePay: 'never' },
          }}
        />

        {paymentError && (
          <div className="flex items-start gap-2.5 bg-red-950/40 border border-red-800/50 rounded-xl px-4 py-3 text-sm text-red-400">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{paymentError}</span>
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          fullWidth
          loading={processing}
          disabled={!stripe || !elements || processing}
        >
          {processing ? 'Processing Payment…' : `Pay ${formatPrice(total)} Securely`}
        </Button>

        <p className="text-slate-500 text-xs text-center flex items-center justify-center gap-1.5">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Protected by 256-bit SSL encryption
        </p>
      </form>
    </div>
  );
}

// ── Order confirmation ─────────────────────────────────────────────────────────
function ConfirmationStep({ orderId }) {
  return (
    <div className="max-w-lg mx-auto text-center py-10">
      {/* Animated success mark */}
      <div className="flex justify-center mb-10">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
          <div className="relative w-28 h-28 rounded-full bg-green-950/60 border-2 border-green-500 flex items-center justify-center shadow-2xl shadow-green-500/20">
            <svg className="w-14 h-14 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>

      <h2 className="text-4xl font-black text-white mb-3">Order Confirmed!</h2>
      <p className="text-slate-400 mb-4">Your payment was successful and your order is being prepared.</p>

      {orderId && (
        <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-full px-5 py-2 mb-6">
          <span className="text-slate-400 text-sm">Order ID</span>
          <span className="font-mono font-bold text-blue-400 text-sm tracking-wider">
            #{orderId.slice(-8).toUpperCase()}
          </span>
        </div>
      )}

      <p className="text-slate-500 text-sm max-w-sm mx-auto mb-10 leading-relaxed">
        We'll send a confirmation email shortly. You can track your order status from your account.
      </p>

      {/* What happens next */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 mb-8 text-left">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">What happens next</p>
        <div className="space-y-3">
          {[
            ['📧', 'Confirmation email sent to your inbox'],
            ['📦', 'Order being packed and prepared'],
            ['🚚', 'Shipping within 1-2 business days'],
            ['✅', 'Delivery in 3-7 business days'],
          ].map(([icon, text]) => (
            <div key={text} className="flex items-center gap-3 text-sm text-slate-300">
              <span className="text-base w-6 text-center">{icon}</span>
              {text}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/orders">
          <Button variant="secondary" size="lg" className="w-full sm:w-auto">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            View My Orders
          </Button>
        </Link>
        <Link href="/products">
          <Button size="lg" className="w-full sm:w-auto">
            Continue Shopping
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Button>
        </Link>
      </div>
    </div>
  );
}

// ── Main checkout page ─────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [shipping, setShipping] = useState({
    fullName: '', email: '', phone: '',
    street: '', city: '', state: '', zip: '', country: 'US',
  });
  const [clientSecret, setClientSecret] = useState('');
  const [isDemo, setIsDemo] = useState(false);
  const [creatingIntent, setCreatingIntent] = useState(false);
  const [orderId, setOrderId] = useState('');

  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated, isLoading } = useAuth();

  const subtotal = cartTotal;
  const shippingCost = subtotal > 50 ? 0 : 9.99;
  const tax = parseFloat((subtotal * 0.08).toFixed(2));
  const total = parseFloat((subtotal + shippingCost + tax).toFixed(2));

  // Pre-fill name + email from logged-in user
  useEffect(() => {
    if (user) {
      setShipping((s) => ({
        ...s,
        fullName: s.fullName || user.name || '',
        email: s.email || user.email || '',
      }));
    }
  }, [user]);

  if (isLoading) return null;

  // Not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-9 h-9 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-white font-bold text-2xl mb-3">Sign In Required</h2>
          <p className="text-slate-400 mb-8">Please sign in to complete your purchase.</p>
          <Link href="/auth/login"><Button size="lg" fullWidth>Sign In to Continue</Button></Link>
          <p className="text-slate-500 text-xs mt-4">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-blue-400 hover:text-blue-300">Create one free</Link>
          </p>
        </div>
      </div>
    );
  }

  // Empty cart
  if (cartItems.length === 0 && step < 3) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-9 h-9 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-white font-bold text-2xl mb-3">Your cart is empty</h2>
          <p className="text-slate-400 mb-8">Add some products before checking out.</p>
          <Link href="/products"><Button size="lg" fullWidth>Browse Products</Button></Link>
        </div>
      </div>
    );
  }

  // Create Stripe payment intent (or enter demo mode) and advance to step 2
  const handleShippingNext = async () => {
    setCreatingIntent(true);
    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (data.demo) {
        setIsDemo(true);
      } else {
        setClientSecret(data.clientSecret);
      }
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setCreatingIntent(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg">
              Electro<span className="text-blue-400">Shop</span>
            </span>
          </Link>
          {step < 3 && (
            <Link href="/cart" className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Cart
            </Link>
          )}
        </div>

        {/* ── Progress ── */}
        {step < 3 && (
          <div className="mb-10">
            <ProgressSteps current={step} />
          </div>
        )}

        {/* ── Step 1: Shipping ── */}
        {step === 1 && (
          <ShippingStep
            shipping={shipping}
            setShipping={setShipping}
            onNext={handleShippingNext}
            loading={creatingIntent}
          />
        )}

        {/* ── Step 2: Payment ── */}
        {step === 2 && (isDemo || clientSecret) && (() => {
          const sharedProps = {
            shipping, cartItems, subtotal, shippingCost, tax, total, clearCart, user,
            onSuccess: (id) => { setOrderId(id); setStep(3); window.scrollTo({ top: 0, behavior: 'smooth' }); },
          };
          const backAndSummary = (
            <>
              <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Shipping
              </button>
              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl px-5 py-4 flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Shipping to</p>
                  <p className="text-white text-sm font-semibold">{shipping.fullName}</p>
                  <p className="text-slate-400 text-xs">{shipping.street}, {shipping.city}, {shipping.state} {shipping.zip}, {shipping.country}</p>
                  <p className="text-slate-500 text-xs">{shipping.email}</p>
                </div>
                <button onClick={() => setStep(1)} className="text-blue-400 hover:text-blue-300 text-xs font-semibold transition-colors flex-shrink-0 bg-blue-900/20 px-2.5 py-1 rounded-lg">
                  Change
                </button>
              </div>
            </>
          );
          const sidebar = (
            <div className="lg:sticky lg:top-24">
              <OrderSummary cartItems={cartItems} subtotal={subtotal} shippingCost={shippingCost} tax={tax} total={total} />
            </div>
          );

          if (isDemo) {
            return (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-4">
                  {backAndSummary}
                  <DemoPaymentForm {...sharedProps} />
                </div>
                {sidebar}
              </div>
            );
          }

          return (
            <Elements stripe={stripePromise} options={{ clientSecret, appearance: STRIPE_APPEARANCE }}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-4">
                  {backAndSummary}
                  <PaymentForm {...sharedProps} />
                </div>
                {sidebar}
              </div>
            </Elements>
          );
        })()}

        {/* ── Step 3: Confirmation ── */}
        {step === 3 && <ConfirmationStep orderId={orderId} />}
      </div>
    </div>
  );
}
