import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

/**
 * Provider dashboard landing page.  Lists the technologies created by
 * the logged in provider and their approval status.  Redirects to
 * login if not authenticated or to dashboard if the user is not a
 * provider.
 */
export default async function ProviderDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    redirect('/login');
  }
  if (session.user.role !== 'PROVIDER') {
    redirect('/dashboard');
  }
  const technologies = await prisma.technology.findMany({
    where: {
      Vendors: {
        some: {
          Vendor: {
            id: { not: undefined },
          },
        },
      },
    },
  });
  // Note: there is no explicit link between a user and vendor in this
  // minimal schema.  In a real implementation, the provider user
  // would be associated with a vendor record; here we simply list all
  // technologies for demonstration purposes.
  return (
    <main className="min-h-screen p-6 space-y-6">
      <h1 className="text-2xl font-bold">Provider Dashboard</h1>
      <Link href="/provider/technologies/new" className="inline-block px-3 py-2 bg-blue-600 text-white rounded">
        Add technology
      </Link>
      <div className="space-y-4">
        {technologies.length === 0 ? (
          <p>You have not submitted any technologies yet.</p>
        ) : (
          technologies.map((tech) => (
            <div key={tech.id} className="p-4 border rounded">
              <h2 className="font-semibold">{tech.name}</h2>
              <p className="text-sm text-gray-600">Status: {tech.approved ? 'Approved' : 'Pending'}</p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
