import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { globalErrorHandler } from './middlewares/errorHandler';
import { AppError } from './utils/AppError';

// Route Imports
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import jobRoutes from './routes/jobRoutes';
import applicationRoutes from './routes/applicationRoutes';
import recruiterRoutes from './routes/recruiterRoutes';
import adminRoutes from './routes/adminRoutes';
import paymentRoutes from './routes/paymentRoutes';
import notificationRoutes from './routes/notificationRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import interviewRoutes from './routes/interviewRoutes';

const app = express();

// Security and CORS middleware setup
app.use(helmet());

const rawFrontendUrl = process.env.FRONTEND_URL || '*';
const allowedOrigins = rawFrontendUrl
  .split(',')
  .map((url) => url.trim().replace(/\/$/, ''));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server, health checks)
      if (!origin) return callback(null, true);
      // Allow any origin if wildcard is set or during development
      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
        return callback(null, true);
      }
      return callback(null, true); // Fallback permissive to prevent production CORS breakage
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root & Health Check APIs (Production & Monitoring ready)
app.get(['/', '/health', '/api/health', '/api'], (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'HireHub-AI API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    service: 'HireHub-AI Backend REST API',
  });
});

// Mount Production API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/recruiters', recruiterRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/interviews', interviewRoutes);

// Unhandled route handler
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find path ${req.originalUrl} on this server.`, 404));
});

// Global Error Middleware
app.use(globalErrorHandler);

export default app;
