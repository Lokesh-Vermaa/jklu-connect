import React, { useState } from 'react';
import { ArrowLeft, Download, Filter, BarChart3, Award, Users, BookOpen, CheckCircle } from 'lucide-react';
import { mockStudents } from '../../data/students';
import { mockAchievements } from '../../data/achievements';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

export function AdminReportsPage() {
  const [selectedBatch, setSelectedBatch] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // Filtered achievements
  const filteredAchievements = mockAchievements.filter(a => {
    const student = mockStudents.find(s => s.id === a.userId);
    const matchBatch = selectedBatch === 'All' || student?.batch === selectedBatch;
    const matchCategory = selectedCategory === 'All' || a.category === selectedCategory;
    return matchBatch && matchCategory;
  });

  // Category distribution
  const categories = ['Technical', 'Sports', 'Cultural', 'Academic', 'Certifications', 'Internships', 'Projects', 'Clubs'];
  const categoryData = categories.map(cat => ({
    name: cat,
    count: mockAchievements.filter(a => a.category === cat).length
  })).filter(c => c.count > 0);

  // Batch comparison
  const batches = ['2021-2025', '2022-2026', '2023-2027', '2024-2028'];
  const batchData = batches.map(b => ({
    batch: b,
    achievements: mockAchievements.filter(a => {
      const s = mockStudents.find(st => st.id === a.userId);
      return s?.batch === b;
    }).length,
    students: mockStudents.filter(s => s.batch === b).length
  }));

  const COLORS = ['#12306B', '#F26A21', '#10B981', '#6366F1', '#EC4899', '#8B5CF6', '#F59E0B', '#06B6D4'];

  const handleExportCSV = () => {
    setDownloadNotice('Generating CSV export: jklu_achievements_report.csv');
    setTimeout(() => {
      setDownloadNotice(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1B2433]">College Talent & Achievement Reports</h1>
          <p className="text-sm text-[#5B6578] mt-1">
            Aggregated institutional talent analytics across departments, batches, and achievement categories.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#12306B] text-white rounded-xl text-sm font-semibold hover:bg-[#0d224d] transition-colors shadow-sm w-fit"
        >
          <Download size={16} />
          Export Report (.CSV)
        </button>
      </div>

      {downloadNotice && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm shadow-sm animate-fade-in">
          <CheckCircle size={16} className="text-emerald-600" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm">
          <p className="text-xs text-[#5B6578] font-medium">Total Registered</p>
          <p className="text-3xl font-black text-[#12306B] mt-1">{mockStudents.length}</p>
          <p className="text-xs text-emerald-600 mt-1 font-semibold">100% Verified JKLU IDs</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm">
          <p className="text-xs text-[#5B6578] font-medium">Total Achievements</p>
          <p className="text-3xl font-black text-[#F26A21] mt-1">{mockAchievements.length}</p>
          <p className="text-xs text-[#5B6578] mt-1">Across 8 Categories</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm">
          <p className="text-xs text-[#5B6578] font-medium">Mentor Evaluations</p>
          <p className="text-3xl font-black text-indigo-600 mt-1">
            {mockAchievements.filter(a => a.mentorReview).length}
          </p>
          <p className="text-xs text-[#5B6578] mt-1">Faculty Graded</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm">
          <p className="text-xs text-[#5B6578] font-medium">National / State Level</p>
          <p className="text-3xl font-black text-emerald-600 mt-1">
            {mockAchievements.filter(a => a.level === 'National' || a.level === 'State' || a.level === 'International').length}
          </p>
          <p className="text-xs text-emerald-600 mt-1 font-semibold">High Impact Honours</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
          <h3 className="font-bold text-[#1B2433] text-base mb-1">Achievements by Category</h3>
          <p className="text-xs text-[#5B6578] mb-6">Distribution across Technical, Sports, Academic & Cultural domains</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#12306B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Batch Participation */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
          <h3 className="font-bold text-[#1B2433] text-base mb-1">Batch Activity Comparison</h3>
          <p className="text-xs text-[#5B6578] mb-6">Achievement submissions recorded by academic batch</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={batchData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="batch" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="achievements" fill="#F26A21" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Filterable Table Section */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-[#1B2433] text-base">Detailed Achievement Records</h3>
            <p className="text-xs text-[#5B6578] mt-0.5">Filter by batch and talent categories</p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedBatch}
              onChange={e => setSelectedBatch(e.target.value)}
              className="bg-[#F5F7FB] border border-[#E2E8F0] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#1B2433] focus:outline-none focus:ring-2 focus:ring-[#12306B]"
            >
              <option value="All">All Batches</option>
              {batches.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="bg-[#F5F7FB] border border-[#E2E8F0] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#1B2433] focus:outline-none focus:ring-2 focus:ring-[#12306B]"
            >
              <option value="All">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F5F7FB] border-b border-[#E2E8F0] text-xs font-semibold text-[#5B6578]">
              <tr>
                <th className="px-6 py-3">Student Name</th>
                <th className="px-6 py-3">Batch & Roll No</th>
                <th className="px-6 py-3">Achievement Title</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Level</th>
                <th className="px-6 py-3">Mentor Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredAchievements.map(ach => {
                const student = mockStudents.find(s => s.id === ach.userId);
                return (
                  <tr key={ach.id} className="hover:bg-[#F5F7FB]/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-[#1B2433]">
                      {student?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-xs text-[#5B6578]">
                      <div>{student?.batch}</div>
                      <div className="text-[11px] text-[#8892A2]">{student?.rollNo}</div>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate text-[#1B2433]">
                      {ach.title}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E8EEF9] text-[#12306B]">
                        {ach.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-[#1B2433]">
                      {ach.level}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {ach.mentorReview ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                          Grade {ach.mentorReview.grade}
                        </span>
                      ) : (
                        <span className="text-[#8892A2] italic">Pending</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
