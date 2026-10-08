import { mockMentors } from '../data/mentors';
import { mockStudents } from '../data/students';
import { mockAchievements } from '../data/achievements';
import { Mentor } from '../types/user';
import { User } from '../types/user';
import { Achievement } from '../types/achievement';

const MOCK_DELAY = 400;
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export async function getMentorById(id: string): Promise<Mentor | null> {
  await sleep(MOCK_DELAY);
  return mockMentors.find(m => m.id === id) ?? null;
}

export async function getBatchStudents(batch: string): Promise<User[]> {
  await sleep(MOCK_DELAY);
  return mockStudents.filter(s => s.batch === batch);
}

export async function getStudentAchievementsForReview(studentId: string): Promise<Achievement[]> {
  await sleep(MOCK_DELAY);
  return mockAchievements.filter(a => a.userId === studentId);
}

export interface GradeData { achievementId: string; grade: string; feedback: string; mentorId: string; mentorName: string; }
export async function submitGrade(data: GradeData): Promise<void> {
  await sleep(MOCK_DELAY);
  const idx = mockAchievements.findIndex(a => a.id === data.achievementId);
  if (idx !== -1) {
    mockAchievements[idx].mentorReview = {
      mentorId: data.mentorId, mentorName: data.mentorName,
      grade: data.grade, feedback: data.feedback, date: new Date().toISOString().split('T')[0],
    };
  }
}
