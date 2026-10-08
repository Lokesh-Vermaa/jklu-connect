import { Mentor } from '../types/user';

export const mockMentors: Mentor[] = [
  {
    id: 'm1', name: 'Dr. Rajesh Kumar', email: 'rajesh.kumar@jklu.edu.in',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RajeshK',
    department: 'Computer Science', assignedBatches: ['2021-2025', '2022-2026'],
  },
  {
    id: 'm2', name: 'Prof. Sunita Rao', email: 'sunita.rao@jklu.edu.in',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SunitaR',
    department: 'Computer Science', assignedBatches: ['2022-2026', '2023-2027'],
  },
  {
    id: 'm3', name: 'Prof. Anand Meena', email: 'anand.meena@jklu.edu.in',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AnandM',
    department: 'Electronics', assignedBatches: ['2021-2025', '2023-2027'],
  },
  {
    id: 'm4', name: 'Dr. Priya Sharma', email: 'priya.sharma@jklu.edu.in',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaS',
    department: 'Management', assignedBatches: ['2022-2026', '2024-2028'],
  },
];

export interface CampusEvent {
  id: string;
  title: string;
  date: string;
  category: string;
  registrationLink?: string;
}

export const campusEvents: CampusEvent[] = [
  { id: 'e1', title: 'Praveg Cultural Fest 2025', date: '2025-03-15', category: 'Cultural' },
  { id: 'e2', title: 'TechXcelerate Hackathon', date: '2025-03-22', category: 'Technical' },
  { id: 'e3', title: 'Annual Sports Meet 2025', date: '2025-04-05', category: 'Sports' },
  { id: 'e4', title: 'Career Fair & Placement Drive', date: '2025-04-18', category: 'Career' },
  { id: 'e5', title: 'Research Symposium 2025', date: '2025-05-01', category: 'Academic' },
];
