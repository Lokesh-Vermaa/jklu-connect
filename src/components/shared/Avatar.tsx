import React, { useState } from 'react';
import { cn, getInitials } from '../../lib/utils';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base font-bold',
  xl: 'w-20 h-20 text-xl font-bold',
};

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const showFallback = !src || imgError;

  return (
    <div
      className={cn(
        'rounded-full overflow-hidden shrink-0 flex items-center justify-center font-semibold select-none ring-1 ring-black/5',
        sizes[size],
        showFallback ? 'text-white' : '',
        className
      )}
      style={
        showFallback
          ? {
              background: `hsl(${(name.charCodeAt(0) * 47) % 360}, 55%, 45%)`,
            }
          : undefined
      }
    >
      {!showFallback ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover block"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      ) : (
        <span className="leading-none">{getInitials(name)}</span>
      )}
    </div>
  );
}
