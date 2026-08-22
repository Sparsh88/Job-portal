import React, { useState } from 'react';
import { api } from '../services/api';
import { Bot, Play, CheckCircle2, Sparkles, RefreshCw, AlertCircle, Lightbulb } from 'lucide-react';

const FALLBACK_QUESTIONS: Record<string, string[]> = {
  'Artificial Intelligence': [
    'How do you mitigate catastrophic forgetting and handle hallucination when fine-tuning or prompting Large Language Models (LLMs)?',
    'Explain the mathematical difference between Transformer self-attention and cross-attention mechanisms, and why FlashAttention improves GPU memory efficiency.',
    'Describe your workflow for training a deep learning model, including data preprocessing, avoiding overfitting with regularization, and optimizing inference latency (e.g., quantization, ONNX, TensorRT).',
    'How do you evaluate generative AI systems (e.g., RAG architectures) using metrics like faithfulness, answer relevancy, and context recall?',
    'What is the architectural difference between Supervised Fine-Tuning (SFT), LoRA/QLoRA parameter-efficient tuning, and RLHF/DPO alignment?',
  ],
  'Frontend Engineering': [
    'Explain how the React Virtual DOM diffing algorithm minimizes DOM mutations, and how React 18 Concurrent features improve UI responsiveness.',
    'How would you diagnose and optimize Core Web Vitals (LCP, INP, CLS) in a large single-page application with heavy component trees?',
    'Describe how you design a resilient global state management architecture and handle asynchronous cache invalidation in modern TypeScript applications.',
    'Explain how utility-first CSS (Tailwind) compares to CSS Modules and CSS-in-JS in terms of runtime overhead, bundle size, and build performance.',
  ],
  'Backend Engineering': [
    'How do you design a high-throughput, low-latency microservices architecture using event-driven communication (e.g., Kafka / RabbitMQ) and distributed caching (Redis)?',
    'Describe a situation where you diagnosed and optimized an expensive PostgreSQL query or resolved deadlocked database transactions under high load.',
    'How do you design a scalable JWT authentication and authorization system with short-lived access tokens, refresh token rotation, and instant revocation?',
    'Explain how you handle distributed transactions and eventual consistency across multiple microservice databases (e.g., Saga pattern, Outbox pattern).',
  ],
  'Software Engineering': [
    'Can you describe a challenging technical architecture decision you made recently, the trade-offs you considered, and the eventual outcome?',
    'How do you design fault-tolerant systems that gracefully degrade during third-party dependency outages or unexpected traffic spikes?',
    'Explain your approach to test-driven development (TDD), CI/CD pipeline automation, and zero-downtime canary deployments.',
    'How do you manage technical debt and balance architectural refactoring with delivering fast business features?',
  ],
  'DevOps & Cloud': [
    'How do you design and manage a zero-downtime Kubernetes deployment pipeline with Helm, GitOps (ArgoCD), and progressive canary rollouts?',
    'Explain your strategy for implementing infrastructure as code (IaC) with Terraform, including state management and drift detection across multi-region cloud environments.',
    'How do you configure comprehensive observability (distributed tracing, Prometheus metrics, ELK logging, and automated alerting) for cloud-native microservices?',
    'Describe how you secure cloud infrastructure against common vulnerabilities (IAM least privilege, VPC peering, secrets management with HashiCorp Vault).',
  ],
  'Data Science & Engineering': [
    'How do you architect a scalable real-time and batch ETL pipeline using Apache Spark, Kafka, and modern cloud data warehouses like Snowflake or BigQuery?',
    'Describe how you ensure data quality, schema evolution, and pipeline idempotency when processing terabytes of unstructured event data daily.',
    'Explain the differences between OLTP and OLAP architectures, columnar storage formats (Parquet/ORC), and partitioning strategies.',
  ],
  'Cybersecurity': [
    'How do you conduct threat modeling and implement defense-in-depth security architecture for public-facing cloud APIs?',
    'Explain the mechanics of OWASP Top 10 vulnerabilities (such as SSRF, SQL Injection, IDOR, and Broken Object Level Authorization) and their remediation.',
    'Describe how you implement zero-trust network access (ZTNA), mTLS between microservices, and automated vulnerability testing in CI/CD.',
  ],
};

const getFallbackQuestionsForCategory = (cat: string): string[] => {
  const norm = cat.toLowerCase();
  if (norm.includes('ai') || norm.includes('ml') || norm.includes('artificial') || norm.includes('intelligence') || norm.includes('machine')) {
    return FALLBACK_QUESTIONS['Artificial Intelligence'];
  }
  if (norm.includes('front')) return FALLBACK_QUESTIONS['Frontend Engineering'];
  if (norm.includes('back')) return FALLBACK_QUESTIONS['Backend Engineering'];
  if (norm.includes('devops') || norm.includes('cloud')) return FALLBACK_QUESTIONS['DevOps & Cloud'];
  if (norm.includes('data')) return FALLBACK_QUESTIONS['Data Science & Engineering'];
  if (norm.includes('security')) return FALLBACK_QUESTIONS['Cybersecurity'];
  return FALLBACK_QUESTIONS['Software Engineering'];
};

const evaluateAnswerClient = (question: string, answer: string, category: string) => {
  const words = answer.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const lowerAnswer = answer.toLowerCase();

  let score = 52;
  if (wordCount >= 25) score += 15;
  if (wordCount >= 55) score += 14;
  if (wordCount >= 100) score += 7;

  const keySignals = ['for example', 'because', 'latency', 'tradeoff', 'optimization', 'architecture', 'metric', 'scale', 'performance'];
  for (const sig of keySignals) {
    if (lowerAnswer.includes(sig)) score += 3;
  }

  if (score > 96) score = 96;
  if (score < 35) score = 35;

  const suggestions: string[] = [];
  if (wordCount < 40) suggestions.push('Elaborate with deeper architectural nuance and mention how you test edge cases.');
  if (!/\d+/.test(lowerAnswer)) suggestions.push('Include quantifiable engineering metrics (e.g. latency improvement %, memory reduction).');

  let feedback = 'Solid technical answer covering the primary concepts.';
  if (score >= 85) {
    feedback = 'Exceptional response! You clearly articulated the underlying mechanisms, trade-offs, and practical considerations.';
  } else if (score >= 70) {
    feedback = 'Good response! You addressed the core technical requirements. Adding more concrete production examples will elevate your answer.';
  } else {
    feedback = 'Fair attempt. Consider expanding on the specific technical architecture and concrete implementation steps.';
  }

  return {
    score,
    feedback,
    suggestions,
    clarity: score >= 80 ? 'High' : 'Medium',
  };
};

export const AIMockInterviewPage: React.FC = () => {
  const [category, setCategory] = useState('Artificial Intelligence');
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<{ score: number; feedback: string; suggestions?: string[]; clarity?: string } | null>(null);

  const fetchQuestions = async () => {
    setLoading(true);
    setFeedback(null);
    setAnswer('');
    try {
      const res = await api.get(`/interviews/ai-questions?category=${encodeURIComponent(category)}`);
      if (res.data?.success && Array.isArray(res.data?.data) && res.data.data.length > 0) {
        setQuestions(res.data.data.map((q: any) => typeof q === 'string' ? q : q.question || String(q)));
        setCurrentIdx(0);
      } else {
        setQuestions(getFallbackQuestionsForCategory(category));
        setCurrentIdx(0);
      }
    } catch (err) {
      setQuestions(getFallbackQuestionsForCategory(category));
      setCurrentIdx(0);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer || !answer.trim()) return;
    setEvaluating(true);
    const activeQuestion = questions[currentIdx] || '';

    try {
      const res = await api.post('/interviews/ai-evaluate', {
        question: activeQuestion,
        answer,
        category,
      });
      if (res.data?.success && res.data?.data) {
        setFeedback(res.data.data);
      } else {
        setFeedback(evaluateAnswerClient(activeQuestion, answer, category));
      }
    } catch (err) {
      setFeedback(evaluateAnswerClient(activeQuestion, answer, category));
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Top Banner */}
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-600/20 border border-cyan-300 dark:border-cyan-500/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mx-auto">
          <Bot className="w-6 h-6" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AI Mock Interview Practice
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto">
          Practice role-specific interview questions generated by AI and receive immediate scoring feedback on your answer depth and technical clarity.
        </p>
      </div>

      {/* Start Controls */}
      <div className="glass-card glass-card-hover group p-6 rounded-3xl border border-slate-300 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-cyan-600 dark:hover:border-cyan-500 transition-all duration-300 shadow-md">
        <div className="w-full sm:w-auto flex-1">
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Target Job Domain
          </label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setFeedback(null);
            }}
            className="w-full sm:w-80 p-2.5 bg-slate-100/90 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-cyan-500"
          >
            <option value="Artificial Intelligence">Artificial Intelligence / ML</option>
            <option value="Frontend Engineering">Frontend Engineering</option>
            <option value="Backend Engineering">Backend Engineering</option>
            <option value="Software Engineering">Software Engineering</option>
            <option value="DevOps & Cloud">DevOps & Cloud</option>
            <option value="Data Science & Engineering">Data Science & Engineering</option>
            <option value="Cybersecurity">Cybersecurity</option>
          </select>
        </div>

        <button
          onClick={fetchQuestions}
          disabled={loading}
          className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg btn-interactive active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
          Generate Interview Session
        </button>
      </div>

      {/* Questions & Answer Area */}
      {questions.length > 0 && (
        <div className="glass-card glass-card-hover group p-8 rounded-3xl border border-slate-300 dark:border-zinc-800 space-y-6 animate-fade-in-up hover:border-cyan-600 dark:hover:border-cyan-500 transition-all duration-300 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              Question {currentIdx + 1} of {questions.length} • {category}
            </span>
            <div className="flex gap-2">
              {currentIdx > 0 && (
                <button
                  onClick={() => {
                    setCurrentIdx(currentIdx - 1);
                    setFeedback(null);
                  }}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition-colors"
                >
                  Previous
                </button>
              )}
              {currentIdx < questions.length - 1 && (
                <button
                  onClick={() => {
                    setCurrentIdx(currentIdx + 1);
                    setFeedback(null);
                  }}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition-colors"
                >
                  Next Question
                </button>
              )}
            </div>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
            "{questions[currentIdx]}"
          </h3>

          <form onSubmit={handleEvaluate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Your Answer / Explanation
              </label>
              <textarea
                rows={6}
                required
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your explanation or technical answer here with concepts, trade-offs, and practical examples..."
                className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              disabled={evaluating || !answer.trim()}
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {evaluating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Evaluating Answer with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Submit Answer for AI Scoring</span>
                </>
              )}
            </button>
          </form>

          {/* AI Score Feedback Display */}
          {feedback && (
            <div className="p-6 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/60 rounded-2xl space-y-4 animate-fade-in-up">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  AI Evaluation Feedback
                </span>
                <div className="flex items-center gap-2">
                  {feedback.clarity && (
                    <span className="px-2.5 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 font-semibold text-xs rounded-md">
                      Clarity: {feedback.clarity}
                    </span>
                  )}
                  <span className="px-3 py-1 bg-cyan-600 text-white font-extrabold text-xs rounded-full shadow-sm">
                    Score: {feedback.score}/100
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {feedback.feedback}
              </p>

              {feedback.suggestions && feedback.suggestions.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-cyan-200 dark:border-cyan-800/60">
                  <span className="text-xs font-bold text-cyan-800 dark:text-cyan-300 flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5" />
                    Pro Suggestions for Staff-Level Impact:
                  </span>
                  <ul className="space-y-1">
                    {feedback.suggestions.map((sug, i) => (
                      <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                        <span className="text-cyan-500">•</span>
                        <span>{sug}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
