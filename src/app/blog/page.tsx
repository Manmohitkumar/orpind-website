'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Clock, User, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';

const categories = ['All', 'Recipes', 'Health', 'Stories'] as const;

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    api.get<any>('/api/blog')
      .then(data => setPosts(data.posts || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getInitials = (name: string) => name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const filtered = activeCategory === 'All' ? posts : posts.filter((post: any) => {
    const cat = (post.category || '').toLowerCase();
    return cat === activeCategory.toLowerCase();
  });

  return (
    <>
      <section className="relative pt-32 pb-20 bg-green-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(215, 104, 31, 0.4) 0%, transparent 50%)' }} />
        </div>
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link><ChevronRight className="w-3 h-3" /><span className="text-white">Blog</span>
          </nav>
          <div className="max-w-3xl">
            <h1 className="heading-xl text-white mb-6">Spice Stories & <span className="text-gold-400">Recipes</span></h1>
            <p className="text-body-lg text-neutral-300">Discover the rich heritage of Punjabi spices, healthy cooking tips, and delicious recipes crafted by our kitchen experts.</p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-12">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-sm text-sm font-medium transition-colors ${activeCategory === cat ? 'bg-gold-600 text-white' : 'bg-white border border-neutral-200 text-neutral-600 hover:border-gold-300 hover:text-gold-600'}`}>{cat}</button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3].map(i => <div key={i} className="h-96 bg-neutral-100 animate-pulse rounded-sm" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-neutral-500 mb-4">No posts found in this category.</p>
              <button onClick={() => setActiveCategory('All')} className="btn-outline">View All Posts</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((post: any) => (
                <article key={post.id} className="card group">
                  <div className="aspect-[16/10] bg-gradient-to-br from-neutral-100 to-neutral-200 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl opacity-20">🫚</span>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="badge bg-gold-500 text-white">{post.category || 'Stories'}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-lg font-display font-semibold text-neutral-800 mb-3 line-clamp-2 group-hover:text-gold-600 transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p className="text-sm text-neutral-500 leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-neutral-400 mb-4">
                      <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {post.author}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                      <time className="text-xs text-neutral-400">{new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</time>
                      <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-600 hover:text-gold-700 transition-colors group/link">
                        Read More <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section-padding bg-gold-600 text-center">
        <div className="container-custom mx-auto">
          <h2 className="heading-md text-white mb-4">Hungry for More?</h2>
          <p className="text-lg text-gold-100 mb-8 max-w-xl mx-auto">Subscribe to our newsletter for the latest recipes, spice tips, and exclusive offers.</p>
          <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-gold-700 font-semibold rounded-sm hover:bg-beige-100 transition-colors group">
            Shop Our Spices <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </>
  );
}
