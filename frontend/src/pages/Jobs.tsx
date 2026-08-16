import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Job } from '../types';
import { api } from '../services/api';
import { JobCard } from '../components/JobCard';
import { JobCardSkeleton } from '../components/JobCardSkeleton';
import { CourseCard } from '../components/CourseCard';
import { COURSES_DATA } from '../data/coursesData';
import { Modal } from '../components/Modal';
import {
  Search,
  MapPin,
  Filter,
  Briefcase,
  SlidersHorizontal,
  ShieldCheck,
  Cloud,
  Database,
  Cpu,
  Code,
  GraduationCap,
  Sparkles,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';

export const Jobs: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState('');

  // Active View Tab: 'jobs' vs 'courses'
  const [activeTab, setActiveTab] = useState<'jobs' | 'courses'>(
    searchParams.get('tab') === 'courses' ? 'courses' : 'jobs'
  );

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

  // Filtered courses based on selected category & search query
  const filteredCourses = COURSES_DATA.filter((course) => {
    const matchesCategory = !category || course.categorySlug === category;
    const matchesSearch =
      !search ||
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.skills.some((s) => s.toLowerCase().includes(search.toLowerCase())) ||
      course.provider.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categoriesList = [
    { slug: 'Full Stack Web Development', label: 'Full Stack Web Dev', icon: Code, color: 'text-indigo-400', activeBg: 'bg-indigo-600' },
    { slug: 'Cybersecurity & Ethical Hacking', label: 'Cybersecurity & Hacking', icon: ShieldCheck, color: 'text-rose-400', activeBg: 'bg-rose-600' },
    { slug: 'Artificial Intelligence', label: 'AI & Machine Learning', icon: Cpu, color: 'text-purple-400', activeBg: 'bg-purple-600' },
    { slug: 'Cloud & DevOps', label: 'Cloud & DevOps', icon: Cloud, color: 'text-cyan-400', activeBg: 'bg-cyan-600' },
    { slug: 'Data Science & Analytics', label: 'Data Science', icon: Database, color: 'text-amber-400', activeBg: 'bg-amber-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-zinc-800 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
          <Briefcase className="w-4 h-4" />
          Real-Time Engineering Jobs & Upskilling Courses
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Explore Jobs & Top Rated Certification Courses
        </h1>
        <p className="text-slate-700 dark:text-zinc-300 text-sm max-w-2xl font-medium">
          Filter by Full Stack Web Dev, AI/ML, Ethical Hacking, Cloud Infrastructure, and Data Science domains with 3 curated skill-building courses per category.
        </p>

        {/* View Switcher: Jobs vs Courses */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'jobs'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 scale-[1.02]'
                : 'bg-slate-200/80 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-300 dark:hover:bg-zinc-800'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Active Jobs ({jobs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'courses'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 scale-[1.02]'
                : 'bg-slate-200/80 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-300 dark:hover:bg-zinc-800'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
            <span>Curated Courses (3 per Category • {filteredCourses.length})</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-500 dark:text-zinc-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder={
                activeTab === 'courses'
                  ? 'Search courses by skill (React, PyTorch, CKA, Penetration Testing, Spark)...'
                  : 'Search jobs by title or stack (React, Node.js, Ethical Hacking, PyTorch)...'
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-white dark:bg-zinc-900/90 border border-slate-300 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 text-sm focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>

          {activeTab === 'jobs' && (
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
          )}

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

          {categoriesList.map((cat) => {
            const Icon = cat.icon;
            const isSelected = category === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => setCategory(isSelected ? '' : cat.slug)}
                className={`px-3 py-1 rounded-lg text-xs font-extrabold shrink-0 transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? `${cat.activeBg} text-white shadow-sm scale-[1.02]`
                    : 'bg-slate-200/80 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-slate-900 dark:text-zinc-300 hover:bg-slate-300 dark:hover:bg-zinc-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
                <span className="text-[10px] opacity-80 bg-black/20 px-1.5 py-0.2 rounded-full">3 courses</span>
              </button>
            );
          })}

          {activeTab === 'jobs' && (
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
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'courses' ? (
        /* Courses Grid */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {category ? `${category} — 3 Curated Certification Courses` : 'All Categories (3 Courses per Category • 15 Total)'}
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
              Showing {filteredCourses.length} industry courses
            </span>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="text-center py-16 glass-card rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No courses match your query</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Try clearing the search filter or switching categories.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Jobs Grid */
        <div className="space-y-8">
          {/* Quick Recommended Courses Mini-Banner for Selected Category */}
          {category && filteredCourses.length > 0 && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900/20 via-indigo-900/20 to-blue-900/20 border border-purple-500/30 dark:border-purple-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-extrabold text-purple-600 dark:text-purple-300 uppercase tracking-wider">
                    Recommended 3 Courses for {category}
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('courses')}
                  className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                >
                  View full curriculum ({filteredCourses.length} courses) →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredCourses.slice(0, 3).map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-zinc-400">
                        <span>{c.provider}</span>
                        <span className="text-amber-500">★ {c.rating}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1 line-clamp-2">
                        {c.title}
                      </h4>
                    </div>
                    <a
                      href={c.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline pt-2 inline-block"
                    >
                      Start Learning →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

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
