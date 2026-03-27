// Types for subpage content — ministry pages, content pages, sermon series, leadership

export interface MinistryPageData {
  title: string;
  subtitle: string;
  slug: string;
  description: string[];
  schedule?: { day: string; time: string; location?: string }[];
  leaders?: { name: string; role: string; image: string }[];
  contactEmail?: string;
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
  image: string;
  sermons: { title: string; date: string; youtubeId: string; speaker?: string }[];
  relatedSeries?: { title: string; slug: string; image: string }[];
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
