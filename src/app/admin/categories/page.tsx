'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, ChevronRight, ChevronDown } from 'lucide-react';

interface Category {
  id: string; name: string; slug: string; description: string; status: 'Active' | 'Inactive'; productCount: number; children: Category[];
}

const initialCategories: Category[] = [
  { id: '1', name: 'Organic Spices', slug: 'organic-spices', description: 'Premium quality organic spices', status: 'Active', productCount: 48, children: [
    { id: '1-1', name: 'Turmeric', slug: 'turmeric', description: 'Turmeric varieties', status: 'Active', productCount: 12, children: [] },
    { id: '1-2', name: 'Chilli', slug: 'chilli', description: 'Chilli powders & whole', status: 'Active', productCount: 8, children: [] },
  ]},
  { id: '2', name: 'Organic Grains', slug: 'organic-grains', description: 'Organic grains and pulses', status: 'Active', productCount: 32, children: [] },
  { id: '3', name: 'Spice Blends', slug: 'spice-blends', description: 'Handcrafted masala blends', status: 'Active', productCount: 15, children: [] },
  { id: '4', name: 'Herbal Teas', slug: 'herbal-teas', description: 'Wellness teas', status: 'Inactive', productCount: 0, children: [] },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['1']));

  const toggle = (id: string) => {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpanded(next);
  };

  const renderCategory = (cat: Category, depth = 0) => {
    const hasChildren = cat.children.length > 0;
    const isExpanded = expanded.has(cat.id);
    return (
      <div key={cat.id}>
        <div className={`flex items-center justify-between px-4 py-3 hover:bg-neutral-50 border-b border-neutral-100 ${depth > 0 ? 'ml-10 border-l-2 border-l-neutral-100' : ''}`}>
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {hasChildren ? (
              <button onClick={() => toggle(cat.id)} className="text-neutral-400 hover:text-neutral-600 p-0.5">
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            ) : <div className="w-5" />}
            <div>
              <p className="text-sm font-medium text-neutral-800">{cat.name}</p>
              <p className="text-xs text-neutral-400">{cat.slug} &middot; {cat.productCount} products</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs px-2 py-0.5 rounded-full ${cat.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'}`}>{cat.status}</span>
            <button className="text-neutral-400 hover:text-primary-600"><Edit className="w-3.5 h-3.5" /></button>
            <button className="text-neutral-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        </div>
        {hasChildren && isExpanded && cat.children.map(child => renderCategory(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-display font-bold text-neutral-800">Categories</h1><p className="text-sm text-neutral-500">Organize your product categories</p></div>
        <button className="btn-primary text-sm py-2"><Plus className="w-4 h-4 mr-1" /> Add Category</button>
      </div>
      <div className="bg-white rounded-sm border border-neutral-100 overflow-hidden">
        {categories.length === 0 ? (
          <div className="py-16 text-center text-neutral-400 text-sm">No categories yet. Create your first category.</div>
        ) : (
          categories.map(cat => renderCategory(cat))
        )}
      </div>
    </div>
  );
}