import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Award, Star, BookOpen, AlertCircle, Send } from 'lucide-react';
import { Avatar } from '../../components/shared/Avatar';
import { Badge } from '../../components/shared/Badge';
import { getUserById } from '../../services/userService';
import { getAchievementsByUser } from '../../services/achievementService';
import { submitGrade } from '../../services/mentorService';
import { User } from '../../types/user';
import { Achievement } from '../../types/achievement';
import { getCategoryColor, getLevelColor } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';

export function StudentReviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [student, setStudent] = useState<User | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  // Grade state per achievement
  const [activeGradeId, setActiveGradeId] = useState<string | null>(null);
  const [gradeInput, setGradeInput] = useState<string>('A+');
  const [feedbackInput, setFeedbackInput] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([getUserById(id), getAchievementsByUser(id)]).then(([u, a]) => {
      setStudent(u);
      setAchievements(a);
      setLoading(false);
    });
  }, [id]);

  const handleOpenGradeModal = (achievement: Achievement) => {
    setActiveGradeId(achievement.id);
    setGradeInput(achievement.mentorReview?.grade || 'A+');
    setFeedbackInput(achievement.mentorReview?.feedback || '');
  };

  const handleSaveGrade = async (achievementId: string) => {
    if (!user) return;
    setSubmitting(true);
    try {
      await submitGrade({
        achievementId,
        mentorId: user.id,
        mentorName: user.name,
        grade: gradeInput,
        feedback: feedbackInput
      });

      setAchievements(prev =>
        prev.map(a =>
          a.id === achievementId
            ? {
                ...a,
                mentorReview: {
                  grade: gradeInput,
                  feedback: feedbackInput,
                  mentorId: user.id,
                  mentorName: user.name,
                  date: new Date().toISOString().split('T')[0]
                }
              }
            : a
        )
      );
      setActiveGradeId(null);
      setSuccessToast('Grade & feedback successfully submitted!');
      setTimeout(() => setSuccessToast(null), 3500);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-[#5B6578]">
        <div className="inline-block w-8 h-8 border-4 border-[#12306B] border-t-transparent rounded-full animate-spin mb-3" />
        <p>Loading student portfolio...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-16">
        <p className="text-[#5B6578]">Student not found.</p>
        <button
          onClick={() => navigate('/mentor/dashboard')}
          className="mt-4 px-4 py-2 bg-[#12306B] text-white rounded-xl text-sm"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const verifiedCount = achievements.filter(a => a.mentorReview).length;

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-[#12306B] hover:text-[#0d224d] transition-colors"
        >
          <ArrowLeft size={18} /> Back
        </button>
        {successToast && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-xl text-sm animate-fade-in shadow-sm">
            <CheckCircle size={16} className="text-emerald-600" />
            <span>{successToast}</span>
          </div>
        )}
      </div>

      {/* Student Overview Header Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar src={student.avatar} name={student.name} size="xl" className="ring-2 ring-[#E8EEF9]" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-[#1B2433]">{student.name}</h1>
                <Badge variant="outline">{student.rollNo}</Badge>
              </div>
              <p className="text-sm text-[#5B6578] mt-1">
                {student.programme} · Batch {student.batch}
              </p>
              <p className="text-xs text-[#5B6578] mt-0.5">{student.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-around sm:justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-[#E2E8F0]">
            <div className="text-center">
              <span className="block text-2xl font-bold text-[#12306B]">{achievements.length}</span>
              <span className="text-xs text-[#5B6578]">Submissions</span>
            </div>
            <div className="h-8 w-px bg-[#E2E8F0]" />
            <div className="text-center">
              <span className="block text-2xl font-bold text-emerald-600">{verifiedCount}</span>
              <span className="text-xs text-[#5B6578]">Reviewed</span>
            </div>
            <div className="h-8 w-px bg-[#E2E8F0]" />
            <div className="text-center">
              <span className="block text-2xl font-bold text-[#F26A21]">
                {achievements.length - verifiedCount}
              </span>
              <span className="text-xs text-[#5B6578]">Pending</span>
            </div>
          </div>
        </div>

        {student.skills && student.skills.length > 0 && (
          <div className="mt-5 pt-5 border-t border-[#E2E8F0] flex flex-wrap gap-1.5 items-center">
            <span className="text-xs font-semibold text-[#5B6578] mr-2">Skills:</span>
            {student.skills.map(s => (
              <span key={s} className="px-2.5 py-1 bg-[#F5F7FB] border border-[#E2E8F0] rounded-lg text-xs font-medium text-[#1B2433]">
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Achievement Review List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#1B2433] flex items-center gap-2">
          <Award size={20} className="text-[#F26A21]" />
          Student Achievements ({achievements.length})
        </h2>

        {achievements.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center text-[#5B6578]">
            No achievement records submitted by this student yet.
          </div>
        ) : (
          achievements.map(ach => (
            <div
              key={ach.id}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm hover:border-[#CBD5E1] transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getCategoryColor(ach.category)}`}>
                      {ach.category}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getLevelColor(ach.level)}`}>
                      {ach.level} Level
                    </span>
                    <span className="text-xs text-[#5B6578]">{ach.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1B2433]">{ach.title}</h3>
                </div>

                {ach.mentorReview ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-sm font-semibold">
                      <Star size={16} className="text-amber-500 fill-amber-500" />
                      <span>Grade: {ach.mentorReview.grade}</span>
                    </div>
                    <button
                      onClick={() => handleOpenGradeModal(ach)}
                      className="text-xs text-[#12306B] underline hover:text-[#0d224d]"
                    >
                      Edit Grade
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleOpenGradeModal(ach)}
                    className="px-4 py-2 bg-[#12306B] text-white rounded-xl text-xs font-bold hover:bg-[#0d224d] transition-colors"
                  >
                    Grade & Verify
                  </button>
                )}
              </div>

              <p className="text-sm text-[#5B6578] leading-relaxed">{ach.description}</p>

              {ach.imageUrl && (
                <div className="mt-2">
                  <img
                    src={ach.imageUrl}
                    alt={ach.title}
                    className="max-h-60 rounded-xl object-cover border border-[#E2E8F0]"
                  />
                </div>
              )}

              {ach.mentorReview?.feedback && (
                <div className="bg-[#F5F7FB] border border-[#E2E8F0] p-4 rounded-xl text-xs space-y-1">
                  <p className="font-semibold text-[#12306B]">Mentor Remarks ({ach.mentorReview.mentorName}):</p>
                  <p className="text-[#5B6578] italic">"{ach.mentorReview.feedback}"</p>
                </div>
              )}

              {/* Inline Grading Form when opened */}
              {activeGradeId === ach.id && (
                <div className="mt-4 p-5 bg-[#E8EEF9]/60 border border-[#12306B]/20 rounded-2xl space-y-4 animate-fade-in">
                  <h4 className="font-bold text-sm text-[#12306B]">
                    Evaluating: {ach.title}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                    <div>
                      <label className="block text-xs font-bold text-[#1B2433] mb-1">
                        Select Grade
                      </label>
                      <select
                        value={gradeInput}
                        onChange={e => setGradeInput(e.target.value)}
                        className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm font-semibold text-[#1B2433] focus:outline-none focus:ring-2 focus:ring-[#12306B]"
                      >
                        <option value="A+">A+ (Exceptional)</option>
                        <option value="A">A (Excellent)</option>
                        <option value="B+">B+ (Very Good)</option>
                        <option value="B">B (Good)</option>
                        <option value="C">C (Satisfactory)</option>
                        <option value="Needs Revision">Needs Revision</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-xs font-bold text-[#1B2433] mb-1">
                        Feedback / Remarks for Student
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Verified certificate from organizing committee. Outstanding performance."
                        value={feedbackInput}
                        onChange={e => setFeedbackInput(e.target.value)}
                        className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm text-[#1B2433] focus:outline-none focus:ring-2 focus:ring-[#12306B]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveGradeId(null)}
                      className="px-4 py-2 border border-[#E2E8F0] bg-white rounded-xl text-xs font-semibold text-[#5B6578] hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleSaveGrade(ach.id)}
                      className="flex items-center gap-1.5 px-5 py-2 bg-[#12306B] text-white rounded-xl text-xs font-bold hover:bg-[#0d224d] disabled:opacity-50 transition-colors shadow-sm"
                    >
                      <Send size={13} />
                      {submitting ? 'Saving...' : 'Submit Evaluation'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
