import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { AppError } from '../utils/AppError';

export type Role = 'JOB_SEEKER' | 'RECRUITER' | 'ADMIN';

export const restrictTo = (...allowedRoles: (Role | string)[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(
        new AppError('Permission denied. You do not have authorization to perform this action.', 403)
      );
    }
    next();
  };
};
