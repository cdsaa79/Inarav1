import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

interface PageProps {
  params: { id: string };
}

/**
 * Project detail page.  Displays baseline metrics and a list of
 * simulations associated with this project.  Provides a link to run a
 * new simulation by browsing technologies.
 */
export default async function ProjectDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    redirect('/login');
  }
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: { simulations: true },
  });
  if (!project) {
    return <div className="p-4">Project not found</div>;
  }
  if (project.userId !== session.user.id && session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }
  return (
    <main className="min-h-screen p-6 space-y-6">
      <Link href="/dashboard" className="text-blue-600 underline">← Back to dashboard</Link>
      <h1 className="text-2xl font-bold">{project.name}</h1>
      <div className="grid grid-cols-2 gap-4">
        {project.baselineEnergyKwh != null && <p><strong>Energy baseline:</strong> {project.baselineEnergyKwh} kWh</p>}
        {project.baselineWaterM3 != null && <p><strong>Water baseline:</strong> {project.baselineWaterM3} m³</p>}
        {project.baselineWasteTpy != null && <p><strong>Waste baseline:</strong> {project.baselineWasteTpy} tpy</p>}
        {project.annualBudgetUsd != null && <p><strong>Budget:</strong> ${project.annualBudgetUsd}</p>}
      </div>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Simulations</h2>
        <Link href={`/dashboard/projects/${project.id}/simulate`} className="px-3 py-2 bg-blue-600 text-white rounded">Run simulation</Link>
      </div>
      {project.simulations.length === 0 ? (
        <p>No simulations yet.</p>
      ) : (
        <div className="space-y-2">
          {project.simulations.map((sim) => (
            <div key={sim.id} className="p-4 border rounded">
              <p><strong>Simulation ID:</strong> {sim.id}</p>
              <p><strong>ROI:</strong> {sim.roiPct?.toFixed(2)}%</p>
              <p><strong>Payback:</strong> {sim.paybackYears ? sim.paybackYears.toFixed(2) : 'N/A'} yrs</p>
              <p><strong>CO₂ reduction:</strong> {sim.co2ReductionTpy} tpy</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
