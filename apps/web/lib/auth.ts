import { NextAuthOptions, getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import { compare } from 'bcryptjs';

/**
 * Centralised NextAuth configuration used by the API route and server
 * components.  The credentials provider authenticates users by
 * comparing the submitted password against the hash stored in the
 * database.  Upon successful login, the session token is enriched
 * with the user's ID and role which can then be consumed in
 * middleware or server actions.
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'name@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) return null;
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          role: user.role,
        } as any;
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        // Persist the custom claims on the session.  Our module augmentation
        // ensures that `id` and `role` are recognised properties on
        // `session.user`, so no TypeScript ignore directives are needed.
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};

/**
 * Helper that wraps `getServerSession` with our authOptions.  Use this
 * in server actions and API routes to retrieve the current
 * authenticated session.
 */
export function getSession() {
  return getServerSession(authOptions);
}
