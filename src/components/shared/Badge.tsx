import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'accent' | 'outline';
}

export function Badge({ children, className, variant = 'default' }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
      variant === 'accent' && 'bg-[#FEF0E6] text-[#F26A21]',
      variant === 'outline' && 'border border-[#E2E8F0] text-[#5B6578] bg-white',
      variant === 'default' && 'bg-[#E8EEF9] text-[#12306B]',
      className
    )}>
      {children}
    </span>
  );
}
