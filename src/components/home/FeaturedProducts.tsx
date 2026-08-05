'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/shop/ProductCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<any>('/api/products/featured')
      .then(data => setProducts(data.featured || []))
      .catch((err) => setError(err.message || 'Failed to load products'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section-padding bg-beige-100">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <p className="text-sm text-gold-500 font-medium uppercase tracking-widest mb-3">Curated for You</p>
            <h2 className="heading-2 text-green-800 mb-4">From Our Fields to Your Kitchen</h2>
            <div className="w-16 h-0.5 bg-gold-500 mb-4" />
            <p className="text-body max-w-lg">Handpicked spices and grains, fresh from Punjab&apos;s finest farms.</p>
          </div>
          <Link href="/shop" className="mt-6 md:mt-0 inline-flex items-center gap-2 text-gold-500 hover:text-gold-600 font-medium group">
            Shop All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : error ? (
          <p className="text-center text-semantic-error">{error}</p>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-body text-neutral-500">No featured products at this time</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product: any) => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
      </div>
    </section>
  );
}
