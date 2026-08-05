'use client';

import { useId } from 'react';

interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export default function Toggle({ checked = false, onChange, label, disabled = false, size = 'md', className = '' }: ToggleProps) {
  const id = useId();
  const isMd = size === 'md';
  const trackW = isMd ? 'w-11' : 'w-8';
  const trackH = isMd ? 'h-6' : 'h-5';
  const dotSize = isMd ? 'w-4 h-4' : 'w-3 h-3';
  const dotOn = isMd ? 'translate-x-5' : 'translate-x-3';

  return (
    <label htmlFor={id} className={`inline-flex items-center gap-3 cursor-pointer group ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${className}`}>
      <span className="relative flex-shrink-0">
        <input
          id={id}
          type="checkbox"
          role="switch"
          checked={checked}
          disabled={disabled}
          onChange={e => onChange?.(e.target.checked)}
          className="peer sr-only"
        />
        <span className={`block ${trackW} ${trackH} rounded-full transition-colors duration-200 ${checked ? 'bg-gold-500' : 'bg-neutral-300 group-hover:bg-neutral-400'}`}>
          <span className={`block ${dotSize} bg-white rounded-full shadow-sm transition-transform duration-200 ${checked ? dotOn : 'translate-x-0.5'} mt-0.5 ml-0.5`} />
        </span>
      </span>
      {label && <span className="text-sm text-neutral-700 select-none">{label}</span>}
    </label>
  );
}
