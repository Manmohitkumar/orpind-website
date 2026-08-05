'use client';

import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Upload } from 'lucide-react';
import { products, formatPrice, categories } from '@/data/products';

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');

  const filtered = products.filter(p => {
    if (catFilter !== 'all' && p.category !== catFilter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.sku?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-display font-bold text-neutral-800">Products</h1><p className="text-sm text-neutral-500">{products.length} products in your catalog</p></div>
        <button className="btn-primary text-sm py-2"><Plus className="w-4 h-4 mr-1" /> Add Product</button>
      </div>

      <div className="bg-white rounded-sm border border-neutral-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="input-field pl-10 text-sm" />
          </div>
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="input-field text-sm w-auto">
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-neutral-50 border-b border-neutral-100">
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Product</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">SKU</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Category</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Price</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Stock</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Rating</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(product => (
                <tr key={product.id} className="border-b border-neutral-50 hover:bg-neutral-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-neutral-100 rounded-sm flex items-center justify-center text-lg">🌶️</div>
                      <div><p className="text-sm font-medium text-neutral-800">{product.name}</p>{product.isOrganic && <span className="text-[10px] text-green-600 font-medium">ORGANIC</span>}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-500 font-mono">{product.sku}</td>
                  <td className="px-4 py-3 text-sm text-neutral-600 capitalize">{product.category.replace('-', ' ')}</td>
                  <td className="px-4 py-3"><p className="text-sm font-semibold text-neutral-800">{formatPrice(product.price)}</p>{product.originalPrice && <p className="text-xs text-neutral-400 line-through">{formatPrice(product.originalPrice)}</p>}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>{product.inStock ? 'In Stock' : 'Out of Stock'}</span></td>
                  <td className="px-4 py-3 text-sm text-neutral-700">⭐ {product.rating}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {product.isNew && <span className="badge-new text-[9px]">New</span>}
                      {product.isBestseller && <span className="badge-bestseller text-[9px]">Hot</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 hover:bg-neutral-100 rounded-sm text-neutral-600" title="Edit"><Edit className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 hover:bg-red-50 rounded-sm text-red-500" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
