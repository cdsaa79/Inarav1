import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

/**
 * Consumer dashboard landing page.  Displays the logged in user's
 * projects and provides links to create new projects or browse
 * technologies.  Redirects to the login page if no session exists.
 */
export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    redirect('/login');
  }
  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    include: { simulations: true },
    orderBy: { createdAt: 'desc' },
  });
  return (
    <main className="min-h-screen p-6 space-y-6">
      <h1 className="text-2xl font-bold">Your Projects</h1>
      <Link href="/dashboard/projects/new" className="inline-block px-3 py-2 bg-blue-600 text-white rounded">
        Create Project
      </Link>
      <div className="space-y-4">
        {projects.length === 0 ? (
          <p>You have no projects yet. Start by creating one.</p>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="p-4 border rounded">
              <h2 className="font-semibold">{project.name}</h2>
              <p className="text-sm text-gray-600">{project.industry || 'No industry'}</p>
              <p className="text-sm text-gray-600">Simulations: {project.simulations.length}</p>
              <Link href={`/dashboard/projects/${project.id}`} className="text-blue-600 underline text-sm mt-2 inline-block">
                View project
              </Link>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
