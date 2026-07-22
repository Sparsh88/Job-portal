import { Response } from 'express';
type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'REMOTE';
type ExperienceLevel = 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD' | 'EXECUTIVE';
import { prisma } from '../config/db';
import { AuthenticatedRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { calculateSkillMatch } from '../services/aiService';
import { verifyAccessToken } from '../utils/jwt';

export const getAllJobs = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const {
    search,
    category,
    location,
    jobType,
    experienceLevel,
    minSalary,
    featured,
    page = '1',
    limit = '10',
  } = req.query;

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

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

  const [total, jobs] = await Promise.all([
    prisma.job.count({ where: whereClause }),
    prisma.job.findMany({
      where: whereClause,
      include: {
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

  // If candidate token provided, calculate AI score for each job
  let candidateSkills: string[] = [];
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = verifyAccessToken(token);
      const profile = await prisma.profile.findUnique({ where: { userId: decoded.userId } });
      if (profile && profile.skills) {
        candidateSkills = profile.skills;
      }
    } catch (e) {
      // ignore token parse error for open job search
    }
  }

  const jobsWithAIScore = jobs.map((job: any) => {
    const aiScoreResult = calculateSkillMatch(candidateSkills, job.skillsRequired);
    return {
      ...job,
      aiMatchScore: candidateSkills.length > 0 ? aiScoreResult.matchScore : null,
    };
  });

  res.status(200).json({
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
  });
});

export const getJobById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
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

  res.status(200).json({
    success: true,
    data: job,
  });
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

  res.status(200).json({
    success: true,
    message: 'Job deleted successfully.',
  });
});

export const calculateAIMatchScore = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  const [job, profile] = await Promise.all([
    prisma.job.findUnique({ where: { id } }),
    prisma.profile.findUnique({ where: { userId } }),
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
