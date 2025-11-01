import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/projects/[id]/simulations
 *
 * Lists all simulations for the given project if the user owns the
 * project or is an admin.
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const { id: projectId } = params;
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    return new NextResponse('Not found', { status: 404 });
  }
  if (project.userId !== session.user.id && session.user.role !== 'ADMIN') {
    return new NextResponse('Forbidden', { status: 403 });
  }
  const simulations = await prisma.simulation.findMany({
    where: { projectId },
  });
  return NextResponse.json(simulations);
}
