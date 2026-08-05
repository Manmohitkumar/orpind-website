'use client';

import { Minus, Plus } from 'lucide-react';

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  className?: string;
}

export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
  className = '',
}: QuantityStepperProps) {
  const isAtMin = value <= min;
  const isAtMax = value >= max;

  const handleDecrement = () => { if (!isAtMin) onChange(value - 1); };
  const handleIncrement = () => { if (!isAtMax) onChange(value + 1); };

  const btnClass = size === 'sm'
    ? 'p-1.5 [&>svg]:w-3 [&>svg]:h-3'
    : 'p-2 [&>svg]:w-3.5 [&>svg]:h-3.5';

  const inputClass = size === 'sm' ? 'w-10 text-xs' : 'px-4 py-1 text-sm';

  return (
    <div className={`inline-flex items-center border border-neutral-200 rounded-md overflow-hidden ${className}`}>
      <button
        type="button"
        onClick={handleDecrement}
        disabled={isAtMin}
        className={`${btnClass} text-neutral-500 hover:bg-beige-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed`}
        aria-label="Decrease quantity"
      >
        <Minus />
      </button>
      <span className={`${inputClass} font-medium text-neutral-900 text-center select-none`}>
        {value}
      </span>
      <button
        type="button"
        onClick={handleIncrement}
        disabled={isAtMax}
        className={`${btnClass} text-neutral-500 hover:bg-beige-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed`}
        aria-label="Increase quantity"
      >
        <Plus />
      </button>
    </div>
  );
}
