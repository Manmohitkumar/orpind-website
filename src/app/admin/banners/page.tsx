'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, X, GripVertical, Eye, EyeOff } from 'lucide-react';
import { formatPrice } from '@/data/products';
import { Banner } from '@/types';

const initialBanners: Banner[] = [
  { id: '1', title: 'Monsoon Spice Sale', subtitle: 'Up to 40% off on all spice blends', cta: 'Shop Now', href: '/shop?sale=true', active: true, position: 'hero' },
  { id: '2', title: 'Farm Fresh Grains', subtitle: 'Direct from Punjab\'s golden fields', cta: 'Explore', href: '/shop?category=grains', active: true, position: 'hero' },
  { id: '3', title: 'Free Shipping on ₹999+', subtitle: 'On all organic spice orders', cta: 'Order Now', href: '/shop', active: true, position: 'promo' },
  { id: '4', title: 'Gift Sets for Every Occasion', subtitle: 'Curated spice collections', cta: 'View Gifts', href: '/shop?category=gift-sets', active: false, position: 'sidebar' },
  { id: '5', title: 'New Arrivals', subtitle: 'Discover our latest organic collection', cta: 'See What\'s New', href: '/shop?sort=newest', active: true, position: 'hero' },
  { id: '6', title: 'Subscribe & Save 10%', subtitle: 'Never run out of your favourites', cta: 'Learn More', href: '/subscribe', active: false, position: 'footer' },
];

interface BannerFormData {
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  active: boolean;
  position: Banner['position'];
}

const emptyForm: BannerFormData = {
  title: '', subtitle: '', cta: '', href: '/', active: true, position: 'hero',
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BannerFormData>(emptyForm);
  const [posFilter, setPosFilter] = useState<string>('all');

  const filtered = banners.filter(b => posFilter === 'all' || b.position === posFilter);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (banner: Banner) => {
    setEditingId(banner.id);
    setForm({ title: banner.title, subtitle: banner.subtitle, cta: banner.cta, href: banner.href, active: banner.active, position: banner.position });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setBanners(prev => prev.map(b => b.id === editingId ? { ...b, ...form } : b));
    } else {
      setBanners(prev => [...prev, { id: String(Date.now()), ...form }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
  };

  const toggleActive = (id: string) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
  };

  const positionLabels: Record<string, string> = { hero: 'Hero Banner', promo: 'Promo Strip', sidebar: 'Sidebar', footer: 'Footer' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-800">Banners</h1>
          <p className="text-sm text-neutral-500">{banners.length} banners configured</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm py-2"><Plus className="w-4 h-4 mr-1" /> Add Banner</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Active', value: banners.filter(b => b.active).length, color: 'text-green-600' },
          { label: 'Inactive', value: banners.filter(b => !b.active).length, color: 'text-red-500' },
          { label: 'Hero Banners', value: banners.filter(b => b.position === 'hero').length, color: 'text-gold-600' },
          { label: 'Promo Banners', value: banners.filter(b => b.position === 'promo').length, color: 'text-green-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-sm border border-neutral-100 p-3 text-center">
            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-neutral-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-sm border border-neutral-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <select value={posFilter} onChange={e => setPosFilter(e.target.value)} className="input-field text-sm w-auto">
            <option value="all">All Positions</option>
            <option value="hero">Hero</option>
            <option value="promo">Promo</option>
            <option value="sidebar">Sidebar</option>
            <option value="footer">Footer</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase w-8"></th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Banner</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Position</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">CTA</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Link</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(banner => (
                <tr key={banner.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <GripVertical className="w-4 h-4 text-neutral-300 cursor-grab" />
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-neutral-800">{banner.title}</p>
                    <p className="text-xs text-neutral-500 max-w-[280px] truncate">{banner.subtitle}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-sm font-medium bg-neutral-100 text-neutral-700">{positionLabels[banner.position]}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-600">{banner.cta}</td>
                  <td className="px-4 py-3 text-sm text-gold-600 font-mono max-w-[180px] truncate">{banner.href}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(banner.id)} className={`text-xs px-2 py-1 rounded-sm font-medium cursor-pointer transition-colors ${banner.active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}>
                      {banner.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(banner)} className="p-1.5 hover:bg-neutral-100 rounded-sm text-neutral-600" title="Edit"><Edit className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(banner.id)} className="p-1.5 hover:bg-red-50 rounded-sm text-red-500" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-neutral-400">No banners found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-neutral-100 p-4">
        <p className="text-xs text-neutral-400 flex items-center gap-1.5">
          <GripVertical className="w-3.5 h-3.5" /> Drag rows using the grip handle to reorder banners. Position priority: Hero &gt; Promo &gt; Sidebar &gt; Footer.
        </p>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-sm border border-neutral-100 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <h2 className="text-lg font-display font-bold text-neutral-800">{editingId ? 'Edit Banner' : 'Add Banner'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-neutral-100 rounded-sm text-neutral-500"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Title</label>
                <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field text-sm" placeholder="e.g. Monsoon Spice Sale" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Subtitle</label>
                <input type="text" required value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} className="input-field text-sm" placeholder="e.g. Up to 40% off" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">CTA Text</label>
                  <input type="text" required value={form.cta} onChange={e => setForm({ ...form, cta: e.target.value })} className="input-field text-sm" placeholder="e.g. Shop Now" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Link URL</label>
                  <input type="text" required value={form.href} onChange={e => setForm({ ...form, href: e.target.value })} className="input-field text-sm font-mono" placeholder="/shop" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Position</label>
                <select value={form.position} onChange={e => setForm({ ...form, position: e.target.value as Banner['position'] })} className="input-field text-sm">
                  <option value="hero">Hero Banner</option>
                  <option value="promo">Promo Strip</option>
                  <option value="sidebar">Sidebar</option>
                  <option value="footer">Footer</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} className="sr-only peer" />
                  <div className="w-9 h-5 bg-neutral-200 peer-focus:ring-2 peer-focus:ring-gold-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold-500"></div>
                </label>
                <span className="text-sm font-medium text-neutral-700">Active</span>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 text-sm font-medium border border-neutral-200 text-neutral-700 rounded-sm hover:bg-neutral-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 btn-primary text-sm py-2.5">{editingId ? 'Update Banner' : 'Add Banner'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
