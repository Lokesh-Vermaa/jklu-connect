import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function getLevelColor(level: string): string {
  const map: Record<string, string> = {
    'Class': 'bg-slate-100 text-slate-700',
    'Batch': 'bg-blue-100 text-blue-700',
    'College': 'bg-indigo-100 text-indigo-700',
    'State': 'bg-green-100 text-green-700',
    'National': 'bg-orange-100 text-orange-700',
    'International': 'bg-yellow-100 text-yellow-800',
  };
  return map[level] ?? 'bg-gray-100 text-gray-700';
}

export function getCategoryColor(cat: string): string {
  const map: Record<string, string> = {
    'Technical': 'bg-purple-100 text-purple-700',
    'Sports': 'bg-green-100 text-green-700',
    'Cultural': 'bg-pink-100 text-pink-700',
    'Academic': 'bg-blue-100 text-blue-700',
    'Certifications': 'bg-yellow-100 text-yellow-800',
    'Clubs': 'bg-teal-100 text-teal-700',
    'Internships': 'bg-orange-100 text-orange-700',
    'Projects': 'bg-indigo-100 text-indigo-700',
  };
  return map[cat] ?? 'bg-gray-100 text-gray-700';
}
