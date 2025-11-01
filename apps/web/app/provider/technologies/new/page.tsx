"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewTechnologyPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Energy');
  const [type, setType] = useState('Hardware');
  const [shortDesc, setShortDesc] = useState('');
  const [capexMin, setCapexMin] = useState('');
  const [capexMax, setCapexMax] = useState('');
  const [benefitEnergyPct, setBenefitEnergyPct] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/providers/technologies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          category,
          type,
          shortDesc,
          capexMin: capexMin ? parseFloat(capexMin) : null,
          capexMax: capexMax ? parseFloat(capexMax) : null,
          benefitEnergyPct: benefitEnergyPct ? parseFloat(benefitEnergyPct) : null,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        setError(text || 'Failed to submit technology');
        return;
      }
      router.push('/provider');
    } catch (err) {
      setError('Failed to submit technology');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white shadow p-6 space-y-4 rounded">
        <h1 className="text-2xl font-bold text-center">Add Technology</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <label className="block text-sm font-medium">Name</label>
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
            <label className="block text-sm font-medium">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 w-full p-2 border rounded">
              {['Energy', 'Water', 'Waste', 'Transport', 'Materials', 'Circular', 'Smart Cities'].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 w-full p-2 border rounded">
              {['Hardware', 'Software', 'Process'].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Short description</label>
          <textarea
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            className="mt-1 w-full p-2 border rounded"
            rows={3}
          />
        </div>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium">CAPEX min (USD)</label>
            <input
              type="number"
              value={capexMin}
              onChange={(e) => setCapexMin(e.target.value)}
              className="mt-1 w-full p-2 border rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium">CAPEX max (USD)</label>
            <input
              type="number"
              value={capexMax}
              onChange={(e) => setCapexMax(e.target.value)}
              className="mt-1 w-full p-2 border rounded"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Energy saving (%)</label>
          <input
            type="number"
            step="0.01"
            value={benefitEnergyPct}
            onChange={(e) => setBenefitEnergyPct(e.target.value)}
            className="mt-1 w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded">
          Submit
        </button>
      </form>
    </div>
  );
}
