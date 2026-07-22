import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Github, Twitter, Linkedin, Heart, Cpu, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-100 dark:bg-black border-t border-slate-200 dark:border-zinc-900 text-slate-700 dark:text-slate-300 pt-16 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-200 dark:border-slate-800/60">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-md">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">
                HireHub<span className="gradient-text">.AI</span>
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              Empowering engineers and top-tier tech companies through real-time AI skill matching, automated candidate scoring, and mock interview practice.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 1: Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/jobs" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Explore Jobs</Link></li>
              <li><Link to="/ai-scorer" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">AI Resume Matcher</Link></li>
              <li><Link to="/ai-interview" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">AI Mock Practice</Link></li>
              <li><Link to="/pricing" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Pricing Plans</Link></li>
            </ul>
          </div>

          {/* Col 2: For Candidates */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">For Candidates</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/candidate/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Candidate Dashboard</Link></li>
              <li><Link to="/jobs?category=Software+Engineering" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Software Jobs</Link></li>
              <li><Link to="/jobs?jobType=REMOTE" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Remote Tech Roles</Link></li>
            </ul>
          </div>

          {/* Col 3: For Recruiters */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">For Employers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/recruiter/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Post a Job</Link></li>
              <li><Link to="/pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Employer Pro Plan</Link></li>
              <li><Link to="/admin/dashboard" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Admin Governance</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="flex items-center gap-1">
            © 2026 HireHub-AI. Built for Engineers & Recruiters.
          </p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <Globe className="w-3.5 h-3.5 text-emerald-500" /> Deployable on Vercel & Render
            </span>
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <Cpu className="w-3.5 h-3.5 text-blue-500" /> Powered by Neon PostgreSQL
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
