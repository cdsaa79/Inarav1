import { PrismaClient } from '@prisma/client';

/**
 * A singleton Prisma client for the app.  In development, Next.js
 * hot reloading can instantiate multiple copies of the Prisma client
 * unless we store it on the global object.  This module ensures
 * that only one instance exists across reloads.
 */
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
