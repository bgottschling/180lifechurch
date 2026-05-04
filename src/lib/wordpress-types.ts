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

export interface WPSiteSettings {
  hero: WPHeroData;
  about: WPAboutData;
  contact: WPContactData;
  social: WPSocialData;
  cta: WPCTAData;
  seo: WPSeoData;
  missionStatement: string;
  churchTagline: string;
}
