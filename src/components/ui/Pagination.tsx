'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  current: number;
  total: number;
  pageSize?: number;
  onChange: (page: number) => void;
  className?: string;
}

export default function Pagination({ current, total, pageSize = 12, onChange, className = '' }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const pages: (number | '...')[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= current - 1 && i <= current + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <nav aria-label="Pagination" className={`flex items-center justify-center gap-1 ${className}`}>
      <button
        onClick={() => onChange(current - 1)}
        disabled={current <= 1}
        className="p-2 rounded-sm text-neutral-500 hover:bg-beige-100 hover:text-green-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 py-1 text-sm text-neutral-400">...</span>
        ) : (
          <button
            key={page}
            onClick={() => onChange(page)}
            className={`min-w-[36px] h-9 flex items-center justify-center rounded-sm text-sm font-medium transition-colors
              ${page === current ? 'bg-gold-500 text-white shadow-warm-sm' : 'text-neutral-600 hover:bg-beige-100 hover:text-green-700'}
            `}
            aria-current={page === current ? 'page' : undefined}
          >
            {page}
          </button>
        )
      )}
      <button
        onClick={() => onChange(current + 1)}
        disabled={current >= totalPages}
        className="p-2 rounded-sm text-neutral-500 hover:bg-beige-100 hover:text-green-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
