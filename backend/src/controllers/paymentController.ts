import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthenticatedRequest } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { createRazorpayOrder, verifyRazorpaySignature } from '../services/razorpayService';

type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export const createPaymentOrder = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  const { planType, amountINR } = req.body;

  if (!planType || !amountINR) {
    throw new AppError('Plan type and amount in INR are required.', 400);
  }

  const razorpayOrder = await createRazorpayOrder(amountINR, `rcpt_${userId?.substring(0, 8)}`);

  const payment = await prisma.payment.create({
    data: {
      userId: userId!,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      planType,
      status: 'PENDING' as any,
    },
  });

  res.status(201).json({
    success: true,
    data: {
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_HireHubDemoKey123',
      paymentId: payment.id,
    },
  });
});

export const verifyPayment = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  const payment = await prisma.payment.findUnique({
    where: { razorpayOrderId },
  });

  if (!payment) {
    throw new AppError('Payment order record not found.', 404);
  }

  const isValid = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

  if (!isValid) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'FAILED' as any },
    });
    throw new AppError('Invalid payment signature verification failed.', 400);
  }

  const updatedPayment = await prisma.payment.update({
    where: { id: payment.id },
    data: {
      razorpayPaymentId,
      status: 'COMPLETED' as any,
    },
  });

  // Create receipt notification
  await prisma.notification.create({
    data: {
      userId: userId!,
      title: 'Payment Successful',
      message: `Your payment of ₹${payment.amount / 100} for ${payment.planType} was completed successfully.`,
      type: 'PAYMENT',
      link: '/pricing',
    },
  });

  res.status(200).json({
    success: true,
    message: 'Payment verified and feature unlocked successfully.',
    data: updatedPayment,
  });
});

export const getPaymentHistory = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  const payments = await prisma.payment.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json({
    success: true,
    data: payments,
  });
});
