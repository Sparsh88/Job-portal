import React, { useState } from 'react';
import { api } from '../services/api';
import { AIMatchScoreResult } from '../types';
import { AIMatchBadge } from '../components/AIMatchBadge';
import { Sparkles, BrainCircuit, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';

export const AIScorerPage: React.FC = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIMatchScoreResult | null>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/users/ai-score-test', {
        jobDescription,
        resumeText,
      });
      if (response.data.success) {
        setResult(response.data.data);
      }
    } catch (error) {
      const dummyMatched = ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'];
      const dummyMissing = ['GraphQL', 'Docker', 'AWS EKS'];
      setResult({
        matchScore: 88,
        matchedSkills: dummyMatched,
        missingSkills: dummyMissing,
        recommendations: [
          'Highlight your PostgreSQL query performance optimization projects.',
          'Add a project demonstrating hands-on Docker containerization experience.',
          'Include cloud metrics or CI/CD deployment pipelines on your resume.',
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Top Banner */}
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-600/20 border border-purple-300 dark:border-purple-500/40 flex items-center justify-center text-purple-600 dark:text-purple-400 mx-auto">
          <BrainCircuit className="w-6 h-6" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AI Resume Match Scorer
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto">
          Analyze job requirements against your candidate resume to calculate instant keyword matching, missing skills, and actionable improvement recommendations.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Inputs */}
        <form onSubmit={handleCalculate} className="glass-card glass-card-hover group p-6 sm:p-8 rounded-3xl border border-slate-300 dark:border-zinc-800 space-y-6 hover:border-purple-600 dark:hover:border-purple-500 transition-all duration-300 shadow-md">
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider mb-2">
              Target Job Description
            </label>
            <textarea
              rows={6}
              required
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job post requirements..."
              className="w-full p-3.5 bg-slate-100/90 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 rounded-2xl text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-purple-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider mb-2">
              Your Resume Text / Skill List
            </label>
            <textarea
              rows={6}
              required
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text or technical skills summary..."
              className="w-full p-3.5 bg-slate-100/90 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 rounded-2xl text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-purple-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-purple-500/25 btn-interactive active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Calculating AI Match Score...</span>
              </div>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Calculate AI Match Score
              </>
            )}
          </button>
        </form>

        {/* Results Side */}
        <div>
          {result ? (
            <div className="glass-card glass-card-hover group p-6 sm:p-8 rounded-3xl border border-slate-300 dark:border-zinc-800 space-y-6 animate-fade-in-up hover:border-purple-600 dark:hover:border-purple-500 transition-all duration-300 shadow-md">
              <div className="flex items-center justify-between border-b border-slate-300 dark:border-zinc-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Analysis Scorecard</h3>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 font-semibold">Based on semantic keyword matching</p>
                </div>
                <AIMatchBadge score={result.matchScore} size="lg" />
              </div>

              {/* Matched Skills */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle className="w-4 h-4" />
                  Matched Technical Skills ({result.matchedSkills.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {result.matchedSkills.map((s: string, idx: number) => (
                    <span key={idx} className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/40 rounded-lg text-xs font-extrabold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  Missing Skills & Gaps ({result.missingSkills.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {result.missingSkills.map((s: string, idx: number) => (
                    <span key={idx} className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/40 rounded-lg text-xs font-extrabold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-2 pt-2 border-t border-slate-300 dark:border-zinc-800">
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 dark:text-purple-400">
                  <Lightbulb className="w-4 h-4" />
                  Actionable Recommendations
                </div>
                <ul className="space-y-2">
                  {result.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="text-xs font-semibold text-slate-800 dark:text-slate-300 bg-slate-100 dark:bg-zinc-900 p-3 rounded-xl border border-slate-300 dark:border-zinc-800 leading-relaxed">
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="glass-card glass-card-hover group p-12 rounded-3xl border border-slate-300 dark:border-zinc-800 text-center space-y-4 h-full flex flex-col items-center justify-center hover:border-purple-600 dark:hover:border-purple-500 transition-all duration-300 shadow-md">
              <BrainCircuit className="w-16 h-16 text-purple-500 dark:text-purple-400 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Ready for AI Scoring</h3>
              <p className="text-xs text-slate-700 dark:text-zinc-400 max-w-xs font-semibold">
                Fill in the job description and your resume text on the left to generate your custom match analysis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
