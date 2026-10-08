import React, { useState } from 'react';
import { Search, Users, Award, ArrowLeft } from 'lucide-react';
import { mockStudents } from '../../data/students';
import { mockAchievements } from '../../data/achievements';
import { Avatar } from '../../components/shared/Avatar';
import { useNavigate } from 'react-router-dom';
import { PROGRAMMES, BATCHES } from '../../lib/config';

export function AdminUsersPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [batchFilter, setBatchFilter] = useState('');
  const [progFilter, setProgFilter] = useState('');

  const filtered = mockStudents.filter(s => {
    const q = query.toLowerCase();
    return (!q || s.name.toLowerCase().includes(q) || s.rollNo.includes(q))
      && (!batchFilter || s.batch === batchFilter)
      && (!progFilter || s.programme === progFilter);
  });

  return (
    <div className="space-y-5">
      <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-2 text-sm text-[#5B6578] hover:text-[#12306B] transition-colors">
        <ArrowLeft size={16} /> Back to Dashboard
      </button>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#1B2433] flex items-center gap-2"><Users size={20} /> All Students</h1>
        <span className="text-sm text-[#5B6578]">{filtered.length} of {mockStudents.length}</span>
      </div>
      {/* Filters */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5B6578]" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search students..."
            className="w-full border border-[#E2E8F0] rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#12306B]/20" />
        </div>
        <select value={batchFilter} onChange={e => setBatchFilter(e.target.value)} className="border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm bg-white text-[#5B6578] focus:outline-none">
          <option value="">All Batches</option>
          {BATCHES.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <select value={progFilter} onChange={e => setProgFilter(e.target.value)} className="border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm bg-white text-[#5B6578] focus:outline-none">
          <option value="">All Programmes</option>
          {PROGRAMMES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F5F7FB] border-b border-[#E2E8F0]">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-bold text-[#5B6578] uppercase tracking-wide">Student</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-[#5B6578] uppercase tracking-wide">Roll No</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-[#5B6578] uppercase tracking-wide">Programme</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-[#5B6578] uppercase tracking-wide">Batch</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-[#5B6578] uppercase tracking-wide">Achievements</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-[#5B6578] uppercase tracking-wide">CGPA</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-[#5B6578] uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filtered.map(s => {
                const achCount = mockAchievements.filter(a => a.userId === s.id).length;
                const sgpaVals = Object.values(s.sgpa ?? {});
                const cgpa = sgpaVals.length ? (sgpaVals.reduce((a, b) => a + b, 0) / sgpaVals.length).toFixed(1) : '-';
                return (
                  <tr key={s.id} className="hover:bg-[#F5F7FB] transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar src={s.avatar} name={s.name} size="sm" />
                        <span className="font-medium text-[#1B2433]">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#5B6578]">{s.rollNo}</td>
                    <td className="px-4 py-3 text-[#5B6578]">{s.programme}</td>
                    <td className="px-4 py-3 text-[#5B6578]">{s.batch}</td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-[#F26A21]">{achCount}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-bold ${parseFloat(cgpa) >= 9 ? 'text-green-600' : parseFloat(cgpa) >= 8 ? 'text-[#12306B]' : 'text-[#F26A21]'}`}>{cgpa}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => navigate(`/profile/${s.id}`)}
                        className="text-xs font-semibold text-[#12306B] hover:underline">View Profile</button>
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
