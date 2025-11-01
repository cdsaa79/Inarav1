import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/projects/[id]
 *
 * Returns the specified project if the authenticated user owns it
 * (or is an admin).  Includes simulations on that project.
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const { id } = params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: { simulations: true },
  });
  if (!project) {
    return new NextResponse('Not found', { status: 404 });
  }
  if (project.userId !== session.user.id && session.user.role !== 'ADMIN') {
    return new NextResponse('Forbidden', { status: 403 });
  }
  return NextResponse.json(project);
}
