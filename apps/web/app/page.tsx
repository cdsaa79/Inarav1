import Link from 'next/link';
import { prisma } from '@/lib/prisma';

/**
 * Landing page implementing the MVP 2.2 PRD.  This page shows a hero
 * section, key metrics, a rotating featured technology, category
 * overview and CTAs.  Counts are fetched from the database at
 * request time to keep the metrics in sync with seeded data.
 */
export default async function Home() {
  // Fetch counts for technologies and vendors.  Approved technologies
  // are counted for the public metrics.  Distinct category counts are
  // derived from the technology records.
  const [techCount, vendorCount, categoriesList] = await Promise.all([
    prisma.technology.count({ where: { approved: true } }),
    prisma.vendor.count(),
    prisma.technology.findMany({
      where: { approved: true },
      select: { category: true },
    }),
  ]);
  const categoryCounts: Record<string, number> = {};
  for (const { category } of categoriesList) {
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  }
  const distinctCategories = Object.keys(categoryCounts);

  // Fetch a featured technology.  Rotate by newest approved item.  We
  // fallback to undefined if no technologies are seeded yet.
  const featured = await prisma.technology.findFirst({
    where: { approved: true },
    orderBy: { createdAt: 'desc' },
  });

  // Fetch a handful of additional technologies to display in a grid on
  // the landing page.  These provide a teaser of the available
  // catalogue.  We limit to six to avoid overloading the UI.
  const sampleTech = await prisma.technology.findMany({
    where: { approved: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
  });

  return (
    <main className="min-h-screen flex flex-col items-center py-12 px-4 space-y-16">
      {/* Hero Section */}
      <section className="text-center max-w-3xl space-y-5">
        <h1 className="text-4xl font-extrabold leading-tight">
          Simulate your sustainability impact before you invest
        </h1>
        <p className="text-gray-600 text-lg">
          Explore technologies that improve energy, water and waste efficiency — all backed by data.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
          <Link
            href="/browse"
            className="px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Browse Free Project
          </Link>
          <Link
            href="/providers/register"
            className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            List Your Technology
          </Link>
        </div>
        <span className="mt-2 inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
          Free Access — 1 Project Per Day
        </span>
      </section>

      {/* Metrics Strip */}
      <section className="max-w-4xl w-full flex justify-around bg-gray-100 py-6 px-4 rounded-lg shadow">
        <div className="text-center">
          <p className="text-3xl font-bold">{techCount}</p>
          <p className="uppercase text-sm tracking-wide text-gray-500">Technologies</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold">{vendorCount}</p>
          <p className="uppercase text-sm tracking-wide text-gray-500">Vendors</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold">{distinctCategories.length}</p>
          <p className="uppercase text-sm tracking-wide text-gray-500">Categories</p>
        </div>
      </section>

      {/* Featured Technology */}
      {featured && (
        <section className="w-full max-w-4xl bg-white shadow rounded-lg p-6 space-y-3">
          <h2 className="text-2xl font-semibold">Featured Technology</h2>
          <h3 className="text-xl font-bold">{featured.name}</h3>
          <p className="text-gray-700">{featured.shortDesc || 'No description available.'}</p>
          <Link
            href={`/browse/${featured.id}`}
            className="text-blue-600 underline hover:text-blue-800"
          >
            View details
          </Link>
        </section>
      )}

      {/* Categories Overview */}
      <section className="w-full max-w-4xl space-y-4">
        <h2 className="text-2xl font-semibold">Explore by category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {distinctCategories.map((cat) => (
            <Link
              key={cat}
              href={`/browse?category=${encodeURIComponent(cat)}`}
              className="block bg-gray-50 hover:bg-gray-100 border rounded-lg p-4 shadow-sm"
            >
              <span className="block font-medium text-lg">{cat}</span>
              <span className="text-sm text-gray-500">{categoryCounts[cat]} projects</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Sample Technologies Grid */}
      {sampleTech.length > 0 && (
        <section className="w-full max-w-4xl space-y-4">
          <h2 className="text-2xl font-semibold">Recently Added</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {sampleTech.map((t) => (
              <div
                key={t.id}
                className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition"
              >
                <h3 className="font-bold text-lg mb-1">{t.name}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {t.shortDesc?.slice(0, 80) || 'No description available.'}
                </p>
                <p className="text-xs text-gray-500 mb-1">Category: {t.category}</p>
                <Link
                  href={`/browse/${t.id}`}
                  className="text-blue-600 underline text-sm"
                >
                  Learn more
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
