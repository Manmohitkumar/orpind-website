'use client';

import { useState, useMemo } from 'react';
import { Search, Download, ChevronLeft, ChevronRight, Eye, Mail, Ban, CheckCircle } from 'lucide-react';
import { formatPrice } from '@/data/products';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  registeredDate: string;
  status: 'active' | 'inactive' | 'blocked';
  lastOrderDate: string;
  city: string;
}

const customers: Customer[] = [
  { id: 'C-001', firstName: 'Priya', lastName: 'Sharma', email: 'priya.sharma@email.com', phone: '+91 62833 48561', ordersCount: 12, totalSpent: 8940, registeredDate: '2024-01-10', status: 'active', lastOrderDate: '2024-03-20', city: 'New Delhi' },
  { id: 'C-002', firstName: 'Vikram', lastName: 'Patel', email: 'vikram.patel@email.com', phone: '+91 87654 32109', ordersCount: 8, totalSpent: 5620, registeredDate: '2024-01-18', status: 'active', lastOrderDate: '2024-03-19', city: 'Chandigarh' },
  { id: 'C-003', firstName: 'Neha', lastName: 'Gupta', email: 'neha.gupta@email.com', phone: '+91 76543 21098', ordersCount: 5, totalSpent: 3499, registeredDate: '2024-02-05', status: 'active', lastOrderDate: '2024-03-18', city: 'Mumbai' },
  { id: 'C-004', firstName: 'Arjun', lastName: 'Singh', email: 'arjun.singh@email.com', phone: '+91 65432 10987', ordersCount: 3, totalSpent: 1247, registeredDate: '2024-02-12', status: 'active', lastOrderDate: '2024-03-15', city: 'Ludhiana' },
  { id: 'C-005', firstName: 'Meera', lastName: 'Kaur', email: 'meera.kaur@email.com', phone: '+91 54321 09876', ordersCount: 15, totalSpent: 12580, registeredDate: '2024-01-05', status: 'active', lastOrderDate: '2024-03-20', city: 'Amritsar' },
  { id: 'C-006', firstName: 'Rajesh', lastName: 'Sharma', email: 'rajesh.sharma@email.com', phone: '+91 43210 98765', ordersCount: 7, totalSpent: 4592, registeredDate: '2024-01-25', status: 'active', lastOrderDate: '2024-03-17', city: 'Bangalore' },
  { id: 'C-007', firstName: 'Anita', lastName: 'Desai', email: 'anita.desai@email.com', phone: '+91 32109 87654', ordersCount: 2, totalSpent: 568, registeredDate: '2024-02-20', status: 'inactive', lastOrderDate: '2024-02-28', city: 'Pune' },
  { id: 'C-008', firstName: 'Suresh', lastName: 'Kumar', email: 'suresh.kumar@email.com', phone: '+91 21098 76543', ordersCount: 9, totalSpent: 6780, registeredDate: '2024-01-12', status: 'active', lastOrderDate: '2024-03-19', city: 'Hyderabad' },
  { id: 'C-009', firstName: 'Kavita', lastName: 'Joshi', email: 'kavita.joshi@email.com', phone: '+91 10987 65432', ordersCount: 1, totalSpent: 299, registeredDate: '2024-03-01', status: 'inactive', lastOrderDate: '2024-03-01', city: 'Jaipur' },
  { id: 'C-010', firstName: 'Deepak', lastName: 'Verma', email: 'deepak.verma@email.com', phone: '+91 09876 54321', ordersCount: 0, totalSpent: 0, registeredDate: '2024-03-10', status: 'blocked', lastOrderDate: 'N/A', city: 'Lucknow' },
  { id: 'C-011', firstName: 'Pooja', lastName: 'Malhotra', email: 'pooja.m@email.com', phone: '+91 98123 45678', ordersCount: 6, totalSpent: 4250, registeredDate: '2024-02-01', status: 'active', lastOrderDate: '2024-03-16', city: 'Delhi' },
  { id: 'C-012', firstName: 'Manpreet', lastName: 'Singh', email: 'manpreet.s@email.com', phone: '+91 87123 45678', ordersCount: 4, totalSpent: 2890, registeredDate: '2024-02-15', status: 'active', lastOrderDate: '2024-03-14', city: 'Jalandhar' },
];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: 'Active', color: 'text-green-700', bg: 'bg-green-100' },
  inactive: { label: 'Inactive', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  blocked: { label: 'Blocked', color: 'text-red-700', bg: 'bg-red-100' },
};

const ITEMS_PER_PAGE = 8;

export default function AdminCustomersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return customers.filter(c => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          c.firstName.toLowerCase().includes(q) ||
          c.lastName.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const stats = useMemo(() => ({
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    inactive: customers.filter(c => c.status === 'inactive').length,
    blocked: customers.filter(c => c.status === 'blocked').length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
  }), []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-800">Customers</h1>
          <p className="text-sm text-neutral-500">{customers.length} registered customers</p>
        </div>
        <button className="btn-primary text-sm py-2"><Download className="w-4 h-4 mr-1" /> Export CSV</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Total', value: stats.total },
          { label: 'Active', value: stats.active },
          { label: 'Inactive', value: stats.inactive },
          { label: 'Blocked', value: stats.blocked },
          { label: 'Revenue', value: formatPrice(stats.totalRevenue) },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-sm border border-neutral-100 p-3 text-center">
            <p className="text-lg font-bold text-neutral-800">{s.value}</p>
            <p className="text-xs text-neutral-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-sm border border-neutral-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name, email, phone..."
              className="input-field pl-10 text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="input-field text-sm w-auto"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Phone</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Orders</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Total Spent</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Registered</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(customer => (
                <tr key={customer.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gold-100 rounded-full flex items-center justify-center text-sm font-semibold text-gold-700">
                        {customer.firstName[0]}{customer.lastName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-800">{customer.firstName} {customer.lastName}</p>
                        <p className="text-xs text-neutral-400">{customer.city}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-600">{customer.email}</td>
                  <td className="px-4 py-3 text-sm text-neutral-600">{customer.phone}</td>
                  <td className="px-4 py-3 text-sm font-medium text-neutral-800">{customer.ordersCount}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-neutral-800">{formatPrice(customer.totalSpent)}</td>
                  <td className="px-4 py-3 text-sm text-neutral-500">{customer.registeredDate}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-sm font-medium ${statusConfig[customer.status].bg} ${statusConfig[customer.status].color}`}>
                      {statusConfig[customer.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 hover:bg-neutral-100 rounded-sm text-neutral-600" title="View Details"><Eye className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 hover:bg-neutral-100 rounded-sm text-neutral-600" title="Send Email"><Mail className="w-3.5 h-3.5" /></button>
                      {customer.status === 'blocked' ? (
                        <button className="p-1.5 hover:bg-green-50 rounded-sm text-green-600" title="Unblock"><CheckCircle className="w-3.5 h-3.5" /></button>
                      ) : (
                        <button className="p-1.5 hover:bg-red-50 rounded-sm text-red-500" title="Block"><Ban className="w-3.5 h-3.5" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-neutral-400">No customers found matching your criteria.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-sm text-neutral-500">
          <span>Showing {paginated.length} of {filtered.length} customers</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-white border border-neutral-200 rounded-sm text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 rounded-sm ${p === page ? 'bg-gold-500 text-white' : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'}`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-white border border-neutral-200 rounded-sm text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
