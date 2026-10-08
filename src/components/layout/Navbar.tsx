import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, User, Search, Bell, LogOut, Menu, BarChart3 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar } from '../shared/Avatar';
import { APP_NAME } from '../../lib/config';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const navItems = user?.role === 'student' ? [
    { icon: Home, label: 'Feed', to: '/feed' },
    { icon: Search, label: 'Search', to: '/search' },
    { icon: Bell, label: 'Notifications', to: '/notifications' },
    { icon: User, label: 'Profile', to: `/profile/${user.id}` },
  ] : user?.role === 'mentor' ? [
    { icon: Home, label: 'Dashboard', to: '/mentor/dashboard' },
  ] : [
    { icon: Home, label: 'Dashboard', to: '/admin/dashboard' },
    { icon: User, label: 'Users', to: '/admin/users' },
    { icon: BarChart3, label: 'Reports', to: '/admin/reports' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to={user?.role === 'mentor' ? '/mentor/dashboard' : user?.role === 'admin' ? '/admin/dashboard' : '/feed'}
          className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#12306B] flex items-center justify-center">
            <span className="text-white font-black text-sm">J</span>
          </div>
          <span className="font-bold text-[#12306B] text-lg hidden sm:block">{APP_NAME}</span>
        </Link>

        {/* Search (desktop, student only) */}
        {user?.role === 'student' && (
          <button onClick={() => navigate('/search')}
            className="hidden md:flex flex-1 max-w-sm items-center gap-2 bg-[#F5F7FB] border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm text-[#5B6578] hover:border-[#12306B] transition-colors">
            <Search size={15} />
            Search students, skills, batches...
          </button>
        )}

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ icon: Icon, label, to }) => (
            <Link key={to} to={to}
              className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${location.pathname.startsWith(to) ? 'text-[#12306B] bg-[#E8EEF9]' : 'text-[#5B6578] hover:text-[#12306B] hover:bg-[#F5F7FB]'}`}>
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* User Menu */}
        <div className="relative flex-shrink-0">
          <button onClick={() => setMenuOpen(o => !o)} className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#F5F7FB] transition-colors">
            <Avatar src={user?.avatar} name={user?.name ?? 'User'} size="sm" />
            <span className="text-sm font-medium text-[#1B2433] hidden sm:block max-w-[100px] truncate">{user?.name}</span>
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] py-2 z-50">
              {user?.role === 'student' && (
                <Link to={`/profile/${user.id}`} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#1B2433] hover:bg-[#F5F7FB] transition-colors" onClick={() => setMenuOpen(false)}>
                  <User size={15} /> My Profile
                </Link>
              )}
              <button onClick={() => { logout(); navigate('/select-role'); setMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                <LogOut size={15} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E2E8F0] z-40 flex">
        {navItems.map(({ icon: Icon, label, to }) => (
          <Link key={to} to={to}
            className={`flex flex-col items-center gap-0.5 flex-1 py-3 text-xs font-medium transition-all ${location.pathname.startsWith(to) ? 'text-[#12306B]' : 'text-[#5B6578]'}`}>
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </header>
  );
}
