import { mockAchievements } from '../data/achievements';
import { mockStudents } from '../data/students';
import { Achievement, AchievementCategory, AchievementLevel } from '../types/achievement';

const MOCK_DELAY = 400;
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export interface FeedFilters {
  category?: AchievementCategory | 'All';
  batch?: string;
  programme?: string;
}

export async function getFeed(filters?: FeedFilters): Promise<Achievement[]> {
  await sleep(MOCK_DELAY);
  let results = [...mockAchievements].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  if (filters?.category && filters.category !== 'All') {
    results = results.filter(a => a.category === filters.category);
  }
  return results;
}

export async function getAchievementsByUser(userId: string): Promise<Achievement[]> {
  await sleep(MOCK_DELAY);
  return mockAchievements.filter(a => a.userId === userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function createAchievement(data: Omit<Achievement, 'id' | 'likes' | 'comments'>): Promise<Achievement> {
  await sleep(MOCK_DELAY);
  const newAchievement: Achievement = { ...data, id: `a${Date.now()}`, likes: 0, comments: [] };
  mockAchievements.unshift(newAchievement);
  return newAchievement;
}

export async function likeAchievement(id: string): Promise<void> {
  await sleep(200);
  const idx = mockAchievements.findIndex(a => a.id === id);
  if (idx !== -1) { mockAchievements[idx].likes++; mockAchievements[idx].liked = true; }
}

export async function getStats(): Promise<Record<string, number>> {
  await sleep(MOCK_DELAY);
  const cats: Record<string, number> = {};
  for (const a of mockAchievements) { cats[a.category] = (cats[a.category] ?? 0) + 1; }
  return cats;
}

export async function getBatchAchievements(batch: string): Promise<Achievement[]> {
  await sleep(MOCK_DELAY);
  return mockAchievements.filter(a => {
    const s = mockStudents.find((s) => s.id === a.userId);
    return s?.batch === batch;
  });
}
