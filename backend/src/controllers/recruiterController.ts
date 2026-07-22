import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthenticatedRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';

export const getCompanyProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const recruiterId = req.user?.userId;
  const company = await prisma.company.findUnique({
    where: { recruiterId: recruiterId! },
    include: {
      recruiter: {
        select: { id: true, name: true, email: true, avatarUrl: true },
      },
    },
  });

  res.status(200).json({
    success: true,
    data: company,
  });
});

export const updateCompanyProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const recruiterId = req.user?.userId;
  const { name, logoUrl, website, description, industry, location, companySize } = req.body;

  const company = await prisma.company.upsert({
    where: { recruiterId: recruiterId! },
    update: {
      name,
      logoUrl,
      website,
      description,
      industry,
      location,
      companySize,
    },
    create: {
      recruiterId: recruiterId!,
      name: name || 'Company Name',
      logoUrl,
      website,
      description: description || 'Company description',
      industry: industry || 'Technology',
      location: location || 'Remote',
      companySize: companySize || '10-50 employees',
    },
  });

  res.status(200).json({
    success: true,
    message: 'Company profile updated successfully.',
    data: company,
  });
});

export const getRecruiterDashboard = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const recruiterId = req.user?.userId;

  const [totalJobs, totalApplications, shortlistedCount, upcomingInterviews, recentApplications] =
    await Promise.all([
      prisma.job.count({ where: { recruiterId } }),
      prisma.application.count({
        where: {
          job: { recruiterId },
        },
      }),
      prisma.application.count({
        where: {
          job: { recruiterId },
          status: 'SHORTLISTED',
        },
      }),
      prisma.interview.count({
        where: {
          recruiterId,
          status: 'SCHEDULED',
        },
      }),
      prisma.application.findMany({
        where: {
          job: { recruiterId },
        },
        include: {
          applicant: {
            select: { id: true, name: true, email: true, avatarUrl: true, profile: true },
          },
          job: {
            select: { id: true, title: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

  res.status(200).json({
    success: true,
    data: {
      metrics: {
        totalJobs,
        totalApplications,
        shortlistedCount,
        upcomingInterviews,
      },
      recentApplications,
    },
  });
});

export const getRecruiterJobs = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const recruiterId = req.user?.userId;
  const jobs = await prisma.job.findMany({
    where: { recruiterId },
    include: {
      company: true,
      _count: {
        select: { applications: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json({
    success: true,
    data: jobs,
  });
});
