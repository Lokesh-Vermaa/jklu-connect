import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Edit, Award, BookOpen, FileCheck } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../../components/shared/BrandIcons';
import { Avatar } from '../../components/shared/Avatar';
import { Badge } from '../../components/shared/Badge';
import { PostCard } from '../../components/feed/PostCard';
import { ProfileSkeleton, PostCardSkeleton } from '../../components/shared/Skeleton';
import { getUserById } from '../../services/userService';
import { getAchievementsByUser } from '../../services/achievementService';
import { User } from '../../types/user';
import { Achievement } from '../../types/achievement';
import { useAuth } from '../../contexts/AuthContext';
import { getCategoryColor, getLevelColor } from '../../lib/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

type Tab = 'achievements' | 'academics' | 'certificates';

export function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('achievements');
  const isOwnProfile = user?.id === id;

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([getUserById(id), getAchievementsByUser(id)]).then(([u, a]) => {
      setProfile(u); setAchievements(a); setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="space-y-4"><ProfileSkeleton /><PostCardSkeleton /></div>;
  if (!profile) return <div className="text-center py-20 text-[#5B6578]">Profile not found.</div>;

  const sgpaEntries = Object.entries(profile.sgpa ?? {});
  const cgpa = sgpaEntries.length ? (sgpaEntries.reduce((s, [, v]) => s + v, 0) / sgpaEntries.length).toFixed(2) : '-';
  const certAchievements = achievements.filter(a => a.category === 'Certifications');
  const categoryStats = ['Technical', 'Sports', 'Cultural', 'Academic', 'Certifications', 'Internships', 'Projects', 'Clubs'].map(cat => ({
    cat, count: achievements.filter(a => a.category === cat).length,
  })).filter(x => x.count > 0);

  const tabs = [
    { key: 'achievements', label: 'Achievements', icon: Award },
    { key: 'academics', label: 'Academics', icon: BookOpen },
    { key: 'certificates', label: 'Certificates', icon: FileCheck },
  ];

  return (
    <div className="space-y-5">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        {/* Cover */}
        <div className="h-36 bg-gradient-to-r from-[#12306B] via-[#1a4a9e] to-[#F26A21]/40 relative">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        </div>
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4">
            <Avatar src={profile.avatar} name={profile.name} size="xl" className="ring-4 ring-white shadow-xl" />
            <div className="flex items-center gap-2 mt-10">
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noreferrer"
                  className="p-2 border border-[#E2E8F0] rounded-xl text-[#5B6578] hover:text-[#12306B] hover:border-[#12306B] transition-all">
                  <GithubIcon size={18} />
                </a>
              )}
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noreferrer"
                  className="p-2 border border-[#E2E8F0] rounded-xl text-[#5B6578] hover:text-[#0077B5] hover:border-[#0077B5] transition-all">
                  <LinkedinIcon size={18} />
                </a>
              )}
              {isOwnProfile && (
                <button className="flex items-center gap-1.5 px-4 py-2 border border-[#12306B] text-[#12306B] rounded-xl text-sm font-semibold hover:bg-[#12306B] hover:text-white transition-all">
                  <Edit size={15} /> Edit Profile
                </button>
              )}
            </div>
          </div>

          <h1 className="text-2xl font-bold text-[#1B2433]">{profile.name}</h1>
          <p className="text-[#5B6578] text-sm mt-0.5">{profile.programme} · {profile.batch} · {profile.rollNo}</p>
          {profile.bio && <p className="text-[#5B6578] text-sm mt-3 leading-relaxed max-w-lg">{profile.bio}</p>}

          {profile.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {profile.skills.map(s => (
                <span key={s} className="text-xs bg-[#E8EEF9] text-[#12306B] px-2.5 py-1 rounded-full font-medium">{s}</span>
              ))}
            </div>
          )}

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-[#E2E8F0]">
            <div className="text-center">
              <p className="text-2xl font-black text-[#F26A21]">{achievements.length}</p>
              <p className="text-xs text-[#5B6578]">Total Achievements</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-[#12306B]">{cgpa}</p>
              <p className="text-xs text-[#5B6578]">CGPA</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-green-600">{achievements.filter(a => a.mentorReview).length}</p>
              <p className="text-xs text-[#5B6578]">Mentor Reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="flex border-b border-[#E2E8F0]">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key as Tab)}
              className={`flex items-center gap-2 flex-1 px-4 py-3.5 text-sm font-semibold transition-all border-b-2 ${tab === key ? 'border-[#12306B] text-[#12306B] bg-[#E8EEF9]/50' : 'border-transparent text-[#5B6578] hover:text-[#12306B]'}`}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {tab === 'achievements' && (
            <div className="space-y-4">
              {categoryStats.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-[#1B2433] mb-3">Achievement Breakdown</h3>
                  <ResponsiveContainer width="100%" height={140}>
                    <BarChart data={categoryStats} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <XAxis dataKey="cat" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: 12 }} />
                      <Bar dataKey="count" fill="#12306B" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
              {achievements.map(a => <PostCard key={a.id} achievement={a} />)}
              {achievements.length === 0 && <p className="text-center text-[#5B6578] py-8 text-sm">No achievements yet.</p>}
            </div>
          )}

          {tab === 'academics' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#1B2433]">Semester-wise Performance</h3>
                <span className="text-sm font-bold text-[#F26A21]">CGPA: {cgpa}</span>
              </div>
              {sgpaEntries.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={sgpaEntries.map(([sem, sgpa]) => ({ sem, sgpa }))} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <XAxis dataKey="sem" tick={{ fontSize: 10 }} />
                      <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: 12 }} />
                      <Bar dataKey="sgpa" fill="#F26A21" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                    {sgpaEntries.map(([sem, sgpa]) => (
                      <div key={sem} className="bg-[#F5F7FB] rounded-xl p-3 text-center border border-[#E2E8F0]">
                        <p className="text-xs text-[#5B6578] font-medium">{sem}</p>
                        <p className={`text-xl font-black mt-0.5 ${sgpa >= 9 ? 'text-green-600' : sgpa >= 8 ? 'text-[#12306B]' : 'text-[#F26A21]'}`}>{sgpa}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : <p className="text-center text-[#5B6578] py-8 text-sm">No academic records available.</p>}
            </div>
          )}

          {tab === 'certificates' && (
            <div className="space-y-4">
              {certAchievements.length > 0
                ? certAchievements.map(a => <PostCard key={a.id} achievement={a} />)
                : <p className="text-center text-[#5B6578] py-8 text-sm">No certificates posted yet.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
