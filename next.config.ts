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
      // Planning Center asset hosts. Both PC products (Registrations
      // and Publishing) serve images via their own CDNs with signed,
      // Imgix-style transform URLs. We bypass Vercel's image optimizer
      // for these (see isPlanningCenterImage in src/lib/image-utils.ts)
      // because Vercel rejects them with INVALID_IMAGE_OPTIMIZE_REQUEST
      // when it tries to re-transform an already-signed transform URL.
      // These entries are still required so <Image> accepts the host
      // even when optimization is disabled.
      {
        protocol: "https",
        hostname: "registrations-production.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "images.planningcenterusercontent.com",
      },
      {
        protocol: "https",
        hostname: "publishing-production-attachments.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "avatars.planningcenteronline.com",
      },
    ],
  },

  /**
   * 301 redirects from the legacy WordPress + Divi URL structure.
   *
   * The current 180lifechurch.org has each ministry as a top-level
   * post slug and sermon series at root paths. The new headless
   * site groups ministries under /ministries/<slug> and series
   * under /sermons/<slug> for cleaner taxonomy. To preserve search
   * rankings and external links, every old URL 301s to its new
   * equivalent.
   *
   * `permanent: true` issues a 301 redirect (vs 308) and signals
   * to Google that the move is permanent, transferring ~85% of
   * SEO equity to the new URL.
   *
   * Reference: docs/seo-url-mapping.md
   */
  async redirects() {
    return [
      // Page slug renames
      { source: "/new-here", destination: "/new", permanent: true },
      { source: "/messages", destination: "/sermons", permanent: true },
      {
        source: "/west-hartford-church-ministries",
        destination: "/ministries",
        permanent: true,
      },

      // Ministry pages (old root slugs → /ministries/<slug>)
      { source: "/180-life-groups", destination: "/ministries/life-groups", permanent: true },
      { source: "/childrens-kids-ministry", destination: "/ministries/kids", permanent: true },
      { source: "/students", destination: "/ministries/students", permanent: true },
      { source: "/young-adults", destination: "/ministries/young-adults", permanent: true },
      { source: "/mens-ministry", destination: "/ministries/mens", permanent: true },
      { source: "/womens-ministry", destination: "/ministries/womens", permanent: true },
      { source: "/marriage-prep", destination: "/ministries/marriage-prep", permanent: true },
      { source: "/care", destination: "/ministries/care", permanent: true },
      { source: "/prayer", destination: "/ministries/prayer", permanent: true },
      { source: "/deaf-ministry", destination: "/ministries/deaf-ministry", permanent: true },
      { source: "/church-missions", destination: "/ministries/missions", permanent: true },

      // Sermon series (old root slugs → /sermons/<slug>)
      { source: "/at-the-movies", destination: "/sermons/at-the-movies", permanent: true },
      { source: "/sabbath", destination: "/sermons/sabbath", permanent: true },
      { source: "/say-yes", destination: "/sermons/say-yes", permanent: true },
      { source: "/21daysofprayer", destination: "/sermons/21-days-of-prayer", permanent: true },
      { source: "/asitisinheaven", destination: "/sermons/as-it-is-in-heaven", permanent: true },
      { source: "/easter-2023", destination: "/sermons/easter-2023", permanent: true },
      {
        source: "/easter-events-2025-hartford-ct-church",
        destination: "/sermons/easter-events-2025",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
