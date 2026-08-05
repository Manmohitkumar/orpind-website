'use client';

import { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export default function Dropdown({ options, value, onChange, placeholder = 'Select...', label, error, disabled = false, className = '' }: DropdownProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find(o => o.value === value);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label htmlFor={id} className="input-label">{label}</label>}
      <div ref={ref} className="relative">
        <button
          id={id}
          type="button"
          disabled={disabled}
          onClick={() => setOpen(!open)}
          className={`w-full flex items-center justify-between px-4 py-3 bg-white border-2 rounded-md text-sm text-left transition-all duration-200
            ${error ? 'border-semantic-error focus:border-semantic-error focus:ring-semantic-error/15' : 'border-neutral-200 focus:border-gold-500 focus:ring-[3px] focus:ring-gold-500/15'}
            ${disabled ? 'opacity-40 cursor-not-allowed bg-neutral-50' : 'hover:border-neutral-300 cursor-pointer'}
            ${selected ? 'text-neutral-900' : 'text-neutral-400 italic'}
          `}
        >
          <span>{selected ? selected.label : placeholder}</span>
          <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-neutral-200 rounded-md shadow-soft-md animate-fade-in max-h-60 overflow-y-auto">
            {options.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange?.(opt.value); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-beige-50 hover:text-gold-600
                  ${opt.value === value ? 'bg-gold-50 text-gold-600 font-medium' : 'text-neutral-700'}
                `}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <p className="input-error-text">{error}</p>}
    </div>
  );
}
