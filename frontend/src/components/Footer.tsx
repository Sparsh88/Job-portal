import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Linkedin, Cpu, Globe } from 'lucide-react';

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
              <a
                href="https://wa.me/917088951914"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                title="WhatsApp: 7088951914"
                className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.1-.476-.15-.676.15-.2.3-.777.979-.952 1.18-.175.2-.351.226-.652.075-.3-.15-1.267-.467-2.413-1.488-.893-.796-1.496-1.78-1.672-2.08-.175-.301-.019-.464.132-.614.135-.135.301-.351.451-.527.15-.175.2-.301.301-.501.1-.2.05-.376-.025-.526-.075-.15-.676-1.63-.927-2.233-.244-.588-.493-.508-.676-.517-.175-.009-.376-.009-.576-.009-.2 0-.526.075-.802.376-.276.301-1.052 1.028-1.052 2.507 0 1.479 1.077 2.908 1.227 3.109.15.2 2.12 3.238 5.136 4.541.717.31 1.277.495 1.713.633.72.228 1.376.196 1.895.118.578-.087 1.78-.727 2.03-1.43.25-.702.25-1.304.175-1.43-.075-.125-.276-.2-.577-.35zM12.042 21.942H12.04a9.904 9.904 0 0 1-5.048-1.385l-.362-.215-3.75 1.228 1.255-3.655-.236-.376a9.923 9.923 0 0 1-1.52-5.279c0-5.474 4.455-9.928 9.933-9.928a9.88 9.88 0 0 1 7.025 2.91 9.873 9.873 0 0 1 2.904 7.026c-.004 5.475-4.459 9.929-9.939 9.929zM12.04 0C5.402 0 0 5.402 0 12.04c0 2.12.553 4.185 1.603 6.007L0 24l6.136-1.569a12.003 12.003 0 0 0 5.904 1.542h.005c6.638 0 12.04-5.402 12.04-12.04A12.04 12.04 0 0 0 12.04 0z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/sparshchauhan050"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                title="Instagram: sparshchauhan050"
                className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:text-pink-500 dark:hover:text-pink-400 hover:bg-pink-500/10 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://linkedin.com/in/sparshchauhan08"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn: sparshchauhan08"
                className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-600/10 transition-colors"
              >
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
