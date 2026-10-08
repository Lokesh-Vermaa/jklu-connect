import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Award, BookOpen, BarChart2, TrendingUp, Shield } from 'lucide-react';
import { mockStudents } from '../../data/students';
import { mockAchievements } from '../../data/achievements';
import { mockMentors } from '../../data/mentors';
import { Avatar } from '../../components/shared/Avatar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const CATS = ['Technical', 'Sports', 'Cultural', 'Academic', 'Certifications', 'Internships'];
const COLORS = ['#12306B', '#F26A21', '#ec4899', '#22C55E', '#f59e0b', '#8b5cf6'];

export function AdminDashboard() {
  const navigate = useNavigate();
  const catData = CATS.map(cat => ({ cat, count: mockAchievements.filter(a => a.category === cat).length }));
  const batchData = ['2021-2025', '2022-2026', '2023-2027', '2024-2028'].map(batch => ({
    batch, students: mockStudents.filter(s => s.batch === batch).length,
    achievements: mockAchievements.filter(a => mockStudents.find(s => s.id === a.userId)?.batch === batch).length,
  }));
  const topStudents = mockStudents.map(s => ({
    student: s, count: mockAchievements.filter(a => a.userId === s.id).length,
  })).sort((a, b) => b.count - a.count).slice(0, 5);

  const stats = [
    { label: 'Total Students', value: mockStudents.length, icon: Users, color: 'text-[#12306B] bg-[#E8EEF9]' },
    { label: 'Total Achievements', value: mockAchievements.length, icon: Award, color: 'text-[#F26A21] bg-[#FEF0E6]' },
    { label: 'Mentors', value: mockMentors.length, icon: BookOpen, color: 'text-purple-600 bg-purple-50' },
    { label: 'Pending Reviews', value: mockAchievements.filter(a => !a.mentorReview).length, icon: Shield, color: 'text-green-600 bg-green-50' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1B2433]">Admin Dashboard</h1>
        <p className="text-[#5B6578] mt-1">College-wide overview of student achievements and engagement.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}><Icon size={20} /></div>
            <p className="text-2xl font-black text-[#1B2433]">{value}</p>
            <p className="text-xs text-[#5B6578] mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Category breakdown */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm">
          <h2 className="text-sm font-bold text-[#1B2433] mb-4 flex items-center gap-2"><BarChart2 size={16} className="text-[#F26A21]" /> Achievements by Category</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={catData} margin={{ left: -20 }}>
              <XAxis dataKey="cat" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', fontSize: 12 }} />
              <Bar dataKey="count" fill="#12306B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Batch breakdown */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm">
          <h2 className="text-sm font-bold text-[#1B2433] mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-[#12306B]" /> Batch-wise Activity</h2>
          <div className="space-y-3">
            {batchData.map(d => (
              <div key={d.batch}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-[#1B2433]">Batch {d.batch}</span>
                  <span className="text-[#5B6578]">{d.achievements} achievements · {d.students} students</span>
                </div>
                <div className="h-2 bg-[#F5F7FB] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#12306B] to-[#F26A21] rounded-full transition-all"
                    style={{ width: `${Math.min(100, (d.achievements / mockAchievements.length) * 100 * 2.5)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Students */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm">
        <h2 className="text-sm font-bold text-[#1B2433] mb-4">🏆 Top Achievers</h2>
        <div className="space-y-3">
          {topStudents.map(({ student, count }, i) => (
            <button key={student.id} onClick={() => navigate(`/profile/${student.id}`)}
              className="flex items-center gap-3 w-full text-left group">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${i === 0 ? 'bg-yellow-100 text-yellow-700' : i === 1 ? 'bg-slate-100 text-slate-600' : i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-[#F5F7FB] text-[#5B6578]'}`}>
                {i + 1}
              </span>
              <Avatar src={student.avatar} name={student.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1B2433] group-hover:text-[#12306B] transition-colors truncate">{student.name}</p>
                <p className="text-xs text-[#5B6578]">{student.programme} · {student.batch}</p>
              </div>
              <span className="text-sm font-black text-[#F26A21]">{count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Manage */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button onClick={() => navigate('/admin/users')}
          className="bg-[#12306B] text-white rounded-2xl p-5 text-left hover:bg-[#0D2254] transition-colors group">
          <Users size={22} className="mb-3" />
          <p className="font-bold">Manage Users</p>
          <p className="text-sm text-white/70 mt-0.5">View, activate, or deactivate student and mentor accounts</p>
        </button>
        <button className="bg-white border border-[#E2E8F0] rounded-2xl p-5 text-left hover:border-[#12306B] transition-colors group shadow-sm">
          <BarChart2 size={22} className="mb-3 text-[#F26A21]" />
          <p className="font-bold text-[#1B2433]">Achievement Reports</p>
          <p className="text-sm text-[#5B6578] mt-0.5">Download batch-wise and category-wise achievement reports</p>
        </button>
      </div>
    </div>
  );
}
