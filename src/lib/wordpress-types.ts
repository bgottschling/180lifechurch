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

export interface WPSiteSettings {
  hero: WPHeroData;
  about: WPAboutData;
  contact: WPContactData;
  social: WPSocialData;
  cta: WPCTAData;
  missionStatement: string;
  churchTagline: string;
}
