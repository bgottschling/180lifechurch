import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["framer-motion"],
  images: {
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
