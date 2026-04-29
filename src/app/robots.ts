import type { MetadataRoute } from "next";

/**
 * robots.txt for the site.
 *
 * Production allows full crawling and references the sitemap.
 * Preview deployments are already gated by Vercel deployment
 * protection + our app's password middleware, so search engines
 * cannot reach them. As a defensive measure we also disallow
 * crawling on non-production hostnames at the application level
 * via the User-Agent rules below.
 *
 * Next.js serves this at /robots.txt automatically.
 */
export default function robots(): MetadataRoute.Robots {
  const isProduction =
    process.env.VERCEL_ENV === "production" ||
    process.env.NODE_ENV === "production";

  if (!isProduction) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/checklist",
          "/login",
        ],
      },
    ],
    sitemap: "https://180lifechurch.org/sitemap.xml",
    host: "https://180lifechurch.org",
  };
}
