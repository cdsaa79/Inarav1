import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { runSimulation } from '@/lib/simulation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * POST /api/simulate
 *
 * Body parameters:
 *   technologyId: string
 *   projectId: string
 *   baseline: { baselineEnergyKwh?, baselineWaterM3?, baselineWasteTpy?, annualBudgetUsd? }
 *   tariffs: { kwh: number, m3: number }
 *
 * Requires an authenticated user.  Performs a rule-based simulation
 * based on the technology coefficients and baseline values.  Persists
 * the result into the `Simulation` table and returns the computed
 * values.
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const body = await request.json();
  const { technologyId, projectId, baseline, tariffs } = body;
  if (!technologyId || !projectId || !tariffs) {
    return new NextResponse('Invalid request', { status: 400 });
  }
  // Fetch technology coefficients
  const tech = await prisma.technology.findUnique({
    where: { id: technologyId },
  });
  if (!tech || !tech.approved) {
    return new NextResponse('Technology not found', { status: 404 });
  }
  const result = runSimulation(
    baseline || {},
    tech,
    tariffs,
  );
  // Persist simulation
  const simRecord = await prisma.simulation.create({
    data: {
      userId: session.user.id as string,
      projectId,
      technologyId,
      baselineEnergyKwh: baseline?.baselineEnergyKwh ?? null,
      baselineWaterM3: baseline?.baselineWaterM3 ?? null,
      baselineWasteTpy: baseline?.baselineWasteTpy ?? null,
      annualBudgetUsd: baseline?.annualBudgetUsd ?? null,
      paramsJson: JSON.stringify({ tariffs }),
      annualSavingsUsd: result.annualSavingsUsd,
      roiPct: result.roiPct,
      paybackYears: result.paybackYears ?? null,
      co2ReductionTpy: result.co2ReductionTpy,
      confidencePct: result.confidencePct,
    },
  });
  return NextResponse.json(simRecord);
}
