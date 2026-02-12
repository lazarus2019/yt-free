import { cn } from '@/utils';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
  className?: string;
}

export function Avatar({
  src,
  alt = 'Avatar',
  size = 'md',
  fallback,
  className,
}: AvatarProps) {
  const sizeStyles = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const getFallbackInitials = () => {
    if (fallback) return fallback.slice(0, 2).toUpperCase();
    if (alt) return alt.slice(0, 2).toUpperCase();
    return '?';
  };

  if (!src) {
    return (
      <div
        className={cn(
          'rounded-full bg-zinc-700 flex items-center justify-center font-medium text-zinc-300',
          sizeStyles[size],
          className
        )}
      >
        {getFallbackInitials()}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn('rounded-full object-cover', sizeStyles[size], className)}
      onError={(e) => {
        // Hide broken image and show fallback
        e.currentTarget.style.display = 'none';
      }}
    />
  );
}
