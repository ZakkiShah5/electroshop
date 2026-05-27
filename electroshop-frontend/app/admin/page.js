'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { productAPI, orderAPI, userAPI } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import { PageLoader } from '@/components/ui/LoadingSpinner';

// ── Revenue chart tooltip ──────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      <p className="text-white font-bold">{formatPrice(payload[0].value)}</p>
    </div>
  );
}

// ── Build last-7-days revenue data from orders array ──────────────────────────
function buildRevenueChart(orders) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      day: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      date: d.toDateString(),
      revenue: 0,
    });
  }
  orders.filter((o) => o.isPaid).forEach((o) => {
    const od = new Date(o.paidAt || o.createdAt).toDateString();
    const slot = days.find((d) => d.date === od);
    if (slot) slot.revenue += o.totalPrice;
  });
  return days.map(({ day, revenue }) => ({ day, revenue: parseFloat(revenue.toFixed(2)) }));
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      orderAPI.getAllOrders(),
      productAPI.getProducts({ pageSize: 200 }),
      userAPI.getAllUsers(),
    ])
      .then(([ordersRes, productsRes, usersRes]) => {
        const orders = ordersRes.data;
        const products = productsRes.data.products ?? [];
        const users = usersRes.data;

        const paid = orders.filter((o) => o.isPaid);
        const today = new Date().toDateString();
        const ordersToday = orders.filter(
          (o) => new Date(o.createdAt).toDateString() === today
        ).length;

        setData({
          totalRevenue: paid.reduce((s, o) => s + o.totalPrice, 0),
          ordersToday,
          totalProducts: products.length,
          activeUsers: users.length,
          paidOrders: paid.length,
          pendingOrders: orders.filter((o) => !o.isPaid).length,
          deliveredOrders: orders.filter((o) => o.isDelivered).length,
          recentOrders: [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10),
          lowStock: products.filter((p) => p.stock < 5).sort((a, b) => a.stock - b.stock),
          chartData: buildRevenueChart(orders),
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  const statCards = [
    {
      label: 'Total Revenue',
      value: formatPrice(data.totalRevenue),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-green-400',
      bg: 'bg-green-900/20',
      border: 'border-green-800/30',
      glow: 'shadow-green-900/20',
    },
    {
      label: 'Orders Today',
      value: data.ordersToday,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      color: 'text-blue-400',
      bg: 'bg-blue-900/20',
      border: 'border-blue-800/30',
      glow: 'shadow-blue-900/20',
    },
    {
      label: 'Total Products',
      value: data.totalProducts,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: 'text-purple-400',
      bg: 'bg-purple-900/20',
      border: 'border-purple-800/30',
      glow: 'shadow-purple-900/20',
    },
    {
      label: 'Active Users',
      value: data.activeUsers,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'text-orange-400',
      bg: 'bg-orange-900/20',
      border: 'border-orange-800/30',
      glow: 'shadow-orange-900/20',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon, color, bg, border, glow }) => (
          <div key={label} className={`${bg} border ${border} rounded-2xl p-5 shadow-lg ${glow}`}>
            <div className={`w-10 h-10 rounded-xl ${bg} border ${border} flex items-center justify-center ${color} mb-4`}>
              {icon}
            </div>
            <p className="text-2xl font-black text-white">{value}</p>
            <p className="text-slate-400 text-sm mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Chart + Quick stats */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Revenue chart */}
        <div className="xl:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white font-semibold">Revenue</h2>
              <p className="text-slate-500 text-xs mt-0.5">Last 7 days</p>
            </div>
            <span className="text-green-400 text-sm font-bold">
              {formatPrice(data.chartData.reduce((s, d) => s + d.revenue, 0))}
            </span>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}`}
                  width={45}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fill="url(#revGrad)"
                  dot={false}
                  activeDot={{ r: 5, fill: '#3b82f6', strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick stats */}
        <div className="space-y-4">
          {[
            { label: 'Paid Orders', value: data.paidOrders, icon: '✓', color: 'text-green-400', bg: 'bg-green-900/25 border-green-800/30' },
            { label: 'Pending Payment', value: data.pendingOrders, icon: '⏳', color: 'text-yellow-400', bg: 'bg-yellow-900/25 border-yellow-800/30' },
            { label: 'Delivered', value: data.deliveredOrders, icon: '🚚', color: 'text-blue-400', bg: 'bg-blue-900/25 border-blue-800/30' },
            { label: 'Low Stock Alert', value: data.lowStock.length, icon: '⚠', color: 'text-red-400', bg: 'bg-red-900/25 border-red-800/30' },
          ].map(({ label, value, icon, color, bg }) => (
            <div key={label} className={`border ${bg} rounded-2xl p-4 flex items-center gap-4`}>
              <div className={`text-lg w-9 h-9 rounded-xl ${bg} border flex items-center justify-center ${color}`}>
                {icon}
              </div>
              <div>
                <p className="text-slate-400 text-xs">{label}</p>
                <p className={`font-bold text-xl ${color}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent orders + Low stock */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Recent orders */}
        <div className="xl:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
            <h2 className="text-white font-semibold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors">
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800/60">
                  <th className="text-left text-slate-500 font-medium px-5 py-3 text-xs">Order ID</th>
                  <th className="text-left text-slate-500 font-medium px-5 py-3 text-xs">Customer</th>
                  <th className="text-left text-slate-500 font-medium px-5 py-3 text-xs">Total</th>
                  <th className="text-left text-slate-500 font-medium px-5 py-3 text-xs">Status</th>
                  <th className="text-left text-slate-500 font-medium px-5 py-3 text-xs">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-slate-800/40 hover:bg-slate-800/20 transition-colors">
                    <td className="px-5 py-3">
                      <Link href={`/admin/orders`} className="text-blue-400 font-mono text-xs hover:text-blue-300">
                        #{order._id.slice(-8).toUpperCase()}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-slate-300 text-xs max-w-[120px] truncate">{order.user?.name ?? 'N/A'}</td>
                    <td className="px-5 py-3 text-white font-semibold text-xs">{formatPrice(order.totalPrice)}</td>
                    <td className="px-5 py-3">
                      <Badge variant={order.isPaid ? 'success' : 'warning'}>
                        {order.isPaid ? 'Paid' : 'Pending'}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-slate-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.recentOrders.length === 0 && (
            <div className="py-12 text-center text-slate-500 text-sm">No orders yet</div>
          )}
        </div>

        {/* Low stock */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
            <h2 className="text-white font-semibold">Low Stock</h2>
            <Link href="/admin/products" className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors">
              Manage →
            </Link>
          </div>
          {data.lowStock.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-green-400 text-sm font-medium">All products well stocked</p>
              <p className="text-slate-500 text-xs mt-1">No items below 5 units</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/60">
              {data.lowStock.map((product) => (
                <div key={product._id} className="flex items-center justify-between px-5 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-xs font-medium truncate">{product.name}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5 capitalize">{product.brand} · {product.category}</p>
                  </div>
                  <div className="ml-3 flex-shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                      product.stock === 0
                        ? 'bg-red-900/50 text-red-400 border border-red-800/50'
                        : 'bg-yellow-900/50 text-yellow-400 border border-yellow-800/50'
                    }`}>
                      {product.stock === 0 ? 'OUT' : `${product.stock} left`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
