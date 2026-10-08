import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { mockMentors } from '../../data/mentors';
import { mockStudents } from '../../data/students';
import { mockAchievements } from '../../data/achievements';
import { getBatchStudents } from '../../services/mentorService';
import { User } from '../../types/user';
import { Avatar } from '../../components/shared/Avatar';
import { Award, Users, BookOpen, ChevronRight } from 'lucide-react';

export function MentorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const mentor = mockMentors.find(m => m.id === user?.id) ?? mockMentors[0];
  const assignedBatches = mentor.assignedBatches;

  const totalStudents = assignedBatches.reduce((sum, batch) =>
    sum + mockStudents.filter(s => s.batch === batch).length, 0);
  const totalAchievements = mockAchievements.filter(a => {
    const student = mockStudents.find(s => s.id === a.userId);
    return student && assignedBatches.includes(student.batch);
  }).length;
  const pendingGrades = mockAchievements.filter(a => {
    const student = mockStudents.find(s => s.id === a.userId);
    return student && assignedBatches.includes(student.batch) && !a.mentorReview;
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1B2433]">Mentor Dashboard</h1>
        <p className="text-[#5B6578] mt-1">Welcome back, {mentor.name} · {mentor.department}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'My Students', value: totalStudents, icon: Users, color: 'text-[#12306B] bg-[#E8EEF9]' },
          { label: 'Total Achievements', value: totalAchievements, icon: Award, color: 'text-[#F26A21] bg-[#FEF0E6]' },
          { label: 'Pending Reviews', value: pendingGrades, icon: BookOpen, color: 'text-green-600 bg-green-50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
              <Icon size={22} />
            </div>
            <div>
              <p className="text-2xl font-black text-[#1B2433]">{value}</p>
              <p className="text-xs text-[#5B6578]">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Batches */}
      <div>
        <h2 className="text-base font-bold text-[#1B2433] mb-3">My Batches</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {assignedBatches.map(batch => {
            const batchStudents = mockStudents.filter(s => s.batch === batch);
            const batchAchievements = mockAchievements.filter(a => batchStudents.some(s => s.id === a.userId));
            const pendingCount = batchAchievements.filter(a => !a.mentorReview).length;
            return (
              <button key={batch} onClick={() => navigate(`/mentor/batch/${encodeURIComponent(batch)}`)}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm hover:shadow-md hover:border-[#12306B]/40 transition-all text-left group">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-[#1B2433] group-hover:text-[#12306B] transition-colors">Batch {batch}</h3>
                  <ChevronRight size={18} className="text-[#5B6578] group-hover:text-[#12306B] transition-colors" />
                </div>
                <div className="flex gap-4 text-sm">
                  <div><p className="font-bold text-[#12306B]">{batchStudents.length}</p><p className="text-xs text-[#5B6578]">Students</p></div>
                  <div><p className="font-bold text-[#F26A21]">{batchAchievements.length}</p><p className="text-xs text-[#5B6578]">Achievements</p></div>
                  {pendingCount > 0 && <div><p className="font-bold text-green-600">{pendingCount}</p><p className="text-xs text-[#5B6578]">To Review</p></div>}
                </div>
                <div className="flex -space-x-2 mt-3">
                  {batchStudents.slice(0, 5).map(s => <Avatar key={s.id} src={s.avatar} name={s.name} size="xs" className="ring-2 ring-white" />)}
                  {batchStudents.length > 5 && <span className="w-6 h-6 rounded-full bg-[#E8EEF9] text-[10px] font-bold text-[#12306B] flex items-center justify-center ring-2 ring-white">+{batchStudents.length - 5}</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
