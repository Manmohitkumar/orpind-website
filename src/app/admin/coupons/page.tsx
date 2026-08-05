'use client';

import { useState } from 'react';
import { Search, Plus, Edit, Trash2, X, Copy, CheckCircle, Tag } from 'lucide-react';
import { formatPrice } from '@/data/products';

interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
}

const initialCoupons: Coupon[] = [
  { id: '1', code: 'ORPIND20', description: '20% off on first order', discountType: 'percentage', discountValue: 20, minOrderAmount: 499, maxDiscount: 500, usageLimit: 500, usedCount: 342, validFrom: '2024-01-01', validUntil: '2024-06-30', isActive: true },
  { id: '2', code: 'SPICE100', description: 'Flat ₹100 off', discountType: 'fixed', discountValue: 100, minOrderAmount: 999, usageLimit: 200, usedCount: 156, validFrom: '2024-02-01', validUntil: '2024-04-30', isActive: true },
  { id: '3', code: 'WELCOME15', description: '15% off welcome discount', discountType: 'percentage', discountValue: 15, minOrderAmount: 299, maxDiscount: 300, usageLimit: 1000, usedCount: 891, validFrom: '2024-01-01', validUntil: '2024-12-31', isActive: true },
  { id: '4', code: 'FESTIVE500', description: '₹500 off on festive orders', discountType: 'fixed', discountValue: 500, minOrderAmount: 2499, usageLimit: 100, usedCount: 100, validFrom: '2023-10-01', validUntil: '2023-11-15', isActive: false },
  { id: '5', code: 'BULK25', description: '25% off on bulk orders', discountType: 'percentage', discountValue: 25, minOrderAmount: 4999, maxDiscount: 2000, usageLimit: 50, usedCount: 12, validFrom: '2024-03-01', validUntil: '2024-09-30', isActive: true },
  { id: '6', code: 'ORGANIC10', description: '10% off organic products', discountType: 'percentage', discountValue: 10, minOrderAmount: 399, maxDiscount: 200, usageLimit: 300, usedCount: 278, validFrom: '2024-01-15', validUntil: '2024-07-15', isActive: false },
];

interface CouponFormData {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount: number;
  usageLimit: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
}

const emptyForm: CouponFormData = {
  code: '', description: '', discountType: 'percentage', discountValue: 0,
  minOrderAmount: 0, maxDiscount: 0, usageLimit: 100, validFrom: '', validUntil: '', isActive: true,
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CouponFormData>(emptyForm);
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = coupons.filter(c => {
    if (search) {
      const q = search.toLowerCase();
      return c.code.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
    }
    return true;
  });

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (coupon: Coupon) => {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount,
      maxDiscount: coupon.maxDiscount || 0,
      usageLimit: coupon.usageLimit,
      validFrom: coupon.validFrom,
      validUntil: coupon.validUntil,
      isActive: coupon.isActive,
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setCoupons(prev => prev.map(c => c.id === editingId ? { ...c, ...form } : c));
    } else {
      const newCoupon: Coupon = {
        id: String(Date.now()),
        ...form,
        usedCount: 0,
      };
      setCoupons(prev => [...prev, newCoupon]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
  };

  const toggleActive = (id: string) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-800">Coupons</h1>
          <p className="text-sm text-neutral-500">{coupons.length} coupons configured</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm py-2"><Plus className="w-4 h-4 mr-1" /> Create Coupon</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Active', value: coupons.filter(c => c.isActive).length },
          { label: 'Inactive', value: coupons.filter(c => !c.isActive).length },
          { label: 'Total Usage', value: coupons.reduce((s, c) => s + c.usedCount, 0).toLocaleString() },
          { label: 'Avg Discount', value: `${Math.round(coupons.reduce((s, c) => s + c.discountValue, 0) / coupons.length)}${coupons[0]?.discountType === 'percentage' ? '%' : '₹'}` },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-sm border border-neutral-100 p-3 text-center">
            <p className="text-lg font-bold text-neutral-800">{s.value}</p>
            <p className="text-xs text-neutral-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-sm border border-neutral-100 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search coupons by code or description..."
            className="input-field pl-10 text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-sm border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Code</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Description</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Discount</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Min Order</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Usage</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Validity</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(coupon => (
                <tr key={coupon.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-semibold text-gold-600">{coupon.code}</span>
                      <button onClick={() => copyCode(coupon.code)} className="p-1 hover:bg-neutral-100 rounded-sm text-neutral-400" title="Copy code">
                        {copied === coupon.code ? <CheckCircle className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-600 max-w-[200px] truncate">{coupon.description}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Tag className="w-3 h-3 text-neutral-400" />
                      <span className="text-sm font-semibold text-neutral-800">
                        {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : formatPrice(coupon.discountValue)}
                      </span>
                      {coupon.maxDiscount && coupon.discountType === 'percentage' && (
                        <span className="text-[10px] text-neutral-400">(max {formatPrice(coupon.maxDiscount)})</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-600">{formatPrice(coupon.minOrderAmount)}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-neutral-700">
                      <span className="font-medium">{coupon.usedCount}</span>
                      <span className="text-neutral-400"> / {coupon.usageLimit}</span>
                    </div>
                    <div className="w-full bg-neutral-100 rounded-full h-1.5 mt-1">
                      <div
                        className="bg-gold-500 h-1.5 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (coupon.usedCount / coupon.usageLimit) * 100)}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-neutral-600">{coupon.validFrom}</p>
                    <p className="text-xs text-neutral-400">to {coupon.validUntil}</p>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(coupon.id)} className={`text-xs px-2 py-1 rounded-sm font-medium cursor-pointer transition-colors ${coupon.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}>
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(coupon)} className="p-1.5 hover:bg-neutral-100 rounded-sm text-neutral-600" title="Edit"><Edit className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(coupon.id)} className="p-1.5 hover:bg-red-50 rounded-sm text-red-500" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-neutral-400">No coupons found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-sm border border-neutral-100 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <h2 className="text-lg font-display font-bold text-neutral-800">{editingId ? 'Edit Coupon' : 'Create Coupon'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-neutral-100 rounded-sm text-neutral-500"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Coupon Code</label>
                <input type="text" required value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} className="input-field text-sm font-mono" placeholder="e.g. SAVE20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Description</label>
                <input type="text" required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field text-sm" placeholder="Brief description of the coupon" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Discount Type</label>
                  <select value={form.discountType} onChange={e => setForm({ ...form, discountType: e.target.value as 'percentage' | 'fixed' })} className="input-field text-sm">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Discount Value</label>
                  <input type="number" required min="1" value={form.discountValue} onChange={e => setForm({ ...form, discountValue: Number(e.target.value) })} className="input-field text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Min Order Amount (₹)</label>
                  <input type="number" required min="0" value={form.minOrderAmount} onChange={e => setForm({ ...form, minOrderAmount: Number(e.target.value) })} className="input-field text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Max Discount (₹)</label>
                  <input type="number" min="0" value={form.maxDiscount} onChange={e => setForm({ ...form, maxDiscount: Number(e.target.value) })} className="input-field text-sm" placeholder="Optional" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Usage Limit</label>
                <input type="number" required min="1" value={form.usageLimit} onChange={e => setForm({ ...form, usageLimit: Number(e.target.value) })} className="input-field text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Valid From</label>
                  <input type="date" required value={form.validFrom} onChange={e => setForm({ ...form, validFrom: e.target.value })} className="input-field text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Valid Until</label>
                  <input type="date" required value={form.validUntil} onChange={e => setForm({ ...form, validUntil: e.target.value })} className="input-field text-sm" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="sr-only peer" />
                  <div className="w-9 h-5 bg-neutral-200 peer-focus:ring-2 peer-focus:ring-gold-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold-500"></div>
                </label>
                <span className="text-sm font-medium text-neutral-700">Active</span>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 text-sm font-medium border border-neutral-200 text-neutral-700 rounded-sm hover:bg-neutral-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 btn-primary text-sm py-2.5">{editingId ? 'Update Coupon' : 'Create Coupon'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
