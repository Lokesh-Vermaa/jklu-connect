import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { ACHIEVEMENT_CATEGORIES, ACHIEVEMENT_LEVELS } from '../../lib/config';
import { createAchievement } from '../../services/achievementService';
import { Achievement, AchievementCategory, AchievementLevel } from '../../types/achievement';
import { useAuth } from '../../contexts/AuthContext';

interface CreatePostModalProps {
  onClose: () => void;
  onCreated: (a: Achievement) => void;
}

const inputCls =
  'w-full h-11 border-2 border-slate-200 rounded-xl px-4 text-sm text-slate-900 bg-slate-50 placeholder:text-slate-400 focus:outline-none focus:border-[#12306B] focus:bg-white transition-all';

export function CreatePostModal({ onClose, onCreated }: CreatePostModalProps) {
  const { user } = useAuth();
  const [category, setCategory] = useState<AchievementCategory>('Technical');
  const [level, setLevel] = useState<AchievementLevel>('College');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      setSkills(s => [...s, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title || !description) return;
    setLoading(true);
    try {
      const achievement = await createAchievement({
        userId: user.id, category, title, description, date, level, skills, liked: false,
      });
      onCreated(achievement);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
          <h2 className="text-base font-bold text-slate-900">Share an Achievement</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body — Scrollable */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {/* Category chips */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {(ACHIEVEMENT_CATEGORIES.filter(c => c !== 'All') as AchievementCategory[]).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`text-xs px-3 py-1.5 rounded-lg border-2 font-semibold transition-all ${
                    category === cat
                      ? 'bg-[#12306B] text-white border-[#12306B]'
                      : 'border-slate-200 text-slate-600 hover:border-[#12306B] hover:text-[#12306B]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              placeholder="e.g. Winner – Smart India Hackathon 2024"
              className={inputCls}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              rows={3}
              placeholder="Describe your achievement in detail..."
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 bg-slate-50 placeholder:text-slate-400 focus:outline-none focus:border-[#12306B] focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Date & Level */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Level
              </label>
              <select
                value={level}
                onChange={e => setLevel(e.target.value as AchievementLevel)}
                className="w-full h-11 border-2 border-slate-200 rounded-xl px-3 text-sm text-slate-900 bg-slate-50 focus:outline-none focus:border-[#12306B] focus:bg-white transition-all"
              >
                {ACHIEVEMENT_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Skill Tags <span className="text-slate-400 normal-case font-medium">(press Enter to add)</span>
            </label>
            <input
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={addSkill}
              placeholder="e.g. React, Python, Leadership..."
              className={inputCls}
            />
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {skills.map(s => (
                  <span
                    key={s}
                    onClick={() => setSkills(sk => sk.filter(x => x !== s))}
                    className="inline-flex items-center gap-1 text-xs bg-[#E8EEF9] text-[#12306B] px-2.5 py-1 rounded-full cursor-pointer hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
                  >
                    {s} <X size={11} />
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Certificate / Image
            </label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-5 cursor-pointer hover:border-[#12306B] hover:bg-slate-50 transition-colors group">
              <Upload size={22} className="text-slate-400 group-hover:text-[#12306B] mb-2 transition-colors" />
              <span className="text-xs text-slate-500 font-medium">Click to upload (JPG, PNG, PDF)</span>
              <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" />
            </label>
          </div>
        </form>

        {/* Modal Footer — always visible */}
        <div className="px-6 py-4 border-t border-slate-200 shrink-0">
          <button
            type="submit"
            form=""
            onClick={handleSubmit as any}
            disabled={loading || !title || !description}
            className="w-full h-11 bg-[#12306B] hover:bg-[#0D2254] text-white font-bold rounded-xl transition-colors disabled:opacity-50 text-sm shadow-md"
          >
            {loading ? 'Posting...' : 'Post Achievement'}
          </button>
        </div>
      </div>
    </div>
  );
}
