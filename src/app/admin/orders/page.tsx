'use client';

import { useState } from 'react';
import { Search, Filter, Eye, Download, ChevronDown } from 'lucide-react';
import { formatPrice } from '@/data/products';

const orders = [
  { id: 'ORD-2024-001', customer: 'Priya Sharma', email: 'priya@email.com', items: 3, total: 1297, status: 'Delivered', payment: 'Completed', date: '2024-03-20', address: 'New Delhi' },
  { id: 'ORD-2024-002', customer: 'Vikram Patel', email: 'vikram@email.com', items: 1, total: 599, status: 'Shipped', payment: 'Completed', date: '2024-03-20', address: 'Chandigarh' },
  { id: 'ORD-2024-003', customer: 'Neha Gupta', email: 'neha@email.com', items: 5, total: 2499, status: 'Processing', payment: 'Completed', date: '2024-03-19', address: 'Mumbai' },
  { id: 'ORD-2024-004', customer: 'Arjun Singh', email: 'arjun@email.com', items: 2, total: 349, status: 'Confirmed', payment: 'Pending', date: '2024-03-19', address: 'Ludhiana' },
  { id: 'ORD-2024-005', customer: 'Meera Kaur', email: 'meera@email.com', items: 4, total: 879, status: 'Delivered', payment: 'Completed', date: '2024-03-18', address: 'Amritsar' },
  { id: 'ORD-2024-006', customer: 'Rajesh Sharma', email: 'rajesh@email.com', items: 8, total: 4592, status: 'Shipped', payment: 'Completed', date: '2024-03-18', address: 'Bangalore' },
  { id: 'ORD-2024-007', customer: 'Anita Desai', email: 'anita@email.com', items: 2, total: 568, status: 'Cancelled', payment: 'Refunded', date: '2024-03-17', address: 'Pune' },
  { id: 'ORD-2024-008', customer: 'Suresh Kumar', email: 'suresh@email.com', items: 6, total: 3294, status: 'Delivered', payment: 'Completed', date: '2024-03-17', address: 'Hyderabad' },
];

const statusColors: Record<string, string> = {
  Delivered: 'bg-green-100 text-green-700', Shipped: 'bg-blue-100 text-blue-700',
  Processing: 'bg-yellow-100 text-yellow-700', Confirmed: 'bg-purple-100 text-purple-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const paymentColors: Record<string, string> = {
  Completed: 'text-green-600', Pending: 'text-yellow-600', Refunded: 'text-red-600',
};

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = orders.filter(o => {
    if (statusFilter !== 'all' && o.status.toLowerCase() !== statusFilter) return false;
    if (search && !o.customer.toLowerCase().includes(search.toLowerCase()) && !o.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-display font-bold text-neutral-800">Orders</h1><p className="text-sm text-neutral-500">Manage and track all customer orders</p></div>
        <button className="btn-primary text-sm py-2"><Download className="w-4 h-4 mr-1" /> Export</button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-sm border border-neutral-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..." className="input-field pl-10 text-sm" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field text-sm w-auto">
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[{ label: 'Total', value: '1,284' }, { label: 'Confirmed', value: '23' }, { label: 'Processing', value: '15' }, { label: 'Shipped', value: '42' }, { label: 'Delivered', value: '1,204' }].map(s => (
          <div key={s.label} className="bg-white rounded-sm border border-neutral-100 p-3 text-center">
            <p className="text-lg font-bold text-neutral-800">{s.value}</p>
            <p className="text-xs text-neutral-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-sm border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-neutral-50 border-b border-neutral-100">
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Order ID</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Customer</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Items</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Total</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Payment</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Action</th>
            </tr></thead>
            <tbody>
              {filtered.map(order => (
                <tr key={order.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gold-600">{order.id}</td>
                  <td className="px-4 py-3"><p className="text-sm font-medium text-neutral-800">{order.customer}</p><p className="text-xs text-neutral-500">{order.address}</p></td>
                  <td className="px-4 py-3 text-sm text-neutral-500">{order.date}</td>
                  <td className="px-4 py-3 text-sm text-neutral-700">{order.items}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-neutral-800">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-medium ${paymentColors[order.payment]}`}>{order.payment}</span></td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-sm font-medium ${statusColors[order.status]}`}>{order.status}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 hover:bg-neutral-100 rounded-sm text-neutral-600"><Eye className="w-3.5 h-3.5" /></button>
                      <select className="text-xs border border-neutral-200 rounded-sm px-2 py-1 bg-white"><option>Update</option><option>Ship</option><option>Deliver</option><option>Cancel</option></select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-sm text-neutral-500">
          <span>Showing {filtered.length} of {orders.length} orders</span>
          <div className="flex gap-1"><button className="px-3 py-1 bg-white border border-neutral-200 rounded-sm text-neutral-700 hover:bg-neutral-100">Previous</button><button className="px-3 py-1 bg-gold-500 text-white rounded-sm">1</button><button className="px-3 py-1 bg-white border border-neutral-200 rounded-sm text-neutral-700 hover:bg-neutral-100">Next</button></div>
        </div>
      </div>
    </div>
  );
}
