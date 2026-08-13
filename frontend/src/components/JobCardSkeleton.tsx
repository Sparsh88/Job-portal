import React from 'react';

export const JobCardSkeleton: React.FC = () => {
  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col justify-between border border-slate-300 dark:border-zinc-800/80 shadow-md relative overflow-hidden animate-pulse">
      <div>
        {/* Top Header: Logo + Title/Company */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-zinc-800 shrink-0" />
          <div className="flex-1 space-y-2 py-0.5">
            <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded-md w-4/5" />
            <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded-md w-1/2" />
          </div>
        </div>

        {/* Badges Row */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="h-6 w-24 bg-slate-200 dark:bg-zinc-800 rounded-md" />
          <div className="h-6 w-28 bg-slate-200 dark:bg-zinc-800 rounded-md" />
          <div className="h-6 w-20 bg-slate-200 dark:bg-zinc-800 rounded-md" />
        </div>

        {/* Skills Tags Row */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          <div className="h-5 w-14 bg-slate-200 dark:bg-zinc-800/80 rounded-md" />
          <div className="h-5 w-16 bg-slate-200 dark:bg-zinc-800/80 rounded-md" />
          <div className="h-5 w-20 bg-slate-200 dark:bg-zinc-800/80 rounded-md" />
          <div className="h-5 w-12 bg-slate-200 dark:bg-zinc-800/80 rounded-md" />
        </div>
      </div>

      {/* Footer Action Row */}
      <div className="pt-4 border-t border-slate-200 dark:border-zinc-800/80 flex items-center justify-between gap-3">
        <div className="h-4 w-20 bg-slate-200 dark:bg-zinc-800 rounded-md" />
        <div className="h-7 w-24 bg-slate-200 dark:bg-zinc-800 rounded-xl" />
      </div>
    </div>
  );
};
