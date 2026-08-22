import React, { useState } from 'react';
import { api } from '../services/api';
import { AIMatchScoreResult } from '../types';
import { AIMatchBadge } from '../components/AIMatchBadge';
import { Sparkles, BrainCircuit, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';

// Comprehensive Client-Side Fallback Skill Extractor
const extractSkillsClient = (text: string): string[] => {
  if (!text) return [];
  const lower = text.toLowerCase();
  const known = [
    'LLMs', 'Deep Learning', 'Machine Learning', 'PyTorch', 'TensorFlow', 'NLP', 'Computer Vision',
    'Transformers', 'LangChain', 'RAG', 'Python', 'Scikit-Learn', 'Pandas', 'MLOps', 'CUDA', 'Fine-Tuning',
    'React', 'TypeScript', 'JavaScript', 'Next.js', 'Vue.js', 'Angular', 'Tailwind CSS', 'GraphQL',
    'Node.js', 'Express.js', 'FastAPI', 'Java', 'Spring Boot', 'C++', 'Go', 'Rust', 'PostgreSQL',
    'MongoDB', 'Redis', 'Kafka', 'Microservices', 'REST APIs', 'SQL', 'Docker', 'Kubernetes',
    'AWS', 'GCP', 'Azure', 'Terraform', 'CI/CD', 'Linux'
  ];

  const found = new Set<string>();
  for (const skill of known) {
    const sLower = skill.toLowerCase();
    if (lower.includes(sLower)) {
      found.add(skill);
    }
  }

  // Also parse comma/newline-separated custom terms
  const rawParts = text.split(/[\n,;•/]+/).map((p) => p.trim()).filter((p) => p.length >= 2 && p.length <= 25);
  for (const part of rawParts) {
    const clean = part.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');
    if (clean.length >= 2 && clean.length <= 20 && !/^(and|with|for|our|the|your|experience)$/i.test(clean)) {
      const formatted = clean.split(/\s+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      if (!Array.from(found).some((s) => s.toLowerCase() === formatted.toLowerCase())) {
        found.add(formatted);
      }
    }
  }

  return Array.from(found);
};

const dynamicClientAnalysis = (jobDescription: string, resumeText: string): AIMatchScoreResult => {
  const reqSkills = extractSkillsClient(jobDescription);
  const candSkills = extractSkillsClient(resumeText);

  let effectiveRequired = reqSkills;
  if (effectiveRequired.length === 0) {
    effectiveRequired = jobDescription
      .split(/\s+/)
      .map((w) => w.replace(/[^a-zA-Z0-9]/g, ''))
      .filter((w) => w.length > 3 && !/^(with|that|this|have|from|will|must|experience|years|requirements|about|team|work|looking)$/i.test(w))
      .slice(0, 5)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1));
  }

  const candLower = candSkills.map((s) => s.toLowerCase().trim());
  const matched: string[] = [];
  const missing: string[] = [];

  for (const req of effectiveRequired) {
    const reqLower = req.toLowerCase().trim();
    if (candLower.some((c) => c === reqLower || c.includes(reqLower) || reqLower.includes(c))) {
      matched.push(req);
    } else {
      missing.push(req);
    }
  }

  let score = 45;
  if (effectiveRequired.length > 0) {
    const ratio = matched.length / effectiveRequired.length;
    score = matched.length === 0 ? 25 : Math.round(45 + ratio * 48);
    if (candSkills.length >= matched.length + 2) score += 4;
    if (score > 98) score = 98;
  } else {
    score = candSkills.length > 0 ? 80 : 50;
  }

  const recs: string[] = [];
  if (missing.length > 0) {
    recs.push(`Target Missing Skills: Gain or highlight practical hands-on experience in ${missing.slice(0, 3).join(', ')}.`);
  }
  const isAI = /ai|ml|machine learning|deep learning|llm|pytorch|neural/i.test(jobDescription + ' ' + resumeText);
  if (isAI) {
    recs.push('AI/ML Optimization: Highlight model evaluation benchmarks, throughput metrics, and fine-tuning or RAG architecture deployments.');
  } else {
    recs.push('Quantify Impact: Add concrete numerical results (e.g., % performance increase, query speedup) to each project bullet point.');
  }
  recs.push('Portfolio Alignment: Link relevant open-source repositories and live production demonstrations in your resume header.');

  return {
    matchScore: score,
    matchedSkills: Array.from(new Set(matched)),
    missingSkills: Array.from(new Set(missing)),
    recommendations: recs,
  };
};

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
      if (response.data?.success && response.data?.data) {
        setResult(response.data.data);
      } else {
        setResult(dynamicClientAnalysis(jobDescription, resumeText));
      }
    } catch (error) {
      // Dynamic client-side analysis fallback to guarantee instant responsive analysis
      setResult(dynamicClientAnalysis(jobDescription, resumeText));
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
              placeholder="Paste the target job post requirements (e.g. AI AND ML Engineer, PyTorch, LLMs, Deep Learning, RAG)..."
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
              placeholder="Paste your resume text or technical skills summary (e.g. LLM, Deep Learning, Python)..."
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
                {result.matchedSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {result.matchedSkills.map((s: string, idx: number) => (
                      <span key={idx} className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/40 rounded-lg text-xs font-extrabold">
                        {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">No matching skills identified between job requirements and resume text.</p>
                )}
              </div>

              {/* Missing Skills */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  Missing Skills & Gaps ({result.missingSkills.length})
                </div>
                {result.missingSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {result.missingSkills.map((s: string, idx: number) => (
                      <span key={idx} className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/40 rounded-lg text-xs font-extrabold">
                        {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">All required skills were successfully matched!</p>
                )}
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
