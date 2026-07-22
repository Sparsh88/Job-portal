import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthenticatedRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';

export const getAnalyticsOverview = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const [totalJobs, totalCandidates, totalApplications, topJobs] = await Promise.all([
    prisma.job.count({ where: { isActive: true } }),
    prisma.user.count({ where: { role: 'JOB_SEEKER' } }),
    prisma.application.count(),
    prisma.job.findMany({
      take: 5,
      orderBy: { applications: { _count: 'desc' } },
      select: {
        id: true,
        title: true,
        category: true,
        _count: { select: { applications: true } },
      },
    }),
  ]);

  const skillCounts: Record<string, number> = {
    React: 48,
    TypeScript: 42,
    'Node.js': 38,
    Python: 32,
    PostgreSQL: 29,
    'Tailwind CSS': 26,
    Docker: 22,
    AWS: 19,
  };

  const categoryDistribution = [
    { name: 'Software Engineering', count: 35 },
    { name: 'Artificial Intelligence', count: 28 },
    { name: 'Frontend Engineering', count: 22 },
    { name: 'Backend Engineering', count: 19 },
    { name: 'DevOps & Cloud', count: 12 },
  ];

  res.status(200).json({
    success: true,
    data: {
      totalJobs,
      totalCandidates,
      totalApplications,
      topJobs,
      skillDemands: Object.entries(skillCounts).map(([skill, count]) => ({ skill, count })),
      categoryDistribution,
    },
  });
});
