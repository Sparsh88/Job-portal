import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

// Always maintain global reference to reuse connection pool across invocations
globalForPrisma.prisma = prisma;

/**
 * Pre-warm the database connection pool eagerly on server startup.
 * Non-blocking with timeout protection so startup never hangs.
 */
export async function warmupDatabaseConnection(): Promise<boolean> {
  try {
    const warmupPromise = prisma.$queryRaw`SELECT 1`;
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database warmup timeout (5000ms)')), 5000)
    );
    await Promise.race([warmupPromise, timeoutPromise]);
    console.log('⚡ Database connection pool successfully warmed up and ready.');
    return true;
  } catch (err: any) {
    console.warn(`⚠️ Database warmup warning: ${err?.message || err}. Queries will connect on-demand.`);
    return false;
  }
}
