'use client';

import { useState, useEffect } from 'react';
import { Package, ShoppingCart, Users, TrendingUp, ArrowUpRight, ArrowDownRight, DollarSign, Eye } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { formatPrice, formatDate, getOrderStatusColor } from '@/lib/utils';

const statCards = [
  { label: 'Total Revenue', key: 'revenue', icon: DollarSign, color: 'bg-gold-500', prefix: true },
  { label: 'Total Orders', key: 'orders', icon: ShoppingCart, color: 'bg-green-500' },
  { label: 'Total Customers', key: 'customers', icon: Users, color: 'bg-gold-500' },
  { label: 'Products Listed', key: 'products', icon: Package, color: 'bg-gold-600' },
];

const topProductDefaults = [
  { name: 'Punjabi Garam Masala', sales: 342, revenue: '₹1,19,274' },
  { name: 'Organic Basmati Rice', sales: 156, revenue: '₹93,444' },
  { name: 'Biryani Masala', sales: 278, revenue: '₹91,462' },
  { name: 'Haldi Powder', sales: 289, revenue: '₹57,511' },
  { name: 'Jeera Seeds', sales: 256, revenue: '₹56,064' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>({ revenue: 0, orders: 0, customers: 0, products: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<any>('/api/admin/products?limit=1').catch(() => ({ pagination: { total: 0 } })),
      api.get<any>('/api/admin/orders?limit=10').catch(() => ({ orders: [], pagination: { total: 0 } })),
      api.get<any>('/api/admin/customers?limit=1').catch(() => ({ pagination: { total: 0 } })),
    ]).then(([productsData, ordersData, customersData]) => {
      const orders = ordersData.orders || [];
      const revenue = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
      setStats({
        revenue,
        orders: ordersData.pagination?.total || 0,
        customers: customersData.pagination?.total || 0,
        products: productsData.pagination?.total || 0,
      });
      setRecentOrders(orders.slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="space-y-6"><div className="grid grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-28 bg-neutral-100 animate-pulse rounded-sm" />)}</div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-display font-bold text-neutral-800">Dashboard</h1><p className="text-sm text-neutral-500">Welcome back. Here&apos;s what&apos;s happening.</p></div>
        <div className="flex gap-2">
          <select className="px-3 py-2 border border-neutral-200 rounded-sm text-sm bg-white">
            <option>Last 30 days</option><option>Last 7 days</option><option>Last 90 days</option><option>This Year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(s => (
          <div key={s.label} className="bg-white rounded-sm border border-neutral-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${s.color} rounded-sm flex items-center justify-center`}><s.icon className="w-5 h-5 text-white" /></div>
            </div>
            <p className="text-2xl font-bold text-neutral-800">{s.prefix ? formatPrice(stats[s.key]) : stats[s.key]}</p>
            <p className="text-xs text-neutral-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-sm border border-neutral-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-neutral-800">Revenue Overview</h2>
            <div className="flex gap-2">
              {['Week', 'Month', 'Year'].map(p => (
                <button key={p} className="px-3 py-1 text-xs rounded-sm bg-neutral-100 text-neutral-600 hover:bg-gold-50 hover:text-gold-600">{p}</button>
              ))}
            </div>
          </div>
          <div className="h-64 bg-neutral-50 rounded-sm flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
              <p className="text-sm text-neutral-400">Revenue chart will render here</p>
              <p className="text-xs text-neutral-300">Integrate Recharts or Chart.js</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-sm border border-neutral-100 p-6">
          <h2 className="font-semibold text-neutral-800 mb-4">Top Products</h2>
          <div className="space-y-3">
            {topProductDefaults.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="w-6 h-6 bg-neutral-100 rounded-full flex items-center justify-center text-xs font-bold text-neutral-600">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-800 truncate">{p.name}</p>
                  <p className="text-xs text-neutral-500">{p.sales} sales</p>
                </div>
                <span className="text-sm font-semibold text-neutral-800">{p.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-neutral-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-neutral-800">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-gold-600 hover:text-gold-700 font-medium">View All →</Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-neutral-500 text-sm py-4 text-center">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-neutral-100">
                <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider pb-3">Order</th>
                <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider pb-3">Customer</th>
                <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider pb-3">Date</th>
                <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider pb-3">Amount</th>
                <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider pb-3">Status</th>
                <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider pb-3">Action</th>
              </tr></thead>
              <tbody>
                {recentOrders.map((order: any) => (
                  <tr key={order.id} className="border-b border-neutral-50 hover:bg-neutral-50/50">
                    <td className="py-3 text-sm font-medium text-gold-600">{order.orderNumber || order.id}</td>
                    <td className="py-3 text-sm text-neutral-800">{order.user?.firstName} {order.user?.lastName}</td>
                    <td className="py-3 text-sm text-neutral-500">{formatDate(order.createdAt)}</td>
                    <td className="py-3 text-sm font-semibold text-neutral-800">{formatPrice(order.total)}</td>
                    <td className="py-3"><span className={`text-xs px-2 py-1 rounded-sm font-medium ${getOrderStatusColor(order.status?.toLowerCase())}`}>{order.status}</span></td>
                    <td className="py-3"><Link href={`/admin/orders`} className="text-xs text-gold-600 hover:text-gold-700 font-medium"><Eye className="w-3.5 h-3.5 inline" /> View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
