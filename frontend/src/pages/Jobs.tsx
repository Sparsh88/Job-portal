import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Job } from '../types';
import { api } from '../services/api';
import { JobCard } from '../components/JobCard';
import { JobCardSkeleton } from '../components/JobCardSkeleton';
import { Modal } from '../components/Modal';
import { Search, MapPin, Filter, Briefcase, SlidersHorizontal, ShieldCheck, Cloud, Database, Cpu, Code } from 'lucide-react';

export const Jobs: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState('');

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [jobType, setJobType] = useState(searchParams.get('jobType') || '');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.append('search', search);
      if (location) query.append('location', location);
      if (category) query.append('category', category);
      if (jobType) query.append('jobType', jobType);

      const res = await api.get(`/jobs?${query.toString()}`);
      if (res.data.success) {
        setJobs(res.data.data.jobs);
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [category, jobType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleQuickApplySubmit = async () => {
    if (!selectedJob) return;
    setApplying(true);
    setApplySuccess('');
    try {
      await api.post('/applications', {
        jobId: selectedJob.id,
        coverLetter,
      });
      setApplySuccess('Your application was submitted successfully!');
      setTimeout(() => {
        setSelectedJob(null);
        setCoverLetter('');
        setApplySuccess('');
      }, 2000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit application. Please log in as a candidate.');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-zinc-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
          <Briefcase className="w-4 h-4" />
          Real-Time Engineering & Security Jobs
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Explore Full Stack, AI, Cloud & Cybersecurity Positions
        </h1>
        <p className="text-slate-700 dark:text-zinc-300 text-sm max-w-2xl font-medium">
          Filter by Full Stack Web Dev, AI/ML, Ethical Hacking, Cloud Infrastructure, and Data Science domains with real-time AI skill match scoring.
        </p>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-500 dark:text-zinc-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by title or stack (e.g. React, Node.js, Ethical Hacking, PyTorch, Kubernetes)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-white dark:bg-zinc-900/90 border border-slate-300 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 text-sm focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>

          <div className="md:w-52 relative">
            <MapPin className="w-4 h-4 text-slate-500 dark:text-zinc-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Location or Remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-white dark:bg-zinc-900/90 border border-slate-300 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 text-sm focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </form>

        {/* Quick Domain Category Badges */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-300 dark:border-zinc-800/80 overflow-x-auto pb-1">
          <SlidersHorizontal className="w-4 h-4 text-slate-600 dark:text-zinc-400 shrink-0 mr-1" />
          <button
            onClick={() => setCategory('')}
            className={`px-3 py-1 rounded-lg text-xs font-extrabold shrink-0 transition-all ${
              category === ''
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-200/80 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-slate-900 dark:text-zinc-300 hover:bg-slate-300 dark:hover:bg-zinc-800'
            }`}
          >
            All Categories
          </button>
          <button
            onClick={() => setCategory(category === 'Full Stack Web Development' ? '' : 'Full Stack Web Development')}
            className={`px-3 py-1 rounded-lg text-xs font-extrabold shrink-0 transition-all flex items-center gap-1 ${
              category === 'Full Stack Web Development'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-200/80 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-slate-900 dark:text-zinc-300 hover:bg-slate-300 dark:hover:bg-zinc-800'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            Full Stack Web Dev
          </button>
          <button
            onClick={() => setCategory(category === 'Cybersecurity & Ethical Hacking' ? '' : 'Cybersecurity & Ethical Hacking')}
            className={`px-3 py-1 rounded-lg text-xs font-extrabold shrink-0 transition-all flex items-center gap-1 ${
              category === 'Cybersecurity & Ethical Hacking'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-200/80 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-slate-900 dark:text-zinc-300 hover:bg-slate-300 dark:hover:bg-zinc-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Cybersecurity & Hacking
          </button>
          <button
            onClick={() => setCategory(category === 'Artificial Intelligence' ? '' : 'Artificial Intelligence')}
            className={`px-3 py-1 rounded-lg text-xs font-extrabold shrink-0 transition-all flex items-center gap-1 ${
              category === 'Artificial Intelligence'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-200/80 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-slate-900 dark:text-zinc-300 hover:bg-slate-300 dark:hover:bg-zinc-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            AI & Machine Learning
          </button>
          <button
            onClick={() => setCategory(category === 'Cloud & DevOps' ? '' : 'Cloud & DevOps')}
            className={`px-3 py-1 rounded-lg text-xs font-extrabold shrink-0 transition-all flex items-center gap-1 ${
              category === 'Cloud & DevOps'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'bg-slate-200/80 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-slate-900 dark:text-zinc-300 hover:bg-slate-300 dark:hover:bg-zinc-800'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            Cloud & DevOps
          </button>
          <button
            onClick={() => setCategory(category === 'Data Science & Analytics' ? '' : 'Data Science & Analytics')}
            className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 transition-all flex items-center gap-1 ${
              category === 'Data Science & Analytics'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Data Science
          </button>
          <button
            onClick={() => setJobType(jobType === 'REMOTE' ? '' : 'REMOTE')}
            className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 transition-all ${
              jobType === 'REMOTE'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-800'
            }`}
          >
            Remote Only
          </button>
        </div>
      </div>

      {/* Job Grid Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <JobCardSkeleton key={n} />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <Briefcase className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No job postings found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Try adjusting your keyword filter or location queries.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} onQuickApply={(j) => setSelectedJob(j)} />
          ))}
        </div>
      )}

      {/* Quick Apply Modal */}
      <Modal
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        title={`Quick Apply: ${selectedJob?.title}`}
      >
        <div className="space-y-4">
          {applySuccess && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs rounded-xl text-center font-semibold">
              {applySuccess}
            </div>
          )}

          <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
            <div className="text-slate-900 dark:text-white font-bold">{selectedJob?.company?.name}</div>
            <div className="text-slate-500">{selectedJob?.location} • {selectedJob?.jobType}</div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Cover Letter / Personal Note (Optional)
            </label>
            <textarea
              rows={4}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Why are you a great match for this role? Highlight relevant technical experience..."
              className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setSelectedJob(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={applying}
              onClick={handleQuickApplySubmit}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              {applying ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
