import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Briefcase, Sparkles, LogOut, Menu, X, ShieldCheck, Zap, Bot, Sun, Moon, GraduationCap } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-slate-300 dark:border-zinc-800 bg-white/95 dark:bg-black/90 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                HireHub<span className="gradient-text">.AI</span>
              </span>
              <span className="text-[10px] tracking-widest text-blue-700 dark:text-blue-400 font-bold uppercase -mt-1">
                AI Career Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/jobs"
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 ${
                isActive('/jobs') && !location.search.includes('tab=courses')
                  ? 'bg-blue-600/15 text-blue-700 dark:text-blue-400 border border-blue-500/40 shadow-sm'
                  : 'text-slate-800 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-zinc-800/80'
              }`}
            >
              Browse Jobs
            </Link>

            <Link
              to="/jobs?tab=courses"
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-1.5 ${
                location.search.includes('tab=courses')
                  ? 'bg-purple-600/15 text-purple-600 dark:text-purple-400 border border-purple-500/30 shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800/80'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
              Tech Courses
            </Link>

            <Link
              to="/ai-scorer"
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-1.5 ${
                isActive('/ai-scorer')
                  ? 'bg-purple-600/15 text-purple-600 dark:text-purple-400 border border-purple-500/30 shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800/80'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400 animate-pulse" />
              AI Resume Scorer
            </Link>

            <Link
              to="/ai-interview"
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-1.5 ${
                isActive('/ai-interview')
                  ? 'bg-cyan-600/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800/80'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              AI Mock Interview
            </Link>

            <Link
              to="/pricing"
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-1.5 ${
                isActive('/pricing')
                  ? 'bg-amber-600/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800/80'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              Pricing
            </Link>

            {/* Role Specific Dashboards */}
            {user?.role === 'JOB_SEEKER' && (
              <Link
                to="/candidate/dashboard"
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95 ${
                  isActive('/candidate/dashboard')
                    ? 'bg-blue-600/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                    : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800/80'
                }`}
              >
                My Applications
              </Link>
            )}

            {user?.role === 'RECRUITER' && (
              <Link
                to="/recruiter/dashboard"
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95 ${
                  isActive('/recruiter/dashboard')
                    ? 'bg-blue-600/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                    : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800/80'
                }`}
              >
                Recruiter Portal
              </Link>
            )}

            {user?.role === 'ADMIN' && (
              <Link
                to="/admin/dashboard"
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95 text-amber-600 dark:text-amber-400 flex items-center gap-1 ${
                  isActive('/admin/dashboard')
                    ? 'bg-amber-600/20 border border-amber-500/40'
                    : 'hover:bg-amber-50 dark:hover:bg-amber-950/40'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Dashboard
              </Link>
            )}
          </nav>

          {/* Theme Toggle & User Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-900 text-amber-500 dark:text-amber-400 hover:scale-110 hover:rotate-180 transition-all duration-500 border border-slate-300 dark:border-zinc-800 shadow-sm"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 hover:scale-105 transition-all">
                  <img
                    src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-7 h-7 rounded-full border border-blue-500/40"
                  />
                  <div className="flex flex-col text-left leading-tight">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[120px]">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono">
                      {user.role.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="p-2 text-slate-500 dark:text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all hover:scale-110 active:scale-95"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-all hover:scale-105"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-blue-500/20 btn-interactive active:scale-95 transition-all duration-300"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu & Theme Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-amber-500 dark:text-amber-400"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 dark:text-slate-400 hover:text-black dark:hover:text-white rounded-lg bg-slate-100 dark:bg-slate-800/50"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-black px-4 pt-3 pb-6 space-y-2 animate-fade-in-up">
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Browse Jobs
          </Link>
          <Link
            to="/jobs?tab=courses"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
          >
            <GraduationCap className="w-4 h-4 text-purple-500" />
            Tech Courses (3 per Domain)
          </Link>
          <Link
            to="/ai-scorer"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            AI Resume Scorer
          </Link>
          <Link
            to="/ai-interview"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            AI Mock Interview
          </Link>
          <Link
            to="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-amber-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Pricing Plans
          </Link>
          {user ? (
            <>
              {user.role === 'JOB_SEEKER' && (
                <Link
                  to="/candidate/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Candidate Dashboard
                </Link>
              )}
              {user.role === 'RECRUITER' && (
                <Link
                  to="/recruiter/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Recruiter Dashboard
                </Link>
              )}
              {user.role === 'ADMIN' && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-amber-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Admin Portal
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                  navigate('/login');
                }}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
              >
                Log Out ({user.name})
              </button>
            </>
          ) : (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center rounded-lg text-sm font-medium text-white bg-blue-600"
              >
                Register Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
