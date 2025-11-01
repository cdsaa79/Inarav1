/**
 * Module augmentation for NextAuth.js types.
 *
 * By default, the `user` object on the `Session` type includes only
 * `name`, `email` and `image` properties.  Our application stores additional
 * fields on the user, such as `id` and `role`, so we extend the
 * `Session.user`, `User`, and `JWT` interfaces accordingly.  This allows
 * TypeScript to recognise `session.user.role` and `session.user.id` without
 * compile errors.
 */

import NextAuth, { DefaultSession, User as NextAuthUser } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

// Extend the `Session` interface to include custom user properties.
declare module 'next-auth' {
  interface Session {
    user: {
      /**
       * The user's unique identifier from the database.  Populated in the
       * JWT callback and persisted on the session.
       */
      id: string;
      /**
       * The user's role (e.g. 'ADMIN', 'PROVIDER', 'CONSUMER').  Set in the
       * credentials provider and available on the session.
       */
      role: string;
    } & DefaultSession['user'];
  }

  interface User extends NextAuthUser {
    id: string;
    role: string;
  }
}

// Extend the JWT interface to persist our custom claims.
declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id?: string;
    role?: string;
  }
}