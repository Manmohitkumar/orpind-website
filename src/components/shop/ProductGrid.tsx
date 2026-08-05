'use client';

import { RefreshCw } from 'lucide-react';
import ProductCard from './ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';

interface ProductGridProps {
  products?: any[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export default function ProductGrid({ products = [], loading, error, onRetry }: ProductGridProps) {
  if (loading) return <ProductGridSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-neutral-600 mb-4">{error}</p>
        {onRetry && (
          <button onClick={onRetry} className="btn-secondary text-sm">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-neutral-500">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
