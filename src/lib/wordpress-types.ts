// TypeScript interfaces for WordPress headless CMS data
// These map to ACF field groups and custom post types in WordPress

export interface WPEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  description: string;
  featured: boolean;
  planningCenterLink: string | null;
  /**
   * Editor-uploaded event image from Planning Center (the "logo"
   * surfaced on the Church Center signup page). Rendered as the
   * homepage event card background. Null when the editor hasn't
   * uploaded one in PC; the card falls back to the gradient.
   */
  image: string | null;
}

export interface WPMinistry {
  id: number;
  title: string;
  description: string;
  image: string;
  tag: string;
  iconName: string;
  sortOrder: number;
  slug?: string;
}

export interface WPService {
  id: number;
  label: string;
  day: string;
  time: string;
  description: string;
  sortOrder: number;
}

export interface WPHeroData {
  tagline: string;
  headingPrefix: string;
  rotatingWords: string[];
  description: string;
  image: string;
  ctaPrimary: { text: string; link: string };
  ctaSecondary: { text: string; link: string };
}

export interface WPAboutData {
  label: string;
  heading: string;
  headingAccent: string;
  body: string[];
  image: string;
  linkText: string;
  linkUrl: string;
}

export interface WPContactData {
  addressLine1: string;
  addressLine2: string;
  phone: string;
  email: string;
  serviceTimesSummary: string;
  doorsOpenText: string;
}

export interface WPSocialData {
  facebook: string;
  instagram: string;
  youtube: string;
  vimeo?: string;
}

export interface WPCTAData {
  label: string;
  heading: string;
  headingAccent: string;
  body: string;
  primaryText: string;
  primaryLink: string;
  secondaryText: string;
  secondaryLink: string;
}

export interface WPSeoData {
  /** Pattern for page titles (uses %s as page-name placeholder) */
  titleTemplate: string;
  /** Title shown on the homepage and used as fallback */
  defaultTitle: string;
  /** Site-wide meta description */
  defaultDescription: string;
  /** Site-wide Open Graph image URL (or empty for dynamic /api/og) */
  defaultOgImage: string;
  /** Twitter / X handle including the @ */
  twitterHandle: string;
  /** Comma-separated keywords */
  keywords: string;
}

/**
 * Per-post SEO override fields populated from the optional SEO tab
 * on any of our custom post types. All fields are optional; if a
 * field is empty, the consumer falls back to route or site defaults.
 *
 * This keeps per-page SEO control inside ACF (consistent with the
 * rest of our CMS) without depending on a third-party SEO plugin.
 */
export interface WPPostSeo {
  title: string;
  description: string;
  ogImage: string;
  noindex: boolean;
}

/**
 * One section group on the /ministries hub page. Each entry renders
 * as one alternating-background section with a featured ministry
 * card on one side and a list of related ministries on the other.
 * Maps to one row of the `ministries_hub_groups` ACF repeater.
 */
export interface WPMinistriesHubGroup {
  label: string;
  heading: string;
  headingAccent: string;
  description: string;
  /** Slug of the ministry shown as the large hero card. */
  featuredSlug: string;
  /**
   * Slugs of all ministries in this group. Includes the featured
   * slug (rendered as hero) and the others (rendered as list rows).
   */
  ministrySlugs: string[];
}

/**
 * Editor-controlled section labels/headings/descriptions for the
 * /leadership page. The leader entries themselves come from the
 * Staff and Elder CPTs — this controls the framing copy around them.
 */
export interface WPLeadershipSectionCopy {
  label: string;
  heading: string;
  headingAccent: string;
  description: string;
}

export interface WPSiteSettings {
  hero: WPHeroData;
  about: WPAboutData;
  contact: WPContactData;
  social: WPSocialData;
  cta: WPCTAData;
  seo: WPSeoData;
  missionStatement: string;
  churchTagline: string;
  /**
   * Editor-controlled section structure for the /ministries hub.
   * When the repeater is empty, callers fall back to the hardcoded
   * MINISTRIES_HUB_GROUPS default in wordpress-fallbacks.ts.
   */
  ministriesHubGroups: WPMinistriesHubGroup[];
  /**
   * Editor-controlled section copy for the /leadership page. Each
   * field is independently optional; consumers fall back to the
   * defaults in LEADERSHIP_SECTIONS in wordpress-fallbacks.ts.
   */
  leadershipSections: {
    pastors: WPLeadershipSectionCopy;
    staff: WPLeadershipSectionCopy;
    elders: WPLeadershipSectionCopy;
  };
}

/**
 * Plugin-managed config exposed via the 180 Life Sync REST namespace
 * (/wp-json/180life-sync/v1/public-config). Editor-controlled values
 * the headless site needs to inject into every page's <head>.
 *
 * Kept separate from WPSiteSettings because:
 *   - Source is the plugin's wp_options, not an ACF post type
 *   - Lifecycle is operational/infra rather than editorial
 *   - Cache invalidation can be tighter (only changes when an editor
 *     touches the Analytics tab)
 */
export interface WPPublicConfig {
  analytics: {
    enabled: boolean;
    measurementId: string;
  };
  searchConsole: {
    verification: string;
  };
}
