'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { orderAPI } from '@/lib/api';
import Badge from '@/components/ui/Badge';
import { formatPrice, formatDate } from '@/lib/utils';
import { PageLoader } from '@/components/ui/LoadingSpinner';

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    orderAPI.getOrder(id)
      .then(({ data }) => setOrder(data))
      .catch(() => setError('Order not found or you do not have access.'))
      .finally(() => setLoading(false));
  }, [id, isAuthenticated, authLoading]);

  if (authLoading || loading) return <PageLoader />;

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-6">📭</div>
          <h2 className="text-white font-bold text-2xl mb-3">Order Not Found</h2>
          <p className="text-slate-400 mb-8">{error}</p>
          <Link href="/orders" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors inline-block">
            My Orders
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = order.items?.reduce((s, i) => s + i.price * i.qty, 0) ?? order.itemsPrice;

  return (
    <div className="min-h-screen bg-slate-950 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back */}
        <Link href="/orders" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Orders
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Order <span className="font-mono text-blue-400">#{order._id.slice(-8).toUpperCase()}</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={order.isPaid ? 'success' : 'warning'} className="px-3 py-1">
              {order.isPaid ? '✓ Paid' : '⏳ Payment Pending'}
            </Badge>
            <Badge variant={order.isDelivered ? 'success' : 'info'} className="px-3 py-1">
              {order.isDelivered ? '✓ Delivered' : '📦 Processing'}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-800">
                <h2 className="text-white font-semibold">Items Ordered</h2>
              </div>
              <div className="divide-y divide-slate-800">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-4">
                    <div className="w-16 h-16 bg-slate-800 rounded-xl flex-shrink-0 relative overflow-hidden border border-slate-700">
                      <Image
                        src={item.image || 'https://placehold.co/64x64/1e293b/3b82f6?text=?'}
                        alt={item.name}
                        fill
                        className="object-contain p-1.5"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm leading-snug">{item.name}</p>
                      <p className="text-slate-500 text-xs mt-0.5">Qty: {item.qty} × {formatPrice(item.price)}</p>
                    </div>
                    <span className="text-white font-bold text-sm flex-shrink-0">{formatPrice(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping address */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
              <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Shipping Address
              </h2>
              <div className="text-slate-300 text-sm space-y-1">
                <p>{order.shippingAddress?.street}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.country} {order.shippingAddress?.zip}</p>
              </div>
              {order.isDelivered && (
                <p className="text-green-400 text-xs mt-3 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Delivered on {formatDate(order.deliveredAt)}
                </p>
              )}
            </div>

            {/* Payment info */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
              <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Payment
              </h2>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Method</span>
                <span className="text-slate-200">{order.paymentMethod}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-slate-400">Status</span>
                <Badge variant={order.isPaid ? 'success' : 'warning'}>
                  {order.isPaid ? `Paid on ${formatDate(order.paidAt)}` : 'Not Paid'}
                </Badge>
              </div>
              {order.paymentResult?.id && (
                <div className="mt-3 pt-3 border-t border-slate-800">
                  <p className="text-slate-500 text-xs font-mono break-all">{order.paymentResult.id}</p>
                </div>
              )}
            </div>
          </div>

          {/* Summary sidebar */}
          <div className="space-y-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
              <h2 className="text-white font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="text-slate-200">{formatPrice(order.itemsPrice ?? subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Shipping</span>
                  <span className={order.shippingPrice === 0 ? 'text-green-400' : 'text-slate-200'}>
                    {order.shippingPrice === 0 ? 'FREE' : formatPrice(order.shippingPrice)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tax</span>
                  <span className="text-slate-200">{formatPrice(order.taxPrice)}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-800 mt-3">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-white font-black text-xl">{formatPrice(order.totalPrice)}</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
              <h2 className="text-white font-semibold mb-4">Timeline</h2>
              <div className="space-y-4">
                {[
                  { label: 'Order placed', date: order.createdAt, done: true },
                  { label: 'Payment confirmed', date: order.paidAt, done: order.isPaid },
                  { label: 'Delivered', date: order.deliveredAt, done: order.isDelivered },
                ].map((event, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 ${event.done ? 'bg-blue-600' : 'bg-slate-800 border border-slate-700'}`}>
                      {event.done && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${event.done ? 'text-white' : 'text-slate-600'}`}>{event.label}</p>
                      {event.date && <p className="text-slate-500 text-xs mt-0.5">{formatDate(event.date)}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/orders" className="block w-full text-center bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl text-sm font-medium transition-colors">
              ← Back to All Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
