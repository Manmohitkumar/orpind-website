'use client';

import { useState, useMemo } from 'react';
import { Download, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, BarChart3, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatPrice } from '@/data/products';

interface SummaryCard {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const revenueByMonth = [
  { month: 'Jan', revenue: 89400, orders: 156 },
  { month: 'Feb', revenue: 102300, orders: 178 },
  { month: 'Mar', revenue: 134500, orders: 234 },
  { month: 'Apr', revenue: 118200, orders: 201 },
  { month: 'May', revenue: 145600, orders: 252 },
  { month: 'Jun', revenue: 156800, orders: 271 },
  { month: 'Jul', revenue: 167900, orders: 289 },
  { month: 'Aug', revenue: 142300, orders: 245 },
  { month: 'Sep', revenue: 178500, orders: 308 },
  { month: 'Oct', revenue: 195200, orders: 337 },
  { month: 'Nov', revenue: 210400, orders: 363 },
  { month: 'Dec', revenue: 234600, orders: 405 },
];

const topProducts = [
  { name: 'Punjabi Garam Masala', sold: 342, revenue: 119358 },
  { name: 'Biryani Masala', sold: 278, revenue: 91462 },
  { name: 'Kashmiri Red Chilli', sold: 218, revenue: 65182 },
  { name: 'Organic Basmati Rice', sold: 156, revenue: 93444 },
  { name: 'Haldi (Turmeric) Powder', sold: 289, revenue: 57511 },
  { name: 'Jeera (Cumin) Seeds', sold: 256, revenue: 56064 },
];

const topCategories = [
  { name: 'Spice Blends', percentage: 35, revenue: 198230 },
  { name: 'Whole Spices', percentage: 28, revenue: 158640 },
  { name: 'Ground Spices', percentage: 18, revenue: 101790 },
  { name: 'Grains', percentage: 12, revenue: 67860 },
  { name: 'Flours & Herbs', percentage: 7, revenue: 39585 },
];

export default function AdminReportsPage() {
  const [dateRange, setDateRange] = useState('12months');

  const summaryCards: SummaryCard[] = useMemo(() => [
    { label: 'Total Revenue', value: formatPrice(1775700), change: 23.5, icon: <DollarSign className="w-5 h-5" />, color: 'bg-green-100 text-green-600' },
    { label: 'Total Orders', value: '3,039', change: 18.2, icon: <ShoppingCart className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600' },
    { label: 'Total Customers', value: '1,847', change: 12.8, icon: <Users className="w-5 h-5" />, color: 'bg-purple-100 text-purple-600' },
    { label: 'Avg Order Value', value: formatPrice(584), change: 4.3, icon: <BarChart3 className="w-5 h-5" />, color: 'bg-amber-100 text-amber-600' },
  ], []);

  const maxRevenue = Math.max(...revenueByMonth.map(m => m.revenue));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-800">Reports & Analytics</h1>
          <p className="text-sm text-neutral-500">Track your store performance and key metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="input-field text-sm w-auto"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
          </select>
          <button className="btn-primary text-sm py-2"><Download className="w-4 h-4 mr-1" /> Export</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map(card => (
          <div key={card.label} className="bg-white rounded-sm border border-neutral-100 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-sm flex items-center justify-center ${card.color}`}>{card.icon}</div>
              <span className={`flex items-center gap-0.5 text-xs font-medium ${card.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {card.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(card.change)}%
              </span>
            </div>
            <p className="text-2xl font-bold text-neutral-800">{card.value}</p>
            <p className="text-sm text-neutral-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-sm border border-neutral-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-semibold text-neutral-800">Revenue Trend</h2>
              <p className="text-xs text-neutral-500">Monthly revenue for the current year</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gold-500"></span> Revenue</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-neutral-300"></span> Orders</span>
            </div>
          </div>
          <div className="relative">
            <div className="flex items-end gap-2 h-64">
              {revenueByMonth.map(m => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="relative w-full flex justify-center">
                    <div className="absolute -top-8 hidden group-hover:block bg-neutral-800 text-white text-[10px] px-2 py-1 rounded-sm whitespace-nowrap z-10">
                      {formatPrice(m.revenue)}
                    </div>
                  </div>
                  <div className="w-full relative">
                    <div
                      className="w-full bg-gold-500 rounded-t-sm transition-all hover:bg-gold-600"
                      style={{ height: `${(m.revenue / maxRevenue) * 200}px` }}
                    />
                    <div
                      className="w-full bg-neutral-200 rounded-t-sm absolute bottom-0 -z-10"
                      style={{ height: `${(m.orders / 405) * 200}px` }}
                    />
                  </div>
                  <span className="text-[10px] text-neutral-500 mt-1">{m.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-sm border border-neutral-100 p-6">
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-neutral-800">Revenue by Category</h2>
            <p className="text-xs text-neutral-500">Distribution across product categories</p>
          </div>
          <div className="space-y-4">
            {topCategories.map(cat => (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-neutral-700">{cat.name}</span>
                  <span className="text-sm font-medium text-neutral-800">{cat.percentage}%</span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2">
                  <div
                    className="bg-gold-500 h-2 rounded-full transition-all"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">{formatPrice(cat.revenue)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-sm border border-neutral-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-100">
            <h2 className="text-sm font-semibold text-neutral-800">Top Selling Products</h2>
            <p className="text-xs text-neutral-500">Products ranked by units sold</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 uppercase">#</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 uppercase">Product</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-neutral-500 uppercase">Units Sold</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-neutral-500 uppercase">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p, i) => (
                  <tr key={p.name} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-3 text-sm font-medium text-neutral-400">{i + 1}</td>
                    <td className="px-6 py-3 text-sm font-medium text-neutral-800">{p.name}</td>
                    <td className="px-6 py-3 text-sm text-neutral-700 text-right">{p.sold}</td>
                    <td className="px-6 py-3 text-sm font-semibold text-neutral-800 text-right">{formatPrice(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-sm border border-neutral-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-100">
            <h2 className="text-sm font-semibold text-neutral-800">Orders Over Time</h2>
            <p className="text-xs text-neutral-500">Monthly order volume trend</p>
          </div>
          <div className="p-6">
            <div className="flex items-end gap-1.5 h-48">
              {revenueByMonth.map(m => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="relative w-full flex justify-center">
                    <div className="absolute -top-6 hidden group-hover:block bg-neutral-800 text-white text-[10px] px-2 py-1 rounded-sm whitespace-nowrap z-10">
                      {m.orders} orders
                    </div>
                  </div>
                  <div
                    className="w-full bg-gold-400 rounded-t-sm hover:bg-gold-500 transition-colors"
                    style={{ height: `${(m.orders / 405) * 150}px` }}
                  />
                  <span className="text-[10px] text-neutral-500 mt-1">{m.month}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-sm text-neutral-500">
            <span>Total Orders: <strong className="text-neutral-800">3,039</strong></span>
            <span>Avg/Day: <strong className="text-neutral-800">8.3</strong></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-sm border border-neutral-100 p-6">
          <h2 className="text-sm font-semibold text-neutral-800 mb-4">Conversion Metrics</h2>
          <div className="space-y-4">
            {[
              { label: 'Store Visitors', value: '24,581', sub: 'Unique visitors' },
              { label: 'Conversion Rate', value: '3.2%', sub: 'Visitor to buyer' },
              { label: 'Cart Abandonment', value: '68.4%', sub: 'Pending recovery' },
              { label: 'Repeat Purchase', value: '34.2%', sub: 'Returning customers' },
            ].map(m => (
              <div key={m.label} className="flex items-center justify-between py-2 border-b border-neutral-50 last:border-0">
                <div>
                  <p className="text-sm text-neutral-700">{m.label}</p>
                  <p className="text-[10px] text-neutral-400">{m.sub}</p>
                </div>
                <p className="text-sm font-bold text-neutral-800">{m.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-sm border border-neutral-100 p-6">
          <h2 className="text-sm font-semibold text-neutral-800 mb-4">Payment Breakdown</h2>
          <div className="space-y-4">
            {[
              { method: 'UPI', percentage: 45, color: 'bg-green-500' },
              { method: 'Cards', percentage: 25, color: 'bg-blue-500' },
              { method: 'COD', percentage: 20, color: 'bg-amber-500' },
              { method: 'Net Banking', percentage: 8, color: 'bg-purple-500' },
              { method: 'Wallets', percentage: 2, color: 'bg-pink-500' },
            ].map(p => (
              <div key={p.method}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-neutral-700">{p.method}</span>
                  <span className="text-sm font-medium text-neutral-800">{p.percentage}%</span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2">
                  <div className={`${p.color} h-2 rounded-full`} style={{ width: `${p.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-sm border border-neutral-100 p-6">
          <h2 className="text-sm font-semibold text-neutral-800 mb-4">Geographic Top Cities</h2>
          <div className="space-y-3">
            {[
              { city: 'New Delhi', orders: 412, percentage: 13.5 },
              { city: 'Mumbai', orders: 356, percentage: 11.7 },
              { city: 'Bangalore', orders: 298, percentage: 9.8 },
              { city: 'Chandigarh', orders: 267, percentage: 8.8 },
              { city: 'Hyderabad', orders: 234, percentage: 7.7 },
              { city: 'Pune', orders: 198, percentage: 6.5 },
              { city: 'Amritsar', orders: 178, percentage: 5.9 },
              { city: 'Jaipur', orders: 156, percentage: 5.1 },
            ].map((c, i) => (
              <div key={c.city} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-neutral-400 w-4">{i + 1}</span>
                  <span className="text-sm text-neutral-700">{c.city}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-neutral-500">{c.orders}</span>
                  <span className="text-xs font-medium text-neutral-800 w-10 text-right">{c.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
