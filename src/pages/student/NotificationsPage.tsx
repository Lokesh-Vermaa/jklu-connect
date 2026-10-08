import React from 'react';
import { Bell, Heart, MessageCircle, Award, Star } from 'lucide-react';
import { Avatar } from '../../components/shared/Avatar';
import { mockStudents } from '../../data/students';
import { mockAchievements } from '../../data/achievements';
import { formatDate } from '../../lib/utils';

const mockNotifications = [
  { id: 'n1', type: 'like', fromUserId: 's2', achievementId: 'a1', date: '2024-08-05' },
  { id: 'n2', type: 'mentor_review', fromUserId: 'm1', achievementId: 'a37', date: '2024-08-05' },
  { id: 'n3', type: 'like', fromUserId: 's7', achievementId: 'a1', date: '2024-08-04' },
  { id: 'n4', type: 'comment', fromUserId: 's14', achievementId: 'a1', date: '2024-08-04' },
  { id: 'n5', type: 'mentor_review', fromUserId: 'm2', achievementId: 'a4', date: '2024-07-10' },
];

const typeConfig = {
  like: { icon: Heart, color: 'text-red-500 bg-red-50', label: 'liked your achievement' },
  comment: { icon: MessageCircle, color: 'text-blue-500 bg-blue-50', label: 'commented on your achievement' },
  mentor_review: { icon: Award, color: 'text-[#12306B] bg-[#E8EEF9]', label: 'reviewed your achievement' },
};

export function NotificationsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <Bell size={22} className="text-[#12306B]" />
        <h1 className="text-xl font-bold text-[#1B2433]">Notifications</h1>
        <span className="text-xs font-bold text-white bg-[#F26A21] px-2 py-0.5 rounded-full">{mockNotifications.length}</span>
      </div>
      <div className="space-y-2">
        {mockNotifications.map(notif => {
          const config = typeConfig[notif.type as keyof typeof typeConfig];
          const fromStudent = mockStudents.find(s => s.id === notif.fromUserId);
          const achievement = mockAchievements.find(a => a.id === notif.achievementId);
          const name = fromStudent?.name ?? (notif.fromUserId.startsWith('m') ? 'Your Mentor' : 'Someone');
          const avatar = fromStudent?.avatar ?? '';
          return (
            <div key={notif.id} className="bg-white rounded-2xl border border-[#E2E8F0] p-4 flex items-start gap-3 hover:shadow-sm transition-shadow">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${config.color}`}>
                <config.icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#1B2433]">
                  <span className="font-semibold">{name}</span>{' '}
                  <span className="text-[#5B6578]">{config.label}</span>
                </p>
                {achievement && <p className="text-xs text-[#12306B] font-medium mt-0.5 truncate">"{achievement.title}"</p>}
                {notif.type === 'mentor_review' && achievement?.mentorReview && (
                  <div className="mt-2 bg-[#F5F7FB] rounded-lg px-3 py-2 text-xs text-[#5B6578]">
                    <span className="font-bold text-[#F26A21]">{achievement.mentorReview.grade}</span> — "{achievement.mentorReview.feedback}"
                  </div>
                )}
                <p className="text-xs text-[#5B6578] mt-1">{formatDate(notif.date)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
