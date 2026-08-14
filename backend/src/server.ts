import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { prisma, warmupDatabaseConnection } from './config/db';
import { seedDatabaseIfEmpty } from './utils/seedDb';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
const HOST = '0.0.0.0';

const server = app.listen(PORT, HOST, async () => {
  console.log(`🚀 HireHub-AI Backend Server running on http://${HOST}:${PORT}`);
  console.log(`📡 REST APIs ready at http://${HOST}:${PORT}/api/`);
  try {
    // Eagerly pre-warm the connection pool in background without blocking server responsiveness
    warmupDatabaseConnection().catch((err: any) => {
      console.warn(`⚠️ Database warmup notice: ${err?.message || err}`);
    });
    await seedDatabaseIfEmpty();
  } catch (startupErr: any) {
    console.error('⚠️ Startup initialization warning:', startupErr?.message || startupErr);
  }
});

// Process-level unhandled rejection & exception handlers to prevent silent crashes
process.on('unhandledRejection', (reason: any) => {
  console.error('💥 Unhandled Rejection at Promise:', reason?.stack || reason);
});

process.on('uncaughtException', (err: Error) => {
  console.error('💥 Uncaught Exception thrown:', err.stack || err);
});

// Graceful shutdown handling
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, closing HTTP server...');
  await prisma.$disconnect();
  server.close(() => {
    process.exit(0);
  });
});
