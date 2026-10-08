import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#E8EEF9] flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-[#12306B] opacity-60" />
      </div>
      <h3 className="text-lg font-semibold text-[#1B2433] mb-1">{title}</h3>
      <p className="text-sm text-[#5B6578] max-w-xs">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
