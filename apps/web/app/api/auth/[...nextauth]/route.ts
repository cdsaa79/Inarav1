import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// Export NextAuth handler for both GET and POST requests.  In the
// Next.js App Router, route files must export either a default
// function or named GET/POST handlers.  Here we delegate to the
// authOptions defined in `lib/auth.ts`.
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
