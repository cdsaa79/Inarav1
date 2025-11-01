import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * POST /api/providers/technologies
 *
 * Allows a provider to submit a new technology.  The provider must be
 * authenticated and have the PROVIDER role.  Request body may
 * include any fields permitted on the Technology model.  Vendors can
 * be linked via an array of vendor IDs or objects with vendor
 * details.  Newly created technologies are not approved until an
 * admin calls the approval endpoint.
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'PROVIDER') {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const body = await request.json();
  const { vendors = [], ...techData } = body;
  // Create the technology record (not approved).
  const tech = await prisma.technology.create({
    data: {
      ...techData,
      approved: false,
      Vendors: {
        create: vendors.map((vendorId: string) => ({ vendorId })),
      },
    },
  });
  return NextResponse.json(tech);
}
