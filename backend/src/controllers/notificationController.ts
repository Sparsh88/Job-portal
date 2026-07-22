import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthenticatedRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';

export const getNotifications = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;

  const [unreadCount, notifications] = await Promise.all([
    prisma.notification.count({
      where: { userId, isRead: false },
    }),
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      unreadCount,
      notifications,
    },
  });
});

export const markNotificationRead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  await prisma.notification.updateMany({
    where: { id, userId },
    data: { isRead: true },
  });

  res.status(200).json({
    success: true,
    message: 'Notification marked as read.',
  });
});

export const markAllNotificationsRead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;

  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read.',
  });
});
