import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/technologies/[id]
 *
 * Returns a single technology by ID.  Includes vendor details.  Only
 * approved technologies are returned.  If the record does not
 * exist or is not approved, a 404 response is returned.
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const tech = await prisma.technology.findUnique({
    where: { id },
    include: {
      Vendors: {
        include: { Vendor: true },
      },
    },
  });
  if (!tech || !tech.approved) {
    return new NextResponse('Not found', { status: 404 });
  }
  return NextResponse.json(tech);
}
