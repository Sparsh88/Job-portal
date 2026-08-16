import React from 'react';
import { CategoryCourse } from '../types';
import { Star, Clock, Award, ExternalLink, BookOpen, CheckCircle, Code, ShieldCheck, Cpu, Cloud, Database } from 'lucide-react';

interface CourseCardProps {
  course: CategoryCourse;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const getCategoryIcon = () => {
    switch (course.categorySlug) {
      case 'Full Stack Web Development':
        return <Code className="w-4 h-4 text-indigo-400" />;
      case 'Cybersecurity & Ethical Hacking':
        return <ShieldCheck className="w-4 h-4 text-rose-400" />;
      case 'Artificial Intelligence':
        return <Cpu className="w-4 h-4 text-purple-400" />;
      case 'Cloud & DevOps':
        return <Cloud className="w-4 h-4 text-cyan-400" />;
      case 'Data Science & Analytics':
        return <Database className="w-4 h-4 text-amber-400" />;
      default:
        return <BookOpen className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="glass-card glass-card-hover group relative rounded-3xl p-6 border border-slate-200 dark:border-zinc-800 flex flex-col justify-between transition-all duration-300 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 animate-fade-in-up">
      <div className="space-y-4">
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl bg-gradient-to-tr ${course.badgeColor} text-white shadow-md`}>
              {getCategoryIcon()}
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block">
                {course.provider}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-amber-500 dark:text-amber-400 font-extrabold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{course.rating}</span>
                <span className="text-slate-400 dark:text-zinc-500 font-normal">({course.reviewsCount})</span>
              </div>
            </div>
          </div>

          <span
            className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
              course.level === 'Advanced'
                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                : course.level === 'Intermediate'
                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
            }`}
          >
            {course.level}
          </span>
        </div>

        {/* Course Title & Description */}
        <div className="space-y-2">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {course.title}
          </h3>
          <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
            {course.description}
          </p>
        </div>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {course.skills.slice(0, 5).map((skill, idx) => (
            <span
              key={idx}
              className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300"
            >
              {skill}
            </span>
          ))}
          {course.skills.length > 5 && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 text-slate-500 dark:text-zinc-500">
              +{course.skills.length - 5} more
            </span>
          )}
        </div>
      </div>

      {/* Card Footer Info & CTA */}
      <div className="pt-5 mt-5 border-t border-slate-200 dark:border-zinc-800/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-zinc-400 font-medium">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{course.duration}</span>
          </div>
          {course.certificate && (
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <Award className="w-3.5 h-3.5" />
              <span>Certificate</span>
            </div>
          )}
        </div>

        <a
          href={course.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 shrink-0"
        >
          <span>Explore Course</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
