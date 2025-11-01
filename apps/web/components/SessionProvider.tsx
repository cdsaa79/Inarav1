"use client";
import { SessionProvider as NextAuthProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import React from 'react';

/**
 * Client component wrapper around NextAuth's SessionProvider.  It
 * accepts a pre-fetched session from a server component (e.g. the
 * root layout) and makes it available on the client.  Without this
 * wrapper the session would be undefined on first render.
 */
export default function SessionProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return <NextAuthProvider session={session}>{children}</NextAuthProvider>;
}
