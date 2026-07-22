import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthenticatedRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { calculateSkillMatch } from '../services/aiService';

type ApplicationStatus = 'APPLIED' | 'IN_REVIEW' | 'SHORTLISTED' | 'INTERVIEW_SCHEDULED' | 'REJECTED' | 'ACCEPTED';

export const applyForJob = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const applicantId = req.user?.userId;
  const { jobId, coverLetter, resumeUrl } = req.body;

  if (!jobId) {
    throw new AppError('Job ID is required to apply.', 400);
  }

  const existingApplication = await prisma.application.findUnique({
    where: {
      jobId_applicantId: {
        jobId,
        applicantId: applicantId!,
      },
    },
  });

  if (existingApplication) {
    throw new AppError('You have already submitted an application for this position.', 400);
  }

  const [job, profile] = await Promise.all([
    prisma.job.findUnique({
      where: { id: jobId },
      include: { recruiter: true },
    }),
    prisma.profile.findUnique({ where: { userId: applicantId } }),
  ]);

  if (!job) {
    throw new AppError('Job not found.', 404);
  }

  const finalResumeUrl = resumeUrl || profile?.resumeUrl || 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf';
  const candidateSkills = profile?.skills || [];
  const matchResult = calculateSkillMatch(candidateSkills, job.skillsRequired);

  const application = await prisma.application.create({
    data: {
      jobId,
      applicantId: applicantId!,
      resumeUrl: finalResumeUrl,
      coverLetter,
      matchScore: matchResult.matchScore,
      status: 'APPLIED' as any,
    },
    include: {
      job: {
        include: { company: true },
      },
    },
  });

  // Create notifications
  await Promise.all([
    prisma.notification.create({
      data: {
        userId: applicantId!,
        title: 'Application Submitted!',
        message: `Your application for ${job.title} at ${job.companyId} has been successfully sent.`,
        type: 'APPLICATION',
        link: '/candidate/dashboard',
      },
    }),
    prisma.notification.create({
      data: {
        userId: job.recruiterId,
        title: 'New Candidate Applicant',
        message: `A new candidate applied for ${job.title} with AI Match Score: ${matchResult.matchScore}%.`,
        type: 'APPLICATION',
        link: '/recruiter/dashboard',
      },
    }),
  ]);

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully.',
    data: application,
  });
});

export const getMyApplications = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const applicantId = req.user?.userId;

  const applications = await prisma.application.findMany({
    where: { applicantId },
    include: {
      job: {
        include: {
          company: true,
        },
      },
      interviews: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json({
    success: true,
    data: applications,
  });
});

export const getJobApplications = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { jobId } = req.params;
  const recruiterId = req.user?.userId;
  const role = req.user?.role;

  const job = await prisma.job.findUnique({ where: { id: jobId } });

  if (!job) {
    throw new AppError('Job not found.', 404);
  }

  if (role !== 'ADMIN' && job.recruiterId !== recruiterId) {
    throw new AppError('Unauthorized to access applications for this job.', 403);
  }

  const applications = await prisma.application.findMany({
    where: { jobId },
    include: {
      applicant: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
          profile: true,
        },
      },
      interviews: true,
    },
    orderBy: [{ matchScore: 'desc' }, { createdAt: 'desc' }],
  });

  res.status(200).json({
    success: true,
    data: applications,
  });
});

export const updateApplicationStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status, recruiterFeedback } = req.body;
  const recruiterId = req.user?.userId;
  const role = req.user?.role;

  const application = await prisma.application.findUnique({
    where: { id },
    include: { job: true },
  });

  if (!application) {
    throw new AppError('Application record not found.', 404);
  }

  if (role !== 'ADMIN' && application.job.recruiterId !== recruiterId) {
    throw new AppError('Unauthorized to update this application status.', 403);
  }

  const updatedApplication = await prisma.application.update({
    where: { id },
    data: {
      status: status as any,
      recruiterFeedback,
    },
  });

  // Notify applicant about status change
  await prisma.notification.create({
    data: {
      userId: application.applicantId,
      title: `Application Status Updated: ${status.replace('_', ' ')}`,
      message: `Your application status for ${application.job.title} was updated to ${status}.`,
      type: 'APPLICATION',
      link: '/candidate/dashboard',
    },
  });

  res.status(200).json({
    success: true,
    message: 'Application status updated successfully.',
    data: updatedApplication,
  });
});

export const withdrawApplication = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const applicantId = req.user?.userId;

  const application = await prisma.application.findUnique({ where: { id } });

  if (!application) {
    throw new AppError('Application not found.', 404);
  }

  if (application.applicantId !== applicantId) {
    throw new AppError('Unauthorized to withdraw this application.', 403);
  }

  await prisma.application.delete({ where: { id } });

  res.status(200).json({
    success: true,
    message: 'Application withdrawn successfully.',
  });
});
