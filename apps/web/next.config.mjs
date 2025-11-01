/**
 * Next.js configuration for the INARA web app.
 *
 * We enable the experimental App Router by toggling `appDir`.  This
 * repository is designed around Next.js 14's app directory for
 * simplified routing and server actions.  Should you choose to
 * migrate to a newer version of Next.js you can adjust these
 * settings accordingly.
 */
const nextConfig = {
  experimental: {
    appDir: true,
  },
};

export default nextConfig;
