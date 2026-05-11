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
    id: 3506531,
    title: "Baptism",
    date: "April 4-5",
    time: "2026",
    description:
      "Ready to take your next step of faith? Sign up for our upcoming baptism service and publicly declare your relationship with Jesus.",
    featured: true,
    planningCenterLink:
      "https://180life.churchcenter.com/registrations/events/3506531",
    image: null,
  },
  {
    id: 3503330,
    title: "Family Hike",
    date: "April 18",
    time: "2026",
    description:
      "Grab the family and join us for a day on the trails. A great opportunity to connect with other families while enjoying God's creation.",
    featured: false,
    planningCenterLink:
      "https://180life.churchcenter.com/registrations/events/3503330",
    image: null,
  },
  {
    id: 3355581,
    title: "Unshakable Marriage Retreat",
    date: "April 24-25",
    time: "2026",
    description:
      "Invest in your marriage with a weekend focused on growing closer together and building an unshakable foundation.",
    featured: false,
    planningCenterLink:
      "https://180life.churchcenter.com/registrations/events/3355581",
    image: null,
  },
];

export const FALLBACK_MINISTRIES: WPMinistry[] = [
  {
    id: 1,
    title: "180 Life Groups",
    description:
      "Life is better together. Our small groups meet throughout the week for real conversation, prayer, and growing deeper in faith.",
    iconName: "Users",
    image: "/images/ministries/life-groups.jpg",
    tag: "Weekly",
    sortOrder: 1,
    slug: "life-groups",
  },
  {
    id: 2,
    title: "Students",
    description:
      "A place where teens can be themselves, ask tough questions, and discover what it looks like to follow Jesus.",
    iconName: "BookOpen",
    image: "/images/ministries/students.jpg",
    tag: "Grades 6-12",
    sortOrder: 2,
    slug: "students",
  },
  {
    id: 3,
    title: "180 Life Kids",
    description:
      "From nursery through 5th grade, your kids will experience age-appropriate Bible teaching in a safe, fun environment.",
    iconName: "Baby",
    image: "/images/ministries/kids.jpg",
    tag: "Nursery - 5th",
    sortOrder: 3,
    slug: "kids",
  },
  {
    id: 4,
    title: "Serving Teams",
    description:
      "Discover how God has wired you with gifts and passions to make a difference in the church, community, and the world.",
    iconName: "HandHeart",
    image: "/images/ministries/serving.jpg",
    tag: "Multiple Teams",
    sortOrder: 4,
    slug: "serving",
  },
  {
    id: 5,
    title: "Young Adults",
    description:
      "For those in their 20s and 30s navigating life, faith, and community. We meet on Tuesdays.",
    iconName: "Sparkles",
    image: "/images/ministries/young-adults.jpg",
    tag: "Tuesdays",
    sortOrder: 5,
    slug: "young-adults",
  },
  {
    id: 6,
    title: "Men's Ministry",
    description:
      "Men sharpening men through fellowship, accountability, and a Christ-centered pursuit of becoming better husbands, fathers, and leaders.",
    iconName: "Users",
    // Temporary placeholder. Editors should upload a Men's Ministry
    // card photo via wp-admin → Ministries → Edit Men's Ministry →
    // Card Image. The smart fallback chain will then prefer the WP
    // upload over this static path.
    image: "/images/community.jpg",
    tag: "Various",
    sortOrder: 6,
    slug: "mens",
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

/** Convenience helper so every subpage doesn't repeat Footer prop wiring */
export function getFooterProps() {
  return {
    contact: FALLBACK_SETTINGS.contact,
    missionStatement: FALLBACK_SETTINGS.missionStatement,
    churchTagline: FALLBACK_SETTINGS.churchTagline,
  };
}

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
    ctaPrimary: { text: "Plan Your Visit", link: "/new" },
    ctaSecondary: { text: "Watch Online", link: "https://180life.online.church/" },
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
    linkUrl: "/about",
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
    vimeo: "https://vimeo.com/180lifechurch",
  },
  cta: {
    label: "Take Your Next Step",
    heading: "Your Story",
    headingAccent: "Starts Here",
    body: "It doesn't matter where you've been or what your story looks like. There's a seat saved for you. Come as you are.",
    primaryText: "I'm New Here",
    primaryLink: "/new",
    secondaryText: "Contact Us",
    secondaryLink: "/contact",
  },
  seo: {
    titleTemplate: "%s | 180 Life Church",
    defaultTitle: "180 Life Church | Bloomfield, CT",
    defaultDescription:
      "A warm, welcoming community in Bloomfield, Connecticut. Join us for worship, connection, and life-changing experiences. Everyone is welcome.",
    defaultOgImage: "",
    twitterHandle: "@180LifeChurch",
    keywords:
      "church, Bloomfield, CT, Connecticut, worship, community, non-denominational",
  },
  missionStatement:
    "We exist to make and send disciples who love and live like Jesus.",
  churchTagline: "Jesus Changes Everything",
  /**
   * Default section structure for the /ministries hub when the editor
   * hasn't populated the `ministries_hub_groups` repeater in Site
   * Settings. Mirrors the original hardcoded MINISTRY_GROUPS so the
   * page renders identically out of the box.
   */
  ministriesHubGroups: [
    {
      label: "Age and Stage",
      heading: "Connect by",
      headingAccent: "Age and Stage",
      description: "Find community with people in your season of life.",
      featuredSlug: "kids",
      ministrySlugs: ["kids", "students", "young-adults", "womens", "mens"],
    },
    {
      label: "Spiritual Growth",
      heading: "Grow",
      headingAccent: "Together",
      description: "Deepen your faith alongside others.",
      featuredSlug: "life-groups",
      ministrySlugs: ["life-groups", "marriage-prep", "prayer", "deaf-ministry"],
    },
    {
      label: "Outreach",
      heading: "Serve and",
      headingAccent: "Care",
      description:
        "Use your gifts to love your neighbors and your church.",
      featuredSlug: "serving",
      ministrySlugs: ["serving", "care", "missions"],
    },
  ],
  leadershipSections: {
    pastors: {
      label: "The Heart Behind It",
      heading: "Our",
      headingAccent: "Pastors",
      description:
        "The shepherds who lead, teach, and care for our church family.",
    },
    staff: {
      label: "The People Who Make It Happen",
      heading: "Our",
      headingAccent: "Team",
      description:
        "Dedicated staff serving behind the scenes and on the front lines every week.",
    },
    elders: {
      label: "Shepherding With Integrity",
      heading: "Our",
      headingAccent: "Elders",
      // Description left blank — page reads ELDERS_DESCRIPTION from
      // subpage-fallbacks.ts when editor hasn't set this.
      description: "",
    },
  },
};
