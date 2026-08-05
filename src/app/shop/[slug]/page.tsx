'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Star,
  Minus,
  Plus,
  ShoppingBag,
  Heart,
  Share2,
  Truck,
  ShieldCheck,
  Leaf,
  ChevronRight,
} from 'lucide-react';
import { products, formatPrice } from '@/data/products';
import ProductCard from '@/components/shop/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = products.find((p) => p.slug === slug);

  const [selectedWeight, setSelectedWeight] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'nutrition' | 'ingredients'>('description');

  if (!product) {
    return (
      <section className="section-padding pt-32">
        <div className="container-custom mx-auto text-center">
          <h1 className="heading-lg text-neutral-800 mb-4">Product Not Found</h1>
          <Link href="/shop" className="btn-primary">
            Back to Shop
          </Link>
        </div>
      </section>
    );
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      {/* Breadcrumb */}
      <section className="pt-28 pb-4 bg-neutral-50">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-neutral-500 flex-wrap">
            <Link href="/" className="hover:text-gold-600 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/shop" className="hover:text-gold-600 transition-colors">Shop</Link>
            <ChevronRight className="w-3 h-3" />
            <Link
              href={`/shop?category=${product.category}`}
              className="hover:text-gold-600 transition-colors capitalize"
            >
              {product.category.replace('-', ' ')}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-neutral-800 font-medium">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Detail */}
      <section className="section-padding bg-white">
        <div className="container-custom mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-sm overflow-hidden bg-neutral-50 border border-neutral-100">
                <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                  <span className="text-9xl opacity-30">🌶️</span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-sm overflow-hidden bg-neutral-50 border-2 border-gold-500 cursor-pointer"
                  >
                    <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                      <span className="text-2xl opacity-30">🌶️</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Details */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                {product.isNew && <span className="badge-new">New</span>}
                {product.isBestseller && <span className="badge-bestseller">Bestseller</span>}
                {product.isOrganic && <span className="badge-organic">Organic</span>}
              </div>

              <h1 className="heading-md text-neutral-800 mb-2">{product.name}</h1>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-gold-500 text-gold-500'
                          : 'text-neutral-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-neutral-500">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-neutral-800">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-neutral-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="badge bg-gold-600 text-white">
                    Save {formatPrice(product.originalPrice - product.price)}
                  </span>
                )}
              </div>

              <p className="text-body mb-8">{product.description}</p>

              {/* Weight Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-neutral-800 mb-3">
                  Select Weight
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.weight.map((w, i) => (
                    <button
                      key={w}
                      onClick={() => setSelectedWeight(i)}
                      className={`px-5 py-2.5 border rounded-sm text-sm font-medium transition-all ${
                        selectedWeight === i
                          ? 'border-gold-500 bg-gold-50 text-gold-600'
                          : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-neutral-800 mb-3">
                  Quantity
                </label>
                <div className="inline-flex items-center border border-neutral-200 rounded-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-neutral-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-3 font-medium text-neutral-800 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-neutral-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 mb-8">
                <button className="btn-primary flex-1">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Add to Cart
                </button>
                <button className="p-3.5 border-2 border-neutral-200 rounded-sm text-neutral-600 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-3.5 border-2 border-neutral-200 rounded-sm text-neutral-600 hover:bg-neutral-50 transition-all">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-neutral-100">
                {[
                  { icon: Truck, label: 'Free delivery on ₹999+' },
                  { icon: ShieldCheck, label: 'Quality guaranteed' },
                  { icon: Leaf, label: '100% organic' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="text-center">
                    <Icon className="w-5 h-5 text-gold-500 mx-auto mb-2" />
                    <p className="text-xs text-neutral-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-16 pt-16 border-t border-neutral-100">
            <div className="flex gap-8 border-b border-neutral-100 mb-8">
              {(['description', 'nutrition', 'ingredients'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm font-semibold uppercase tracking-wider border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-gold-500 text-gold-600'
                      : 'border-transparent text-neutral-400 hover:text-neutral-600'
                  }`}
                >
                  {tab === 'nutrition' ? 'Nutritional Info' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="max-w-3xl">
              {activeTab === 'description' && (
                <div className="text-body">
                  <p>{product.description}</p>
                  <p className="mt-4">
                    <strong>Origin:</strong> {product.origin}
                  </p>
                </div>
              )}

              {activeTab === 'nutrition' && product.nutritionalInfo && (
                <div className="space-y-3">
                  {Object.entries(product.nutritionalInfo).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-neutral-100">
                      <span className="text-neutral-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="font-medium text-neutral-800">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'ingredients' && product.ingredients && (
                <div>
                  <p className="text-body mb-4">Our {product.name} contains:</p>
                  <div className="flex flex-wrap gap-2">
                    {product.ingredients.map((ing) => (
                      <span
                        key={ing}
                        className="px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-sm text-sm text-neutral-700"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'nutrition' && !product.nutritionalInfo && (
                <p className="text-neutral-500">Nutritional information coming soon.</p>
              )}
              {activeTab === 'ingredients' && !product.ingredients && (
                <p className="text-neutral-500">Ingredient list coming soon.</p>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16 pt-16 border-t border-neutral-100">
              <h2 className="heading-md text-neutral-800 mb-8">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
