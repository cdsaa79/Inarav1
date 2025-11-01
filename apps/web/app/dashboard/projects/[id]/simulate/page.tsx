import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

interface PageProps {
  params: { id: string };
}

export default async function SimulatePage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    redirect('/login');
  }
  const project = await prisma.project.findUnique({ where: { id: params.id } });
  if (!project) {
    return <div className="p-4">Project not found</div>;
  }
  if (project.userId !== session.user.id && session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }
  const technologies = await prisma.technology.findMany({ where: { approved: true } });
  return (
    <main className="min-h-screen p-6 space-y-4">
      <Link href={`/dashboard/projects/${project.id}`} className="text-blue-600 underline">← Back to project</Link>
      <h1 className="text-2xl font-bold">Run simulation</h1>
      <SimulationForm projectId={project.id} baseline={project} technologies={technologies} />
    </main>
  );
}

// Client component that renders the simulation form.  It receives
// pre-fetched baseline and technology options from the server.
// eslint-disable-next-line @next/next/no-client-import-in-server-component
function SimulationForm({ projectId, baseline, technologies }: { projectId: string; baseline: any; technologies: any[] }) {
  'use client';
  const { useState } = require('react');
  const { useRouter } = require('next/navigation');
  const router = useRouter();
  const [technologyId, setTechnologyId] = useState(technologies[0]?.id || '');
  const [tariffKwh, setTariffKwh] = useState('0.1');
  const [tariffM3, setTariffM3] = useState('1');
  const [error, setError] = useState('');

  async function handleSubmit(e: any) {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          technologyId,
          projectId,
          baseline: {
            baselineEnergyKwh: baseline.baselineEnergyKwh,
            baselineWaterM3: baseline.baselineWaterM3,
            baselineWasteTpy: baseline.baselineWasteTpy,
            annualBudgetUsd: baseline.annualBudgetUsd,
          },
          tariffs: {
            kwh: parseFloat(tariffKwh),
            m3: parseFloat(tariffM3),
          },
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        setError(text || 'Simulation failed');
        return;
      }
      // On success, go back to project page to show the new simulation.
      router.push(`/dashboard/projects/${projectId}`);
    } catch (err) {
      setError('Simulation failed');
    }
  }
  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div>
        <label className="block text-sm font-medium">Technology</label>
        <select value={technologyId} onChange={(e) => setTechnologyId(e.target.value)} className="mt-1 w-full p-2 border rounded">
          {technologies.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium">Electricity tariff (USD/kWh)</label>
          <input
            type="number"
            step="0.01"
            value={tariffKwh}
            onChange={(e) => setTariffKwh(e.target.value)}
            className="mt-1 w-full p-2 border rounded"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium">Water tariff (USD/m³)</label>
          <input
            type="number"
            step="0.1"
            value={tariffM3}
            onChange={(e) => setTariffM3(e.target.value)}
            className="mt-1 w-full p-2 border rounded"
            required
          />
        </div>
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        Run Simulation
      </button>
    </form>
  );
}
