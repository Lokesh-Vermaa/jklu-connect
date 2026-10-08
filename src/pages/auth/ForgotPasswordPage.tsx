import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { COLLEGE_DOMAIN, APP_NAME } from '../../lib/config';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.toLowerCase().endsWith(COLLEGE_DOMAIN)) {
      setError(`Please enter your official university email ending with ${COLLEGE_DOMAIN}`);
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-8 space-y-6">
        <Link to="/login" className="inline-flex items-center gap-2 text-xs font-bold text-[#12306B] hover:underline">
          <ArrowLeft size={16} /> Back to Sign In
        </Link>

        <div>
          <div className="w-12 h-12 bg-[#12306B] text-white rounded-2xl flex items-center justify-center font-black text-xl mb-4">
            J
          </div>
          <h1 className="text-2xl font-black text-[#1B2433]">Reset Password</h1>
          <p className="text-sm text-[#5B6578] mt-1">
            Enter your university email to receive password recovery instructions.
          </p>
        </div>

        {submitted ? (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
              <CheckCircle size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-emerald-900">Recovery Link Sent!</p>
                <p className="text-xs text-emerald-700 mt-1">
                  We've sent a password reset token to <b>{email}</b>. Please check your university inbox.
                </p>
              </div>
            </div>

            <Link
              to="/login"
              className="block w-full text-center py-3 bg-[#12306B] text-white rounded-xl text-sm font-bold hover:bg-[#0d224d] transition-colors"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#1B2433] mb-1.5">
                University Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5B6578]" />
                <input
                  type="email"
                  placeholder={`rollno${COLLEGE_DOMAIN}`}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#F5F7FB] border border-[#E2E8F0] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#1B2433] focus:outline-none focus:ring-2 focus:ring-[#12306B] transition-all"
                />
              </div>
              <p className="text-[11px] text-[#5B6578] mt-1">
                Must be an active @jklu.edu.in account
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#12306B] text-white rounded-xl text-sm font-bold hover:bg-[#0d224d] transition-colors shadow-sm"
            >
              Send Password Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
