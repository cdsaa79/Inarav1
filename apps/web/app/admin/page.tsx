import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/');
  }
  const pending = await prisma.technology.findMany({ where: { approved: false } });
  return (
    <main className="min-h-screen p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Console</h1>
      <h2 className="text-xl font-semibold">Pending technologies</h2>
      <PendingList pending={pending} />
    </main>
  );
}

// Client component for listing pending technologies with approve actions.
function PendingList({ pending }: { pending: any[] }) {
  'use client';
  const { useState } = require('react');
  const [items, setItems] = useState(pending);
  async function approve(id: string) {
    await fetch('/api/admin/approve-tech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ technologyId: id }),
    });
    setItems(items.filter((item) => item.id !== id));
  }
  if (items.length === 0) {
    return <p>No pending technologies.</p>;
  }
  return (
    <div className="space-y-4">
      {items.map((tech) => (
        <div key={tech.id} className="p-4 border rounded flex justify-between items-center">
          <div>
            <h3 className="font-semibold">{tech.name}</h3>
            <p className="text-sm text-gray-600">{tech.shortDesc || 'No description'}</p>
          </div>
          <button
            onClick={() => approve(tech.id)}
            className="px-3 py-2 bg-green-600 text-white rounded"
          >
            Approve
          </button>
        </div>
      ))}
    </div>
  );
}
