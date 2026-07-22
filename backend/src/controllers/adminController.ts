import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthenticatedRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';

export const getAdminMetrics = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const [
    totalUsers,
    candidateCount,
    recruiterCount,
    totalJobs,
    totalApplications,
    completedPayments,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'JOB_SEEKER' } }),
    prisma.user.count({ where: { role: 'RECRUITER' } }),
    prisma.job.count(),
    prisma.application.count(),
    prisma.payment.findMany({ where: { status: 'COMPLETED' } }),
  ]);

  const totalRevenueINR = completedPayments.reduce((acc: number, p: any) => acc + p.amount / 100, 0);

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      candidateCount,
      recruiterCount,
      totalJobs,
      totalApplications,
      totalRevenueINR,
    },
  });
});

export const getAllUsers = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isVerified: true,
      avatarUrl: true,
      createdAt: true,
      profile: {
        select: { title: true, location: true },
      },
      company: {
        select: { name: true, industry: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json({
    success: true,
    data: users,
  });
});

export const updateUserRole = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { role, isVerified } = req.body;

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      role,
      isVerified,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isVerified: true,
    },
  });

  res.status(200).json({
    success: true,
    message: 'User permissions updated.',
    data: updatedUser,
  });
});

export const deleteUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  await prisma.user.delete({ where: { id } });

  res.status(200).json({
    success: true,
    message: 'User deleted from platform.',
  });
});
