import { cn } from '@/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({ className, variant = 'rectangular' }: SkeletonProps) {
  const variantStyles = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-zinc-800',
        variantStyles[variant],
        className
      )}
    />
  );
}

// Pre-built skeleton components
export function TrackSkeleton() {
  return (
    <div className="flex items-center gap-3 p-2">
      <Skeleton className="w-12 h-12 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="w-10 h-4" />
    </div>
  );
}

export function PlaylistCardSkeleton() {
  return (
    <div className="p-4">
      <Skeleton className="aspect-square w-full mb-3" />
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

export function SearchResultSkeleton() {
  return (
    <div className="flex gap-4 p-3">
      <Skeleton className="w-40 h-24 flex-shrink-0" />
      <div className="flex-1">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}
