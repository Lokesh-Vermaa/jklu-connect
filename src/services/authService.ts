import { mockStudents } from '../data/students';
import { mockMentors } from '../data/mentors';
import { User, Mentor } from '../types/user';
import { COLLEGE_DOMAIN } from '../lib/config';

const MOCK_DELAY = 400;
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'mentor' | 'admin';
  avatar: string;
  student?: User;
  mentor?: Mentor;
}

const ADMIN_CREDENTIALS = { email: 'admin@jklu.edu.in', password: 'admin123' };

export async function login(email: string, password: string): Promise<AuthUser> {
  await sleep(MOCK_DELAY);
  if (!email.endsWith(COLLEGE_DOMAIN)) throw new Error('invalid_email');
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    return { id: 'admin1', name: 'Admin', email, role: 'admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin' };
  }
  const mentor = mockMentors.find(m => m.email === email);
  if (mentor && password === 'mentor123') {
    return { id: mentor.id, name: mentor.name, email, role: 'mentor', avatar: mentor.avatar, mentor };
  }
  const student = mockStudents.find(s => s.email === email);
  if (student && password === 'student123') {
    return { id: student.id, name: student.name, email, role: 'student', avatar: student.avatar, student };
  }
  throw new Error('invalid_credentials');
}

export async function sendPasswordReset(email: string): Promise<void> {
  await sleep(MOCK_DELAY);
  if (!email.endsWith(COLLEGE_DOMAIN)) throw new Error('invalid_email');
}

export async function resetPassword(_token: string, _newPassword: string): Promise<void> {
  await sleep(MOCK_DELAY);
}
