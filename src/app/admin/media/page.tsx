'use client';

import { useState } from 'react';
import { Search, Upload, Trash2, Grid, List, Image, FileImage, X, Info } from 'lucide-react';

interface MediaFile {
  id: string;
  name: string;
  url: string;
  size: string;
  type: string;
  dimensions: string;
  uploadedAt: string;
  usedIn: string;
}

const initialMedia: MediaFile[] = [
  { id: '1', name: 'garam-masala-hero.svg', url: '/images/products/garam-masala-1.svg', size: '2.4 MB', type: 'image/jpeg', dimensions: '1200x800', uploadedAt: '2024-04-10', usedIn: 'Product page, Homepage' },
  { id: '2', name: 'kashmiri-chilli-main.svg', url: '/images/products/kashmiri-chilli.svg', size: '1.8 MB', type: 'image/jpeg', dimensions: '1200x800', uploadedAt: '2024-04-09', usedIn: 'Product page' },
  { id: '3', name: 'organic-farm-banner.svg', url: '/images/banners/farm.svg', size: '3.1 MB', type: 'image/jpeg', dimensions: '1920x600', uploadedAt: '2024-04-08', usedIn: 'Homepage hero' },
  { id: '4', name: 'category-whole-spices.svg', url: '/images/categories/whole-spices.svg', size: '980 KB', type: 'image/jpeg', dimensions: '800x800', uploadedAt: '2024-04-07', usedIn: 'Category page' },
  { id: '5', name: 'category-ground-spices.svg', url: '/images/categories/ground-spices.svg', size: '1.1 MB', type: 'image/jpeg', dimensions: '800x800', uploadedAt: '2024-04-07', usedIn: 'Category page' },
  { id: '6', name: 'gift-set-promo.png', url: '/images/promo/gift-set.png', size: '4.2 MB', type: 'image/png', dimensions: '1600x900', uploadedAt: '2024-04-05', usedIn: 'Promo banner' },
  { id: '7', name: 'turmeric-powder.svg', url: '/images/products/turmeric.svg', size: '1.5 MB', type: 'image/jpeg', dimensions: '1200x800', uploadedAt: '2024-04-04', usedIn: 'Product page' },
  { id: '8', name: 'punjabi-recipe-blog.svg', url: '/images/blog/punjabi-recipe.svg', size: '2.0 MB', type: 'image/jpeg', dimensions: '1200x630', uploadedAt: '2024-04-03', usedIn: 'Blog post' },
  { id: '9', name: 'logo-dark.png', url: '/images/logo-dark.png', size: '45 KB', type: 'image/png', dimensions: '300x80', uploadedAt: '2024-03-15', usedIn: 'Navbar, Footer' },
  { id: '10', name: 'spice-blend-collection.svg', url: '/images/products/spice-collection.svg', size: '2.8 MB', type: 'image/jpeg', dimensions: '1200x800', uploadedAt: '2024-03-10', usedIn: 'Product page, Collection' },
  { id: '11', name: 'wholesale-banner.svg', url: '/images/banners/wholesale.svg', size: '3.5 MB', type: 'image/jpeg', dimensions: '1920x600', uploadedAt: '2024-03-08', usedIn: 'Wholesale page' },
  { id: '12', name: 'team-photo.svg', url: '/images/about/team.svg', size: '1.9 MB', type: 'image/jpeg', dimensions: '1400x900', uploadedAt: '2024-03-01', usedIn: 'About page' },
];

export default function AdminMediaPage() {
  const [media] = useState<MediaFile[]>(initialMedia);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState<string | null>(null);

  const filtered = media.filter(m => {
    if (search) {
      const q = search.toLowerCase();
      return m.name.toLowerCase().includes(q) || m.type.toLowerCase().includes(q) || m.usedIn.toLowerCase().includes(q);
    }
    return true;
  });

  const selected = media.find(m => m.id === showInfo);

  const getTypeIcon = (type: string) => {
    if (type.includes('png')) return '🖼️';
    return '📷';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-800">Media Library</h1>
          <p className="text-sm text-neutral-500">{media.length} files &middot; {media.reduce((acc, m) => acc + parseFloat(m.size), 0).toFixed(1)} MB total</p>
        </div>
        <button className="btn-primary text-sm py-2"><Upload className="w-4 h-4 mr-1" /> Upload Files</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Files', value: media.length },
          { label: 'Images', value: media.filter(m => m.type.startsWith('image')).length },
          { label: 'Total Size', value: `${(media.reduce((acc, m) => acc + parseFloat(m.size), 0)).toFixed(1)} MB` },
          { label: 'PNG Files', value: media.filter(m => m.type.includes('png')).length },
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
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search files by name, type, or usage..." className="input-field pl-10 text-sm" />
          </div>
          <div className="flex items-center gap-2 border border-neutral-200 rounded-sm overflow-hidden">
            <button onClick={() => setViewMode('grid')} className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-gold-600 text-white' : 'text-neutral-500 hover:bg-neutral-50'}`}><Grid className="w-4 h-4" /></button>
            <button onClick={() => setViewMode('list')} className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-gold-600 text-white' : 'text-neutral-500 hover:bg-neutral-50'}`}><List className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map(file => (
            <div key={file.id} className="bg-white rounded-sm border border-neutral-100 overflow-hidden hover:shadow-md transition-shadow group">
              <div className="aspect-square bg-neutral-100 flex items-center justify-center relative">
                <span className="text-3xl">{getTypeIcon(file.type)}</span>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-1">
                    <button onClick={() => setShowInfo(file.id)} className="p-1.5 bg-white rounded-sm text-neutral-700 hover:bg-neutral-100"><Info className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 bg-white rounded-sm text-red-500 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <p className="text-[11px] font-medium text-neutral-800 truncate">{file.name}</p>
                <p className="text-[10px] text-neutral-400">{file.size} &middot; {file.dimensions}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-sm border border-neutral-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">File</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Size</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Dimensions</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Uploaded</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Used In</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(file => (
                  <tr key={file.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neutral-100 rounded-sm flex items-center justify-center text-lg">{getTypeIcon(file.type)}</div>
                        <span className="text-sm font-medium text-neutral-800 max-w-[240px] truncate">{file.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{file.size}</td>
                    <td className="px-4 py-3 text-xs text-neutral-500 font-mono">{file.type}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{file.dimensions}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{file.uploadedAt}</td>
                    <td className="px-4 py-3 text-xs text-neutral-500 max-w-[180px] truncate">{file.usedIn}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setShowInfo(file.id)} className="p-1.5 hover:bg-neutral-100 rounded-sm text-neutral-600" title="Info"><Info className="w-3.5 h-3.5" /></button>
                        <button className="p-1.5 hover:bg-red-50 rounded-sm text-red-500" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-neutral-400">No files found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-sm border border-neutral-100 w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <h2 className="text-lg font-display font-bold text-neutral-800">File Details</h2>
              <button onClick={() => setShowInfo(null)} className="p-1.5 hover:bg-neutral-100 rounded-sm text-neutral-500"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6">
              <div className="aspect-video bg-neutral-100 rounded-sm flex items-center justify-center mb-4">
                <span className="text-4xl">{getTypeIcon(selected.type)}</span>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Name', value: selected.name },
                  { label: 'Size', value: selected.size },
                  { label: 'Type', value: selected.type },
                  { label: 'Dimensions', value: selected.dimensions },
                  { label: 'Uploaded', value: selected.uploadedAt },
                  { label: 'Used In', value: selected.usedIn },
                ].map(item => (
                  <div key={item.label} className="flex justify-between">
                    <span className="text-xs text-neutral-500">{item.label}</span>
                    <span className="text-sm font-medium text-neutral-800">{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowInfo(null)} className="flex-1 px-4 py-2.5 text-sm font-medium border border-neutral-200 text-neutral-700 rounded-sm hover:bg-neutral-50 transition-colors">Close</button>
                <button className="flex-1 px-4 py-2.5 text-sm font-medium bg-red-50 text-red-600 border border-red-200 rounded-sm hover:bg-red-100 transition-colors"><Trash2 className="w-4 h-4 mr-1 inline" /> Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
