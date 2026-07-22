import React from 'react';
import { Sparkles } from 'lucide-react';

interface AIMatchBadgeProps {
  score?: number | null;
  size?: 'sm' | 'md' | 'lg';
}

export const AIMatchBadge: React.FC<AIMatchBadgeProps> = ({ score, size = 'md' }) => {
  if (score === undefined || score === null) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-400';
    if (score >= 70) return 'from-blue-500/20 to-indigo-500/20 border-blue-500/40 text-blue-400';
    return 'from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-400';
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  }[size];

  return (
    <div
      className={`inline-flex items-center rounded-full bg-gradient-to-r border backdrop-blur-md shadow-sm ${getScoreColor(
        score
      )} ${sizeClasses}`}
    >
      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
      <span>{score}% AI Match</span>
    </div>
  );
};
