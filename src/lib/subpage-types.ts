// Types for subpage content — ministry pages, content pages, sermon series, leadership

export interface MinistryPageData {
  title: string;
  subtitle: string;
  slug: string;
  description: string[];
  schedule?: { day: string; time: string; location?: string }[];
  leaders?: { name: string; role: string; image: string }[];
  contactEmail?: string;
  /** External links (Church Center, Google Drive, YouTube, etc.) */
  externalLinks?: { label: string; href: string; description?: string }[];
}

export interface ContentPageData {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href: string }[];
  sections: {
    label?: string;
    heading: string;
    headingAccent?: string;
    body: string | string[];
    image?: { src: string; alt: string; position?: "left" | "right" };
  }[];
  cta?: { heading: string; description?: string; text: string; link: string };
}

export interface SermonSeriesData {
  title: string;
  subtitle: string;
  slug: string;
  description: string[];
  /**
   * Largest available artwork — used by the /sermons hero where the
   * card spans up to 1152px wide and crispness matters at retina.
   */
  image: string;
  /**
   * Smaller artwork variant for grid/sidebar cards (~320px wide).
   * Falls back to `image` if Planning Center didn't return a smaller
   * variant. Lets the past-series grid render quickly without
   * downloading the full-size hero artwork (PC's "large" variant is
   * 2000×1125) for every tile.
   */
  imageThumb?: string;
  dateRange?: string;
  churchCenterUrl?: string;
  sermons: { title: string; date: string; youtubeId: string; speaker?: string }[];
  relatedSeries?: {
    title: string;
    slug: string;
    image: string;
    /** Smaller variant matching SermonSeriesData.imageThumb. */
    imageThumb?: string;
  }[];
  /**
   * Optional per-post SEO override populated from the SEO tab in the
   * Sermon Series ACF group. All fields default to empty strings;
   * consumers merge these over route-level and site-wide SEO.
   */
  seo?: {
    title: string;
    description: string;
    ogImage: string;
    noindex: boolean;
  };
}

export interface StaffMember {
  name: string;
  role: string;
  image: string;
  bio?: string;
}

export interface LeadershipData {
  pastors: StaffMember[];
  staff: StaffMember[];
}
