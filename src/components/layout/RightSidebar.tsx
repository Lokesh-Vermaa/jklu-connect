import React from 'react';
import { campusEvents } from '../../data/mentors';
import { mockAchievements } from '../../data/achievements';
import { mockStudents } from '../../data/students';
import { CalendarDays, TrendingUp } from 'lucide-react';
import { Avatar } from '../shared/Avatar';
import { formatDate } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

export function RightSidebar() {
  const navigate = useNavigate();
  // Top 3 students by achievements count
  const topStudents = mockStudents
    .map(s => ({ student: s, count: mockAchievements.filter(a => a.userId === s.id).length }))
    .sort((a, b) => b.count - a.count).slice(0, 4);

  return (
    <aside className="space-y-4">
      {/* Trending */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="text-[#F26A21]" />
          <h3 className="font-bold text-[#1B2433] text-sm">Trending in Your Batch</h3>
        </div>
        <div className="space-y-3">
          {topStudents.map(({ student, count }) => (
            <button key={student.id} onClick={() => navigate(`/profile/${student.id}`)}
              className="flex items-center gap-3 w-full text-left group">
              <Avatar src={student.avatar} name={student.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1B2433] group-hover:text-[#12306B] transition-colors truncate">{student.name}</p>
                <p className="text-xs text-[#5B6578]">{student.programme}</p>
              </div>
              <span className="text-xs font-bold text-[#F26A21] bg-[#FEF0E6] px-2 py-0.5 rounded-full flex-shrink-0">{count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays size={16} className="text-[#12306B]" />
          <h3 className="font-bold text-[#1B2433] text-sm">Upcoming Events</h3>
        </div>
        <div className="space-y-3">
          {campusEvents.map(event => (
            <div key={event.id} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#E8EEF9] flex flex-col items-center justify-center">
                <span className="text-[10px] font-bold text-[#12306B] leading-none">
                  {new Date(event.date).toLocaleDateString('en-IN', { day: '2-digit' })}
                </span>
                <span className="text-[9px] text-[#5B6578] uppercase">
                  {new Date(event.date).toLocaleDateString('en-IN', { month: 'short' })}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#1B2433] leading-tight">{event.title}</p>
                <p className="text-xs text-[#F26A21] font-medium">{event.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
