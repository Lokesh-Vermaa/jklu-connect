export type UserRole = 'student' | 'mentor' | 'admin';
export type Programme = 'B.Tech CSE' | 'B.Tech ECE' | 'B.Tech ME' | 'B.Des' | 'BBA';
export type Batch = '2021-2025' | '2022-2026' | '2023-2027' | '2024-2028';

export interface User {
  id: string;
  name: string;
  email: string;
  rollNo: string;
  programme: Programme;
  batch: Batch;
  role: UserRole;
  avatar: string;
  bio: string;
  skills: string[];
  github?: string;
  linkedin?: string;
  coverImage?: string;
  sgpa: Record<string, number>; // semester -> sgpa
  totalAchievements?: number;
}

export interface Mentor {
  id: string;
  name: string;
  email: string;
  avatar: string;
  department: string;
  assignedBatches: string[];
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  avatar: string;
}
