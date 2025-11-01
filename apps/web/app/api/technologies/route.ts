import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/technologies
 *
 * List approved technologies.  Supports optional query parameters:
 *   - category: filter by category name (case sensitive)
 *   - q: free text search on name or tags
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const q = searchParams.get('q') || undefined;

  const where: any = { approved: true };
  if (category) {
    where.category = category;
  }
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { tags: { contains: q, mode: 'insensitive' } },
    ];
  }

  const technologies = await prisma.technology.findMany({
    where,
    include: {
      Vendors: {
        include: { Vendor: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(technologies);
}
