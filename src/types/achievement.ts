export type AchievementCategory =
  | 'Technical'
  | 'Sports'
  | 'Cultural'
  | 'Academic'
  | 'Certifications'
  | 'Clubs'
  | 'Internships'
  | 'Projects';

export type AchievementLevel = 'Class' | 'Batch' | 'College' | 'State' | 'National' | 'International';

export interface Achievement {
  id: string;
  userId: string;
  category: AchievementCategory;
  title: string;
  description: string;
  date: string;
  level: AchievementLevel;
  imageUrl?: string;
  skills: string[];
  likes: number;
  comments: Comment[];
  mentorReview?: MentorReview;
  liked?: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  date: string;
}

export interface MentorReview {
  mentorId: string;
  mentorName: string;
  grade: string;
  feedback: string;
  date: string;
}
