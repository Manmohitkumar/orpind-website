'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, LayoutGrid, List, ChevronLeft, ChevronRight, X, Search } from 'lucide-react';
import ProductGrid from '@/components/shop/ProductGrid';
import ProductFilters from '@/components/shop/ProductFilters';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

const sortOptions = [
  { label: 'Featured', value: '' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest', value: 'newest' },
  { label: 'Name: A-Z', value: 'name-asc' },
  { label: 'Name: Z-A', value: 'name-desc' },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<{ slug: string; name: string; count?: number }[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const currentPage = Number(searchParams.get('page')) || 1;
  const selectedCategory = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || '';
  const searchQuery = searchParams.get('search') || '';
  const minPrice = Number(searchParams.get('minPrice')) || 0;
  const maxPrice = Number(searchParams.get('maxPrice')) || 100000;

  const perPage = 12;
  const totalPages = Math.ceil(total / perPage);

  function updateParams(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value && value !== '' && value !== 'all' && value !== '0' && value !== '100000') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    if (updates.page === undefined && !updates.hasOwnProperty('page')) {
      params.set('page', '1');
    }
    router.push(`/shop?${params.toString()}`);
  }

  function handleCategoryChange(slug: string) {
    updateParams({ category: slug === 'all' ? undefined : slug, page: '1' });
  }

  function handleSortChange(value: string) {
    updateParams({ sort: value || undefined });
  }

  function handlePriceChange(range: [number, number]) {
    updateParams({
      minPrice: range[0] > 0 ? String(range[0]) : undefined,
      maxPrice: range[1] < 100000 ? String(range[1]) : undefined,
      page: '1',
    });
  }

  function handleSearch(value: string) {
    updateParams({ search: value || undefined, page: '1' });
  }

  function handleClearFilters() {
    router.push('/shop');
  }

  function handlePageChange(page: number) {
    if (page < 1 || page > totalPages) return;
    updateParams({ page: String(page) });
  }

  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (sort) params.set('sort', sort);
    if (searchQuery) params.set('search', searchQuery);
    if (minPrice > 0) params.set('minPrice', String(minPrice));
    if (maxPrice < 100000) params.set('maxPrice', String(maxPrice));
    params.set('page', String(currentPage));
    params.set('limit', String(perPage));

    api.get<any>(`/api/products?${params}`)
      .then(data => {
        setProducts(data.products || []);
        setCategories(data.categories || []);
        setTotal(data.pagination?.total || 0);
      })
      .catch(err => setError(err.message || 'Failed to load products'))
      .finally(() => setLoading(false));
  }, [selectedCategory, sort, searchQuery, minPrice, maxPrice, currentPage]);

  const startItem = total === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, total);

  return (
    <>
      <section className="relative pt-32 pb-16 bg-green-900">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
              <a href="/" className="hover:text-white transition-colors">Home</a>
              <span>/</span>
              <span className="text-white">Shop</span>
            </nav>
            <h1 className="heading-1 text-green-800">Our Collection</h1>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-neutral-200 rounded-sm text-sm font-medium text-green-700 hover:bg-beige-100 transition-colors lg:hidden"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
              <p className="text-body-sm">
                Showing {total > 0 ? `${startItem}-${endItem}` : '0'} of {total} products
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={e => handleSearch(e.target.value)}
                  className="input-field pl-10 pr-4 py-2 text-sm w-48"
                />
                {searchQuery && (
                  <button onClick={() => handleSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                )}
              </div>
              <select
                value={sort}
                onChange={e => handleSortChange(e.target.value)}
                className="input-field py-2 text-sm w-auto"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <div className="hidden sm:flex items-center border border-neutral-200 rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn('p-2', viewMode === 'grid' ? 'bg-gold-500 text-white' : 'text-neutral-500 hover:bg-beige-100')}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn('p-2', viewMode === 'list' ? 'bg-gold-500 text-white' : 'text-neutral-500 hover:bg-beige-100')}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            <aside className="w-[280px] flex-shrink-0 hidden lg:block">
              <ProductFilters
                categories={[
                  { slug: 'all', name: 'All Products', count: total },
                  ...categories,
                ]}
                selectedCategory={selectedCategory}
                priceRange={[minPrice, maxPrice]}
                onCategoryChange={handleCategoryChange}
                onPriceChange={handlePriceChange}
                onSortChange={handleSortChange}
                onClear={handleClearFilters}
                sort={sort}
              />
            </aside>

            <div className="flex-1 min-w-0">
              {loading ? (
                <ProductGrid loading />
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <p className="text-semantic-error mb-4">{error}</p>
                  <button onClick={() => window.location.reload()} className="btn-primary">Try Again</button>
                </div>
              ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-24 h-24 bg-beige-200 rounded-full flex items-center justify-center mb-6">
                    <Search className="w-10 h-10 text-neutral-400" />
                  </div>
                  <h3 className="heading-3 text-green-800 mb-2">No products found</h3>
                  <p className="text-body text-neutral-500 mb-6">Try adjusting your filters or search terms</p>
                  <button onClick={handleClearFilters} className="btn-secondary">Clear Filters</button>
                </div>
              ) : (
                <>
                  <ProductGrid products={products} />
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                        className="btn-icon"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={cn(
                            'w-10 h-10 rounded-md text-sm font-medium transition-colors',
                            page === currentPage
                              ? 'bg-gold-500 text-white'
                              : 'text-neutral-600 hover:bg-beige-100'
                          )}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        className="btn-icon"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-green-900/60 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[300px] max-w-[85vw] bg-beige-50 shadow-soft-xl animate-drawer-in overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-beige-200">
              <h3 className="heading-4 text-green-800">Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)} className="btn-icon">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <ProductFilters
                categories={[
                  { slug: 'all', name: 'All Products', count: total },
                  ...categories,
                ]}
                selectedCategory={selectedCategory}
                priceRange={[minPrice, maxPrice]}
                onCategoryChange={(slug) => { handleCategoryChange(slug); setMobileFiltersOpen(false); }}
                onPriceChange={handlePriceChange}
                onSortChange={handleSortChange}
                onClear={() => { handleClearFilters(); setMobileFiltersOpen(false); }}
                sort={sort}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <section className="section-padding">
        <div className="container-custom">
          <div className="flex gap-8">
            <aside className="w-[280px] flex-shrink-0 hidden lg:block" />
            <div className="flex-1"><ProductGrid loading /></div>
          </div>
        </div>
      </section>
    }>
      <ShopContent />
    </Suspense>
  );
}
