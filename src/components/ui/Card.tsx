interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'flat' | 'elevated';
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

const variantClasses = {
  default: 'bg-white rounded-lg shadow-warm-sm overflow-hidden',
  flat: 'bg-white rounded-lg border border-beige-200 overflow-hidden',
  elevated: 'bg-white rounded-xl shadow-soft-md overflow-hidden',
};

export default function Card({ children, variant = 'default', className = '', onClick, hoverable = false }: CardProps) {
  const Component = onClick ? 'button' : 'div';
  return (
    <Component
      className={`
        ${variantClasses[variant]}
        ${hoverable ? 'transition-all duration-300 hover:shadow-warm-md hover:-translate-y-0.5' : ''}
        ${onClick ? 'cursor-pointer text-left w-full' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </Component>
  );
}
