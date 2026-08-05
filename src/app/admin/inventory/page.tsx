'use client';

import { useState, useMemo } from 'react';
import { Search, Package, AlertTriangle, CheckCircle, XCircle, Save, ArrowUpDown } from 'lucide-react';
import { products as catalogProducts, formatPrice } from '@/data/products';

interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  lowStockThreshold: number;
  lastRestocked: string;
  category: string;
  price: number;
}

const inventoryData: InventoryItem[] = catalogProducts.map(p => ({
  id: p.id,
  productId: p.id,
  productName: p.name,
  sku: p.sku || 'N/A',
  currentStock: p.id === '4' ? 3 : p.id === '5' ? 8 : p.id === '16' ? 15 : Math.floor(Math.random() * 200) + 20,
  lowStockThreshold: 20,
  lastRestocked: '2024-03-15',
  category: p.category,
  price: p.price,
}));

type SortKey = 'productName' | 'sku' | 'currentStock' | 'category';

export default function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>(inventoryData);
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('productName');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkIds, setBulkIds] = useState<string[]>([]);
  const [bulkAdjustment, setBulkAdjustment] = useState(0);

  const getStockStatus = (item: InventoryItem): 'in_stock' | 'low_stock' | 'out_of_stock' => {
    if (item.currentStock === 0) return 'out_of_stock';
    if (item.currentStock <= item.lowStockThreshold) return 'low_stock';
    return 'in_stock';
  };

  const stockStatusConfig = {
    in_stock: { label: 'In Stock', color: 'text-green-700', bg: 'bg-green-100', icon: <CheckCircle className="w-3 h-3" /> },
    low_stock: { label: 'Low Stock', color: 'text-yellow-700', bg: 'bg-yellow-100', icon: <AlertTriangle className="w-3 h-3" /> },
    out_of_stock: { label: 'Out of Stock', color: 'text-red-700', bg: 'bg-red-100', icon: <XCircle className="w-3 h-3" /> },
  };

  const filtered = useMemo(() => {
    let result = items.filter(item => {
      if (stockFilter !== 'all') {
        const status = getStockStatus(item);
        if (status !== stockFilter) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        return item.productName.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q);
      }
      return true;
    });

    result.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'currentStock') cmp = a.currentStock - b.currentStock;
      else if (sortKey === 'productName') cmp = a.productName.localeCompare(b.productName);
      else if (sortKey === 'sku') cmp = a.sku.localeCompare(b.sku);
      else if (sortKey === 'category') cmp = a.category.localeCompare(b.category);
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [items, search, stockFilter, sortKey, sortDir]);

  const stats = useMemo(() => ({
    total: items.length,
    inStock: items.filter(i => getStockStatus(i) === 'in_stock').length,
    lowStock: items.filter(i => getStockStatus(i) === 'low_stock').length,
    outOfStock: items.filter(i => getStockStatus(i) === 'out_of_stock').length,
    totalUnits: items.reduce((s, i) => s + i.currentStock, 0),
  }), [items]);

  const updateStock = (id: string, newStock: number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, currentStock: Math.max(0, newStock) } : i));
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const toggleBulkSelect = (id: string) => {
    setBulkIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const selectAll = () => {
    if (bulkIds.length === filtered.length) setBulkIds([]);
    else setBulkIds(filtered.map(i => i.id));
  };

  const applyBulkUpdate = () => {
    setItems(prev => prev.map(i => bulkIds.includes(i.id) ? { ...i, currentStock: Math.max(0, i.currentStock + bulkAdjustment) } : i));
    setBulkIds([]);
    setBulkAdjustment(0);
    setBulkMode(false);
  };

  const SortHeader = ({ label, sortId }: { label: string; sortId: SortKey }) => (
    <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase cursor-pointer hover:text-neutral-700 select-none" onClick={() => handleSort(sortId)}>
      <span className="flex items-center gap-1">
        {label}
        <ArrowUpDown className={`w-3 h-3 ${sortKey === sortId ? 'text-gold-500' : 'text-neutral-300'}`} />
      </span>
    </th>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-800">Inventory</h1>
          <p className="text-sm text-neutral-500">Manage stock levels for all products</p>
        </div>
        <div className="flex items-center gap-2">
          {bulkMode && bulkIds.length > 0 && (
            <div className="flex items-center gap-2 bg-gold-50 border border-gold-200 rounded-sm px-3 py-2">
              <span className="text-xs font-medium text-gold-700">{bulkIds.length} selected</span>
              <input
                type="number"
                value={bulkAdjustment}
                onChange={e => setBulkAdjustment(Number(e.target.value))}
                className="input-field text-xs w-20 py-1"
                placeholder="± Qty"
              />
              <button onClick={applyBulkUpdate} className="text-xs font-medium text-gold-700 hover:text-gold-900">Apply</button>
              <button onClick={() => { setBulkMode(false); setBulkIds([]); }} className="text-xs font-medium text-neutral-500 hover:text-neutral-700">Cancel</button>
            </div>
          )}
          <button
            onClick={() => setBulkMode(!bulkMode)}
            className={`text-sm py-2 px-3 rounded-sm font-medium border transition-colors ${bulkMode ? 'bg-gold-50 border-gold-200 text-gold-700' : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'}`}
          >
            {bulkMode ? 'Exit Bulk' : 'Bulk Update'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Total Products', value: stats.total },
          { label: 'In Stock', value: stats.inStock },
          { label: 'Low Stock', value: stats.lowStock, highlight: true },
          { label: 'Out of Stock', value: stats.outOfStock, danger: true },
          { label: 'Total Units', value: stats.totalUnits.toLocaleString() },
        ].map(s => (
          <div key={s.label} className={`bg-white rounded-sm border border-neutral-100 p-3 text-center ${(s as Record<string, unknown>).danger ? 'border-red-200 bg-red-50/30' : (s as Record<string, unknown>).highlight ? 'border-yellow-200 bg-yellow-50/30' : ''}`}>
            <p className={`text-lg font-bold ${(s as Record<string, unknown>).danger ? 'text-red-700' : (s as Record<string, unknown>).highlight ? 'text-yellow-700' : 'text-neutral-800'}`}>{s.value}</p>
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
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by product name or SKU..."
              className="input-field pl-10 text-sm"
            />
          </div>
          <select value={stockFilter} onChange={e => setStockFilter(e.target.value)} className="input-field text-sm w-auto">
            <option value="all">All Stock Status</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-100">
                {bulkMode && (
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase w-10">
                    <input type="checkbox" checked={bulkIds.length === filtered.length && filtered.length > 0} onChange={selectAll} className="rounded-sm border-neutral-300" />
                  </th>
                )}
                <SortHeader label="Product" sortId="productName" />
                <SortHeader label="SKU" sortId="sku" />
                <SortHeader label="Category" sortId="category" />
                <SortHeader label="Stock" sortId="currentStock" />
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Threshold</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Update</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => {
                const status = getStockStatus(item);
                const config = stockStatusConfig[status];
                return (
                  <tr key={item.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                    {bulkMode && (
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={bulkIds.includes(item.id)} onChange={() => toggleBulkSelect(item.id)} className="rounded-sm border-neutral-300" />
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-neutral-100 rounded-sm flex items-center justify-center text-sm">🌶️</div>
                        <p className="text-sm font-medium text-neutral-800">{item.productName}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-500 font-mono">{item.sku}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600 capitalize">{item.category.replace('-', ' ')}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-bold ${status === 'out_of_stock' ? 'text-red-600' : status === 'low_stock' ? 'text-yellow-600' : 'text-neutral-800'}`}>
                        {item.currentStock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-500">{item.lowStockThreshold}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-sm font-medium ${config.bg} ${config.color}`}>
                        {config.icon} {config.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateStock(item.id, item.currentStock - 1)} className="w-7 h-7 flex items-center justify-center text-sm border border-neutral-200 rounded-sm text-neutral-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors" disabled={bulkMode}>−</button>
                        <input
                          type="number"
                          value={item.currentStock}
                          onChange={e => updateStock(item.id, Number(e.target.value))}
                          className="w-16 text-center text-sm font-medium border border-neutral-200 rounded-sm py-1 bg-white focus:border-gold-300 focus:ring-1 focus:ring-gold-300 outline-none"
                          disabled={bulkMode}
                        />
                        <button onClick={() => updateStock(item.id, item.currentStock + 1)} className="w-7 h-7 flex items-center justify-center text-sm border border-neutral-200 rounded-sm text-neutral-600 hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-colors" disabled={bulkMode}>+</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={bulkMode ? 8 : 7} className="px-4 py-12 text-center text-sm text-neutral-400">No products found matching your criteria.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-sm text-neutral-500">
          <span>Showing {filtered.length} of {items.length} products</span>
          <span>Total units in inventory: <strong className="text-neutral-800">{stats.totalUnits.toLocaleString()}</strong></span>
        </div>
      </div>
    </div>
  );
}
