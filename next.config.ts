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
    ],
  },
};

export default nextConfig;
