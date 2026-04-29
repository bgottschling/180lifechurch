/**
 * Per-route SEO defaults sourced from the 180lifechurch.org audit
 * (docs/seo-audit-current-site.md).
 *
 * These values come from the live WordPress + AIOSEO site and
 * represent what Google currently has indexed. Using them verbatim
 * preserves search rankings during the cutover. Editors can override
 * any of these later via the AIOSEO admin UI (once the AIOSEO bridge
 * in the 180 Life Sync plugin is wired up — Phase 2b).
 *
 * The lookup key is the new (Next.js) route slug, not the old
 * WordPress slug, since that's what each page knows about itself.
 */

export interface RouteSeoDefaults {
  title: string;
  description: string;
  /** Optional canonical override; defaults to the route itself. */
  canonical?: string;
  /** Optional Open Graph image override; defaults to /api/og. */
  ogImage?: string;
}

/**
 * Ministry pages — keyed by the slug used in /ministries/<slug>.
 */
export const MINISTRY_SEO_DEFAULTS: Record<string, RouteSeoDefaults> = {
  "life-groups": {
    title: "Church small groups West Hartford, CT | 180 Life Church",
    description:
      "Life Groups are a great way to get to meet others at the church on a more personal level. Learn more about our church small groups around West Hartford, CT.",
  },
  kids: {
    title: "Children Kids ministry in Hartford, CT | 180 Life Church",
    description:
      "Our church partners with parents and caregivers to help lead their children into a relationship with Jesus and to grow in their faith.",
  },
  students: {
    title: "Student ministry in West Hartford, CT | 180 Life Church",
    description:
      "Discover real community for middle school and high school students at 180 Life Church. Weekly gatherings, retreats, and discipleship in West Hartford, CT.",
  },
  "young-adults": {
    title: "Young Adults | 180 Life Church",
    description:
      "Are you in your 20s or 30s and looking for community? Be a part of our diverse group of Young Adults in the Greater Hartford area who call 180 Life Church home!",
  },
  mens: {
    title: "Men's ministry in Hartford, CT | 180 Life Church",
    description:
      "Our church challenges, equips and encourages men to love God and live lives that reflect His priorities and purposes at home, in our communities and beyond.",
  },
  womens: {
    title: "Women's ministry in Hartford CT | 180 Life Church",
    description:
      "The women of our church seek to connect, encourage and equip each other to pursue a deep, transforming relationship with Christ.",
  },
  "marriage-prep": {
    title: "Church premarital counseling West Hartford | 180 Life Church",
    description:
      "It is our goal at 180 Life Church to help you prepare for a successful marriage that glorifies God.",
  },
  care: {
    title: "Church care ministry West Hartford | 180 Life Church",
    description:
      "Connecting people to Christ-centered spiritual, emotional and relational assistance through our West Hartford, CT church.",
  },
  prayer: {
    title: "Church prayer ministry in Hartford, CT | 180 Life Church",
    description:
      "Prayer is a vital part of our relationship with God, as individuals and a church community.",
  },
  "deaf-ministry": {
    title: "Church deaf ministry in West Hartford, CT | 180 Life Church",
    description:
      "Our church provides a high quality, professional interpreter in American Sign Language every Sunday morning.",
  },
  missions: {
    title: "Church missions in Hartford, CT | 180 Life Church",
    description:
      "We seek to bring the love of Christ to a community and world in need of the Gospel.",
  },
  serving: {
    title: "Volunteer at West Hartford, our CT church | 180 Life Church",
    description:
      "Discover how God has uniquely wired you with gifts, talents and passions to magnify God by serving in the church, community and the world.",
  },
};

/**
 * Content pages — keyed by route slug.
 */
export const CONTENT_PAGE_SEO_DEFAULTS: Record<string, RouteSeoDefaults> = {
  baptism: {
    title: "Baptism & baby dedication in West Hartford | 180 Life Church",
    description:
      "Ready to take the next step in your faith journey? Learn more about adult, teen baptisms and baby dedications at 180 Life in West Hartford, CT",
  },
  partnership: {
    title: "Church Membership West Hartford, CT | 180 Life Church",
    description:
      "Find Christian community. Grow in your faith in Christ with us. Visit and consider church membership in West Hartford, CT.",
  },
  membership: {
    title: "Church Membership West Hartford, CT | 180 Life Church",
    description:
      "Find Christian community. Grow in your faith in Christ with us. Visit and consider church membership in West Hartford, CT.",
  },
  stories: {
    title: "Life & Personal Transformation | 180 Life Church",
    description:
      "Watch real people's stories of personal life transformation form our 180 Life Church in West Hartford, CT. We believe, \"Jesus changes everything.\"",
  },
  "new-to-faith": {
    title: "New to Faith in West Hartford, CT? | 180 Life Church",
    description:
      "Did you recently give your life to Christ or do you have questions about the Christian faith? Our church in West Hartford, CT is here to help!",
  },
};

/**
 * Helper: build a Next.js Metadata object from a route's defaults.
 * Wraps the canonical URL with the production site origin and
 * threads through OG/Twitter overrides automatically.
 */
import type { Metadata } from "next";

export function metadataFromDefaults(
  defaults: RouteSeoDefaults,
  canonicalPath: string
): Metadata {
  return {
    title: defaults.title,
    description: defaults.description,
    alternates: {
      canonical: defaults.canonical || canonicalPath,
    },
    openGraph: {
      title: defaults.title,
      description: defaults.description,
      url: canonicalPath,
      ...(defaults.ogImage ? { images: [defaults.ogImage] } : {}),
    },
    twitter: {
      title: defaults.title,
      description: defaults.description,
      ...(defaults.ogImage ? { images: [defaults.ogImage] } : {}),
    },
  };
}
