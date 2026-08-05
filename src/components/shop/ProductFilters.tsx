'use client';

interface ProductFiltersProps {
  categories: { slug: string; name: string; count?: number }[];
  selectedCategory?: string;
  priceRange: [number, number];
  onCategoryChange: (slug: string) => void;
  onPriceChange: (range: [number, number]) => void;
  onSortChange: (sort: string) => void;
  onClear: () => void;
  sort?: string;
  className?: string;
}

const sortOptions = [
  { value: '', label: 'Best Match' },
  { value: 'price-asc', label: 'Price Low-High' },
  { value: 'price-desc', label: 'Price High-Low' },
  { value: 'name-asc', label: 'Name A-Z' },
  { value: 'name-desc', label: 'Name Z-A' },
  { value: 'newest', label: 'Newest' },
];

export default function ProductFilters({
  categories,
  selectedCategory,
  priceRange,
  onCategoryChange,
  onPriceChange,
  onSortChange,
  onClear,
  sort = '',
  className = '',
}: ProductFiltersProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h4 className="heading-4 text-green-800 mb-3">Categories</h4>
        <ul className="space-y-1">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <button
                onClick={() => onCategoryChange(cat.slug)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedCategory === cat.slug
                    ? 'bg-green-500 text-white'
                    : 'text-neutral-600 hover:bg-beige-100'
                }`}
              >
                {cat.name}
                {cat.count !== undefined && (
                  <span className="ml-2 text-xs opacity-60">({cat.count})</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="heading-4 text-green-800 mb-3">Price Range</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => onPriceChange([Number(e.target.value), priceRange[1]])}
            placeholder="Min"
            className="input-field w-full"
          />
          <span className="text-neutral-400">-</span>
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
            placeholder="Max"
            className="input-field w-full"
          />
        </div>
      </div>

      <div>
        <h4 className="heading-4 text-green-800 mb-3">Sort By</h4>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="input-field w-full"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={onClear}
        className="text-sm text-gold-500 hover:text-gold-600 transition-colors"
      >
        Clear all filters
      </button>
    </div>
  );
}
