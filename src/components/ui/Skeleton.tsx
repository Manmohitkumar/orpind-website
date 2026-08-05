interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'image' | 'avatar' | 'card';
}

export default function Skeleton({ className = '', variant = 'text' }: SkeletonProps) {
  const baseClasses = 'skeleton';
  const variantClasses = {
    text: 'h-4 w-full rounded',
    image: 'aspect-square w-full rounded-lg',
    avatar: 'w-10 h-10 rounded-full',
    card: 'aspect-[3/4] w-full rounded-lg',
  };
  return <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} aria-hidden="true" />;
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <Skeleton variant="card" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
