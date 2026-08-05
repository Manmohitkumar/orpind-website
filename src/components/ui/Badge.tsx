interface BadgeProps {
  children: React.ReactNode;
  variant?: 'organic' | 'new' | 'bestseller' | 'sale' | 'outline' | 'default';
  className?: string;
}

const variantClasses = {
  organic: 'bg-green-500 text-white',
  new: 'bg-gold-500 text-white',
  bestseller: 'bg-brown-500 text-white',
  sale: 'bg-semantic-error text-white',
  outline: 'border border-green-500 text-green-500 bg-transparent',
  default: 'bg-beige-200 text-green-700',
};

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-sm ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
