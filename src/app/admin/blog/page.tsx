'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Search, Eye, Calendar, User, FileText } from 'lucide-react';
import { formatPrice } from '@/data/products';

interface BlogPostAdmin {
  id: string;
  title: string;
  slug: string;
  author: string;
  status: 'draft' | 'published';
  excerpt: string;
  tags: string[];
  readTime: string;
  publishedAt: string | null;
  createdAt: string;
}

const initialPosts: BlogPostAdmin[] = [
  { id: '1', title: 'The Secret Behind Authentic Punjabi Garam Masala', slug: 'authentic-punjabi-garam-masala', author: 'Harpreet Singh', status: 'published', excerpt: 'Discover the centuries-old tradition of crafting garam masala in Punjab...', tags: ['spices', 'tradition', 'recipes'], readTime: '5 min', publishedAt: '2024-03-15', createdAt: '2024-03-10' },
  { id: '2', title: '5 Health Benefits of Organic Turmeric', slug: 'health-benefits-turmeric', author: 'Dr. Amrita Kaur', status: 'published', excerpt: 'Turmeric has been used in Ayurvedic medicine for thousands of years...', tags: ['health', 'organic', 'turmeric'], readTime: '7 min', publishedAt: '2024-03-20', createdAt: '2024-03-18' },
  { id: '3', title: 'How to Store Spices for Maximum Freshness', slug: 'storing-spices-freshness', author: 'Harpreet Singh', status: 'draft', excerpt: 'Learn the best practices for storing your spices to maintain their aroma...', tags: ['tips', 'storage', 'freshness'], readTime: '4 min', publishedAt: null, createdAt: '2024-03-25' },
  { id: '4', title: 'Punjab\'s Organic Farming Revolution', slug: 'punjab-organic-farming', author: 'Manpreet Kaur', status: 'published', excerpt: 'How Punjabi farmers are embracing organic agriculture for healthier produce...', tags: ['organic', 'farming', 'punjab'], readTime: '6 min', publishedAt: '2024-04-01', createdAt: '2024-03-28' },
  { id: '5', title: 'Guide to Indian Spice Blends for Beginners', slug: 'indian-spice-blends-guide', author: 'Dr. Amrita Kaur', status: 'draft', excerpt: 'A comprehensive guide to understanding and using Indian spice blends...', tags: ['guide', 'blends', 'beginners'], readTime: '10 min', publishedAt: null, createdAt: '2024-04-05' },
  { id: '6', title: 'The Journey from Farm to Kitchen', slug: 'farm-to-kitchen-journey', author: 'Harpreet Singh', status: 'published', excerpt: 'Follow the journey of our spices from Punjabi farms to your kitchen...', tags: ['journey', 'farm', 'process'], readTime: '8 min', publishedAt: '2024-04-10', createdAt: '2024-04-08' },
];

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPostAdmin[]>(initialPosts);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all');

  const filtered = posts.filter(p => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.author.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q));
    }
    return true;
  });

  const handleDelete = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const toggleStatus = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? {
      ...p,
      status: p.status === 'draft' ? 'published' as const : 'draft' as const,
      publishedAt: p.status === 'draft' ? new Date().toISOString().split('T')[0] : null,
    } : p));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-800">Blog</h1>
          <p className="text-sm text-neutral-500">{posts.length} posts &middot; {posts.filter(p => p.status === 'published').length} published</p>
        </div>
        <button className="btn-primary text-sm py-2"><Plus className="w-4 h-4 mr-1" /> New Post</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Posts', value: posts.length, icon: <FileText className="w-4 h-4" /> },
          { label: 'Published', value: posts.filter(p => p.status === 'published').length, color: 'text-green-600', icon: <Eye className="w-4 h-4" /> },
          { label: 'Drafts', value: posts.filter(p => p.status === 'draft').length, color: 'text-yellow-600', icon: <Edit className="w-4 h-4" /> },
          { label: 'Authors', value: new Set(posts.map(p => p.author)).size, color: 'text-gold-600', icon: <User className="w-4 h-4" /> },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-sm border border-neutral-100 p-3">
            <div className="flex items-center gap-2 text-neutral-400 mb-1">{s.icon}<p className="text-xs text-neutral-500">{s.label}</p></div>
            <p className={`text-lg font-bold ${s.color || 'text-neutral-800'}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-sm border border-neutral-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts by title, author, or tag..." className="input-field pl-10 text-sm" />
          </div>
          <div className="flex gap-2">
            {(['all', 'published', 'draft'] as const).map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-2 text-xs font-medium rounded-sm transition-colors ${statusFilter === s ? 'bg-gold-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Post</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Author</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Read Time</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(post => (
                <tr key={post.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-neutral-800 max-w-[320px] truncate">{post.title}</p>
                      <p className="text-xs text-neutral-400 max-w-[320px] truncate mt-0.5">{post.excerpt}</p>
                      <div className="flex gap-1 mt-1">
                        {post.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded-sm">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 bg-gold-100 rounded-full flex items-center justify-center text-[10px] font-bold text-gold-700">{post.author.charAt(0)}</div>
                      <span className="text-sm text-neutral-600">{post.author}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleStatus(post.id)} className={`text-xs px-2 py-1 rounded-sm font-medium cursor-pointer transition-colors ${post.status === 'published' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}>
                      {post.status === 'published' ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      {post.publishedAt ? (
                        <p className="text-xs text-neutral-600 flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.publishedAt}</p>
                      ) : (
                        <p className="text-xs text-neutral-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.createdAt}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-500">{post.readTime}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 hover:bg-neutral-100 rounded-sm text-neutral-600" title="Edit"><Edit className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 hover:bg-neutral-100 rounded-sm text-neutral-600" title="Preview"><Eye className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(post.id)} className="p-1.5 hover:bg-red-50 rounded-sm text-red-500" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-neutral-400">No posts found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
