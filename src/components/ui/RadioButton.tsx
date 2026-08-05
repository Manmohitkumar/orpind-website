'use client';

import { useId } from 'react';

interface RadioButtonProps {
  checked?: boolean;
  onChange?: () => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  name?: string;
  value?: string;
  className?: string;
}

export default function RadioButton({ checked = false, onChange, label, description, disabled = false, name, value, className = '' }: RadioButtonProps) {
  const id = useId();
  return (
    <label htmlFor={id} className={`inline-flex items-start gap-3 cursor-pointer group ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${className}`}>
      <span className="relative mt-0.5 flex-shrink-0">
        <input
          id={id}
          type="radio"
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          name={name}
          value={value}
          className="peer sr-only"
        />
        <span className={`w-5 h-5 block rounded-full border-2 transition-all duration-200 flex items-center justify-center
          ${checked ? 'border-gold-500' : 'border-neutral-300 group-hover:border-gold-400 bg-white'}
          ${disabled ? '' : 'peer-focus-visible:ring-[3px] peer-focus-visible:ring-gold-500/15'}
        `}>
          {checked && <span className="w-2.5 h-2.5 rounded-full bg-gold-500 animate-scale-in" />}
        </span>
      </span>
      <span className="flex flex-col pt-0.5">
        {label && <span className="text-sm text-neutral-700 select-none">{label}</span>}
        {description && <span className="text-xs text-neutral-500 mt-0.5">{description}</span>}
      </span>
    </label>
  );
}
