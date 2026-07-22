import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Application } from '../types';
import { AIMatchBadge } from '../components/AIMatchBadge';
import { Briefcase, Calendar, CheckCircle2, Clock, XCircle, FileText, User } from 'lucide-react';

export const CandidateDashboard: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/applications/my-applications');
        if (res.data.success) {
          setApplications(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load candidate applications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SHORTLISTED':
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {status}
          </span>
        );
      case 'INTERVIEW_SCHEDULED':
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 font-bold animate-pulse">
            <Calendar className="w-3.5 h-3.5" />
            Interview Scheduled
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 font-bold">
            <XCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 font-bold">
            <Clock className="w-3.5 h-3.5" />
            Under Review
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
          <User className="w-4 h-4" />
          Candidate Dashboard
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Track Your Job Applications
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Inspect application status updates, AI compatibility match scores, and interview schedules.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-500">Total Applications</span>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{applications.length}</div>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-500">Shortlisted / Interviews</span>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {applications.filter((a) => a.status === 'SHORTLISTED' || a.status === 'INTERVIEW_SCHEDULED').length}
          </div>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-500">Avg AI Match Score</span>
          <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
            {applications.length > 0
              ? `${Math.round(applications.reduce((acc, a) => acc + (a.matchScore || 80), 0) / applications.length)}%`
              : 'N/A'}
          </div>
        </div>
      </div>

      {/* Applications Table / Cards */}
      <div className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Active Applications</h3>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-20 bg-slate-100 dark:bg-slate-900/50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <FileText className="w-12 h-12 text-slate-400 mx-auto" />
            <div className="text-slate-900 dark:text-white font-bold">No applications submitted yet</div>
            <p className="text-xs text-slate-500">Browse open engineering roles and submit your first application.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="p-4 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-500/40 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-600/20 border border-blue-300 dark:border-blue-500/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">{app.job?.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{app.job?.company?.name} • {app.job?.location}</p>
                    <span className="text-[10px] text-slate-500 mt-1 block">Applied on: {new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {app.matchScore && <AIMatchBadge score={app.matchScore} size="sm" />}
                  {getStatusBadge(app.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
