import React, { useState, useEffect } from 'react';
import { Plus, Filter } from 'lucide-react';
import { PostCard } from '../../components/feed/PostCard';
import { CreatePostModal } from '../../components/feed/CreatePostModal';
import { PostCardSkeleton } from '../../components/shared/Skeleton';
import { EmptyState } from '../../components/shared/EmptyState';
import { getFeed } from '../../services/achievementService';
import { Achievement, AchievementCategory } from '../../types/achievement';
import { ACHIEVEMENT_CATEGORIES, BATCHES, PROGRAMMES } from '../../lib/config';
import { useAuth } from '../../contexts/AuthContext';
import { mockStudents } from '../../data/students';
import { Avatar } from '../../components/shared/Avatar';

export function FeedPage() {
  const { user } = useAuth();
  const student = mockStudents.find(s => s.id === user?.id);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState<AchievementCategory | 'All'>('All');

  useEffect(() => {
    setLoading(true);
    getFeed({ category: activeCategory }).then(data => {
      setAchievements(data);
      setLoading(false);
    });
  }, [activeCategory]);

  return (
    <div className="space-y-4">
      {/* Create Post Box */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-sm">
        <div
          onClick={() => setShowModal(true)}
          className="flex items-center gap-3 w-full text-left group cursor-pointer"
        >
          <Avatar src={student?.avatar} name={student?.name ?? 'User'} size="md" />
          <div className="flex-1 bg-[#F5F7FB] group-hover:bg-[#E8EEF9] border border-[#E2E8F0] group-hover:border-[#12306B] rounded-xl px-4 py-2.5 text-sm text-[#5B6578] transition-all duration-200">
            Share an achievement, certificate, or win... 🏆
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
            className="flex-shrink-0 bg-[#F26A21] hover:bg-[#d95d1c] text-white rounded-xl p-2.5 transition-colors shadow-lg shadow-[#F26A21]/20"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {ACHIEVEMENT_CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat as AchievementCategory | 'All')}
            className={`flex-shrink-0 text-xs font-semibold px-4 py-2 rounded-full border transition-all duration-200 ${activeCategory === cat ? 'bg-[#12306B] text-white border-[#12306B] shadow-md' : 'bg-white text-[#5B6578] border-[#E2E8F0] hover:border-[#12306B] hover:text-[#12306B]'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Feed */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <PostCardSkeleton key={i} />)}
        </div>
      ) : achievements.length === 0 ? (
        <EmptyState icon={Filter} title="No achievements found" description="Try a different category filter or be the first to post!" />
      ) : (
        <div className="space-y-4">
          {achievements.map(a => <PostCard key={a.id} achievement={a} />)}
        </div>
      )}

      {showModal && <CreatePostModal onClose={() => setShowModal(false)} onCreated={a => setAchievements(prev => [a, ...prev])} />}
    </div>
  );
}
