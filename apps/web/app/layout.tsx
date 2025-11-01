import './globals.css';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import SessionProvider from '@/components/SessionProvider';

export const metadata: Metadata = {
  title: 'INARA – Sustainability Intelligence Platform',
  description: 'Explore, simulate and compare sustainable technologies.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Pre-fetch the session on the server.  This allows us to render the
  // initial page with the correct authentication state before any
  // client-side hydration occurs.
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
