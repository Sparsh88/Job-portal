import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Job, Application } from '../types';
import { AIMatchBadge } from '../components/AIMatchBadge';
import { Modal } from '../components/Modal';
import { Building2, Plus, Users, Calendar, Video, CheckCircle2, XCircle, Clock } from 'lucide-react';

export const RecruiterDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState({
    totalJobs: 0,
    totalApplications: 0,
    shortlistedCount: 0,
    upcomingInterviews: 0,
  });
  const [recentApps, setRecentApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // New Job Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [category, setCategory] = useState('Software Engineering');
  const [location, setLocation] = useState('Remote');
  const [salaryMin, setSalaryMin] = useState('120000');
  const [salaryMax, setSalaryMax] = useState('160000');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('React, TypeScript, Node.js, PostgreSQL');
  const [creating, setCreating] = useState(false);

  // Interview Schedule Modal
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [scheduledAt, setScheduledAt] = useState('');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/hirehub-mock');
  const [scheduling, setScheduling] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/recruiters/dashboard');
      if (res.data.success) {
        setMetrics(res.data.data.metrics);
        setRecentApps(res.data.data.recentApplications);
      }
    } catch (err) {
      console.error('Failed to load recruiter metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post('/jobs', {
        title: jobTitle,
        category,
        location,
        salaryMin,
        salaryMax,
        description,
        skillsRequired: skills.split(',').map((s) => s.trim()),
      });
      setShowCreateModal(false);
      fetchDashboardData();
      alert('Job listing posted successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Please complete your company profile first.');
    } finally {
      setCreating(false);
    }
  };

  const handleScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;
    setScheduling(true);
    try {
      await api.post('/interviews', {
        applicationId: selectedApp.id,
        candidateId: selectedApp.applicantId,
        scheduledAt,
        meetingLink,
      });
      setSelectedApp(null);
      fetchDashboardData();
      alert('Interview scheduled & notification sent to candidate!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to schedule interview.');
    } finally {
      setScheduling(false);
    }
  };

  const handleStatusUpdate = async (appId: string, status: string) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status });
      fetchDashboardData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Status update failed.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-widest">
            <Building2 className="w-4 h-4" />
            Recruiter Command Portal
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Hiring Pipeline Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl">
            Post new engineering listings, inspect AI match scores, and schedule candidate Google Meet interviews.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Post New Job Opening
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500">Active Job Listings</span>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{metrics.totalJobs}</div>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500">Total Applicants</span>
          <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">{metrics.totalApplications}</div>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500">Shortlisted Candidates</span>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{metrics.shortlistedCount}</div>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500">Upcoming Interviews</span>
          <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">{metrics.upcomingInterviews}</div>
        </div>
      </div>

      {/* Applications Pipeline List */}
      <div className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Candidate Applications</h3>
          <span className="text-xs text-slate-500">Sorted by AI Match Score</span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-20 bg-slate-100 dark:bg-slate-900/50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : recentApps.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <Users className="w-12 h-12 text-slate-400 mx-auto" />
            <div className="text-slate-900 dark:text-white font-bold">No candidate applications yet</div>
            <p className="text-xs text-slate-500">Post a new job or feature an existing role to receive candidate applications.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentApps.map((app) => (
              <div
                key={app.id}
                className="p-4 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-purple-500/40 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={app.applicant?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.applicant?.name}`}
                    alt={app.applicant?.name}
                    className="w-12 h-12 rounded-full border border-purple-500/40 object-cover bg-slate-800"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">{app.applicant?.name}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{app.applicant?.email} • Role: <span className="font-semibold text-slate-900 dark:text-white">{app.job?.title}</span></p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {app.matchScore && <AIMatchBadge score={app.matchScore} size="sm" />}

                  <select
                    value={app.status}
                    onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                    className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="APPLIED">APPLIED</option>
                    <option value="SHORTLISTED">SHORTLISTED</option>
                    <option value="INTERVIEW_SCHEDULED">INTERVIEW SCHEDULED</option>
                    <option value="REJECTED">REJECTED</option>
                    <option value="ACCEPTED">ACCEPTED</option>
                  </select>

                  <button
                    onClick={() => setSelectedApp(app)}
                    className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-600 dark:text-purple-300 border border-purple-500/40 rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <Video className="w-3.5 h-3.5" />
                    Schedule Interview
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Job Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Post New Job Opening" maxWidth="lg">
        <form onSubmit={handleCreateJob} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Job Title</label>
            <input
              type="text"
              required
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Full Stack Engineer"
              className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Domain</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none"
              >
                <option value="Full Stack Web Development">Full Stack Web Development</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Cybersecurity & Ethical Hacking">Cybersecurity & Ethical Hacking</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
                <option value="Data Science & Analytics">Data Science & Analytics</option>
                <option value="Frontend Engineering">Frontend Engineering</option>
                <option value="Backend Engineering">Backend Engineering</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Min Salary ($/yr)</label>
              <input
                type="number"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Max Salary ($/yr)</label>
              <input
                type="number"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Required Technical Skills (Comma Separated)</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed responsibilities..."
              className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="px-5 py-2 bg-purple-600 text-white font-bold text-xs rounded-xl shadow-md"
            >
              {creating ? 'Publishing...' : 'Publish Job Listing'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Schedule Interview Modal */}
      <Modal isOpen={!!selectedApp} onClose={() => setSelectedApp(null)} title={`Schedule Interview: ${selectedApp?.applicant?.name}`}>
        <form onSubmit={handleScheduleInterview} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Interview Date & Time</label>
            <input
              type="datetime-local"
              required
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Google Meet / Video Link</label>
            <input
              type="url"
              required
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setSelectedApp(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={scheduling}
              className="px-5 py-2 bg-purple-600 text-white font-bold text-xs rounded-xl shadow-md"
            >
              {scheduling ? 'Scheduling...' : 'Confirm Interview'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
