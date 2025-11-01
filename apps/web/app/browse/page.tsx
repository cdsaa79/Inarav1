import { prisma } from '@/lib/prisma';
import Link from 'next/link';

interface BrowseProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

/**
 * Browse page.  Lists all approved technologies, optionally filtered
 * by category.  Provides links to individual technology detail pages.
 */
export default async function BrowsePage({ searchParams }: BrowseProps) {
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  const technologies = await prisma.technology.findMany({
    where: {
      approved: true,
      ...(category ? { category } : {}),
    },
    orderBy: { createdAt: 'desc' },
  });
  return (
    <main className="min-h-screen p-6 space-y-6">
      <h1 className="text-2xl font-bold">Browse technologies</h1>
      {category && <p>Category: {category}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {technologies.map((tech) => (
          <div key={tech.id} className="p-4 border rounded">
            <h2 className="font-semibold">{tech.name}</h2>
            <p className="text-sm text-gray-600">{tech.shortDesc || 'No description'}</p>
            <Link href={`/browse/${tech.id}`} className="text-blue-600 underline text-sm inline-block mt-2">
              View details
            </Link>
          </div>
        ))}
        {technologies.length === 0 && <p>No technologies found.</p>}
      </div>
    </main>
  );
}
