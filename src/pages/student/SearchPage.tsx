import React, { useState, useEffect } from 'react';
import { Search, X, Users, Code } from 'lucide-react';
import { Avatar } from '../../components/shared/Avatar';
import { Skeleton } from '../../components/shared/Skeleton';
import { EmptyState } from '../../components/shared/EmptyState';
import { searchUsers } from '../../services/userService';
import { User } from '../../types/user';
import { BATCHES, PROGRAMMES } from '../../lib/config';
import { useNavigate } from 'react-router-dom';
import { mockAchievements } from '../../data/achievements';

export function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [batch, setBatch] = useState('');
  const [skill, setSkill] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (query.length < 1 && !batch && !skill) { setResults([]); setSearched(false); return; }
    setLoading(true);
    const timer = setTimeout(() => {
      searchUsers(query, batch || undefined, skill || undefined).then(r => {
        setResults(r); setLoading(false); setSearched(true);
      });
    }, 350);
    return () => clearTimeout(timer);
  }, [query, batch, skill]);

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm">
        <h1 className="text-lg font-bold text-[#1B2433] mb-4">Find Students</h1>
        <div className="space-y-3">
          {/* Search input — flex row, no overlap */}
          <div className="flex items-center h-11 border-2 border-slate-200 rounded-xl bg-slate-50 focus-within:border-[#12306B] focus-within:bg-white transition-all px-3.5 gap-3">
            <Search size={17} className="text-slate-400 shrink-0" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by name, roll number, or programme..."
              className="flex-1 h-full bg-transparent border-0 outline-none text-sm text-slate-900 placeholder:text-slate-400"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-700 shrink-0">
                <X size={15} />
              </button>
            )}
          </div>

          {/* Filters row */}
          <div className="grid grid-cols-2 gap-3">
            <select
              value={batch}
              onChange={e => setBatch(e.target.value)}
              className="h-11 border-2 border-slate-200 rounded-xl px-3 text-sm bg-slate-50 text-slate-700 focus:outline-none focus:border-[#12306B] focus:bg-white transition-all"
            >
              <option value="">All Batches</option>
              {BATCHES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>

            <div className="flex items-center h-11 border-2 border-slate-200 rounded-xl bg-slate-50 focus-within:border-[#12306B] focus-within:bg-white transition-all px-3.5 gap-2.5">
              <Code size={15} className="text-slate-400 shrink-0" />
              <input
                value={skill}
                onChange={e => setSkill(e.target.value)}
                placeholder="Filter by skill..."
                className="flex-1 h-full bg-transparent border-0 outline-none text-sm text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
      ) : searched && results.length === 0 ? (
        <EmptyState icon={Users} title="No students found" description="Try a different name, skill, or batch filter." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {results.map(student => {
            const achCount = mockAchievements.filter(a => a.userId === student.id).length;
            return (
              <button key={student.id} onClick={() => navigate(`/profile/${student.id}`)}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-sm hover:shadow-md hover:border-[#12306B]/30 transition-all text-left group">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar src={student.avatar} name={student.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#1B2433] group-hover:text-[#12306B] transition-colors truncate">{student.name}</p>
                    <p className="text-xs text-[#5B6578]">{student.rollNo}</p>
                  </div>
                  <span className="text-xs font-bold text-[#F26A21] bg-[#FEF0E6] px-2 py-0.5 rounded-full">{achCount} ach.</span>
                </div>
                <p className="text-xs text-[#5B6578] mb-2">{student.programme} · {student.batch}</p>
                <div className="flex flex-wrap gap-1">
                  {student.skills.slice(0, 3).map(s => (
                    <span key={s} className="text-xs bg-[#E8EEF9] text-[#12306B] px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                  {student.skills.length > 3 && <span className="text-xs text-[#5B6578]">+{student.skills.length - 3}</span>}
                </div>
              </button>
            );
          })}
        </div>
      )}
      {!searched && !loading && (
        <div className="text-center py-12 text-[#5B6578] text-sm">Start typing to search for students...</div>
      )}
    </div>
  );
}
