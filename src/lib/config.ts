export const COLLEGE_DOMAIN = '@jklu.edu.in';
export const COLLEGE_NAME = 'JK Lakshmipat University';
export const APP_NAME = 'JKLU Connect';
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

export const PROGRAMMES = ['B.Tech CSE', 'B.Tech ECE', 'B.Tech ME', 'B.Des', 'BBA'] as const;
export const BATCHES = ['2021-2025', '2022-2026', '2023-2027', '2024-2028'] as const;

export const ACHIEVEMENT_CATEGORIES = [
  'All', 'Technical', 'Sports', 'Cultural', 'Academic', 'Certifications', 'Clubs', 'Internships', 'Projects'
] as const;

export const ACHIEVEMENT_LEVELS = ['Class', 'Batch', 'College', 'State', 'National', 'International'] as const;
