import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Job } from '../types';
import { api } from '../services/api';
import { AIMatchBadge } from '../components/AIMatchBadge';
import { MapPin, DollarSign, Briefcase, Building2, Calendar, CheckCircle2, ArrowLeft } from 'lucide-react';

export const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        if (res.data.success) {
          setJob(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load job details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;
    setApplying(true);
    setErrorMessage('');
    try {
      await api.post('/applications', {
        jobId: job.id,
        coverLetter,
      });
      setApplied(true);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to submit application. Please log in as candidate.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Job Posting Not Found</h2>
        <Link to="/jobs" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
          Return to Job Openings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <Link to="/jobs" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to all jobs
      </Link>

      {/* Main Header Card */}
      <div className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={job.company?.logoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80'}
              alt={job.company?.name}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-md"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{job.title}</h1>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mt-1">
                <Building2 className="w-4 h-4 text-slate-400" />
                {job.company?.name}
              </p>
            </div>
          </div>

          {job.aiMatchScore && <AIMatchBadge score={job.aiMatchScore} size="lg" />}
        </div>

        {/* Metadata grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="p-3 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500">Location</span>
            <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-blue-500" /> {job.location}
            </p>
          </div>
          <div className="p-3 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500">Salary Range</span>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
              <DollarSign className="w-3.5 h-3.5" /> ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k
            </p>
          </div>
          <div className="p-3 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500">Employment Type</span>
            <p className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-0.5">
              <Briefcase className="w-3.5 h-3.5" /> {job.jobType.replace('_', ' ')}
            </p>
          </div>
          <div className="p-3 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500">Experience Level</span>
            <p className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 mt-0.5">
              <Calendar className="w-3.5 h-3.5" /> {job.experienceLevel}
            </p>
          </div>
        </div>
      </div>

      {/* Description & Application Form grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Role Description & Responsibilities</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">{job.description}</p>

            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Required Skills & Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {job.skillsRequired?.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40 rounded-lg text-xs font-semibold">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Application Form Sidebar */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Apply for Position</h3>

            {applied ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <div className="font-bold text-sm">Application Sent!</div>
                <p className="text-xs">Your profile and resume have been submitted to the recruiter.</p>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 text-xs rounded-xl">
                    {errorMessage}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Cover Note / Highlights</label>
                  <textarea
                    rows={4}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Briefly state your relevant tech experience..."
                    className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={applying}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all disabled:opacity-50"
                >
                  {applying ? 'Submitting...' : 'Submit Candidate Application'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
