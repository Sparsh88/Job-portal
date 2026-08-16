import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../config/db';
import { AuthenticatedRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(['JOB_SEEKER', 'RECRUITER', 'ADMIN']).default('JOB_SEEKER'),
  companyName: z.string().optional(),
});

export const register = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const parseResult = registerSchema.safeParse(req.body);
  if (!parseResult.success) {
    throw new AppError(parseResult.error.errors[0].message, 400);
  }

  const { email, password, name, role, companyName } = parseResult.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError('User with this email already exists.', 400);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      role,
      isVerified: true,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      ...(role === 'JOB_SEEKER'
        ? {
            profile: {
              create: {
                skills: [],
                experienceYears: 0,
              },
            },
          }
        : {}),
      ...(role === 'RECRUITER' && companyName
        ? {
            company: {
              create: {
                name: companyName,
                description: `${companyName} technology company profile.`,
                industry: 'Information Technology',
                location: 'Remote',
              },
            },
          }
        : {}),
    },
    include: {
      profile: true,
      company: true,
    },
  });

  const tokenPayload = { userId: user.id, email: user.email, role: user.role };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  res.status(201).json({
    success: true,
    message: 'Account registered successfully.',
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
        profile: user.profile,
        company: user.company,
      },
      accessToken,
      refreshToken,
    },
  });
});

export const login = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { email, password, role } = req.body;
  if (!email || !password) {
    throw new AppError('Please provide both email and password.', 400);
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      profile: true,
      company: true,
    },
  });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new AppError('Invalid email or password credentials.', 401);
  }

  // Enforce portal role segregation: ensure account role matches portal being accessed
  if (role && user.role !== role) {
    const roleLabels: Record<string, string> = {
      JOB_SEEKER: 'Candidate / Job Seeker',
      RECRUITER: 'Recruiter',
      ADMIN: 'Admin',
    };
    const targetLabel = roleLabels[role] || role;
    const currentLabel = roleLabels[user.role] || user.role;
    throw new AppError(`Access denied: This account has ${currentLabel} access and cannot log in via the ${targetLabel} portal. Please switch to the correct portal.`, 403);
  }

  const tokenPayload = { userId: user.id, email: user.email, role: user.role };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  res.status(200).json({
    success: true,
    message: 'Log in successful.',
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
        profile: user.profile,
        company: user.company,
      },
      accessToken,
      refreshToken,
    },
  });
});

export const refreshToken = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { refreshToken: token } = req.body;
  if (!token) {
    throw new AppError('Refresh token is required.', 400);
  }

  try {
    const decoded = verifyRefreshToken(token);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user) {
      throw new AppError('User belonging to this token no longer exists.', 401);
    }

    const tokenPayload = { userId: user.id, email: user.email, role: user.role };
    const newAccessToken = generateAccessToken(tokenPayload);

    res.status(200).json({
      success: true,
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    throw new AppError('Invalid or expired refresh token.', 401);
  }
});

export const getMe = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      company: true,
    },
  });

  if (!user) {
    throw new AppError('User profile not found.', 404);
  }

  res.status(200).json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl,
      profile: user.profile,
      company: user.company,
    },
  });
});
