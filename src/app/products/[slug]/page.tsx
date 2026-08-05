'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Star, Check, ChevronDown, Share2, Heart, ShoppingBag, Minus, Plus } from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { formatPrice, cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

const accordionSections = [
  { id: 'description', title: 'Description' },
  { id: 'nutrition', title: 'Nutrition & Benefits' },
  { id: 'ingredients', title: 'Ingredients' },
  { id: 'origin', title: 'Origin & Storage' },
  { id: 'reviews', title: 'Reviews' },
  { id: 'faqs', title: 'FAQs' },
];

function AccordionSection({ id, title, children, open, onToggle }: {
  id: string; title: string; children: React.ReactNode; open: boolean; onToggle: () => void;
}) {
  return (
    <div className="border-b border-beige-200">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className="heading-4 text-green-800">{title}</span>
        <ChevronDown className={cn('w-5 h-5 text-neutral-400 transition-transform duration-300', open && 'rotate-180')} />
      </button>
      <div className={cn('overflow-hidden transition-all duration-300', open ? 'max-h-96 pb-5' : 'max-h-0')}>
        <div className="text-body">{children}</div>
      </div>
    </div>
  );
}

const highlights = [
  '100% naturally sourced from organic farms',
  'Handpicked and sun-dried for maximum flavour',
  'No preservatives, additives, or artificial colors',
  'Packed in eco-friendly, resealable packaging',
];

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWeight, setSelectedWeight] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<string | null>('description');
  const { addItem, isInCart } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    api.get<any>(`/api/products/${slug}`)
      .then(data => {
        setProduct(data.product);
        setRelated(data.related || []);
        setSelectedWeight(data.product.weight?.[0] || '');
      })
      .catch(err => setError(err.message || 'Failed to load product'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="aspect-square rounded-lg skeleton" />
              <div className="flex gap-3 mt-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="w-20 h-20 rounded-md skeleton" />)}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-4 w-48 skeleton" />
              <div className="h-10 w-3/4 skeleton" />
              <div className="h-5 w-32 skeleton" />
              <div className="h-12 w-48 skeleton" />
              <div className="h-20 w-full skeleton" />
              <div className="flex gap-3">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-10 w-24 rounded-full skeleton" />)}
              </div>
              <div className="h-14 w-full rounded-md skeleton" />
              <div className="h-14 w-full rounded-md skeleton" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="section-padding">
        <div className="container-custom text-center">
          <h1 className="heading-2 text-green-800 mb-4">
            {error || 'Product not found'}
          </h1>
          <Link href="/shop" className="btn-primary">Go Back</Link>
        </div>
      </section>
    );
  }

  const discount = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;
  const images = product.images?.length ? product.images : [null];
  const inWishlist = isInWishlist(product.id);

  return (
    <>
      <section className="section-padding">
        <div className="container-custom">
          <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8">
            <Link href="/" className="hover:text-green-700 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-green-700 transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-green-800">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="relative aspect-square rounded-lg overflow-hidden bg-beige-100">
                {images[activeImage] ? (
                  <img
                    src={images[activeImage]}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-8xl opacity-20">🌶️</div>
                )}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                  {product.isOrganic && <Badge variant="organic">Organic</Badge>}
                  {product.isNew && <Badge variant="new">New</Badge>}
                  {product.isBestseller && <Badge variant="bestseller">Bestseller</Badge>}
                  {discount > 0 && <Badge variant="sale">{discount}% OFF</Badge>}
                </div>
                <button className="absolute bottom-4 right-4 btn-ghost z-10">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {images.length > 1 && (
                <div className="flex gap-3 mt-4">
                  {images.map((img: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={cn(
                        'w-20 h-20 rounded-md overflow-hidden border-2 transition-colors flex-shrink-0',
                        activeImage === i ? 'border-gold-500' : 'border-beige-200'
                      )}
                    >
                      {img ? (
                        <img src={img} alt="" className="object-cover w-full h-full" />
                      ) : (
                        <div className="w-full h-full bg-beige-100 flex items-center justify-center text-2xl">🌶️</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h1 className="heading-1 text-green-800 mb-3">{product.name}</h1>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star
                      key={i}
                      className={cn(
                        'w-5 h-5',
                        i <= Math.round(product.rating || 0)
                          ? 'fill-gold-500 stroke-gold-500'
                          : 'text-neutral-200'
                      )}
                    />
                  ))}
                </div>
                <span className="text-body-sm">
                  {product.rating?.toFixed(1)} ({product.reviewCount || 0} reviews)
                </span>
              </div>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="heading-2 text-gold-500">{formatPrice(product.price)}</span>
                {discount > 0 && (
                  <>
                    <span className="text-xl text-neutral-400 line-through">{formatPrice(product.compareAtPrice)}</span>
                    <Badge variant="sale">{discount}% OFF</Badge>
                  </>
                )}
              </div>

              <p className="text-body mb-6">{product.shortDescription || product.description?.slice(0, 150)}</p>

              <div className="space-y-3 mb-8">
                {highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                    <span className="text-body">{h}</span>
                  </div>
                ))}
              </div>

              {product.weight?.length > 0 && (
                <div className="mb-8">
                  <p className="input-label mb-3">Select Weight</p>
                  <div className="flex flex-wrap gap-3">
                    {product.weight.map((w: string) => (
                      <button
                        key={w}
                        onClick={() => setSelectedWeight(w)}
                        className={cn(
                          'rounded-full border px-5 py-2 text-sm font-medium transition-colors',
                          selectedWeight === w
                            ? 'bg-green-500 text-white border-green-500'
                            : 'border-neutral-200 text-neutral-600 hover:border-gold-500'
                        )}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 mb-6">
                <div className="inline-flex items-center border border-neutral-200 rounded-md">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-3 hover:bg-beige-100 transition-colors"
                  >
                    <Minus className="w-4 h-4 text-neutral-600" />
                  </button>
                  <span className="px-6 py-3 text-sm font-medium min-w-[3rem] text-center text-green-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="p-3 hover:bg-beige-100 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-neutral-600" />
                  </button>
                </div>
                {!product.inStock && (
                  <span className="text-semantic-error text-sm font-medium">Out of Stock</span>
                )}
              </div>

              <div className="space-y-3 mb-8">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={!product.inStock}
                  onClick={() => addItem(product, selectedWeight, quantity)}
                >
                  <ShoppingBag className="w-5 h-5" />
                  {isInCart(product.id, selectedWeight) ? 'Add More' : 'Add to Cart'}
                </Button>
                <Button variant="secondary" size="lg" fullWidth>
                  Buy Now
                </Button>
              </div>

              <Button
                variant="ghost"
                size="md"
                fullWidth
                onClick={() => toggleItem(product)}
                className={cn(inWishlist && 'border-semantic-error text-semantic-error')}
              >
                <Heart className={cn('w-5 h-5', inWishlist && 'fill-semantic-error')} />
                {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>

              <div className="mt-10">
                {accordionSections.map(section => (
                  <AccordionSection
                    key={section.id}
                    id={section.id}
                    title={section.title}
                    open={openAccordion === section.id}
                    onToggle={() => setOpenAccordion(openAccordion === section.id ? null : section.id)}
                  >
                    {section.id === 'description' && (
                      <p>{product.description}</p>
                    )}
                    {section.id === 'nutrition' && (
                      <p>{product.nutrition || 'Nutritional information coming soon.'}</p>
                    )}
                    {section.id === 'ingredients' && (
                      <div className="flex flex-wrap gap-2">
                        {product.ingredients?.length > 0
                          ? product.ingredients.map((i: string) => (
                              <span key={i} className="px-3 py-1.5 bg-beige-100 text-neutral-600 text-sm rounded-md">{i}</span>
                            ))
                          : <p>Ingredient details coming soon.</p>
                        }
                      </div>
                    )}
                    {section.id === 'origin' && (
                      <div className="space-y-2">
                        {product.origin && <p><strong>Origin:</strong> {product.origin}</p>}
                        {product.storage && <p><strong>Storage:</strong> {product.storage}</p>}
                        {!product.origin && !product.storage && <p>Origin and storage information coming soon.</p>}
                      </div>
                    )}
                    {section.id === 'reviews' && (
                      <p>Customer reviews coming soon.</p>
                    )}
                    {section.id === 'faqs' && (
                      <p>Frequently asked questions coming soon.</p>
                    )}
                  </AccordionSection>
                ))}
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <section className="mt-20">
              <h2 className="heading-2 text-green-800 mb-8">You May Also Like</h2>
              <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
                {related.map((p: any) => (
                  <div key={p.id} className="flex-shrink-0 w-72">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {related.length > 0 && (
            <section className="mt-16">
              <h2 className="heading-2 text-green-800 mb-8">Frequently Bought Together</h2>
              <div className="card-flat p-8">
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                  <div className="flex items-center gap-4">
                    {related.slice(0, 3).map((p: any) => (
                      <div key={p.id} className="flex flex-col items-center gap-2">
                        <div className="w-20 h-20 rounded-md bg-beige-100 overflow-hidden">
                          {p.images?.[0] && (
                            <img src={p.images[0]} alt={p.name} className="object-cover w-full h-full" />
                          )}
                        </div>
                        <p className="text-xs text-neutral-500 text-center line-clamp-1">{p.name}</p>
                        <span className="text-sm font-medium text-green-800">{formatPrice(p.price)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-lg font-medium text-green-800 mb-1">
                      Total: {formatPrice(
                        related.slice(0, 3).reduce((sum: number, p: any) => sum + (p.price || 0), 0) + (product.price || 0)
                      )}
                    </p>
                    <p className="text-body-sm mb-3">Add all to cart for a complete set</p>
                    <Button size="md">Add All</Button>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </section>
    </>
  );
}
