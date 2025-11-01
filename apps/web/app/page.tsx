import Link from 'next/link';
import { prisma } from '@/lib/prisma';

/**
 * Landing page.  Displays a hero section with a rotating featured
 * technology, static value propositions, and calls to action.  As
 * per the MVP spec, unregistered visitors can view one full
 * technology per day; here we simply surface the first approved
 * technology as the featured item.
 */
export default async function Home() {
  // Fetch the featured technology via Prisma.  We do not call the
  // API route here to avoid an extra HTTP hop.
  const tech = await prisma.technology.findFirst({
    where: { approved: true },
    orderBy: { createdAt: 'desc' },
  });
  return (
    <main className="min-h-screen flex flex-col items-center justify-start py-16 px-4 space-y-12">
      <section className="text-center max-w-2xl space-y-4">
        <h1 className="text-3xl font-bold">Simulate your sustainability impact before you invest</h1>
        <p className="text-gray-600">Explore technologies that improve energy, water and waste efficiency — all backed by data.</p>
        <div className="space-x-4">
          <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded">Sign In</Link>
          <Link href="/register" className="px-4 py-2 bg-gray-200 rounded">Register</Link>
        </div>
      </section>
      {tech && (
        <section className="w-full max-w-3xl bg-white shadow p-6 rounded">
          <h2 className="text-xl font-semibold mb-2">Featured Technology</h2>
          <h3 className="text-lg font-bold">{tech.name}</h3>
          <p className="text-gray-700 mt-2">{tech.shortDesc || 'No description available.'}</p>
          <Link href={`/browse/${tech.id}`} className="mt-4 inline-block text-blue-600 underline">
            View details
          </Link>
        </section>
      )}
      <section className="w-full max-w-3xl">
        <h2 className="text-xl font-semibold mb-4">Explore by category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {['Energy', 'Water', 'Waste', 'Transport', 'Materials', 'Circular', 'Smart Cities'].map((cat) => (
            <Link key={cat} href={`/browse?category=${encodeURIComponent(cat)}`} className="block p-4 bg-gray-100 rounded hover:bg-gray-200">
              {cat}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
