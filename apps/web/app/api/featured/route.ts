import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/featured
 *
 * Returns the currently featured technology.  If a feature rotation
 * exists for the current date, that technology is returned.  If not,
 * the oldest approved technology is chosen as a fallback.  Only
 * approved technologies are exposed to unauthenticated users.
 */
export async function GET() {
  // Find a rotation entry covering today.
  const now = new Date();
  const rotation = await prisma.featuredRotation.findFirst({
    where: {
      startDate: { lte: now },
      endDate: { gte: now },
    },
    include: { technology: true },
  });
  if (rotation?.technology && rotation.technology.approved) {
    return NextResponse.json(rotation.technology);
  }
  // Fallback to the first approved technology.
  const tech = await prisma.technology.findFirst({ where: { approved: true } });
  return NextResponse.json(tech);
}
