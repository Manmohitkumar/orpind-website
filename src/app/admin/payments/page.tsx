'use client';

import { useState } from 'react';
import { Search, Download, TrendingUp, Clock, AlertCircle, CheckCircle, CreditCard, Wallet, Smartphone, Banknote, RefreshCw } from 'lucide-react';
import { formatPrice } from '@/data/products';

interface Transaction {
  id: string;
  transactionId: string;
  orderId: string;
  amount: number;
  method: 'UPI' | 'Card' | 'Net Banking' | 'COD' | 'Wallet';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  date: string;
  customerName: string;
}

const transactions: Transaction[] = [
  { id: '1', transactionId: 'pay_Mx7K9pQ2vL', orderId: 'ORD-1847', amount: 1249, method: 'UPI', status: 'completed', date: '2024-04-10 14:32', customerName: 'Rahul Sharma' },
  { id: '2', transactionId: 'pay_Mx7H8pR1wK', orderId: 'ORD-1846', amount: 899, method: 'Card', status: 'completed', date: '2024-04-10 13:15', customerName: 'Priya Patel' },
  { id: '3', transactionId: 'pay_Mx7G7pQ0vJ', orderId: 'ORD-1845', amount: 2149, method: 'Net Banking', status: 'completed', date: '2024-04-10 11:45', customerName: 'Amit Kumar' },
  { id: '4', transactionId: 'COD-1844', orderId: 'ORD-1844', amount: 649, method: 'COD', status: 'pending', date: '2024-04-10 10:20', customerName: 'Sneha Reddy' },
  { id: '5', transactionId: 'pay_Mx7F5pN9xI', orderId: 'ORD-1843', amount: 1799, method: 'UPI', status: 'refunded', date: '2024-04-10 09:00', customerName: 'Vikram Singh' },
  { id: '6', transactionId: 'pay_Mx7E4pM8wH', orderId: 'ORD-1842', amount: 449, method: 'Wallet', status: 'completed', date: '2024-04-09 16:30', customerName: 'Neha Gupta' },
  { id: '7', transactionId: 'pay_Mx7D3pL7vG', orderId: 'ORD-1841', amount: 3299, method: 'Card', status: 'failed', date: '2024-04-09 15:00', customerName: 'Rajesh Verma' },
  { id: '8', transactionId: 'pay_Mx7C2pK6uF', orderId: 'ORD-1840', amount: 749, method: 'UPI', status: 'completed', date: '2024-04-09 14:20', customerName: 'Kavita Joshi' },
  { id: '9', transactionId: 'COD-1839', orderId: 'ORD-1839', amount: 1099, method: 'COD', status: 'completed', date: '2024-04-09 12:00', customerName: 'Sanjay Mehta' },
  { id: '10', transactionId: 'pay_Mx7A1pJ5tE', orderId: 'ORD-1838', amount: 599, method: 'UPI', status: 'completed', date: '2024-04-09 10:45', customerName: 'Ananya Das' },
];

const statusColors: Record<string, string> = {
  completed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-blue-100 text-blue-700',
};

const methodIcons: Record<string, React.ReactNode> = {
  UPI: <Smartphone className="w-3.5 h-3.5" />,
  Card: <CreditCard className="w-3.5 h-3.5" />,
  'Net Banking': <Banknote className="w-3.5 h-3.5" />,
  COD: <Banknote className="w-3.5 h-3.5" />,
  Wallet: <Wallet className="w-3.5 h-3.5" />,
};

export default function AdminPaymentsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  const filtered = transactions.filter(t => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (methodFilter !== 'all' && t.method !== methodFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return t.transactionId.toLowerCase().includes(q) || t.orderId.toLowerCase().includes(q) || t.customerName.toLowerCase().includes(q);
    }
    return true;
  });

  const totalCollected = transactions.filter(t => t.status === 'completed').reduce((s, t) => s + t.amount, 0);
  const totalPending = transactions.filter(t => t.status === 'pending').reduce((s, t) => s + t.amount, 0);
  const totalRefunded = transactions.filter(t => t.status === 'refunded').reduce((s, t) => s + t.amount, 0);
  const totalFailed = transactions.filter(t => t.status === 'failed').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-800">Payments</h1>
          <p className="text-sm text-neutral-500">{transactions.length} transactions &middot; Razorpay integration</p>
        </div>
        <button className="btn-primary text-sm py-2"><Download className="w-4 h-4 mr-1" /> Export Report</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Collected', value: formatPrice(totalCollected), color: 'text-green-600', icon: <CheckCircle className="w-4 h-4" /> },
          { label: 'Pending', value: formatPrice(totalPending), color: 'text-yellow-600', icon: <Clock className="w-4 h-4" /> },
          { label: 'Refunded', value: formatPrice(totalRefunded), color: 'text-blue-600', icon: <RefreshCw className="w-4 h-4" /> },
          { label: 'Failed', value: formatPrice(totalFailed), color: 'text-red-600', icon: <AlertCircle className="w-4 h-4" /> },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-sm border border-neutral-100 p-3">
            <div className="flex items-center gap-1.5 text-neutral-400 mb-1">{s.icon}<p className="text-xs text-neutral-500">{s.label}</p></div>
            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-sm border border-neutral-100 overflow-hidden">
        <div className="p-4 border-b border-neutral-100">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="w-4 h-4 text-gold-600" />
            <h2 className="text-sm font-display font-bold text-neutral-800 uppercase tracking-wide">Razorpay Configuration</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] text-neutral-500 mb-1">Key ID</label>
              <input type="text" defaultValue="rzp_test_XXXXXXXXXXXXXXX" className="input-field text-xs font-mono py-2" readOnly />
            </div>
            <div>
              <label className="block text-[11px] text-neutral-500 mb-1">Key Secret</label>
              <input type="password" defaultValue="supersecretkey" className="input-field text-xs font-mono py-2" readOnly />
            </div>
            <div>
              <label className="block text-[11px] text-neutral-500 mb-1">Webhook URL</label>
              <input type="text" defaultValue="https://orpind.com/api/webhooks/razorpay" className="input-field text-xs font-mono py-2" readOnly />
            </div>
            <div className="flex items-end">
              <button className="btn-primary text-xs py-2 w-full"><TrendingUp className="w-3.5 h-3.5 mr-1" /> View on Razorpay</button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-neutral-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by transaction ID, order ID, or customer..." className="input-field pl-10 text-sm" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field text-sm w-auto">
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          <select value={methodFilter} onChange={e => setMethodFilter(e.target.value)} className="input-field text-sm w-auto">
            <option value="all">All Methods</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
            <option value="Net Banking">Net Banking</option>
            <option value="COD">COD</option>
            <option value="Wallet">Wallet</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Transaction ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Order</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Method</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(txn => (
                <tr key={txn.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-gold-600">{txn.transactionId}</span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-neutral-800">{txn.orderId}</td>
                  <td className="px-4 py-3 text-sm text-neutral-600">{txn.customerName}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-neutral-800">{formatPrice(txn.amount)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-neutral-600">
                      {methodIcons[txn.method]}
                      <span className="text-xs">{txn.method}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-1 rounded-sm uppercase ${statusColors[txn.status]}`}>{txn.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-500 font-mono">{txn.date}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-neutral-400">No transactions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
