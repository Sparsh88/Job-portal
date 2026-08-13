import React from 'react';
import { Link } from 'react-router-dom';
import { Job } from '../types';
import { AIMatchBadge } from './AIMatchBadge';
import { MapPin, DollarSign, Briefcase, Building2, Star, ArrowUpRight } from 'lucide-react';

interface JobCardProps {
  job: Job;
  onQuickApply?: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onQuickApply }) => {
  const formattedSalary = `$${(job.salaryMin / 1000).toFixed(0)}k - $${(job.salaryMax / 1000).toFixed(0)}k / yr`;

  return (
    <div className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group border border-slate-300 dark:border-zinc-800/80 hover:border-blue-600 dark:hover:border-blue-500/50 transition-all duration-300 shadow-md">
      {job.isFeatured && (
        <div className="absolute top-0 right-0">
          <div className="bg-gradient-to-l from-amber-500 to-orange-500 text-white dark:text-[#0b0f19] text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-md flex items-center gap-1 animate-pulse">
            <Star className="w-3 h-3 fill-current" />
            Featured
          </div>
        </div>
      )}

      <div>
        {/* Top Header: Company logo & basic info */}
        <div className="flex items-start gap-4 mb-4">
          <img
            src={
              job.company?.logoUrl ||
              'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80'
            }
            alt={job.company?.name || 'Company Logo'}
            width={48}
            height={48}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80';
            }}
            className="w-12 h-12 rounded-xl object-cover border border-slate-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 group-hover:scale-110 group-hover:rotate-2 transition-transform duration-300 shadow-md shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
              <Link to={`/jobs/${job.id}`}>{job.title}</Link>
            </h3>
            <p className="text-sm font-bold text-slate-800 dark:text-zinc-300 flex items-center gap-1.5 mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-slate-600 dark:text-zinc-400 group-hover:text-blue-600 transition-colors" />
              <span className="truncate">{job.company?.name || 'Tech Company'}</span>
            </p>
          </div>
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-zinc-900 text-slate-900 dark:text-zinc-200 border border-slate-300 dark:border-zinc-800 hover:scale-105 transition-all shadow-xs">
            <MapPin className="w-3 h-3 text-slate-600 dark:text-zinc-400" />
            {job.location}
          </span>

          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-zinc-900 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-zinc-800 font-extrabold hover:scale-105 transition-all shadow-xs">
            <DollarSign className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
            {formattedSalary}
          </span>

          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-blue-50 dark:bg-zinc-900 text-blue-800 dark:text-blue-400 border border-blue-300 dark:border-zinc-800 font-extrabold hover:scale-105 transition-all shadow-xs">
            <Briefcase className="w-3 h-3 text-blue-700 dark:text-blue-400" />
            {job.jobType.replace('_', ' ')}
          </span>

          {job.aiMatchScore && <AIMatchBadge score={job.aiMatchScore} size="sm" />}
        </div>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {job.skillsRequired?.slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-md bg-blue-100/80 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 border border-blue-300 dark:border-blue-800/40 hover:scale-105 hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-all cursor-default"
            >
              {skill}
            </span>
          ))}
          {job.skillsRequired?.length > 4 && (
            <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-zinc-900 text-slate-800 dark:text-zinc-400 border border-slate-300 dark:border-zinc-800">
              +{job.skillsRequired.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Footer Action Buttons */}
      <div className="pt-4 border-t border-slate-300 dark:border-slate-800/80 flex items-center justify-between gap-3">
        <Link
          to={`/jobs/${job.id}`}
          className="text-xs font-bold text-slate-800 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white flex items-center gap-1 group/btn transition-colors"
        >
          View Details
          <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-200" />
        </Link>

        {onQuickApply && (
          <button
            onClick={() => onQuickApply(job)}
            className="px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-md btn-interactive active:scale-95 transition-all duration-200"
          >
            Quick Apply
          </button>
        )}
      </div>
    </div>
  );
};
