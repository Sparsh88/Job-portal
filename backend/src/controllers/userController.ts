import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthenticatedRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { uploadToCloudinary } from '../services/cloudinaryService';

export const getProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          avatarUrl: true,
        },
      },
    },
  });

  res.status(200).json({
    success: true,
    data: profile,
  });
});

export const updateProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  const {
    bio,
    title,
    phone,
    location,
    skills,
    experienceYears,
    resumeUrl,
    resumeName,
    githubUrl,
    linkedinUrl,
    portfolioUrl,
    targetRole,
    expectedSalary,
    name,
  } = req.body;

  if (name) {
    await prisma.user.update({
      where: { id: userId },
      data: { name },
    });
  }

  const updatedProfile = await prisma.profile.upsert({
    where: { userId: userId! },
    update: {
      bio,
      title,
      phone,
      location,
      skills: Array.isArray(skills) ? skills : undefined,
      experienceYears: experienceYears ? parseInt(experienceYears) : undefined,
      resumeUrl,
      resumeName,
      githubUrl,
      linkedinUrl,
      portfolioUrl,
      targetRole,
      expectedSalary: expectedSalary ? parseInt(expectedSalary) : undefined,
    },
    create: {
      userId: userId!,
      bio,
      title,
      phone,
      location,
      skills: Array.isArray(skills) ? skills : [],
      experienceYears: experienceYears ? parseInt(experienceYears) : 0,
      resumeUrl,
      resumeName,
      githubUrl,
      linkedinUrl,
      portfolioUrl,
      targetRole,
      expectedSalary: expectedSalary ? parseInt(expectedSalary) : 0,
    },
  });

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully.',
    data: updatedProfile,
  });
});

export const uploadResume = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  const fileName = req.body.fileName || 'candidate_resume.pdf';

  // Demo upload link generation (Cloudinary simulation)
  const mockBuffer = Buffer.from('PDF Content Simulation');
  const uploadedUrl = await uploadToCloudinary(mockBuffer, fileName);

  await prisma.profile.upsert({
    where: { userId: userId! },
    update: {
      resumeUrl: uploadedUrl,
      resumeName: fileName,
    },
    create: {
      userId: userId!,
      resumeUrl: uploadedUrl,
      resumeName: fileName,
      skills: [],
    },
  });

  res.status(200).json({
    success: true,
    message: 'Resume uploaded successfully.',
    data: {
      resumeUrl: uploadedUrl,
      fileName,
    },
  });
});

export const toggleSaveJob = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  const { jobId } = req.params;

  const existingSave = await prisma.savedJob.findUnique({
    where: {
      userId_jobId: {
        userId: userId!,
        jobId,
      },
    },
  });

  if (existingSave) {
    await prisma.savedJob.delete({
      where: { id: existingSave.id },
    });
    return res.status(200).json({
      success: true,
      message: 'Job removed from saved items.',
      saved: false,
    });
  }

  await prisma.savedJob.create({
    data: {
      userId: userId!,
      jobId,
    },
  });

  res.status(200).json({
    success: true,
    message: 'Job saved to bookmarked items.',
    saved: true,
  });
});

export const getSavedJobs = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  const saved = await prisma.savedJob.findMany({
    where: { userId },
    include: {
      job: {
        include: {
          company: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json({
    success: true,
    data: saved.map((s: any) => s.job),
  });
});
