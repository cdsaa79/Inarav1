"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [baselineEnergyKwh, setBaselineEnergyKwh] = useState('');
  const [baselineWaterM3, setBaselineWaterM3] = useState('');
  const [baselineWasteTpy, setBaselineWasteTpy] = useState('');
  const [annualBudgetUsd, setAnnualBudgetUsd] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          industry: industry || null,
          location: location || null,
          baselineEnergyKwh: baselineEnergyKwh ? parseFloat(baselineEnergyKwh) : null,
          baselineWaterM3: baselineWaterM3 ? parseFloat(baselineWaterM3) : null,
          baselineWasteTpy: baselineWasteTpy ? parseFloat(baselineWasteTpy) : null,
          annualBudgetUsd: annualBudgetUsd ? parseFloat(annualBudgetUsd) : null,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        setError(text || 'Failed to create project');
        return;
      }
      const data = await res.json();
      router.push(`/dashboard/projects/${data.id}`);
    } catch (err) {
      setError('Failed to create project');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white shadow p-6 space-y-4 rounded">
        <h1 className="text-2xl font-bold text-center">Create Project</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <label className="block text-sm font-medium">Project name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full p-2 border rounded"
            required
          />
        </div>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium">Industry</label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="mt-1 w-full p-2 border rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 w-full p-2 border rounded"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Baseline energy (kWh)</label>
            <input
              type="number"
              value={baselineEnergyKwh}
              onChange={(e) => setBaselineEnergyKwh(e.target.value)}
              className="mt-1 w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Baseline water (m³)</label>
            <input
              type="number"
              value={baselineWaterM3}
              onChange={(e) => setBaselineWaterM3(e.target.value)}
              className="mt-1 w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Baseline waste (tpy)</label>
            <input
              type="number"
              value={baselineWasteTpy}
              onChange={(e) => setBaselineWasteTpy(e.target.value)}
              className="mt-1 w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Annual budget (USD)</label>
            <input
              type="number"
              value={annualBudgetUsd}
              onChange={(e) => setAnnualBudgetUsd(e.target.value)}
              className="mt-1 w-full p-2 border rounded"
            />
          </div>
        </div>
        <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded">
          Save Project
        </button>
      </form>
    </div>
  );
}
