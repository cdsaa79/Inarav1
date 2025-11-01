import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

/**
 * POST /api/register
 *
 * Creates a new user with the provided email, password and optional
 * name.  Role defaults to CONSUMER unless explicitly set to
 * PROVIDER.  Passwords are hashed using bcrypt before storage.  If
 * the email is already taken, returns a 400 status code.
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password, name, role } = body;
  if (!email || !password) {
    return new NextResponse('Email and password are required', { status: 400 });
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return new NextResponse('Email already registered', { status: 400 });
  }
  const hashed = await hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      name: name ?? null,
      role: role === 'PROVIDER' ? 'PROVIDER' : 'CONSUMER',
      password: hashed,
    },
  });
  return NextResponse.json({ id: user.id, email: user.email, role: user.role });
}
