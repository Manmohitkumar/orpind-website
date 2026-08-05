'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gold-500 text-white shadow-warm-sm hover:bg-gold-600 hover:shadow-warm-md hover:-translate-y-0.5 active:bg-gold-700 active:translate-y-0',
  secondary:
    'border-2 border-green-500 text-green-500 hover:bg-green-50 hover:border-green-600 active:bg-green-100',
  tertiary:
    'text-green-500 hover:text-gold-500 px-3',
  ghost:
    'text-green-700 border border-neutral-200 hover:bg-beige-100 hover:border-neutral-300',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs min-w-[80px]',
  md: 'px-6 py-3 text-sm min-w-[120px]',
  lg: 'px-8 py-4 text-base min-w-[160px]',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, icon, fullWidth = false, className = '', children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          inline-flex items-center justify-center font-body font-semibold tracking-wide
          transition-all duration-300 ease-out cursor-pointer
          disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500
          rounded-md
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>{children}</span>
          </span>
        ) : (
          <span className="flex items-center gap-2">
            {icon && <span className="w-5 h-5">{icon}</span>}
            {children}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
