import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthenticatedRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { generateMockInterviewQuestions, evaluateInterviewResponse } from '../services/aiService';

type InterviewStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
type ApplicationStatus = 'APPLIED' | 'IN_REVIEW' | 'SHORTLISTED' | 'INTERVIEW_SCHEDULED' | 'REJECTED' | 'ACCEPTED';

export const scheduleInterview = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const recruiterId = req.user?.userId;
  const { applicationId, candidateId, scheduledAt, durationMins, meetingLink, format, notes } = req.body;

  if (!applicationId || !candidateId || !scheduledAt) {
    throw new AppError('Application ID, Candidate ID, and scheduled date/time are required.', 400);
  }

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { job: true },
  });

  if (!application) {
    throw new AppError('Application not found.', 404);
  }

  const interview = await prisma.interview.create({
    data: {
      applicationId,
      recruiterId: recruiterId!,
      candidateId,
      scheduledAt: new Date(scheduledAt),
      durationMins: durationMins ? parseInt(durationMins) : 45,
      meetingLink: meetingLink || 'https://meet.google.com/hirehub-ai-mock',
      format: format || 'Video Call',
      notes,
      status: 'SCHEDULED' as any,
    },
  });

  // Update application status to INTERVIEW_SCHEDULED
  await prisma.application.update({
    where: { id: applicationId },
    data: { status: 'INTERVIEW_SCHEDULED' as any },
  });

  // Create candidate notification
  await prisma.notification.create({
    data: {
      userId: candidateId,
      title: 'Interview Scheduled!',
      message: `An interview has been scheduled for ${application.job.title} on ${new Date(scheduledAt).toLocaleString()}.`,
      type: 'INTERVIEW',
      link: '/candidate/dashboard',
    },
  });

  res.status(201).json({
    success: true,
    message: 'Interview scheduled successfully.',
    data: interview,
  });
});

export const getMyInterviews = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  const role = req.user?.role;

  const whereClause =
    role === 'RECRUITER' ? { recruiterId: userId } : { candidateId: userId };

  const interviews = await prisma.interview.findMany({
    where: whereClause,
    include: {
      application: {
        include: {
          job: {
            include: { company: true },
          },
        },
      },
      recruiter: {
        select: { id: true, name: true, email: true, avatarUrl: true },
      },
      candidate: {
        select: { id: true, name: true, email: true, avatarUrl: true },
      },
    },
    orderBy: { scheduledAt: 'asc' },
  });

  res.status(200).json({
    success: true,
    data: interviews,
  });
});

export const updateInterview = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status, notes, feedback } = req.body;

  const updatedInterview = await prisma.interview.update({
    where: { id },
    data: {
      status: status as any,
      notes,
      feedback,
    },
  });

  res.status(200).json({
    success: true,
    message: 'Interview details updated successfully.',
    data: updatedInterview,
  });
});

export const getAIMockQuestions = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { category = 'Software Engineering' } = req.query;
  const questions = generateMockInterviewQuestions(category as string);

  res.status(200).json({
    success: true,
    data: questions,
  });
});

export const evaluateAIMockResponse = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { answer } = req.body;
  if (!answer) {
    throw new AppError('Answer text is required for AI evaluation.', 400);
  }

  const evaluation = evaluateInterviewResponse(answer);

  res.status(200).json({
    success: true,
    data: evaluation,
  });
});
