import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { getBatchStudents } from '../../services/mentorService';
import { getAchievementsByUser } from '../../services/achievementService';
import { submitGrade } from '../../services/mentorService';
import { User } from '../../types/user';
import { Achievement } from '../../types/achievement';
import { Avatar } from '../../components/shared/Avatar';
import { PostCard } from '../../components/feed/PostCard';
import { useAuth } from '../../contexts/AuthContext';
import { mockMentors } from '../../data/mentors';

export function BatchPage() {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const mentor = mockMentors.find(m => m.id === user?.id) ?? mockMentors[0];
  const batch = decodeURIComponent(batchId ?? '');
  const [students, setStudents] = useState<User[]>([]);
  const [selected, setSelected] = useState<User | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [gradeModal, setGradeModal] = useState<Achievement | null>(null);
  const [grade, setGrade] = useState('A');
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => { getBatchStudents(batch).then(setStudents); }, [batch]);
  useEffect(() => {
    if (selected) getAchievementsByUser(selected.id).then(setAchievements);
  }, [selected]);

  const handleGradeSubmit = async () => {
    if (!gradeModal || !grade) return;
    setSubmitting(true);
    await submitGrade({ achievementId: gradeModal.id, grade, feedback, mentorId: mentor.id, mentorName: mentor.name });
    setSuccess(true);
    setTimeout(() => { setSuccess(false); setGradeModal(null); setFeedback(''); }, 1500);
    if (selected) getAchievementsByUser(selected.id).then(setAchievements);
    setSubmitting(false);
  };

  return (
    <div className="space-y-5">
      <button onClick={() => navigate('/mentor/dashboard')} className="flex items-center gap-2 text-sm text-[#5B6578] hover:text-[#12306B] transition-colors">
        <ArrowLeft size={16} /> Back to Dashboard
      </button>
      <h1 className="text-xl font-bold text-[#1B2433]">Batch {batch}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">
        {/* Students List */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#E2E8F0]">
            <p className="text-sm font-bold text-[#1B2433]">{students.length} Students</p>
          </div>
          <div className="divide-y divide-[#E2E8F0]">
            {students.map(s => (
              <button key={s.id} onClick={() => setSelected(s)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${selected?.id === s.id ? 'bg-[#E8EEF9]' : 'hover:bg-[#F5F7FB]'}`}>
                <Avatar src={s.avatar} name={s.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1B2433] truncate">{s.name}</p>
                  <p className="text-xs text-[#5B6578]">{s.rollNo}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Achievement Review Panel */}
        <div>
          {!selected ? (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center text-[#5B6578] shadow-sm">
              <p className="text-sm">Select a student to view and review their achievements.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 flex items-center gap-3 shadow-sm">
                <Avatar src={selected.avatar} name={selected.name} size="md" />
                <div>
                  <p className="font-bold text-[#1B2433]">{selected.name}</p>
                  <p className="text-xs text-[#5B6578]">{selected.programme} · {selected.rollNo}</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-xs font-bold text-[#F26A21] bg-[#FEF0E6] px-2.5 py-1 rounded-full">{achievements.length} achievements</span>
                  <button
                    onClick={() => navigate(`/mentor/student/${selected.id}`)}
                    className="text-xs font-semibold px-3 py-1 bg-[#12306B] text-white rounded-lg hover:bg-[#0d224d] transition-colors"
                  >
                    Dedicated View
                  </button>
                </div>
              </div>
              {achievements.map(a => (
                <PostCard key={a.id} achievement={a} showMentorActions onGrade={setGradeModal} />
              ))}
              {achievements.length === 0 && <p className="text-center text-[#5B6578] py-8 text-sm">No achievements posted yet.</p>}
            </div>
          )}
        </div>
      </div>

      {/* Grade Modal */}
      {gradeModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-[#1B2433] mb-1">Grade Achievement</h2>
            <p className="text-sm text-[#5B6578] mb-4 line-clamp-2">"{gradeModal.title}"</p>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#5B6578] uppercase tracking-wide block mb-2">Grade</label>
                <div className="grid grid-cols-5 gap-2">
                  {['A+', 'A', 'B+', 'B', 'C'].map(g => (
                    <button key={g} onClick={() => setGrade(g)}
                      className={`py-2 rounded-xl border text-sm font-bold transition-all ${grade === g ? 'bg-[#12306B] text-white border-[#12306B]' : 'border-[#E2E8F0] text-[#5B6578] hover:border-[#12306B]'}`}>{g}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#5B6578] uppercase tracking-wide block mb-1.5">Feedback</label>
                <textarea value={feedback} onChange={e => setFeedback(e.target.value)} rows={3}
                  placeholder="Write constructive feedback for the student..."
                  className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#12306B]/20 resize-none" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setGradeModal(null)} className="flex-1 py-2.5 border border-[#E2E8F0] rounded-xl text-sm font-medium text-[#5B6578] hover:bg-[#F5F7FB]">Cancel</button>
                <button onClick={handleGradeSubmit} disabled={submitting || success}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${success ? 'bg-green-500 text-white' : 'bg-[#12306B] hover:bg-[#0D2254] text-white'}`}>
                  {success ? <span className="flex items-center justify-center gap-2"><CheckCircle size={16} /> Submitted!</span> : submitting ? 'Submitting...' : 'Submit Grade'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
