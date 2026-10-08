import { mockStudents } from '../data/students';
import { User } from '../types/user';

const MOCK_DELAY = 300;
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export async function getUserById(id: string): Promise<User | null> {
  await sleep(MOCK_DELAY);
  return mockStudents.find(s => s.id === id) ?? null;
}

export async function searchUsers(query: string, batch?: string, skill?: string): Promise<User[]> {
  await sleep(MOCK_DELAY);
  const q = query.toLowerCase();
  return mockStudents.filter(s => {
    const matchesQuery = !q || s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q) || s.programme.toLowerCase().includes(q);
    const matchesBatch = !batch || s.batch === batch;
    const matchesSkill = !skill || s.skills.some(sk => sk.toLowerCase().includes(skill.toLowerCase()));
    return matchesQuery && matchesBatch && matchesSkill;
  });
}

export async function updateProfile(id: string, data: Partial<User>): Promise<User> {
  await sleep(MOCK_DELAY);
  const idx = mockStudents.findIndex(s => s.id === id);
  if (idx === -1) throw new Error('User not found');
  Object.assign(mockStudents[idx], data);
  return mockStudents[idx];
}

export async function getAllStudents(): Promise<User[]> {
  await sleep(MOCK_DELAY);
  return mockStudents;
}
