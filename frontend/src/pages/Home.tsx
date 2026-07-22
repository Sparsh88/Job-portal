import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Job } from '../types';
import { api } from '../services/api';
import { JobCard } from '../components/JobCard';
import { AnimatedCounter } from '../components/AnimatedCounter';
import {
  Search,
  MapPin,
  Sparkles,
  BrainCircuit,
  ArrowRight,
  Zap,
  Bot,
  ShieldCheck,
  Cpu,
  Cloud,
  Database,
  Lock,
} from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeJobs = async () => {
      try {
        const response = await api.get('/jobs?limit=8');
        if (response.data.success) {
          setFeaturedJobs(response.data.data.jobs);
        }
      } catch (error) {
        console.error('Failed to load featured jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeJobs();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/jobs?search=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(locationQuery)}`);
  };

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background glow graphics */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/15 rounded-full blur-[150px] pointer-events-none animate-float" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none animate-float-delayed" />

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10 animate-fade-in-up">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider shadow-lg">
            <Sparkles className="w-4 h-4 text-purple-500 dark:text-purple-400 animate-spin" />
            <span>AI-Driven Match Engine 3.0 Live</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Land Your Next Tech Role <br />
            <span className="gradient-text">Powered by Real-Time AI</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-800 dark:text-zinc-300 max-w-3xl mx-auto leading-relaxed font-semibold">
            HireHub-AI connects software engineers, cybersecurity specialists, AI developers, and data scientists with instant skill match scoring and live recruiter pipelines.
          </p>

          {/* Search Form Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="glass-card p-3.5 rounded-3xl border border-slate-300 dark:border-zinc-800 shadow-xl max-w-3xl mx-auto flex flex-col md:flex-row gap-3 glow-blue transition-all duration-300 hover:border-blue-600"
          >
            <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-slate-100/90 dark:bg-zinc-900/90 rounded-2xl border border-slate-300 dark:border-zinc-800">
              <Search className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
              <input
                type="text"
                placeholder="Job title, domain (Cybersecurity, AI, Cloud, Data Science)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-zinc-500 text-sm focus:outline-none font-semibold"
              />
            </div>

            <div className="md:w-56 flex items-center gap-3 px-4 py-3 bg-slate-100/90 dark:bg-zinc-900/90 rounded-2xl border border-slate-300 dark:border-zinc-800">
              <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <input
                type="text"
                placeholder="Location or Remote"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-zinc-500 text-sm focus:outline-none font-semibold"
              />
            </div>

            <button
              type="submit"
              className="px-7 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-blue-500/25 btn-interactive active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Search Jobs
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Stats Bar with Count-Up Animation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-slate-300 dark:border-zinc-800/80 max-w-4xl mx-auto">
            <div className="glass-card p-5 rounded-2xl border border-slate-300 dark:border-zinc-800/80 hover:scale-105 transition-all shadow-md">
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                <AnimatedCounter end={14200} suffix="+" duration={2200} />
              </div>
              <div className="text-xs text-slate-800 dark:text-zinc-400 mt-1 font-bold">Active Tech Jobs</div>
            </div>
            <div className="glass-card p-5 rounded-2xl border border-slate-300 dark:border-zinc-800/80 hover:scale-105 transition-all shadow-md">
              <div className="text-3xl font-extrabold text-blue-700 dark:text-blue-400">
                <AnimatedCounter end={95.4} decimals={1} suffix="%" duration={2000} />
              </div>
              <div className="text-xs text-slate-800 dark:text-zinc-400 mt-1 font-bold">AI Match Precision</div>
            </div>
            <div className="glass-card p-5 rounded-2xl border border-slate-300 dark:border-zinc-800/80 hover:scale-105 transition-all shadow-md">
              <div className="text-3xl font-extrabold text-purple-700 dark:text-purple-400">
                <AnimatedCounter end={520} suffix="+" duration={1800} />
              </div>
              <div className="text-xs text-slate-800 dark:text-zinc-400 mt-1 font-bold">Top Tech Companies</div>
            </div>
            <div className="glass-card p-5 rounded-2xl border border-slate-300 dark:border-zinc-800/80 hover:scale-105 transition-all shadow-md">
              <div className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400">
                <AnimatedCounter end={155} prefix="$" suffix="k" duration={2000} />
              </div>
              <div className="text-xs text-slate-800 dark:text-zinc-400 mt-1 font-bold">Avg Specialist Salary</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Domain Sections Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Top Engineering Domains</span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Browse Jobs by Tech Specialization</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto">
            Discover verified openings across high-demand technology sectors with instant AI skill scoring.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Cybersecurity & Ethical Hacking */}
          <div className="glass-card glass-card-hover group p-6 rounded-3xl border border-slate-200 dark:border-zinc-800 flex flex-col justify-between space-y-4 hover:border-rose-500/50 dark:hover:border-rose-500/50 transition-all duration-300">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800/60 flex items-center justify-center text-rose-600 dark:text-rose-400 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">Cybersecurity & Ethical Hacking</h3>
              <p className="text-xs text-slate-700 dark:text-zinc-400 leading-relaxed font-medium">
                Penetration Testing, Ethical Hacking, Zero Trust Architecture, SOC2, and Threat Intelligence.
              </p>
            </div>
            <Link
              to="/jobs?category=Cybersecurity+%26+Ethical+Hacking"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 group/link pt-2"
            >
              Explore Security Jobs <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* AI & Machine Learning */}
          <div className="glass-card glass-card-hover group p-6 rounded-3xl border border-slate-200 dark:border-zinc-800 flex flex-col justify-between space-y-4 hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-all duration-300">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800/60 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">AI & Machine Learning</h3>
              <p className="text-xs text-slate-700 dark:text-zinc-400 leading-relaxed font-medium">
                LLM Fine-tuning, RAG Pipelines, PyTorch, Computer Vision, and Autonomous AI Agents.
              </p>
            </div>
            <Link
              to="/jobs?category=Artificial+Intelligence"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 group/link pt-2"
            >
              Explore AI Jobs <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Cloud & DevOps */}
          <div className="glass-card glass-card-hover group p-6 rounded-3xl border border-slate-200 dark:border-zinc-800 flex flex-col justify-between space-y-4 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 transition-all duration-300">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-800/60 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                <Cloud className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">Cloud & DevOps Engineering</h3>
              <p className="text-xs text-slate-700 dark:text-zinc-400 leading-relaxed font-medium">
                Kubernetes Orchestration, Terraform, AWS Multi-Region, CI/CD Pipelines, and SRE.
              </p>
            </div>
            <Link
              to="/jobs?category=Cloud+%26+DevOps"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 group/link pt-2"
            >
              Explore Cloud Jobs <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Data Science & Big Data */}
          <div className="glass-card glass-card-hover group p-6 rounded-3xl border border-slate-200 dark:border-zinc-800 flex flex-col justify-between space-y-4 hover:border-amber-500/50 dark:hover:border-amber-500/50 transition-all duration-300">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Data Science & Big Data</h3>
              <p className="text-xs text-slate-700 dark:text-zinc-400 leading-relaxed font-medium">
                Apache Spark Data Lakehouses, Kafka Streaming, Predictive Analytics, and Snowflake.
              </p>
            </div>
            <Link
              to="/jobs?category=Data+Science+%26+Analytics"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 group/link pt-2"
            >
              Explore Data Jobs <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Openings List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Live Job Listings</span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">Featured Tech & Security Openings</h2>
          </div>
          <Link
            to="/jobs"
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 group"
          >
            Explore all open positions
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-64 rounded-2xl bg-slate-100 dark:bg-zinc-900/50 animate-pulse border border-slate-200 dark:border-zinc-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* AI Superpowers Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 lg:p-12 border border-slate-200 dark:border-zinc-800 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-4 group p-4 rounded-2xl hover:bg-slate-100/60 dark:hover:bg-zinc-900/60 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-600/20 border border-purple-300 dark:border-purple-500/40 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">AI Resume Matcher</h3>
              <p className="text-slate-700 dark:text-zinc-400 text-sm leading-relaxed font-medium">
                Paste any job description and your resume to receive an instant compatibility score, missing skills list, and actionable recommendations.
              </p>
              <Link to="/ai-scorer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 dark:text-purple-400 group/link">
                Try AI Scorer Tool <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="space-y-4 group p-4 rounded-2xl hover:bg-slate-100/60 dark:hover:bg-zinc-900/60 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-600/20 border border-cyan-300 dark:border-cyan-500/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">AI Mock Interview Simulator</h3>
              <p className="text-slate-700 dark:text-zinc-400 text-sm leading-relaxed font-medium">
                Practice technical & behavioral questions curated for your role. Get instant automated feedback on speech clarity, technical depth, and metrics.
              </p>
              <Link to="/ai-interview" className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-600 dark:text-cyan-400 group/link">
                Start Mock Interview <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="space-y-4 group p-4 rounded-2xl hover:bg-slate-100/60 dark:hover:bg-zinc-900/60 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-600/20 border border-amber-300 dark:border-amber-500/40 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Recruiter Fast-Track</h3>
              <p className="text-slate-700 dark:text-zinc-400 text-sm leading-relaxed font-medium">
                Post high-visibility engineering roles, manage candidates in a streamlined status pipeline, and schedule Google Meet interviews directly.
              </p>
              <Link to="/recruiter/dashboard" className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 dark:text-amber-400 group/link">
                Recruiter Portal <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 rounded-3xl p-10 lg:p-16 border border-blue-500/30 text-center relative overflow-hidden shadow-2xl">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
              Ready to Accelerate Your Tech Career?
            </h2>
            <p className="text-slate-300 text-base sm:text-lg">
              Join thousands of developers and security specialists using HireHub-AI to analyze job match scores and land top offers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 bg-white text-slate-950 hover:bg-slate-100 font-bold rounded-2xl shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Create Candidate Account
              </Link>
              <Link
                to="/jobs"
                className="w-full sm:w-auto px-8 py-3.5 bg-blue-600/30 hover:bg-blue-600/50 text-white font-semibold rounded-2xl border border-blue-400/40 transition-colors"
              >
                Browse All Openings
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
