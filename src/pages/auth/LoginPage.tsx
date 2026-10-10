import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, ArrowLeft, GraduationCap, Award, Shield, Mail, Lock, Sparkles, MapPin } from 'lucide-react';
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

  // Set default placeholder credentials based on selected role
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
      badgeColor: 'bg-blue-50 text-[#12306B] border-blue-200',
    },
    mentor: {
      badge: 'Faculty Mentor Portal',
      icon: Award,
      badgeColor: 'bg-orange-50 text-[#F26A21] border-orange-200',
    },
    admin: {
      badge: 'Administrator Portal',
      icon: Shield,
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
    },
  }[selectedRole];

  const RoleIcon = roleMeta.icon;

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50 text-[#1B2433]">
      {/* ======================================================== */}
      {/* LEFT HALF: Dedicated JKLU Campus Image & University Brand */}
      {/* ======================================================== */}
      <div className="relative w-full lg:w-[52%] xl:w-[56%] min-h-[380px] lg:min-h-screen bg-[#0A1838] overflow-hidden flex flex-col justify-between p-6 sm:p-10 lg:p-12 text-white">
        {/* Campus Photograph Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/jklu_campus.jpg"
            alt="JK Lakshmipat University Campus"
            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 ease-out"
          />

          {/* Navy Gradient Overlay for High Contrast & Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1838] via-[#0A1838]/80 to-[#0A1838]/45" />
          <div className="absolute inset-0 bg-[#12306B]/20" />
        </div>

        {/* Top Header: University Crest & Identity */}
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center shadow-xl border border-white/20">
              <span className="text-[#12306B] font-black text-2xl tracking-tighter">J</span>
            </div>
            <div>
              <div className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                <span>{APP_NAME}</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-[#F26A21] text-white">
                  Official
                </span>
              </div>
              <p className="text-xs text-white/80 font-medium tracking-wide">
                {COLLEGE_NAME}
              </p>
            </div>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white/90 font-medium">
            <MapPin size={13} className="text-[#F26A21]" />
            <span>Jaipur, Rajasthan</span>
          </div>
        </div>

        {/* Center / Body: Taglines & Key Highlights */}
        <div className="relative z-10 my-auto py-8 lg:py-0 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-semibold mb-4">
            <Sparkles size={13} className="text-[#F26A21]" />
            <span>NAAC Accredited · Legacy of JK Organisation</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white mb-4">
            Where Innovation <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-amber-200 to-white">
              Meets Excellence.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-white/85 font-medium leading-relaxed max-w-lg mb-6">
            Showcase verified achievements, connect with faculty mentors, and unlock academic and research opportunities across JK Lakshmipat University.
          </p>

          {/* Quick Highlight Stats */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/15">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <div className="text-lg sm:text-xl font-black text-white">50+ Acres</div>
              <div className="text-[11px] text-white/70 font-medium">Lush Campus</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <div className="text-lg sm:text-xl font-black text-[#F26A21]">100%</div>
              <div className="text-[11px] text-white/70 font-medium">Experiential</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <div className="text-lg sm:text-xl font-black text-white">125+ Yrs</div>
              <div className="text-[11px] text-white/70 font-medium">JK Legacy</div>
            </div>
          </div>
        </div>

        {/* Bottom Left Note */}
        <div className="relative z-10 flex items-center justify-between text-xs text-white/60 pt-4 border-t border-white/10">
          <span>JK Lakshmipat University, Jaipur, Rajasthan</span>
          <a
            href="https://jklu.edu.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white underline font-medium"
          >
            jklu.edu.in ↗
          </a>
        </div>
      </div>

      {/* ======================================================== */}
      {/* RIGHT HALF: Crisp Solid White Login Box                   */}
      {/* ======================================================== */}
      <div className="w-full lg:w-[48%] xl:w-[44%] min-h-screen bg-white flex flex-col justify-center items-center p-6 sm:p-10 lg:p-12 relative">
        <div className="w-full max-w-md mx-auto">
          {/* Top Control Bar: Role Switcher & Role Badge */}
          <div className="flex items-center justify-between gap-2 pb-5 mb-6 border-b border-slate-200">
            <Link
              to="/select-role"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#12306B] hover:text-[#F26A21] transition-colors group"
            >
              <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
              <span>Switch Role</span>
            </Link>

            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${roleMeta.badgeColor}`}>
              <RoleIcon size={14} />
              <span>{roleMeta.badge}</span>
            </span>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-[#1B2433] tracking-tight">
              Sign in to your account
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
              Enter your institutional credentials ending with <strong className="text-[#12306B]">@jklu.edu.in</strong>
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="flex items-center gap-2 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl p-3 text-xs font-medium">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errors.general}</span>
              </div>
            )}

            {/* Email Container (Flexbox row — zero icon overlap) */}
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

            {/* Password Container (Flexbox row — zero icon overlap) */}
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
                  className="text-slate-400 hover:text-slate-700 shrink-0 ml-2 p-1 focus:outline-none"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#12306B] hover:bg-[#0D2254] text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 text-sm mt-3"
            >
              {loading ? 'Authenticating...' : 'Sign in →'}
            </button>
          </form>

          {/* Quick 1-Click Demo Sign In */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold text-slate-600">Quick Testing / Demo Mode</span>
              <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">1-Click</span>
            </div>
            <button
              type="button"
              onClick={() => devLogin(selectedRole)}
              className="w-full py-2.5 px-3 rounded-xl border-2 border-dashed border-[#F26A21] bg-[#FEF0E6] hover:bg-[#fddbc4] text-[#F26A21] text-xs font-bold transition-all text-center flex items-center justify-center gap-2"
            >
              <span>⚡ Enter Portal Directly as {roleMeta.badge}</span>
            </button>
          </div>

          {/* Security & Access Notice */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
            <Shield size={14} className="text-[#12306B]" />
            <span>Encrypted institutional SSO · JKLU IT Security</span>
          </div>
        </div>
      </div>
    </div>
  );
}
