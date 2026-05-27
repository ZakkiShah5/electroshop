'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { orderAPI } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';

function OrderSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex gap-2">
                <div className="h-5 skeleton rounded w-32" />
                <div className="h-5 skeleton rounded-full w-16" />
                <div className="h-5 skeleton rounded-full w-20" />
              </div>
              <div className="h-4 skeleton rounded w-48" />
            </div>
            <div className="space-y-2 text-right">
              <div className="h-6 skeleton rounded w-20" />
              <div className="h-4 skeleton rounded w-24" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800">
            <div className="h-3 skeleton rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ paid }) {
  return paid ? (
    <span className="inline-flex items-center gap-1 bg-green-900/20 text-green-400 border border-green-800/50 text-xs font-semibold px-2.5 py-0.5 rounded-full">
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
      Paid
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 bg-amber-900/20 text-amber-400 border border-amber-800/50 text-xs font-semibold px-2.5 py-0.5 rounded-full">
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      Pending
    </span>
  );
}

function DeliveryBadge({ delivered }) {
  return delivered ? (
    <span className="inline-flex items-center gap-1 bg-blue-900/20 text-blue-400 border border-blue-800/50 text-xs font-semibold px-2.5 py-0.5 rounded-full">
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8" /></svg>
      Delivered
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 bg-slate-800 text-slate-400 border border-slate-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
      Processing
    </span>
  );
}

export default function OrdersPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { setLoading(false); return; }
    orderAPI.getMyOrders()
      .then(({ data }) => setOrders([...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated, authLoading]);

  if (!isAuthenticated && !authLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center py-20">
        <div className="text-center max-w-sm px-4">
          <div className="w-20 h-20 bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-9 h-9 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-white font-bold text-2xl mb-3">Sign In Required</h2>
          <p className="text-slate-400 mb-8">Please sign in to view your orders.</p>
          <Link href="/auth/login" className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-blue-600/20">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">My Orders</h1>
            {!loading && <p className="text-slate-400 mt-1">{orders.length} {orders.length === 1 ? 'order' : 'orders'} total</p>}
          </div>
          <Link href="/products" className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors">
            Continue Shopping →
          </Link>
        </div>

        {loading ? (
          <OrderSkeleton />
        ) : orders.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-9 h-9 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-white font-semibold text-xl mb-3">No orders yet</h2>
            <p className="text-slate-400 mb-8">Start shopping to see your orders here.</p>
            <Link href="/products" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-blue-600/20">
              Shop Now
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 hover:shadow-lg hover:shadow-slate-950/50 transition-all"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center flex-wrap gap-2 mb-1.5">
                      <p className="text-white font-bold text-sm font-mono">#{order._id.slice(-8).toUpperCase()}</p>
                      <StatusBadge paid={order.isPaid} />
                      <DeliveryBadge delivered={order.isDelivered} />
                    </div>
                    <p className="text-slate-500 text-xs">
                      {formatDate(order.createdAt)}
                      {' · '}
                      {order.items?.length} {order.items?.length === 1 ? 'item' : 'items'}
                      {' · '}
                      {order.paymentMethod}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 sm:text-right">
                    <div>
                      <p className="text-white font-bold text-lg">{formatPrice(order.totalPrice)}</p>
                    </div>
                    <Link
                      href={`/orders/${order._id}`}
                      className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors whitespace-nowrap"
                    >
                      View Details
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>

                <div className="mt-3.5 pt-3.5 border-t border-slate-800">
                  <p className="text-slate-600 text-xs line-clamp-1">
                    {order.items?.map((i) => `${i.name} ×${i.qty}`).join(', ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
