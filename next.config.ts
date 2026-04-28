import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["framer-motion"],
  images: {
    // Optimization cache TTL. Default is 4 hours on Vercel; we lower
    // to 1 hour so editor-uploaded images that keep the same URL
    // (e.g., when re-uploaded over an existing media item) propagate
    // sooner. Source-URL cache busting via the `?v=<modified>` query
    // param in src/lib/wordpress.ts is the primary mechanism; this
    // is a defensive belt-and-suspenders default.
    minimumCacheTTL: 3600,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "180lifechurch.org",
      },
      {
        protocol: "https",
        hostname: "*.180lifechurch.org",
      },
      {
        protocol: "https",
        hostname: "registrations-production.s3.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
