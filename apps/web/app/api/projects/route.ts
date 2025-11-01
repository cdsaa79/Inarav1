import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * POST /api/projects
 *
 * Creates a new project for the authenticated user.  Accepts
 * `name`, `industry`, `location`, `baselineEnergyKwh`,
 * `baselineWaterM3`, `baselineWasteTpy`, and `annualBudgetUsd` in the
 * request body.  Returns the created project.  GET is not
 * implemented here.
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const body = await request.json();
  const { name, industry, location, baselineEnergyKwh, baselineWaterM3, baselineWasteTpy, annualBudgetUsd } = body;
  if (!name) {
    return new NextResponse('Name is required', { status: 400 });
  }
  const project = await prisma.project.create({
    data: {
      userId: session.user.id as string,
      name,
      industry: industry ?? null,
      location: location ?? null,
      baselineEnergyKwh: baselineEnergyKwh ?? null,
      baselineWaterM3: baselineWaterM3 ?? null,
      baselineWasteTpy: baselineWasteTpy ?? null,
      annualBudgetUsd: annualBudgetUsd ?? null,
    },
  });
  return NextResponse.json(project);
}
