import React, { useState } from 'react';
import { Heart, MessageCircle, Award, Flag } from 'lucide-react';
import { Achievement } from '../../types/achievement';
import { mockStudents } from '../../data/students';
import { Avatar } from '../shared/Avatar';
import { cn, formatDate, getCategoryColor, getLevelColor } from '../../lib/utils';
import { likeAchievement } from '../../services/achievementService';
import { useNavigate } from 'react-router-dom';

interface PostCardProps {
  achievement: Achievement;
  showMentorActions?: boolean;
  onGrade?: (a: Achievement) => void;
}

export function PostCard({ achievement, showMentorActions, onGrade }: PostCardProps) {
  const navigate = useNavigate();
  const student = mockStudents.find(s => s.id === achievement.userId);
  const [liked, setLiked] = useState(achievement.liked ?? false);
  const [likes, setLikes] = useState(achievement.likes);

  const handleLike = async () => {
    if (!liked) {
      setLiked(true);
      setLikes(l => l + 1);
      await likeAchievement(achievement.id);
    }
  };

  if (!student) return null;

  return (
    <article className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          {/* Student Info */}
          <button
            type="button"
            className="flex items-center gap-3 text-left group min-w-0"
            onClick={() => navigate(`/profile/${student.id}`)}
          >
            <Avatar src={student.avatar} name={student.name} size="md" className="shrink-0" />
            <div className="min-w-0">
              <p className="font-semibold text-slate-900 text-sm group-hover:text-[#12306B] transition-colors truncate">
                {student.name}
              </p>
              <p className="text-xs text-slate-500 truncate">{student.programme} · {student.batch}</p>
              <p className="text-xs text-slate-400">{formatDate(achievement.date)}</p>
            </div>
          </button>

          {/* Right side: category badge + report */}
          <div className="flex items-center gap-2 shrink-0">
            <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap', getCategoryColor(achievement.category))}>
              {achievement.category}
            </span>
            <button
              type="button"
              className="text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
              title="Report"
            >
              <Flag size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3 space-y-2.5">
        <div className="flex items-start gap-2 flex-wrap">
          <h3 className="font-bold text-slate-900 text-base leading-snug flex-1 min-w-0">
            {achievement.title}
          </h3>
          <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 whitespace-nowrap', getLevelColor(achievement.level))}>
            🏆 {achievement.level}
          </span>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">{achievement.description}</p>

        {achievement.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {achievement.skills.map(skill => (
              <span key={skill} className="text-xs bg-[#E8EEF9] text-[#12306B] px-2.5 py-0.5 rounded-full font-medium">
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Image — contained with proper borders */}
      {achievement.imageUrl && (
        <div className="mx-4 mb-3 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
          <img
            src={achievement.imageUrl}
            alt={achievement.title}
            className="w-full h-52 object-cover block"
            loading="lazy"
          />
        </div>
      )}

      {/* Mentor Review badge */}
      {achievement.mentorReview && (
        <div className="mx-4 mb-3 bg-gradient-to-r from-[#E8EEF9] to-slate-50 rounded-xl p-3.5 border border-[#12306B]/10">
          <div className="flex items-center gap-2 mb-1.5">
            <Award size={14} className="text-[#12306B] shrink-0" />
            <span className="text-xs font-bold text-[#12306B]">Faculty Verified</span>
            <span className="ml-auto text-xs font-black text-white bg-[#F26A21] px-2.5 py-0.5 rounded-full">
              {achievement.mentorReview.grade}
            </span>
          </div>
          <p className="text-xs text-slate-600 italic leading-relaxed">"{achievement.mentorReview.feedback}"</p>
          <p className="text-xs text-slate-400 mt-1">— {achievement.mentorReview.mentorName}</p>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleLike}
            className={cn(
              'flex items-center gap-1.5 text-sm font-semibold transition-all duration-200',
              liked ? 'text-red-500' : 'text-slate-500 hover:text-red-500'
            )}
          >
            <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
            <span>{likes}</span>
          </button>
          <button type="button" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#12306B] transition-colors font-semibold">
            <MessageCircle size={16} />
            <span>{achievement.comments.length}</span>
          </button>
        </div>

        {showMentorActions && !achievement.mentorReview && onGrade && (
          <button
            type="button"
            onClick={() => onGrade(achievement)}
            className="text-xs font-bold text-[#12306B] border-2 border-[#12306B] rounded-lg px-3 py-1.5 hover:bg-[#12306B] hover:text-white transition-all duration-200"
          >
            Grade This
          </button>
        )}
        {showMentorActions && achievement.mentorReview && (
          <span className="text-xs text-emerald-600 font-bold">✓ Graded</span>
        )}
      </div>
    </article>
  );
}
