// Fallback data extracted from hardcoded component content.
// Used when WordPress is unreachable, during local dev, or at build time.

import type {
  WPEvent,
  WPMinistry,
  WPService,
  WPSiteSettings,
} from "./wordpress-types";

export const FALLBACK_EVENTS: WPEvent[] = [
  {
    id: 1,
    title: "Easter at 180 Life",
    date: "April 20",
    time: "9:00 AM & 11:00 AM",
    description:
      "Celebrate the hope of Easter with us! Special services, worship, and activities for the whole family. Invite someone you love.",
    featured: true,
    planningCenterLink: null,
  },
  {
    id: 2,
    title: "Young Adults Night",
    date: "Every Tuesday",
    time: "7:00 PM",
    description:
      "If you're in your 20s or 30s, come hang out. Real conversations about life, faith, and figuring it all out together.",
    featured: false,
    planningCenterLink: null,
  },
  {
    id: 3,
    title: "180 Life Groups",
    date: "Various Days",
    time: "Throughout the Week",
    description:
      "Small groups meeting in homes across the area. Find your people and grow in faith together.",
    featured: false,
    planningCenterLink: null,
  },
];

export const FALLBACK_MINISTRIES: WPMinistry[] = [
  {
    id: 1,
    title: "Worship",
    description:
      "Our worship team leads with passion and authenticity every Sunday. If you play an instrument or love to sing, there's a spot for you.",
    iconName: "Music",
    image: "/images/ministries/worship.jpg",
    tag: "Sundays",
    sortOrder: 1,
  },
  {
    id: 2,
    title: "180 Life Groups",
    description:
      "Life is better together. Our small groups meet throughout the week for real conversation, prayer, and growing deeper in faith.",
    iconName: "Users",
    image: "/images/ministries/life-groups.jpg",
    tag: "Weekly",
    sortOrder: 2,
  },
  {
    id: 3,
    title: "Students",
    description:
      "A place where teens can be themselves, ask tough questions, and discover what it looks like to follow Jesus.",
    iconName: "BookOpen",
    image: "/images/ministries/students.jpg",
    tag: "Grades 6-12",
    sortOrder: 3,
  },
  {
    id: 4,
    title: "180 Life Kids",
    description:
      "From nursery through 5th grade, your kids will experience age-appropriate Bible teaching in a safe, fun environment.",
    iconName: "Baby",
    image: "/images/ministries/kids.jpg",
    tag: "Nursery - 5th",
    sortOrder: 4,
  },
  {
    id: 5,
    title: "Serving Teams",
    description:
      "Discover how God has wired you with gifts and passions to make a difference in the church, community, and the world.",
    iconName: "HandHeart",
    image: "/images/ministries/serving.jpg",
    tag: "Multiple Teams",
    sortOrder: 5,
  },
  {
    id: 6,
    title: "Young Adults",
    description:
      "For those in their 20s and 30s navigating life, faith, and community. We meet on Tuesdays.",
    iconName: "Sparkles",
    image: "/images/ministries/young-adults.jpg",
    tag: "Tuesdays",
    sortOrder: 6,
  },
];

export const FALLBACK_SERVICES: WPService[] = [
  {
    id: 1,
    label: "First Service",
    day: "Sunday",
    time: "9:00 AM",
    description:
      "Contemporary worship, a relevant message, and community for all ages. About 75 minutes.",
    sortOrder: 1,
  },
  {
    id: 2,
    label: "Second Service",
    day: "Sunday",
    time: "11:00 AM",
    description:
      "Same great experience, later start. Doors open at 10:40 AM. Kids programs available at both services.",
    sortOrder: 2,
  },
];

export const FALLBACK_SETTINGS: WPSiteSettings = {
  hero: {
    tagline: "No Perfect People Allowed",
    headingPrefix: "Jesus Changes",
    rotatingWords: [
      "Everything",
      "You",
      "Your Family",
      "Your Story",
      "Your Marriage",
      "Your Purpose",
      "Your Future",
      "Your Heart",
      "Communities",
      "Generations",
    ],
    description:
      "We exist to make and send disciples who love and live like Jesus. Come as you are. You're welcome here.",
    image: "/images/hero-worship.jpg",
    ctaPrimary: { text: "Plan Your Visit", link: "#visit" },
    ctaSecondary: { text: "Watch Online", link: "#watch" },
  },
  about: {
    label: "Gather, Grow & Go",
    heading: "A Place Where",
    headingAccent: "You Belong",
    body: [
      "180 Life Church is a contemporary, non-denominational church right here in Bloomfield, CT. Whether you're exploring faith for the first time or looking for a new church family, you'll find open doors and open hearts.",
      "Our name says it all. We believe God can turn any life 180 degrees toward hope, purpose, and real community. We're not about being perfect. We're about being Christ-centered, Christ-led, and Christ-empowered.",
    ],
    image: "/images/community.jpg",
    linkText: "Learn More About Us",
    linkUrl: "#about-more",
  },
  contact: {
    addressLine1: "180 Still Road",
    addressLine2: "Bloomfield, CT 06002",
    phone: "(860) 243-3576",
    email: "info@180lifechurch.org",
    serviceTimesSummary: "Sundays at 9:00 & 11:00 AM",
    doorsOpenText: "Doors open at 8:40 AM",
  },
  social: {
    facebook: "https://www.facebook.com/180LifeChurch",
    instagram: "https://www.instagram.com/180lifechurch/",
    youtube: "https://www.youtube.com/@180lifechurch",
  },
  cta: {
    label: "Take Your Next Step",
    heading: "Your Story",
    headingAccent: "Starts Here",
    body: "It doesn't matter where you've been or what your story looks like. There's a seat saved for you. Come as you are.",
    primaryText: "I'm New Here",
    primaryLink: "#visit-form",
    secondaryText: "Contact Us",
    secondaryLink: "#contact",
  },
  missionStatement:
    "We exist to make and send disciples who love and live like Jesus.",
  churchTagline: "Jesus Changes Everything",
};
