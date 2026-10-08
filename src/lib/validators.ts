import { COLLEGE_DOMAIN } from './config';

export function validateCollegeEmail(email: string): string | null {
  if (!email) return 'Email is required';
  if (!email.endsWith(COLLEGE_DOMAIN)) return `Email must end with ${COLLEGE_DOMAIN}`;
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  return null;
}

export function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
  return { score, label: labels[score - 1] ?? 'Weak', color: colors[score - 1] ?? 'bg-red-500' };
}
