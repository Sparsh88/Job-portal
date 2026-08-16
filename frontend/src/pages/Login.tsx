import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import { Briefcase, Lock, Mail, ArrowRight, User, Building2, ShieldCheck, Sparkles } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState<Role>('JOB_SEEKER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);
    try {
      const loggedUser = await login(email, password, selectedRole);
      if (loggedUser.role !== selectedRole) {
        throw new Error(`Access denied: This account cannot log in through the ${selectedRole.replace('_', ' ')} portal.`);
      }
      if (loggedUser.role === 'ADMIN') navigate('/admin/dashboard');
      else if (loggedUser.role === 'RECRUITER') navigate('/recruiter/dashboard');
      else navigate('/candidate/dashboard');
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || error.message || 'Invalid email or password credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getRoleTheme = () => {
    switch (selectedRole) {
      case 'ADMIN':
        return {
          glow: 'glow-amber',
          border: 'border-amber-500/40',
          badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-500 dark:text-amber-400',
          btnBg: 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-500/25',
          iconColor: 'text-amber-500 dark:text-amber-400',
          focusRing: 'focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50',
          title: 'Admin Command Center',
          subtitle: 'Sign in to govern platform metrics, users, and moderation queue.',
        };
      case 'RECRUITER':
        return {
          glow: 'glow-purple',
          border: 'border-purple-500/40',
          badgeBg: 'bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400',
          btnBg: 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-500/25',
          iconColor: 'text-purple-600 dark:text-purple-400',
          focusRing: 'focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50',
          title: 'Recruiter Hiring Portal',
          subtitle: 'Sign in to manage active jobs, inspect AI candidate scores & schedule interviews.',
        };
      default:
        return {
          glow: 'glow-blue',
          border: 'border-blue-500/40',
          badgeBg: 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400',
          btnBg: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/25',
          iconColor: 'text-blue-600 dark:text-blue-400',
          focusRing: 'focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50',
          title: 'Candidate Career Hub',
          subtitle: 'Sign in to calculate AI match scores, track applications & practice mock interviews.',
        };
    }
  };

  const theme = getRoleTheme();

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background Animated Floating Ambient Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px] pointer-events-none animate-float" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none animate-float-delayed" />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse-glow" />

      {/* Main Glassmorphism Animated Card Container */}
      <div
        className={`w-full max-w-md glass-card p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 ${theme.glow} shadow-2xl transition-all duration-500 relative z-10 animate-fade-in-up`}
      >
        {/* Top Logo & Header */}
        <div className="text-center space-y-3 mb-6">
          <div
            className={`w-14 h-14 rounded-2xl ${theme.badgeBg} border flex items-center justify-center mx-auto transition-transform duration-500 hover:scale-110 shadow-lg`}
          >
            {selectedRole === 'ADMIN' ? (
              <ShieldCheck className="w-7 h-7" />
            ) : selectedRole === 'RECRUITER' ? (
              <Building2 className="w-7 h-7" />
            ) : (
              <Briefcase className="w-7 h-7" />
            )}
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-2">
              <span>{theme.title}</span>
              <Sparkles className={`w-4 h-4 ${theme.iconColor} animate-pulse`} />
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
              {theme.subtitle}
            </p>
          </div>
        </div>

        {/* Role Selection Interactive Tabs */}
        <div className="grid grid-cols-3 gap-1.5 bg-slate-100 dark:bg-slate-900/90 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800/80 mb-6 shadow-inner">
          <button
            type="button"
            onClick={() => setSelectedRole('JOB_SEEKER')}
            className={`py-2 px-1 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-300 ${
              selectedRole === 'JOB_SEEKER'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-[1.02]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800/60'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Candidate
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('RECRUITER')}
            className={`py-2 px-1 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-300 ${
              selectedRole === 'RECRUITER'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30 scale-[1.02]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Recruiter
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('ADMIN')}
            className={`py-2 px-1 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-300 ${
              selectedRole === 'ADMIN'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/30 scale-[1.02]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin
          </button>
        </div>

        {/* Error Notification Alert */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 rounded-xl text-xs text-center font-medium animate-fade-in-up">
            {errorMessage}
          </div>
        )}

        {/* Login Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {selectedRole === 'ADMIN'
                ? 'Admin Email Address'
                : selectedRole === 'RECRUITER'
                ? 'Recruiter Corporate Email'
                : 'Candidate Email Address'}
            </label>
            <div className="relative group">
              <Mail className={`w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:${theme.iconColor} transition-colors absolute left-3.5 top-3.5`} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  selectedRole === 'ADMIN'
                    ? 'Enter admin email (e.g. sparshchauhan050@gmail.com)'
                    : selectedRole === 'RECRUITER'
                    ? 'Enter recruiter corporate email...'
                    : 'Enter candidate email...'
                }
                className={`w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none ${theme.focusRing} transition-all duration-300`}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
            <div className="relative group">
              <Lock className={`w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:${theme.iconColor} transition-colors absolute left-3.5 top-3.5`} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className={`w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none ${theme.focusRing} transition-all duration-300`}
              />
            </div>
          </div>

          {/* Submit Button with Gradient & Shimmer */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 font-bold text-sm rounded-xl text-white transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 ${theme.btnBg}`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Authenticating Credentials...</span>
              </div>
            ) : (
              <>
                <span>Sign In as {selectedRole.replace('_', ' ')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800/80">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline transition-colors">
            Register Candidate Account
          </Link>
        </div>
      </div>
    </div>
  );
};
