import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps { className?: string; }

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('animate-pulse rounded-lg bg-[#E8EEF9]', className)} />;
}

export function PostCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E2E8F0] space-y-4">
      <div className="flex gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-40 w-full rounded-xl" />
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E2E8F0]">
      <Skeleton className="h-32 w-full rounded-none" />
      <div className="p-6 space-y-4">
        <Skeleton className="w-20 h-20 rounded-full -mt-12" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
