// WordPress headless CMS data fetching layer.
// All fetch functions use ISR with tag-based revalidation.
// When WORDPRESS_URL is not set, functions throw so callers fall back to defaults.

import type {
  WPEvent,
  WPMinistry,
  WPService,
  WPSiteSettings,
  WPHeroData,
  WPAboutData,
  WPContactData,
  WPSocialData,
  WPCTAData,
} from "./wordpress-types";

const WORDPRESS_URL = process.env.WORDPRESS_URL;

const FETCH_OPTIONS: RequestInit = {
  next: { revalidate: 3600, tags: ["wordpress"] },
};

// ---------------------------------------------------------------------------
// Base helper
// ---------------------------------------------------------------------------

async function wpFetch<T>(endpoint: string): Promise<T> {
  if (!WORDPRESS_URL) {
    throw new Error("WORDPRESS_URL not configured");
  }

  const url = `${WORDPRESS_URL}/wp-json/wp/v2/${endpoint}`;
  const res = await fetch(url, FETCH_OPTIONS);

  if (!res.ok) {
    throw new Error(`WordPress API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

async function wpFetchACF<T>(endpoint: string): Promise<T> {
  if (!WORDPRESS_URL) {
    throw new Error("WORDPRESS_URL not configured");
  }

  const url = `${WORDPRESS_URL}/wp-json/acf/v3/${endpoint}`;
  const res = await fetch(url, FETCH_OPTIONS);

  if (!res.ok) {
    throw new Error(`WordPress ACF API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// ---------------------------------------------------------------------------
// Raw WordPress REST API response types
// ---------------------------------------------------------------------------

interface WPPostRaw {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  acf: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

export async function getEvents(): Promise<WPEvent[]> {
  const posts = await wpFetch<WPPostRaw[]>(
    "event?per_page=10&orderby=date&order=desc&_fields=id,title,acf"
  );

  return posts.map((post) => ({
    id: post.id,
    title: post.title.rendered,
    date: (post.acf.event_date as string) || "",
    time: (post.acf.event_time as string) || "",
    description: (post.acf.event_description as string) || post.title.rendered,
    featured: Boolean(post.acf.event_featured),
    planningCenterLink: (post.acf.event_link as string) || null,
  }));
}

// ---------------------------------------------------------------------------
// Ministries
// ---------------------------------------------------------------------------

export async function getMinistries(): Promise<WPMinistry[]> {
  const posts = await wpFetch<WPPostRaw[]>(
    "ministry?per_page=20&_fields=id,title,acf"
  );

  return posts
    .map((post) => ({
      id: post.id,
      title: post.title.rendered,
      description: (post.acf.ministry_description as string) || "",
      image: extractImageUrl(post.acf.ministry_image) || "",
      tag: (post.acf.ministry_tag as string) || "",
      iconName: (post.acf.ministry_icon as string) || "Users",
      sortOrder: Number(post.acf.ministry_sort_order) || 0,
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

export async function getServices(): Promise<WPService[]> {
  const posts = await wpFetch<WPPostRaw[]>(
    "service?per_page=10&_fields=id,title,acf"
  );

  return posts
    .map((post) => ({
      id: post.id,
      label: post.title.rendered,
      day: (post.acf.service_day as string) || "Sunday",
      time: (post.acf.service_time as string) || "",
      description: (post.acf.service_description as string) || "",
      sortOrder: Number(post.acf.service_sort_order) || 0,
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

// ---------------------------------------------------------------------------
// Site Settings (ACF Pro Options Page or singleton post)
// ---------------------------------------------------------------------------

export async function getSiteSettings(): Promise<WPSiteSettings> {
  // Try ACF Pro Options Page first, fall back to singleton post
  let acf: Record<string, unknown>;

  try {
    const options = await wpFetchACF<{ acf: Record<string, unknown> }>(
      "options/site-settings"
    );
    acf = options.acf;
  } catch {
    // Fallback: ACF Free singleton post type
    const posts = await wpFetch<WPPostRaw[]>(
      "site-settings?per_page=1&_fields=id,acf"
    );
    if (!posts.length) throw new Error("No site settings found");
    acf = posts[0].acf;
  }

  return {
    hero: parseHeroData(acf),
    about: parseAboutData(acf),
    contact: parseContactData(acf),
    social: parseSocialData(acf),
    cta: parseCTAData(acf),
    missionStatement:
      (acf.mission_statement as string) ||
      "We exist to make and send disciples who love and live like Jesus.",
    churchTagline:
      (acf.church_tagline as string) || "Jesus Changes Everything",
  };
}

// ---------------------------------------------------------------------------
// Parsers — transform raw ACF fields into typed data
// ---------------------------------------------------------------------------

function parseHeroData(acf: Record<string, unknown>): WPHeroData {
  // Rotating words: ACF Pro repeater → array of { word: string }
  // ACF Free fallback → newline-separated textarea
  let rotatingWords: string[] = [];
  const rawWords = acf.hero_rotating_words;
  if (Array.isArray(rawWords)) {
    rotatingWords = rawWords.map(
      (row: { word?: string }) => row.word || ""
    ).filter(Boolean);
  } else if (typeof rawWords === "string") {
    rotatingWords = rawWords.split("\n").map((w: string) => w.trim()).filter(Boolean);
  }

  return {
    tagline: (acf.hero_tagline as string) || "No Perfect People Allowed",
    headingPrefix: (acf.hero_heading_prefix as string) || "Jesus Changes",
    rotatingWords:
      rotatingWords.length > 0
        ? rotatingWords
        : ["Everything", "You", "Your Family"],
    description: (acf.hero_description as string) || "",
    image: extractImageUrl(acf.hero_image) || "/images/hero-worship.jpg",
    ctaPrimary: {
      text: (acf.hero_cta_primary_text as string) || "Plan Your Visit",
      link: (acf.hero_cta_primary_link as string) || "#visit",
    },
    ctaSecondary: {
      text: (acf.hero_cta_secondary_text as string) || "Watch Online",
      link: (acf.hero_cta_secondary_link as string) || "#watch",
    },
  };
}

function parseAboutData(acf: Record<string, unknown>): WPAboutData {
  const bodyRaw = (acf.about_body as string) || "";
  // Split WYSIWYG content into paragraphs
  const body = bodyRaw
    ? bodyRaw
        .split(/<\/?p>/)
        .map((s: string) => s.trim())
        .filter(Boolean)
    : [];

  return {
    label: (acf.about_label as string) || "Gather, Grow & Go",
    heading: (acf.about_heading as string) || "A Place Where",
    headingAccent: (acf.about_heading_accent as string) || "You Belong",
    body,
    image: extractImageUrl(acf.about_image) || "/images/community.jpg",
    linkText: (acf.about_link_text as string) || "Learn More About Us",
    linkUrl: (acf.about_link_url as string) || "/about",
  };
}

function parseContactData(acf: Record<string, unknown>): WPContactData {
  return {
    addressLine1: (acf.contact_address_line1 as string) || "180 Still Road",
    addressLine2:
      (acf.contact_address_line2 as string) || "Bloomfield, CT 06002",
    phone: (acf.contact_phone as string) || "(860) 243-3576",
    email: (acf.contact_email as string) || "info@180lifechurch.org",
    serviceTimesSummary:
      (acf.contact_service_times_summary as string) ||
      "Sundays at 9:00 & 11:00 AM",
    doorsOpenText:
      (acf.doors_open_text as string) || "Doors open at 8:40 AM",
  };
}

function parseSocialData(acf: Record<string, unknown>): WPSocialData {
  return {
    facebook:
      (acf.social_facebook as string) ||
      "https://www.facebook.com/180LifeChurch",
    instagram:
      (acf.social_instagram as string) ||
      "https://www.instagram.com/180lifechurch/",
    youtube:
      (acf.social_youtube as string) ||
      "https://www.youtube.com/@180lifechurch",
    vimeo:
      (acf.social_vimeo as string) ||
      "https://vimeo.com/180lifechurch",
  };
}

function parseCTAData(acf: Record<string, unknown>): WPCTAData {
  return {
    label: (acf.cta_label as string) || "Take Your Next Step",
    heading: (acf.cta_heading as string) || "Your Story",
    headingAccent: (acf.cta_heading_accent as string) || "Starts Here",
    body:
      (acf.cta_body as string) ||
      "It doesn't matter where you've been or what your story looks like. There's a seat saved for you. Come as you are.",
    primaryText: (acf.cta_primary_text as string) || "I'm New Here",
    primaryLink: (acf.cta_primary_link as string) || "/new",
    secondaryText: (acf.cta_secondary_text as string) || "Contact Us",
    secondaryLink: (acf.cta_secondary_link as string) || "/contact",
  };
}

// ---------------------------------------------------------------------------
// Leadership
// ---------------------------------------------------------------------------

import type {
  LeadershipData,
  StaffMember,
  MinistryPageData,
  ContentPageData,
  SermonSeriesData,
} from "./subpage-types";

export async function getLeadership(): Promise<LeadershipData> {
  const posts = await wpFetch<WPPostRaw[]>(
    "staff?per_page=50&_fields=id,title,acf"
  );

  const staff: StaffMember[] = posts.map((post) => ({
    name: post.title.rendered,
    role: (post.acf.staff_role as string) || "",
    image: extractImageUrl(post.acf.staff_photo) || "/images/staff/placeholder-male.jpg",
    bio: (post.acf.staff_bio as string) || undefined,
  }));

  // Split into pastors (role contains "Pastor") and staff
  const pastors = staff.filter((s) =>
    s.role.toLowerCase().includes("pastor")
  );
  const team = staff.filter(
    (s) => !s.role.toLowerCase().includes("pastor")
  );

  return { pastors, staff: team };
}

export async function getElders(): Promise<
  { name: string; role: string; image?: string }[]
> {
  const posts = await wpFetch<WPPostRaw[]>(
    "elder?per_page=20&_fields=id,title,acf"
  );

  return posts.map((post) => ({
    name: post.title.rendered,
    role: (post.acf.elder_role as string) || "Elder",
    image: extractImageUrl(post.acf.elder_photo) || undefined,
  }));
}

// ---------------------------------------------------------------------------
// Ministry Pages (individual subpage content)
// ---------------------------------------------------------------------------

export async function getMinistryPage(
  slug: string
): Promise<MinistryPageData> {
  const posts = await wpFetch<WPPostRaw[]>(
    `ministry-page?slug=${slug}&per_page=1&_fields=id,title,acf`
  );

  if (!posts.length) throw new Error(`Ministry page not found: ${slug}`);
  const post = posts[0];
  const acf = post.acf;

  // Parse description: ACF WYSIWYG or repeater
  const descRaw = acf.ministry_description as string | string[];
  const description = Array.isArray(descRaw)
    ? descRaw
    : (descRaw || "")
        .split(/<\/?p>/)
        .map((s: string) => s.trim())
        .filter(Boolean);

  // Parse schedule: ACF repeater
  const schedRaw = acf.ministry_schedule as
    | { day: string; time: string; location?: string }[]
    | undefined;

  // Parse external links: ACF repeater
  const linksRaw = acf.ministry_external_links as
    | { label: string; href: string; description?: string }[]
    | undefined;

  return {
    title: post.title.rendered,
    subtitle: (acf.ministry_subtitle as string) || "",
    slug,
    description,
    schedule: schedRaw || undefined,
    contactEmail: (acf.ministry_contact_email as string) || undefined,
    externalLinks: linksRaw || undefined,
  };
}

// ---------------------------------------------------------------------------
// Content Pages (about, partnership, baptism, stories, new-to-faith)
// ---------------------------------------------------------------------------

export async function getContentPage(
  slug: string
): Promise<ContentPageData> {
  const posts = await wpFetch<WPPostRaw[]>(
    `content-page?slug=${slug}&per_page=1&_fields=id,title,acf`
  );

  if (!posts.length) throw new Error(`Content page not found: ${slug}`);
  const post = posts[0];
  const acf = post.acf;

  // Parse sections: ACF flexible content or repeater
  const sectionsRaw = acf.page_sections as
    | {
        label?: string;
        heading: string;
        heading_accent?: string;
        body: string;
        image_src?: string;
        image_alt?: string;
        image_position?: "left" | "right";
      }[]
    | undefined;

  const sections = (sectionsRaw || []).map((s) => ({
    label: s.label,
    heading: s.heading,
    headingAccent: s.heading_accent,
    body: s.body
      .split(/<\/?p>/)
      .map((t: string) => t.trim())
      .filter(Boolean),
    image: s.image_src
      ? { src: s.image_src, alt: s.image_alt || "", position: s.image_position }
      : undefined,
  }));

  // Parse CTA
  const ctaRaw = acf.page_cta as
    | { heading: string; description?: string; text: string; link: string }
    | undefined;

  return {
    title: post.title.rendered,
    subtitle: (acf.page_subtitle as string) || undefined,
    breadcrumbs: [{ label: post.title.rendered, href: `/${slug}` }],
    sections,
    cta: ctaRaw || undefined,
  };
}

// ---------------------------------------------------------------------------
// Sermon Series
// ---------------------------------------------------------------------------

export async function getSermonSeries(): Promise<
  Record<string, SermonSeriesData>
> {
  const posts = await wpFetch<WPPostRaw[]>(
    "sermon-series?per_page=50&_fields=id,title,acf"
  );

  const result: Record<string, SermonSeriesData> = {};

  for (const post of posts) {
    const acf = post.acf;
    const slug = (acf.series_slug as string) || post.title.rendered.toLowerCase().replace(/\s+/g, "-");

    const sermonsRaw = acf.series_sermons as
      | { title: string; date: string; youtube_id: string; speaker?: string }[]
      | undefined;

    result[slug] = {
      title: post.title.rendered,
      subtitle: (acf.series_subtitle as string) || "",
      slug,
      description: ((acf.series_description as string) || "")
        .split(/<\/?p>/)
        .map((s: string) => s.trim())
        .filter(Boolean),
      image: extractImageUrl(acf.series_image) || "/images/series/placeholder.jpg",
      sermons: (sermonsRaw || []).map((s) => ({
        title: s.title,
        date: s.date,
        youtubeId: s.youtube_id,
        speaker: s.speaker,
      })),
    };
  }

  return result;
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

/** Extract URL from ACF image field (can be object with url, or just a URL string) */
function extractImageUrl(field: unknown): string | null {
  if (!field) return null;
  if (typeof field === "string") return field;
  if (typeof field === "object" && field !== null && "url" in field) {
    return (field as { url: string }).url;
  }
  return null;
}
