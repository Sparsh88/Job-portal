import { Response } from 'express';
type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'REMOTE';
type ExperienceLevel = 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD' | 'EXECUTIVE';
import { prisma } from '../config/db';
import { AuthenticatedRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { calculateSkillMatch } from '../services/aiService';
import { verifyAccessToken } from '../utils/jwt';
import { memoryCache } from '../services/cacheService';

export const getAllJobs = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const {
    search,
    category,
    location,
    jobType,
    experienceLevel,
    minSalary,
    featured,
    includeDescription,
    page = '1',
    limit = '10',
  } = req.query;

  const pageNum = Math.max(1, parseInt(page as string) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit as string) || 10));
  const skip = (pageNum - 1) * limitNum;

  // Extract auth token if provided for AI match scoring
  let candidateSkills: string[] = [];
  let candidateUserId: string | null = null;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = verifyAccessToken(token);
      candidateUserId = decoded.userId;
      const profile = await prisma.profile.findUnique({
        where: { userId: decoded.userId },
        select: { skills: true },
      });
      if (profile && profile.skills) {
        candidateSkills = profile.skills;
      }
    } catch (e) {
      // ignore token parse error for open job search
    }
  }

  // Generate cache key based on query parameters & candidate state
  const cacheKey = `jobs:list:${JSON.stringify(req.query)}:${candidateUserId || 'anon'}`;
  const cachedData = memoryCache.get<any>(cacheKey);

  if (cachedData) {
    res.setHeader('X-Cache', 'HIT');
    res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=120');
    return res.status(200).json(cachedData);
  }

  const whereClause: any = { isActive: true };

  if (search) {
    whereClause.OR = [
      { title: { contains: search as string, mode: 'insensitive' } },
      { description: { contains: search as string, mode: 'insensitive' } },
      { category: { contains: search as string, mode: 'insensitive' } },
    ];
  }

  if (category) {
    whereClause.category = { equals: category as string, mode: 'insensitive' };
  }

  if (location) {
    whereClause.location = { contains: location as string, mode: 'insensitive' };
  }

  if (jobType) {
    whereClause.jobType = jobType as JobType;
  }

  if (experienceLevel) {
    whereClause.experienceLevel = experienceLevel as ExperienceLevel;
  }

  if (minSalary) {
    whereClause.salaryMax = { gte: parseInt(minSalary as string) };
  }

  if (featured === 'true') {
    whereClause.isFeatured = true;
  }

  // Optimized selective field projection for list endpoints (avoids fetching heavy description)
  const shouldIncludeDesc = includeDescription === 'true';

  const [total, jobs] = await Promise.all([
    prisma.job.count({ where: whereClause }),
    prisma.job.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        category: true,
        location: true,
        jobType: true,
        experienceLevel: true,
        salaryMin: true,
        salaryMax: true,
        isFeatured: true,
        skillsRequired: true,
        createdAt: true,
        description: shouldIncludeDesc ? true : false,
        company: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
            industry: true,
            location: true,
          },
        },
        _count: {
          select: { applications: true },
        },
      },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      skip,
      take: limitNum,
    }),
  ]);

  const jobsWithAIScore = jobs.map((job: any) => {
    const aiScoreResult = calculateSkillMatch(candidateSkills, job.skillsRequired);
    return {
      ...job,
      aiMatchScore: candidateSkills.length > 0 ? aiScoreResult.matchScore : null,
    };
  });

  const responsePayload = {
    success: true,
    data: {
      jobs: jobsWithAIScore,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    },
  };

  // Cache response in memory for 60 seconds
  memoryCache.set(cacheKey, responsePayload, 60 * 1000);

  res.setHeader('X-Cache', 'MISS');
  res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=120');
  res.status(200).json(responsePayload);
});

export const getJobById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const cacheKey = `jobs:detail:${id}`;
  const cachedJob = memoryCache.get<any>(cacheKey);

  if (cachedJob) {
    res.setHeader('X-Cache', 'HIT');
    res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=120');
    return res.status(200).json(cachedJob);
  }

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      company: true,
      recruiter: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
      _count: {
        select: { applications: true },
      },
    },
  });

  if (!job) {
    throw new AppError('Job posting not found.', 404);
  }

  const responsePayload = {
    success: true,
    data: job,
  };

  memoryCache.set(cacheKey, responsePayload, 60 * 1000);

  res.setHeader('X-Cache', 'MISS');
  res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=120');
  res.status(200).json(responsePayload);
});

export const createJob = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const recruiterId = req.user?.userId;
  const {
    title,
    description,
    category,
    location,
    jobType,
    experienceLevel,
    salaryMin,
    salaryMax,
    skillsRequired,
    isFeatured,
  } = req.body;

  const company = await prisma.company.findUnique({
    where: { recruiterId: recruiterId! },
  });

  if (!company) {
    throw new AppError('Please complete your company profile before posting jobs.', 400);
  }

  const newJob = await prisma.job.create({
    data: {
      title,
      description,
      category,
      location,
      jobType: jobType || 'FULL_TIME',
      experienceLevel: experienceLevel || 'MID',
      salaryMin: parseInt(salaryMin),
      salaryMax: parseInt(salaryMax),
      skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : [],
      isFeatured: Boolean(isFeatured),
      recruiterId: recruiterId!,
      companyId: company.id,
    },
    include: {
      company: true,
    },
  });

  // Invalidate job list cache upon creation
  memoryCache.invalidateJobsCache();

  res.status(201).json({
    success: true,
    message: 'Job posting created successfully.',
    data: newJob,
  });
});

export const updateJob = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  const userRole = req.user?.role;

  const existingJob = await prisma.job.findUnique({ where: { id } });
  if (!existingJob) {
    throw new AppError('Job not found.', 404);
  }

  if (userRole !== 'ADMIN' && existingJob.recruiterId !== userId) {
    throw new AppError('Unauthorized to update this job listing.', 403);
  }

  const updatedJob = await prisma.job.update({
    where: { id },
    data: {
      ...req.body,
      salaryMin: req.body.salaryMin ? parseInt(req.body.salaryMin) : undefined,
      salaryMax: req.body.salaryMax ? parseInt(req.body.salaryMax) : undefined,
    },
  });

  // Invalidate jobs cache upon update
  memoryCache.invalidateJobsCache();

  res.status(200).json({
    success: true,
    message: 'Job updated successfully.',
    data: updatedJob,
  });
});

export const deleteJob = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  const userRole = req.user?.role;

  const existingJob = await prisma.job.findUnique({ where: { id } });
  if (!existingJob) {
    throw new AppError('Job not found.', 404);
  }

  if (userRole !== 'ADMIN' && existingJob.recruiterId !== userId) {
    throw new AppError('Unauthorized to delete this job listing.', 403);
  }

  await prisma.job.delete({ where: { id } });

  // Invalidate jobs cache upon deletion
  memoryCache.invalidateJobsCache();

  res.status(200).json({
    success: true,
    message: 'Job deleted successfully.',
  });
});

export const calculateAIMatchScore = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  const [job, profile] = await Promise.all([
    prisma.job.findUnique({ where: { id }, select: { skillsRequired: true } }),
    prisma.profile.findUnique({ where: { userId }, select: { skills: true } }),
  ]);

  if (!job) {
    throw new AppError('Job not found.', 404);
  }

  const candidateSkills = profile?.skills || [];
  const result = calculateSkillMatch(candidateSkills, job.skillsRequired);

  res.status(200).json({
    success: true,
    data: result,
  });
});
