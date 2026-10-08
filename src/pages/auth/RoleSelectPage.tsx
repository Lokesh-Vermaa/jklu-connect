import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Award, Shield } from 'lucide-react';
import { APP_NAME, COLLEGE_NAME } from '../../lib/config';

interface RoleOption {
  id: 'student' | 'mentor' | 'admin';
  title: string;
  subtitle: string;
  icon: React.ElementType;
  gradient: string;
  borderColor: string;
  hoverGlow: string;
}

const ROLES: RoleOption[] = [
  {
    id: 'student',
    title: 'Student',
    subtitle: 'Portfolio & Wins',
    icon: GraduationCap,
    gradient: 'from-blue-600 to-indigo-600',
    borderColor: 'hover:border-blue-500',
    hoverGlow: 'hover:shadow-blue-500/25',
  },
  {
    id: 'mentor',
    title: 'Faculty / Mentor',
    subtitle: 'Batches & Grades',
    icon: Award,
    gradient: 'from-[#F26A21] to-amber-600',
    borderColor: 'hover:border-[#F26A21]',
    hoverGlow: 'hover:shadow-[#F26A21]/25',
  },
  {
    id: 'admin',
    title: 'Admin',
    subtitle: 'Campus Supervision',
    icon: Shield,
    gradient: 'from-slate-700 to-[#12306B]',
    borderColor: 'hover:border-slate-500',
    hoverGlow: 'hover:shadow-slate-500/25',
  },
];

export function RoleSelectPage() {
  const navigate = useNavigate();

  const handleSelect = (roleId: 'student' | 'mentor' | 'admin') => {
    navigate(`/login?role=${roleId}`);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col justify-center items-center p-6 relative overflow-hidden select-none">
      {/* Ambient background glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#F26A21]/15 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

      {/* Main Centered Container */}
      <div className="relative z-10 w-full max-w-3xl text-center">
        {/* Brand pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 backdrop-blur-md mb-4">
          <span className="w-2 h-2 rounded-full bg-[#F26A21]" />
          <span>{APP_NAME} · {COLLEGE_NAME}</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-2">
          Who are you?
        </h1>
        <p className="text-sm text-slate-400 mb-10">
          Click your role to access your personalized portal
        </p>

        {/* 3 Moderately Sized Clickable Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-2xl mx-auto">
          {ROLES.map(role => {
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => handleSelect(role.id)}
                className={`group bg-slate-900/90 backdrop-blur-xl rounded-2xl border-2 border-slate-800 ${role.borderColor} p-6 sm:p-7 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer shadow-lg ${role.hoverGlow} hover:-translate-y-2 hover:scale-[1.03] text-center`}
              >
                {/* Icon box */}
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.gradient} flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon size={32} strokeWidth={2.2} />
                </div>

                {/* Role Title */}
                <span className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-colors block">
                  {role.title}
                </span>

                {/* Subtitle */}
                <span className="text-xs text-slate-400 mt-1 block">
                  {role.subtitle}
                </span>
              </button>
            );
          })}
        </div>

        {/* Subtle footer info */}
        <p className="text-xs text-slate-500 mt-10">
          Protected institutional access for <code>@jklu.edu.in</code> accounts
        </p>
      </div>
    </div>
  );
}
