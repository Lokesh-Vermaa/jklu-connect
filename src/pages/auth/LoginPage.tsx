import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, ArrowLeft, GraduationCap, Award, Shield, Mail, Lock } from 'lucide-react';
import { login as loginService } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import { validateCollegeEmail, validatePassword } from '../../lib/validators';
import { COLLEGE_NAME, APP_NAME, COLLEGE_DOMAIN } from '../../lib/config';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedRole = (searchParams.get('role') as 'student' | 'mentor' | 'admin') || 'student';

  const { login, setDevRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);

  // Set default placeholder email based on selected role
  useEffect(() => {
    if (selectedRole === 'mentor') {
      setEmail('dr.kapoor@jklu.edu.in');
      setPassword('Pass123!');
    } else if (selectedRole === 'admin') {
      setEmail('admin@jklu.edu.in');
      setPassword('Pass123!');
    } else {
      setEmail('aarav.sharma@jklu.edu.in');
      setPassword('Pass123!');
    }
  }, [selectedRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailErr = validateCollegeEmail(email);
    const pwdErr = validatePassword(password);
    if (emailErr || pwdErr) {
      setErrors({ email: emailErr ?? undefined, password: pwdErr ?? undefined });
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const user = await loginService(email, password);
      login(user);
      if (user.role === 'mentor') navigate('/mentor/dashboard');
      else if (user.role === 'admin') navigate('/admin/dashboard');
      else navigate('/feed');
    } catch (err: any) {
      const msg = err.message;
      if (msg === 'invalid_email') setErrors({ email: `Email must end with ${COLLEGE_DOMAIN}` });
      else if (msg === 'invalid_credentials') setErrors({ general: 'Invalid email or password.' });
      else setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const devLogin = (role: 'student' | 'mentor' | 'admin') => {
    setDevRole(role);
    if (role === 'mentor') navigate('/mentor/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
    else navigate('/feed');
  };

  const roleMeta = {
    student: {
      badge: 'Student Portal',
      icon: GraduationCap,
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    },
    mentor: {
      badge: 'Faculty Mentor Portal',
      icon: Award,
      badgeColor: 'bg-orange-100 text-[#F26A21] border-orange-300',
    },
    admin: {
      badge: 'Administrator Portal',
      icon: Shield,
      badgeColor: 'bg-slate-200 text-[#12306B] border-slate-400',
    },
  }[selectedRole];

  const RoleIcon = roleMeta.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#12306B] via-[#1a4a9e] to-[#0D2254] flex flex-col justify-center items-center p-4 sm:p-6 relative select-none">
      {/* Decorative ambient glowing circles */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#F26A21]/20 blur-3xl pointer-events-none" />

      {/* Header outside card */}
      <div className="relative z-10 text-center max-w-lg mb-6 space-y-1.5">
        <div className="flex items-center justify-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg">
            <span className="text-[#12306B] font-black text-xl">J</span>
          </div>
          <span className="text-2xl font-black text-white tracking-tight">{APP_NAME}</span>
        </div>
        <p className="text-xs sm:text-sm text-white/80 font-medium">
          {COLLEGE_NAME} · Official Campus Talent Portal
        </p>
      </div>

      {/* Main Solid White Box with Clear Visible Boundaries */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl border-2 border-slate-200 p-6 sm:p-8 text-[#1B2433]">
        {/* Top Control Bar: Role Switcher & Active Role Badge */}
        <div className="flex items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-200">
          <Link
            to="/select-role"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#12306B] hover:text-[#F26A21] transition-colors"
          >
            <ArrowLeft size={15} />
            <span>Switch Role</span>
          </Link>

          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${roleMeta.badgeColor}`}>
            <RoleIcon size={14} />
            <span>{roleMeta.badge}</span>
          </span>
        </div>

        {/* Card Title */}
        <div className="mb-5">
          <h1 className="text-2xl font-extrabold text-[#1B2433]">Sign in</h1>
          <p className="text-xs text-slate-500 mt-1">
            Enter your institutional credentials ending with <strong className="text-[#12306B]">@jklu.edu.in</strong>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="flex items-center gap-2 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl p-3 text-xs font-medium">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          {/* Email Container - Flexbox layout prevents any overlapping */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5" htmlFor="email-input">
              University Email ID
            </label>
            <div
              className={`flex items-center w-full h-12 px-3.5 rounded-xl border-2 bg-slate-50 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-[#12306B]/20 ${
                errors.email
                  ? 'border-red-400 bg-red-50/30'
                  : 'border-slate-300 focus-within:border-[#12306B]'
              }`}
            >
              <Mail size={18} className="text-slate-400 shrink-0 mr-3" />
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={`rollno${COLLEGE_DOMAIN}`}
                autoComplete="email"
                className="w-full h-full bg-transparent border-0 outline-none p-0 text-sm font-medium text-slate-900 placeholder:text-slate-400"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle size={13} />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          {/* Password Container - Flexbox layout prevents any overlapping */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800" htmlFor="password-input">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-[#12306B] hover:underline font-bold">
                Forgot password?
              </Link>
            </div>
            <div
              className={`flex items-center w-full h-12 px-3.5 rounded-xl border-2 bg-slate-50 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-[#12306B]/20 ${
                errors.password
                  ? 'border-red-400 bg-red-50/30'
                  : 'border-slate-300 focus-within:border-[#12306B]'
              }`}
            >
              <Lock size={18} className="text-slate-400 shrink-0 mr-3" />
              <input
                id="password-input"
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full h-full bg-transparent border-0 outline-none p-0 text-sm font-medium text-slate-900 placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="text-slate-400 hover:text-slate-700 shrink-0 ml-2 p-1"
                aria-label={showPwd ? 'Hide password' : 'Show password'}
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle size={13} />
                <span>{errors.password}</span>
              </p>
            )}
          </div>

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#12306B] hover:bg-[#0D2254] text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 text-sm mt-3"
          >
            {loading ? 'Authenticating...' : 'Sign in →'}
          </button>
        </form>

        {/* 1-Click Quick Demo Sign In */}
        <div className="mt-5 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => devLogin(selectedRole)}
            className="w-full py-2.5 px-3 rounded-xl border-2 border-dashed border-[#F26A21] bg-[#FEF0E6] hover:bg-[#fddbc4] text-[#F26A21] text-xs font-bold transition-all text-center"
          >
            ⚡ Quick 1-Click Sign In (as {selectedRole})
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center text-xs text-white/60 mt-6">
        <p>Restricted to verified @jklu.edu.in university members</p>
      </footer>
    </div>
  );
}
