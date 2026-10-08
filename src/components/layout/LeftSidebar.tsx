import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { mockStudents } from '../../data/students';
import { mockAchievements } from '../../data/achievements';
import { Avatar } from '../shared/Avatar';
import { Award } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../shared/BrandIcons';

export function LeftSidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const student = mockStudents.find(s => s.id === user?.id);
  const myAchievements = mockAchievements.filter(a => a.userId === user?.id).length;

  if (!student) return null;

  return (
    <aside>
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        {/* Cover */}
        <div className="h-16 bg-gradient-to-r from-[#12306B] to-[#1a4a9e]" />
        <div className="px-4 pb-5">
          <div className="-mt-7 mb-3">
            <Avatar src={student.avatar} name={student.name} size="lg"
              className="ring-4 ring-white" />
          </div>
          <h3 className="font-bold text-[#1B2433] text-sm">{student.name}</h3>
          <p className="text-xs text-[#5B6578]">{student.programme} · {student.batch}</p>
          <p className="text-xs text-[#5B6578] mt-0.5">{student.rollNo}</p>
          {student.bio && <p className="text-xs text-[#5B6578] mt-2 line-clamp-2">{student.bio}</p>}

          <div className="mt-3 pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
            <div className="text-center">
              <p className="text-lg font-bold text-[#F26A21]">{myAchievements}</p>
              <p className="text-xs text-[#5B6578]">Achievements</p>
            </div>
            <div className="h-8 w-px bg-[#E2E8F0]" />
            <div className="text-center">
              <p className="text-lg font-bold text-[#12306B]">
                {student.sgpa ? (Object.values(student.sgpa).reduce((a,b)=>a+b,0)/Object.values(student.sgpa).length).toFixed(1) : '-'}
              </p>
              <p className="text-xs text-[#5B6578]">CGPA</p>
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            {student.github && (
              <a href={student.github} target="_blank" rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 border border-[#E2E8F0] rounded-lg text-[#5B6578] hover:border-[#12306B] hover:text-[#12306B] transition-all">
                <GithubIcon size={13} /> GitHub
              </a>
            )}
            {student.linkedin && (
              <a href={student.linkedin} target="_blank" rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 border border-[#E2E8F0] rounded-lg text-[#5B6578] hover:border-[#0077B5] hover:text-[#0077B5] transition-all">
                <LinkedinIcon size={13} /> LinkedIn
              </a>
            )}
          </div>

          <button onClick={() => navigate(`/profile/${student.id}`)}
            className="mt-2 w-full text-xs font-semibold text-[#12306B] bg-[#E8EEF9] py-2 rounded-lg hover:bg-[#12306B] hover:text-white transition-all duration-200">
            View Full Profile
          </button>
        </div>
      </div>
    </aside>
  );
}
