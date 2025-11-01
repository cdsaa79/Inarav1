import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * POST /api/admin/approve-tech
 *
 * Approves a technology so that it becomes visible in browse
 * endpoints.  Requires an admin session.  The request body must
 * contain `technologyId`.
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const body = await request.json();
  const { technologyId } = body;
  if (!technologyId) {
    return new NextResponse('technologyId is required', { status: 400 });
  }
  const tech = await prisma.technology.update({
    where: { id: technologyId },
    data: { approved: true },
  });
  return NextResponse.json(tech);
}
