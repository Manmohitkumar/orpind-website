'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<any>('/api/categories')
      .then(data => setCategories(data.categories || []))
      .catch((err) => setError(err.message || 'Failed to load categories'));
  }, []);

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <p className="text-sm text-gold-500 font-medium uppercase tracking-widest mb-3">Collections</p>
          <h2 className="heading-2 text-green-800 mb-4">Shop by Category</h2>
          <div className="divider-center mb-6" />
        </div>

        {error ? (
          <p className="text-center text-semantic-error">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(categories.length > 0 ? categories : []).map((category: any) => (
              <Link
                key={category.slug}
                href={`/shop?category=${category.slug}`}
                className="group relative h-80 overflow-hidden rounded-lg card"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-beige-100 to-beige-200" />
                <div className="absolute inset-0 bg-gradient-to-t from-beige-200/60 to-transparent" />
                <div className="relative h-full flex flex-col justify-end p-8">
                  <p className="text-sm text-neutral-500 mb-2">{category.count || category.productCount || 0} Products</p>
                  <h3 className="text-2xl font-display font-normal text-green-700 mb-2">{category.name}</h3>
                  <div className="flex items-center gap-2 text-gold-500 group-hover:text-gold-600 transition-colors">
                    <span className="text-sm font-medium">Shop Now</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
