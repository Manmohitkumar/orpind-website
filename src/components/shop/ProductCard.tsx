'use client';

import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatPrice } from '@/lib/utils';
import StarRating from '@/components/ui/StarRating';

export default function ProductCard({ product }: { product: any }) {
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const discount = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="card overflow-hidden">
      <div className="relative aspect-[4/5] overflow-hidden bg-beige-100">
        {product.images?.[0] && (
          <img
            src={product.images[0]}
            alt={product.name}
            className="object-cover w-full h-full hover:scale-105 transition-all duration-600 ease-out"
          />
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isOrganic && <span className="badge-organic">Organic</span>}
          {product.isNew && <span className="badge-new">New</span>}
          {product.isBestseller && <span className="badge-bestseller">Bestseller</span>}
          {discount > 0 && <span className="badge-sale">{discount}% OFF</span>}
        </div>

        <button
          onClick={() => toggleItem(product)}
          className="absolute top-3 right-3 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full shadow-sm flex items-center justify-center z-10"
        >
          <Heart
            className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-neutral-600'}`}
          />
        </button>
      </div>

      <div className="p-4 space-y-2">
        <Link href={`/products/${product.slug}`}>
          <h3 className="heading-4 text-green-800 font-display line-clamp-1">{product.name}</h3>
        </Link>

        {product.weight && (
          <p className="text-sm text-neutral-500">
            {Array.isArray(product.weight) ? product.weight.join(', ') : product.weight}
          </p>
        )}

        <div className="flex items-center gap-1.5">
          <StarRating rating={product.rating || 0} size="sm" />
          {product.reviewCount > 0 && (
            <span className="text-xs text-neutral-400">({product.reviewCount})</span>
          )}
        </div>

        <div className="flex items-center">
          <span className="text-lg font-semibold text-gold-500">
            {formatPrice(product.price)}
          </span>
          {discount > 0 && (
            <span className="text-sm text-neutral-400 line-through ml-2">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        <button
          onClick={() => addItem(product, product.weight?.[0] || '')}
          className="btn-primary w-full text-sm py-2.5"
        >
          <ShoppingBag className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
