'use client';

import { useId } from 'react';

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  indeterminate?: boolean;
  error?: string;
  className?: string;
}

export default function Checkbox({ checked = false, onChange, label, disabled = false, indeterminate = false, error, className = '' }: CheckboxProps) {
  const id = useId();
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={id} className={`inline-flex items-start gap-3 cursor-pointer group ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}>
        <span className="relative mt-0.5 flex-shrink-0">
          <input
            id={id}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={e => onChange?.(e.target.checked)}
            className="peer sr-only"
          />
          <span className={`w-5 h-5 block rounded border-2 transition-all duration-200 
            ${checked || indeterminate ? 'bg-gold-500 border-gold-500' : 'border-neutral-300 group-hover:border-gold-400 bg-white'}
            ${disabled ? '' : 'peer-focus-visible:ring-[3px] peer-focus-visible:ring-gold-500/15'}
          `}>
            {indeterminate ? (
              <svg viewBox="0 0 20 20" className="w-full h-full text-white">
                <rect x="5" y="9" width="10" height="2" rx="1" fill="currentColor" />
              </svg>
            ) : checked ? (
              <svg viewBox="0 0 20 20" className="w-full h-full text-white animate-scale-in">
                <path d="M5 10l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : null}
          </span>
        </span>
        {label && <span className="text-sm text-neutral-700 select-none pt-0.5">{label}</span>}
      </label>
      {error && <p className="text-xs text-semantic-error ml-8">{error}</p>}
    </div>
  );
}
