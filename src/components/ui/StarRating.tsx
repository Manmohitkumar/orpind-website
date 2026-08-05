'use client';

import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showValue?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

export default function StarRating({
  rating,
  maxStars = 5,
  size = 'sm',
  interactive = false,
  onChange,
  showValue = false,
  className = '',
}: StarRatingProps) {
  const stars = Array.from({ length: maxStars }, (_, i) => i + 1);

  const handleClick = (star: number) => {
    if (interactive && onChange) onChange(star);
  };

  return (
    <div className={`inline-flex items-center gap-0.5 ${className}`} role={interactive ? 'radiogroup' : 'img'} aria-label={`${rating} out of ${maxStars} stars`}>
      {stars.map(star => {
        const filled = star <= Math.floor(rating);
        const half = !filled && star - 0.5 <= rating;
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => handleClick(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform ${sizeClasses[size]} ${filled ? 'text-gold-500 fill-gold-500' : half ? 'text-gold-500 fill-gold-500/50' : 'text-neutral-200'}`}
            role={interactive ? 'radio' : undefined}
            aria-checked={interactive ? filled : undefined}
            aria-label={interactive ? `${star} star${star > 1 ? 's' : ''}` : undefined}
          >
            <Star className="w-full h-full" />
          </button>
        );
      })}
      {showValue && (
        <span className="ml-1.5 text-xs font-semibold text-neutral-500">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
