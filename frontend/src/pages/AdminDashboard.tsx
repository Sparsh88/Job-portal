import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User } from '../types';
import { ShieldCheck, Users, Briefcase, FileText, DollarSign, Trash2, CheckCircle2 } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    candidateCount: 0,
    recruiterCount: 0,
    totalJobs: 0,
    totalApplications: 0,
    totalRevenueINR: 0,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const [mRes, uRes] = await Promise.all([
        api.get('/admin/metrics'),
        api.get('/admin/users'),
      ]);
      if (mRes.data.success) setMetrics(mRes.data.data);
      if (uRes.data.success) setUsers(uRes.data.data);
    } catch (err) {
      console.error('Failed to load admin metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user from platform?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      fetchAdminData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Delete user failed.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" />
            Platform Governance
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Admin System Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl">
            Monitor platform performance metrics, manage system users, and review subscription revenue.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500">Total System Users</span>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{metrics.totalUsers}</div>
          <span className="text-[10px] text-slate-500 mt-1 block">Candidates: {metrics.candidateCount} | Recruiters: {metrics.recruiterCount}</span>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500">Total Job Listings</span>
          <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">{metrics.totalJobs}</div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500">Submitted Applications</span>
          <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">{metrics.totalApplications}</div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500">Total Platform Revenue</span>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            ₹{metrics.totalRevenueINR?.toLocaleString()}
          </div>
        </div>
      </div>

      {/* System Users Table */}
      <div className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Registered Platform Users</h3>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-16 bg-slate-100 dark:bg-slate-900/50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((u) => (
              <div
                key={u.id}
                className="p-4 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={u.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`}
                    alt={u.name}
                    className="w-10 h-10 rounded-full border border-amber-500/40 object-cover bg-slate-800"
                  />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{u.name}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">{u.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                      u.role === 'ADMIN'
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                        : u.role === 'RECRUITER'
                        ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800'
                        : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
                    }`}
                  >
                    {u.role.replace('_', ' ')}
                  </span>

                  {u.role !== 'ADMIN' && (
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
