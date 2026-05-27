'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { orderAPI } from '@/lib/api';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatPrice, formatDate, getErrorMessage } from '@/lib/utils';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const FILTERS = [
  { key: 'all', label: 'All Orders' },
  { key: 'paid', label: 'Paid' },
  { key: 'unpaid', label: 'Unpaid' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'pending', label: 'Undelivered' },
];

// ── Order detail panel ────────────────────────────────────────────────────────
function OrderPanel({ order, onClose, onDeliver }) {
  const [delivering, setDelivering] = useState(false);

  const handleDeliver = async () => {
    setDelivering(true);
    try {
      await orderAPI.deliverOrder(order._id);
      toast.success('Order marked as delivered');
      onDeliver(order._id);
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDelivering(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="fixed top-0 right-0 z-50 h-full w-full max-w-lg bg-[#0c1425] border-l border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 flex-shrink-0">
          <div>
            <h2 className="text-white font-bold text-lg">Order Details</h2>
            <p className="text-slate-500 text-xs font-mono mt-0.5">#{order._id.slice(-8).toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Status badges */}
          <div className="flex gap-2 flex-wrap">
            <Badge variant={order.isPaid ? 'success' : 'warning'} className="px-3 py-1">
              {order.isPaid ? '✓ Paid' : '⏳ Unpaid'}
            </Badge>
            <Badge variant={order.isDelivered ? 'success' : 'info'} className="px-3 py-1">
              {order.isDelivered ? '✓ Delivered' : '📦 Processing'}
            </Badge>
          </div>

          {/* Customer */}
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 space-y-1.5">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Customer</p>
            <p className="text-white font-semibold">{order.user?.name ?? 'N/A'}</p>
            <p className="text-slate-400 text-sm">{order.user?.email ?? '—'}</p>
            <p className="text-slate-500 text-xs">{formatDate(order.createdAt)}</p>
          </div>

          {/* Items */}
          <div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3">Items ({order.items?.length})</p>
            <div className="space-y-2.5">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-slate-800/40 border border-slate-700/50 rounded-xl p-3">
                  <div className="w-12 h-12 bg-slate-800 rounded-lg flex-shrink-0 relative overflow-hidden border border-slate-700">
                    <Image
                      src={item.image || 'https://placehold.co/48x48/1e293b/3b82f6?text=?'}
                      alt={item.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium line-clamp-2">{item.name}</p>
                    <p className="text-slate-500 text-xs mt-0.5">Qty: {item.qty} × {formatPrice(item.price)}</p>
                  </div>
                  <span className="text-white text-xs font-bold flex-shrink-0">{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Shipping Address</p>
            <p className="text-slate-300 text-sm">{order.shippingAddress?.street}</p>
            <p className="text-slate-300 text-sm">{order.shippingAddress?.city}, {order.shippingAddress?.country} {order.shippingAddress?.zip}</p>
            {order.isDelivered && (
              <p className="text-green-400 text-xs mt-2 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Delivered {formatDate(order.deliveredAt)}
              </p>
            )}
          </div>

          {/* Payment */}
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3">Payment</p>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Method</span>
                <span className="text-slate-200">{order.paymentMethod}</span>
              </div>
              {order.isPaid && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Paid on</span>
                  <span className="text-slate-200">{formatDate(order.paidAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Totals */}
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 space-y-2 text-sm">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Order Total</p>
            <div className="flex justify-between">
              <span className="text-slate-400">Subtotal</span>
              <span className="text-slate-200">{formatPrice(order.itemsPrice)}</span>
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
            <div className="flex justify-between items-center pt-2 border-t border-slate-700 mt-1">
              <span className="text-white font-bold">Total</span>
              <span className="text-white font-black text-lg">{formatPrice(order.totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-800 flex-shrink-0 space-y-3">
          {!order.isDelivered && order.isPaid && (
            <Button fullWidth loading={delivering} onClick={handleDeliver}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Mark as Delivered
            </Button>
          )}
          <Button variant="secondary" fullWidth onClick={onClose} type="button">
            Close
          </Button>
        </div>
      </div>
    </>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    orderAPI.getAllOrders()
      .then(({ data }) => {
        const sorted = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sorted);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDeliver = (id) => {
    setOrders((prev) =>
      prev.map((o) => o._id === id ? { ...o, isDelivered: true, deliveredAt: new Date().toISOString() } : o)
    );
  };

  if (loading) return <PageLoader />;

  const filtered = orders.filter((o) => {
    const matchFilter =
      filter === 'all' ? true :
      filter === 'paid' ? o.isPaid :
      filter === 'unpaid' ? !o.isPaid :
      filter === 'delivered' ? o.isDelivered :
      filter === 'pending' ? !o.isDelivered : true;

    const matchSearch = !search || (
      o._id.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(search.toLowerCase())
    );

    return matchFilter && matchSearch;
  });

  const paidCount = orders.filter((o) => o.isPaid).length;
  const deliveredCount = orders.filter((o) => o.isDelivered).length;
  const totalRevenue = orders.filter((o) => o.isPaid).reduce((s, o) => s + o.totalPrice, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <p className="text-slate-400 text-sm mt-1">{orders.length} orders total</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: orders.length, color: 'text-white' },
          { label: 'Revenue', value: formatPrice(totalRevenue), color: 'text-green-400' },
          { label: 'Paid', value: paidCount, color: 'text-blue-400' },
          { label: 'Delivered', value: deliveredCount, color: 'text-purple-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
            <p className="text-slate-500 text-xs mb-1">{label}</p>
            <p className={`font-bold text-xl ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters + search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order ID, name, or email…"
          className="flex-1 bg-slate-900 border border-slate-800 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
        />
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={[
                'px-3 py-2 rounded-xl text-xs font-medium transition-all',
                filter === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-slate-500 font-medium px-5 py-3 text-xs">Order ID</th>
                <th className="text-left text-slate-500 font-medium px-5 py-3 text-xs">Customer</th>
                <th className="text-left text-slate-500 font-medium px-5 py-3 text-xs">Date</th>
                <th className="text-left text-slate-500 font-medium px-5 py-3 text-xs">Total</th>
                <th className="text-left text-slate-500 font-medium px-5 py-3 text-xs">Paid</th>
                <th className="text-left text-slate-500 font-medium px-5 py-3 text-xs">Delivered</th>
                <th className="text-right text-slate-500 font-medium px-5 py-3 text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="px-5 py-3.5 font-mono text-blue-400 text-xs">
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-slate-200 text-xs font-medium">{order.user?.name ?? 'N/A'}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5 truncate max-w-[140px]">{order.user?.email ?? '—'}</p>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs">
                    {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                  </td>
                  <td className="px-5 py-3.5 text-white font-semibold text-xs">{formatPrice(order.totalPrice)}</td>
                  <td className="px-5 py-3.5">
                    <Badge variant={order.isPaid ? 'success' : 'warning'}>
                      {order.isPaid ? 'Paid' : 'Unpaid'}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={order.isDelivered ? 'success' : 'default'}>
                      {order.isDelivered ? 'Delivered' : 'Pending'}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                      className="text-blue-400 hover:text-blue-300 text-xs font-medium px-2 py-1 rounded-lg hover:bg-blue-900/20 transition-all"
                    >
                      Details →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-slate-400 font-medium">No orders found</p>
            <p className="text-slate-600 text-sm mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* Order detail slide-over panel */}
      {selectedOrder && (
        <OrderPanel
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onDeliver={handleDeliver}
        />
      )}
    </div>
  );
}
