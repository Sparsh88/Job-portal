import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { prisma } from './config/db';
import { seedDatabaseIfEmpty } from './utils/seedDb';

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, async () => {
  console.log(`🚀 HireHub-AI Backend Server running on http://localhost:${PORT}`);
  console.log(`📡 REST APIs ready at http://localhost:${PORT}/api/`);
  await seedDatabaseIfEmpty();
});

// Graceful shutdown handling
process.on('SIGINT', async () => {
  console.log(' shutting down gracefully...');
  await prisma.$disconnect();
  server.close(() => {
    process.exit(0);
  });
});
