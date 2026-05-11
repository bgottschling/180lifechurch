#!/usr/bin/env node
/**
 * WordPress Content Seed Script for 180 Life Church
 *
 * Populates the Phase A custom post types with the content that is
 * currently hardcoded in `src/lib/wordpress-fallbacks.ts` and
 * `src/lib/subpage-fallbacks.ts`.
 *
 * Run AFTER importing `acf-post-types.json` and `acf-field-groups.json`
 * via ACF Tools in wp-admin.
 *
 * Usage:
 *   node wordpress/seed-content.mjs               # dry run (shows what would be created)
 *   node wordpress/seed-content.mjs --write       # actually create posts
 *   node wordpress/seed-content.mjs --write --only=ministries,staff   # only specific types
 *
 * Requires the following env vars (reads from .env.local if present):
 *   WORDPRESS_URL
 *   WORDPRESS_USERNAME
 *   WORDPRESS_AUTH_TOKEN
 *
 * Idempotency: the script looks up posts by title before creating. If a
 * post with the same title already exists, it is skipped. Safe to run
 * multiple times.
 */

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Env loading
// ---------------------------------------------------------------------------

function loadEnvLocal() {
  const envPath = resolve(__dirname, "..", ".env.local");
  if (!existsSync(envPath)) return;
  const content = readFileSync(envPath, "utf-8");
  // Handle both LF and CRLF line endings
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  }
}

loadEnvLocal();

const WORDPRESS_URL = process.env.WORDPRESS_URL;
const WORDPRESS_USERNAME = process.env.WORDPRESS_USERNAME;
const WORDPRESS_AUTH_TOKEN = process.env.WORDPRESS_AUTH_TOKEN;

if (!WORDPRESS_URL || !WORDPRESS_USERNAME || !WORDPRESS_AUTH_TOKEN) {
  console.error(
    "Missing env vars. Required: WORDPRESS_URL, WORDPRESS_USERNAME, WORDPRESS_AUTH_TOKEN"
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const DRY_RUN = !args.includes("--write");
const onlyArg = args.find((a) => a.startsWith("--only="));
const ONLY = onlyArg ? onlyArg.split("=")[1].split(",") : null;

function shouldRun(type) {
  return !ONLY || ONLY.includes(type);
}

// ---------------------------------------------------------------------------
// WP REST API helper
// ---------------------------------------------------------------------------

const authHeader =
  "Basic " +
  Buffer.from(`${WORDPRESS_USERNAME}:${WORDPRESS_AUTH_TOKEN}`).toString(
    "base64"
  );

async function wpRequest(method, path, body) {
  const url = `${WORDPRESS_URL}/wp-json/wp/v2/${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${method} ${path} failed: ${res.status} ${res.statusText}\n${text}`);
  }
  return res.json();
}

async function findExistingByTitle(restBase, title) {
  try {
    const results = await wpRequest(
      "GET",
      `${restBase}?search=${encodeURIComponent(title)}&per_page=20&_fields=id,title,slug`
    );
    return results.find((p) => p.title?.rendered === title || p.title === title);
  } catch {
    return null;
  }
}

async function createPost(restBase, title, acf) {
  if (DRY_RUN) {
    console.log(`  [dry-run] Would create: ${title}`);
    return { id: 0, title: { rendered: title } };
  }
  return wpRequest("POST", restBase, {
    title,
    status: "publish",
    acf,
  });
}

async function createOrSkip(restBase, title, acf) {
  const existing = await findExistingByTitle(restBase, title);
  if (existing) {
    console.log(`  [skip] "${title}" already exists (id=${existing.id})`);
    return existing;
  }
  const created = await createPost(restBase, title, acf);
  console.log(`  [created] "${title}" (id=${created.id || "dry-run"})`);
  return created;
}

// ---------------------------------------------------------------------------
// Data -- extracted verbatim from src/lib/wordpress-fallbacks.ts
//        and src/lib/subpage-fallbacks.ts
// ---------------------------------------------------------------------------

const SITE_SETTINGS = {
  hero_tagline: "No Perfect People Allowed",
  hero_heading_prefix: "Jesus Changes",
  // NOTE: If your ACF repeater max is set to 8, only the first 8 items
  // will be accepted. We keep all 10 here to match the hardcoded fallback;
  // editors can prune in wp-admin if desired or raise the max to 0.
  hero_rotating_words: [
    { word: "Everything" },
    { word: "You" },
    { word: "Your Family" },
    { word: "Your Story" },
    { word: "Your Marriage" },
    { word: "Your Purpose" },
    { word: "Your Future" },
    { word: "Your Heart" },
    { word: "Communities" },
    { word: "Generations" },
  ],
  hero_description:
    "We exist to make and send disciples who love and live like Jesus. Come as you are. You're welcome here.",
  hero_cta_primary_text: "Plan Your Visit",
  hero_cta_primary_link: "/new",
  hero_cta_secondary_text: "Watch Online",
  hero_cta_secondary_link: "https://180life.online.church/",
  about_label: "Gather, Grow & Go",
  about_heading: "A Place Where",
  about_heading_accent: "You Belong",
  about_body:
    "<p>180 Life Church is a contemporary, non-denominational church right here in Bloomfield, CT. Whether you're exploring faith for the first time or looking for a new church family, you'll find open doors and open hearts.</p>\n<p>Our name says it all. We believe God can turn any life 180 degrees toward hope, purpose, and real community. We're not about being perfect. We're about being Christ-centered, Christ-led, and Christ-empowered.</p>",
  about_link_text: "Learn More About Us",
  about_link_url: "/about",
  contact_address_line1: "180 Still Road",
  contact_address_line2: "Bloomfield, CT 06002",
  contact_phone: "(860) 243-3576",
  contact_email: "info@180lifechurch.org",
  contact_service_times_summary: "Sundays at 9:00 & 11:00 AM",
  doors_open_text: "Doors open at 8:40 AM",
  social_facebook: "https://www.facebook.com/180LifeChurch",
  social_instagram: "https://www.instagram.com/180lifechurch/",
  social_youtube: "https://www.youtube.com/@180lifechurch",
  social_vimeo: "https://vimeo.com/180lifechurch",
  cta_label: "Take Your Next Step",
  cta_heading: "Your Story",
  cta_heading_accent: "Starts Here",
  cta_body:
    "It doesn't matter where you've been or what your story looks like. There's a seat saved for you. Come as you are.",
  cta_primary_text: "I'm New Here",
  cta_primary_link: "/new",
  cta_secondary_text: "Contact Us",
  cta_secondary_link: "/contact",
  mission_statement:
    "We exist to make and send disciples who love and live like Jesus.",
  church_tagline: "Jesus Changes Everything",
  // Ministries Hub — added in plugin v1.5.0. Editor-controlled section
  // structure for /ministries. Mirrors FALLBACK_SETTINGS.ministriesHubGroups.
  ministries_hub_groups: [
    {
      label: "Age and Stage",
      heading: "Connect by",
      heading_accent: "Age and Stage",
      description: "Find community with people in your season of life.",
      featured_slug: "kids",
      ministry_slugs: "kids, students, young-adults, womens, mens",
    },
    {
      label: "Spiritual Growth",
      heading: "Grow",
      heading_accent: "Together",
      description: "Deepen your faith alongside others.",
      featured_slug: "life-groups",
      ministry_slugs: "life-groups, marriage-prep, prayer, deaf-ministry",
    },
    {
      label: "Outreach",
      heading: "Serve and",
      heading_accent: "Care",
      description: "Use your gifts to love your neighbors and your church.",
      featured_slug: "serving",
      ministry_slugs: "serving, care, missions",
    },
  ],
  // Leadership page section copy — added in plugin v1.5.0.
  leadership_pastors_label: "The Heart Behind It",
  leadership_pastors_heading: "Our",
  leadership_pastors_heading_accent: "Pastors",
  leadership_pastors_description:
    "The shepherds who lead, teach, and care for our church family.",
  leadership_staff_label: "The People Who Make It Happen",
  leadership_staff_heading: "Our",
  leadership_staff_heading_accent: "Team",
  leadership_staff_description:
    "Dedicated staff serving behind the scenes and on the front lines every week.",
  leadership_elders_label: "Shepherding With Integrity",
  leadership_elders_heading: "Our",
  leadership_elders_heading_accent: "Elders",
  leadership_elders_description:
    "180 Life Church is led by a team of elders who serve alongside the staff to provide spiritual oversight, pastoral care, and biblical direction.",
};

const MINISTRIES = [
  {
    title: "180 Life Groups",
    ministry_description:
      "Life is better together. Our small groups meet throughout the week for real conversation, prayer, and growing deeper in faith.",
    ministry_icon: "Users",
    ministry_tag: "Weekly",
    ministry_sort_order: 1,
    ministry_slug: "life-groups",
  },
  {
    title: "Students",
    ministry_description:
      "A place where teens can be themselves, ask tough questions, and discover what it looks like to follow Jesus.",
    ministry_icon: "BookOpen",
    ministry_tag: "Grades 6-12",
    ministry_sort_order: 2,
    ministry_slug: "students",
  },
  {
    title: "180 Life Kids",
    ministry_description:
      "From nursery through 5th grade, your kids will experience age-appropriate Bible teaching in a safe, fun environment.",
    ministry_icon: "Baby",
    ministry_tag: "Nursery - 5th",
    ministry_sort_order: 3,
    ministry_slug: "kids",
  },
  {
    title: "Serving Teams",
    ministry_description:
      "Discover how God has wired you with gifts and passions to make a difference in the church, community, and the world.",
    ministry_icon: "HandHeart",
    ministry_tag: "Multiple Teams",
    ministry_sort_order: 4,
    ministry_slug: "serving",
  },
  {
    title: "Young Adults",
    ministry_description:
      "For those in their 20s and 30s navigating life, faith, and community. We meet on Tuesdays.",
    ministry_icon: "Sparkles",
    ministry_tag: "Tuesdays",
    ministry_sort_order: 5,
    ministry_slug: "young-adults",
  },
  {
    title: "Men's Ministry",
    ministry_description:
      "Men sharpening men through fellowship, accountability, and a Christ-centered pursuit of becoming better husbands, fathers, and leaders.",
    ministry_icon: "Users",
    ministry_tag: "Various",
    ministry_sort_order: 6,
    ministry_slug: "mens",
  },
];

const STAFF = [
  {
    title: "Josh Poteet",
    staff_role: "Lead Pastor",
    staff_bio:
      "Born in Ohio, Josh grew up in Florida. He and Jennie tied the knot in 2015 and they now have two kids, Lilla and Ezra. Prior to ministry, Josh worked in the Army National Guard Infantry and as an EMT. Since then, he completed his Masters in Theological Studies and has been serving within the local church. Josh is a deep believer in relational discipleship. He personally experienced tremendous life change through discipleship and it is now his passion to create and multiply that culture wherever he goes.",
  },
  {
    title: "Nicholas Leadbeater",
    staff_role: "Pastor for Ministry Development",
    staff_bio:
      "While now living in New England, Nicholas is a native of old England. His family is from Birmingham in the center of the UK. After working at a University in London for five years as a Chemistry Professor, he had the opportunity to move to the University of Connecticut. Nicholas and his wife Susan live in Southington. They have been a part of the church since 2006. He was ordained in 2019 and often gets to put his teaching hat on, giving some Sunday morning messages.",
  },
  {
    title: "Chip Anthony",
    staff_role: "Operations and Student Ministry Director",
    staff_bio:
      "Born and raised in Connecticut, Chip attended college right down the road from the church in West Hartford. He found the church in January 2006 and felt that it was a place he could truly feel God moving. He joined staff in June 2009. Some of his duties include operations, partnership, life groups, students, and special events. Chip is married to Amanda and they reside in Farmington, CT with their two sons Christian and Thomas.",
  },
  {
    title: "Jennifer Byrne",
    staff_role: "Children's Ministry Director",
    staff_bio:
      "Jen joined the team as the Children's Ministry Director in May 2022 but has been attending 180 Life Church since 2008. Originally from a small farm town in Illinois, Jen is passionate about serving the local community, hosting kids and families, and supporting moms and families in this parenting journey. She lives in West Hartford with her husband Jeremy and three daughters Johanna, Julianne, and Jade.",
  },
  {
    title: "Ben Valentine",
    staff_role: "Director of Worship & Young Adults",
    staff_bio:
      "Born and raised in the Natural State, Ben recently moved to Connecticut with his wife Grace. He has a passion for leading Christ-centered worship that ushers people into the presence of God, and to see Young Adults emboldened and equipped to be the hands and feet of Jesus making and sending disciples.",
  },
  {
    title: "Emily Oaks",
    staff_role: "Women's Ministry Director",
    staff_bio:
      "Emily grew up in Connecticut and is grateful to now call West Hartford home. She first began attending 180 Life Church in 2017. In the fall of 2025, she stepped into the role of Women's Ministry Director. She is passionate about serving the Lord, growing in her own faith, and walking in relationships with others. Outside of church, she is an elementary school teacher in West Hartford.",
  },
  {
    title: "Jim Richert",
    staff_role: "Men's Ministry Director",
    staff_bio:
      "Jim is an elder and a lifelong follower of Christ who has been attending 180 Life Church since 2012. Originally from upstate New York, Jim has been married to his best friend Tanya since 2000 and is a dad to three amazing adult children (Caleb, Faith, and Noah). Jim's work focuses on the unique needs of making and sending men as disciples and exhorting them to step up in all areas of their life.",
  },
  {
    title: "Tinisha Noah",
    staff_role: "Middle School Curriculum Coordinator",
    staff_bio:
      "Born and raised in Newfoundland, Canada, Tinisha moved to Connecticut in 2017. She resides in Windsor, CT and is married to her husband Blessing Noah. They have three young kids: Grace, Seth, and Trinity. Tinisha joined the Kids Ministry Team in March 2024. She has a passion for Kids and Youth Ministry and a desire to see the next generation know and love God.",
  },
  {
    title: "Ashley Perri",
    staff_role: "Kids Curriculum Specialist",
    staff_bio:
      "Ashley is our Kids Curriculum Specialist for ages birth through 5th grade. She received her bachelor's degree in middle school math and science education from Valparaiso University in 2009. She and her husband Ryan are both originally from the Chicago area but have called Farmington home since 2020. They have 3 boys: Jackson, Wyatt, and Miles.",
  },
];

const ELDERS = [
  { title: "Jeff Doot", elder_role: "Secretary" },
  { title: "Sam Kim", elder_role: "Elder" },
  { title: "Jim Richert", elder_role: "Chair" },
  { title: "Jose Rios", elder_role: "Treasurer" },
];

const CC_SERIES = "https://180life.churchcenter.com/channels/12038/series";

const SERMON_SERIES = [
  {
    title: "Concrete Relationship",
    series_subtitle:
      "Building something that lasts with the people who matter most.",
    series_slug: "concrete-relationship",
    series_date_range: "April 5, 2026 - Present",
    series_church_center_url: `${CC_SERIES}/86108`,
    series_description:
      "<p>What if the greatest threat to your home isn't what's happening around you, but what's happening within you? In a world that has confused and dulled what it means to be a man, many have drifted into passivity or misplaced strength. But Scripture calls us to something far greater: to be watchmen who are awake, anchored in Christ, and willing to lay our lives down. When we step into that calling, everything around us begins to come alive.</p>",
    series_sermons: [
      {
        title: "Watchmen on the Wall",
        date: "April 12, 2026",
        youtube_id: "YpB93Bgu8m0",
        speaker: "Pastor Josh Poteet",
      },
      {
        title: "Right Where He's Waiting",
        date: "April 5, 2026",
        youtube_id: "vJj-hR9GM5g",
        speaker: "Pastor Josh Poteet",
      },
    ],
  },
  {
    title: "Buying Back Gomer",
    series_subtitle: "A redemption story through the book of Hosea.",
    series_slug: "buying-back-gomer",
    series_date_range: "March 22 - 29, 2026",
    series_church_center_url: `${CC_SERIES}/84748`,
    series_description:
      "<p>A study through the book of Hosea. God's relentless love, faithfulness in the face of betrayal, and the cost of redemption come alive in this powerful Old Testament story.</p>",
    series_sermons: [
      {
        title: "Consequences",
        date: "March 29, 2026",
        youtube_id: "coQieDuSL3o",
        speaker: "Pastor Josh Poteet",
      },
      {
        title: "Biblegate",
        date: "March 22, 2026",
        youtube_id: "QzjZycSt8TY",
        speaker: "Pastor Josh Poteet",
      },
    ],
  },
  {
    title: "For A Time Such As This",
    series_subtitle: "Finding purpose in the place God has you.",
    series_slug: "for-a-time-such-as-this",
    series_date_range: "January 4 - March 9, 2026",
    series_church_center_url: `${CC_SERIES}/78538`,
    series_description:
      "<p>What if you are exactly where you are for a reason? This series explores how God positions us for purpose, even when the circumstances feel uncertain or overwhelming.</p>",
    series_sermons: [
      { title: "Cross The Road", date: "March 15, 2026", youtube_id: "f1gfshs-Fd4", speaker: "Pastor Josh Poteet" },
      { title: "God of the Turnaround", date: "March 8, 2026", youtube_id: "LOucibW88P8", speaker: "Pastor Josh Poteet" },
      { title: "That's Mine", date: "March 1, 2026", youtube_id: "YOAATPqUWZA", speaker: "Pastor Josh Poteet" },
      { title: "Yellow Car", date: "February 22, 2026", youtube_id: "u7N5Z6GWM7s", speaker: "Pastor Josh Poteet" },
      { title: "Where Dependence Lives", date: "February 15, 2026", youtube_id: "F6H6oMKqPSo", speaker: "Pastor Josh Poteet" },
      { title: "Risk The Palace", date: "February 8, 2026", youtube_id: "r3IWLNwZ8UA", speaker: "Pastor Josh Poteet" },
      { title: "My Goliath, Your Goliath", date: "February 1, 2026", youtube_id: "RNjfZUjuzIQ", speaker: "Pastor Josh Poteet" },
      { title: "For the Joy Ahead", date: "January 25, 2026", youtube_id: "Nz5OX1I9QVE", speaker: "Pastor Josh Poteet" },
      { title: "The Trade", date: "January 18, 2026", youtube_id: "nWXhUJzWveA", speaker: "Pastor Josh Poteet" },
      { title: "Purpose Happens on Tuesday", date: "January 11, 2026", youtube_id: "ONOubBBgoho", speaker: "Pastor Josh Poteet" },
      { title: "Power, Pride and Providence", date: "January 4, 2026", youtube_id: "nxJPR5_c91M", speaker: "Pastor Josh Poteet" },
    ],
  },
  {
    title: "Home For Christmas",
    series_subtitle: "Coming home to the hope, peace, joy, and love of Christmas.",
    series_slug: "home-for-christmas",
    series_date_range: "December 7 - 21, 2025",
    series_church_center_url: `${CC_SERIES}/76797`,
    series_description:
      "<p>Christmas is about coming home. Not just to a place, but to a Person. This series explores what it means to find your way back to the heart of the season.</p>",
    series_sermons: [
      { title: "I Wonder", date: "December 28, 2025", youtube_id: "VW_INLGeqvs", speaker: "Pastor Josh Poteet" },
      { title: "Who Wears The Crown", date: "December 21, 2025", youtube_id: "O1otACXTFRs", speaker: "Pastor Josh Poteet" },
      { title: "Do You Want to Get Well?", date: "December 14, 2025", youtube_id: "y_IY9BNR7uA", speaker: "Pastor Josh Poteet" },
    ],
  },
  {
    title: "On Dry Ground",
    series_subtitle: "When God parts the waters and invites you to walk through.",
    series_slug: "on-dry-ground",
    series_date_range: "November 16 - 30, 2025",
    series_church_center_url: `${CC_SERIES}/75055`,
    series_description:
      "<p>God doesn't always remove the obstacles. Sometimes He parts them and asks you to walk through on dry ground. This series explores what it takes to trust God in the middle of the impossible.</p>",
    series_sermons: [
      { title: "Living a Promised Life", date: "November 30, 2025", youtube_id: "QJBZwlmzcNc", speaker: "Pastor Josh Poteet" },
      { title: "Steward the Moment", date: "November 23, 2025", youtube_id: "B3XhCqZsUHg", speaker: "Pastor Josh Poteet" },
      { title: "The Long Road Home", date: "November 16, 2025", youtube_id: "_f2iHg5hRW4", speaker: "Pastor Josh Poteet" },
    ],
  },
  {
    title: "Truth in Tension",
    series_subtitle: "Holding onto truth when life pulls you in every direction.",
    series_slug: "truth-in-tension",
    series_date_range: "October 5 - November 2, 2025",
    series_church_center_url: `${CC_SERIES}/72437`,
    series_description:
      "<p>Some of the most important truths in the Bible seem to pull in opposite directions. Grace and truth. Faith and works. Justice and mercy. This series explores how to hold them together.</p>",
    series_sermons: [
      { title: "Freedom Has a Seatbelt", date: "November 2, 2025", youtube_id: "mWy45wtIFqs", speaker: "Pastor Josh Poteet" },
    ],
  },
  { title: "All In", series_subtitle: "What does it look like to go all in with God?", series_slug: "all-in", series_date_range: "August 31 - September 28, 2025", series_church_center_url: `${CC_SERIES}/69650`, series_description: "<p>Half-hearted faith leads to a half-lived life. This series challenges us to stop playing it safe and go all in on what God has for us.</p>", series_sermons: [] },
  { title: "Getting Back to Eden", series_subtitle: "Rediscovering what God intended from the beginning.", series_slug: "getting-back-to-eden", series_date_range: "August 3 - 24, 2025", series_church_center_url: `${CC_SERIES}/67839`, series_description: "<p>In the beginning, everything was as it should be. This series traces God's plan to restore what was lost and bring us back to the life He always intended.</p>", series_sermons: [] },
  { title: "The Movement", series_subtitle: "Be part of something bigger than yourself.", series_slug: "the-movement", series_date_range: "July 2024 - July 2025", series_church_center_url: `${CC_SERIES}/46358`, series_description: "<p>The early church turned the world upside down. This series explores what it means to be part of the movement that God started and continues today.</p>", series_sermons: [] },
  { title: "How to Fight", series_subtitle: "Spiritual warfare and standing firm in faith.", series_slug: "how-to-fight", series_date_range: "April 27 - May 18, 2025", series_church_center_url: `${CC_SERIES}/62199`, series_description: "<p>Every believer faces a battle. This series equips you with the tools and truth you need to fight well and stand firm when the enemy comes.</p>", series_sermons: [] },
  { title: "The Broken Gospel", series_subtitle: "The power of the gospel through brokenness.", series_slug: "the-broken-gospel", series_date_range: "April 13 - 20, 2025", series_church_center_url: `${CC_SERIES}/61070`, series_description: "<p>The gospel isn't for people who have it all together. It's for the broken, the hurting, and the searching. This Easter series explores the beauty of a gospel that meets us in our mess.</p>", series_sermons: [] },
  { title: "Follow Me", series_subtitle: "What Jesus really meant when He said follow me.", series_slug: "follow-me", series_date_range: "March 2 - April 6, 2025", series_church_center_url: `${CC_SERIES}/58758`, series_description: "<p>When Jesus said 'Follow Me,' it wasn't an invitation to a comfortable life. It was a call to something radical. This series unpacks what it truly means to follow Jesus.</p>", series_sermons: [] },
  { title: "Crossroads", series_subtitle: "Making decisions that define your future.", series_slug: "crossroads", series_date_range: "January 12 - February 25, 2025", series_church_center_url: `${CC_SERIES}/55560`, series_description: "<p>Life is full of crossroads. The decisions we make at those moments shape everything that follows. This series helps you navigate life's biggest choices with wisdom and faith.</p>", series_sermons: [] },
  { title: "Behold", series_subtitle: "A Christmas series about seeing Jesus clearly.", series_slug: "behold", series_date_range: "December 1 - 22, 2024", series_church_center_url: `${CC_SERIES}/52906`, series_description: "<p>Christmas invites us to stop, look, and behold the wonder of who Jesus is. This series helps us see Him with fresh eyes.</p>", series_sermons: [] },
  { title: "Living in Babylon", series_subtitle: "Staying faithful in a culture that opposes your faith.", series_slug: "living-in-babylon", series_date_range: "October 21 - November 4, 2024", series_church_center_url: `${CC_SERIES}/50997`, series_description: "<p>Daniel and his friends lived as exiles in a hostile culture and thrived. This series explores how we can do the same in our world today.</p>", series_sermons: [] },
  { title: "Immeasurably More", series_subtitle: "God can do more than you could ever ask or imagine.", series_slug: "immeasurably-more", series_date_range: "September 16 - October 6, 2024", series_church_center_url: `${CC_SERIES}/49272`, series_description: "<p>What if God wants to do immeasurably more than you're asking for? This series explores Ephesians 3:20 and what it means to dream bigger with God.</p>", series_sermons: [] },
  { title: "The Jonah Mirror", series_subtitle: "Seeing yourself in the story of Jonah.", series_slug: "the-jonah-mirror", series_date_range: "June 3 - July 1, 2024", series_church_center_url: `${CC_SERIES}/44584`, series_description: "<p>The story of Jonah is more than a whale tale. It's a mirror that reflects our own reluctance, rebellion, and the relentless grace of God that pursues us anyway.</p>", series_sermons: [] },
  { title: "Family Meeting", series_subtitle: "Honest conversations about life, faith, and family.", series_slug: "family-meeting", series_date_range: "April 30 - May 20, 2024", series_church_center_url: `${CC_SERIES}/43095`, series_description: "<p>It's time for a family meeting. This series tackles the real conversations families need to have about faith, priorities, and growing together.</p>", series_sermons: [] },
  { title: "Why Jesus?", series_subtitle: "The case for following the most influential person in history.", series_slug: "why-jesus", series_date_range: "April 1 - 22, 2024", series_church_center_url: `${CC_SERIES}/41405`, series_description: "<p>In a world of options, why Jesus? This Easter series makes the case for why Jesus matters more than any other leader, teacher, or figure in human history.</p>", series_sermons: [] },
  { title: "At The Movies", series_subtitle: "Discovering biblical truth through the lens of film.", series_slug: "at-the-movies", series_date_range: "March 3 - 11, 2024", series_church_center_url: `${CC_SERIES}/40061`, series_description: "<p>We watch scenes from popular movies on Sunday mornings and explore the biblical truths they reveal. Join us for this creative and engaging series!</p>", series_sermons: [] },
  { title: "The Ruthless Elimination of Hurry", series_subtitle: "Slowing down to live the life God designed for you.", series_slug: "the-ruthless-elimination-of-hurry", series_date_range: "January 15 - February 19, 2024", series_church_center_url: `${CC_SERIES}/37398`, series_description: "<p>Hurry is the great enemy of the spiritual life. Inspired by John Mark Comer's book, this series challenges us to ruthlessly eliminate hurry and create space for God.</p>", series_sermons: [] },
  { title: "Through The Eyes", series_subtitle: "A Christmas series about seeing the world through God's eyes.", series_slug: "through-the-eyes", series_date_range: "December 11 - 25, 2023", series_church_center_url: `${CC_SERIES}/35657`, series_description: "<p>Christmas changes the way we see everything. This series invites you to look at the season, and your life, through the eyes of those who witnessed the first Christmas.</p>", series_sermons: [] },
  { title: "Get in the Game", series_subtitle: "Stop watching from the sidelines and get in the game.", series_slug: "get-in-the-game", series_date_range: "September 24 - December 3, 2023", series_church_center_url: `${CC_SERIES}/32249`, series_description: "<p>Too many of us are spectators in our own faith. This series is a call to get off the sidelines, step onto the field, and live the life God created you for.</p>", series_sermons: [] },
  { title: "Act Like You Believe", series_subtitle: "When your actions catch up to your faith.", series_slug: "act-like-you-believe", series_date_range: "July 9 - September 10, 2023", series_church_center_url: `${CC_SERIES}/28943`, series_description: "<p>It's one thing to say you believe. It's another to live like it. This series from the book of James challenges us to put our faith into action.</p>", series_sermons: [] },
  { title: "On My Heart", series_subtitle: "What's on God's heart for your life?", series_slug: "on-my-heart", series_date_range: "April 23 - June 13, 2023", series_church_center_url: `${CC_SERIES}/26200`, series_description: "<p>God has things on His heart for your life, your family, and your future. This series explores what happens when we align our hearts with His.</p>", series_sermons: [] },
  { title: "In God We Trust", series_subtitle: "Building a foundation of trust that cannot be shaken.", series_slug: "in-god-we-trust", series_date_range: "March 5 - 26, 2023", series_church_center_url: `${CC_SERIES}/24447`, series_description: "<p>Trust is the foundation of every relationship, especially our relationship with God. This series explores what it means to put your full trust in Him.</p>", series_sermons: [] },
  { title: "Fit 4 God", series_subtitle: "Honoring God with your whole self: body, mind, and spirit.", series_slug: "fit-4-god", series_date_range: "January 15 - February 27, 2023", series_church_center_url: `${CC_SERIES}/22373`, series_description: "<p>Your body is a temple. This new year series explores what it means to honor God with every part of who you are: physically, mentally, and spiritually.</p>", series_sermons: [] },
];

// ---------------------------------------------------------------------------
// Content Pages (about, partnership, baptism, stories) — added in v1.4.0
// Data mirrors src/lib/subpage-fallbacks.ts → CONTENT_PAGES.
// ---------------------------------------------------------------------------

const CONTENT_PAGES = [
  {
    title: "About 180 Life Church",
    slug: "about",
    acf: {
      page_subtitle:
        "We exist to make and send disciples who love and live like Jesus.",
      page_card_tag: "Our Story",
      page_card_title: "About",
      page_card_description:
        "Mission, history, and what to expect on a Sunday.",
      page_sections: [
        {
          label: "Our Mission",
          heading: "Following, Changing,",
          heading_accent: "Committed",
          body:
            "<p>We exist to make and send disciples who love and live like Jesus. This is the mission of our church and everything that we do is filtered through that lens. Our goal is to live out the great commission and to spread the Good News to the ends of the earth.</p><p>\"And he said to them, 'Follow me, and I will make you fishers of men.'\" (Matthew 4:19)</p><p>180 Life Church members have an intentional relationship with God, His people, and the community. Following Jesus changes us, producing spiritual growth. We are committed to Jesus and actively discipling others.</p>",
        },
        {
          label: "Our Story",
          heading: "How It All",
          heading_accent: "Started",
          body:
            "<p>180 Life Church is a non-denominational church that started in 2005 when Pastor Bill LaMorey and his wife Rebecca felt called to leave Florida and plant a church in Connecticut. They had a vision to see lives changed by Jesus, and before long, a small group of people started meeting for church at Elmwood Community Center in West Hartford. Through prayer and persistence, the church grew over time, eventually settling into Conard High School for weekly services for 16 years.</p><p>After 18 years of faithful service, God called Pastor Bill and Rebecca back to Florida, and in August 2023 Josh Poteet joined staff as Lead Pastor.</p><p>In June of 2025 we acquired our first building that sits on the Bloomfield/West Hartford line located at 180 Still Road. Services in the new space kicked off in November 2025 and we have fully embraced the blessing that the building is as a tool for ministry.</p>",
          image_position: "left",
        },
        {
          label: "Sundays",
          heading: "What to",
          heading_accent: "Expect",
          body:
            "<p>Our building is located at 180 Still Road in Bloomfield. Doors open at 8:40 AM and church begins at 9 AM for our first service and 11 AM for service two. Please arrive earlier to get yourself settled.</p><p>We want you to feel the freedom to come as you are. Some people dress up while others dress casually. Join us in an outfit that you are comfortable in.</p><p>We start with worship, announcements, followed by a message. Each service lasts about 75 minutes.</p>",
        },
      ],
      page_cta_heading: "Got Questions?",
      page_cta_description:
        "We are here to help with your questions about Jesus, our church, and your own spiritual growth.",
      page_cta_text: "Ask Now",
      page_cta_link: "/contact",
    },
  },
  {
    title: "Partnership",
    slug: "partnership",
    acf: {
      page_subtitle:
        "Learn more about who we are as a church and how God uniquely designed you to be a part of the church body.",
      page_card_tag: "Membership",
      page_card_title: "Partnership",
      page_card_description:
        "Learn how to become a partner and discover your place in the church body.",
      page_sections: [
        {
          label: "Partner With Us",
          heading: "Your Place in",
          heading_accent: "the Church Body",
          body:
            "<p>In our two-week Partnership class, we unpack our beliefs, what the Bible says about the church body, and how you fit into the local church. You will have an opportunity to fill out a spiritual gifts assessment test to see how your gifts can be utilized to serve the body.</p><p>Have questions about 180 Life Church or the Bible? This is the perfect class to come, learn, and ask. It is our goal to continue partnering with you on our mission to make and send disciples who love and live like Jesus!</p>",
        },
      ],
      page_cta_heading: "Ready to Partner?",
      page_cta_description:
        "Be on the lookout for our next class. Contact us for details.",
      page_cta_text: "Contact Us",
      page_cta_link: "/contact",
    },
  },
  {
    title: "Baptism & Dedication",
    slug: "baptism",
    acf: {
      page_subtitle: "A public declaration of an inward transformation.",
      page_card_tag: "Next Step",
      page_card_title: "Baptism & Dedication",
      page_card_description:
        "Ready to take your next step of faith? Learn about baptism and child dedication.",
      page_sections: [
        {
          label: "Your Next Step",
          heading: "What is",
          heading_accent: "Baptism?",
          body:
            "<p>Baptism is a public declaration of an inward transformation. It is a command from Christ (Matthew 28:19) and an act of obedience. If you are a follower of Jesus and have never been baptized, we encourage you to take this next step in your faith journey!</p>",
        },
        {
          heading: "Are You",
          heading_accent: "Ready?",
          body:
            "<p>If you feel that you are ready to take this next step in your faith journey, sign up for our next baptism! Let us know you are interested or if you have any questions.</p>",
        },
        {
          label: "Families",
          heading: "Child",
          heading_accent: "Dedication",
          body:
            "<p>Child Dedication is a public commitment parents make before God, the church, and their family. The dedication provides parents an opportunity to express their desire to lead and spiritually nurture their child to know God and encourage them to establish a personal relationship with Jesus Christ.</p><p>Attending a Child Dedication Parent Meeting is a requirement before the Child Dedication Ceremony.</p>",
          image_position: "left",
        },
      ],
      page_cta_heading: "Interested in Baptism or Dedication?",
      page_cta_description:
        "Congratulations! We would love to celebrate this step with you.",
      page_cta_text: "Sign Up for Baptism",
      page_cta_link:
        "https://180life.churchcenter.com/registrations/events/3506531",
    },
  },
  {
    title: "Stories",
    slug: "stories",
    acf: {
      page_subtitle: "Jesus Changes Everything!",
      page_card_tag: "Testimonies",
      page_card_title: "Stories",
      page_card_description:
        "See how God is transforming lives at 180 Life Church.",
      page_sections: [
        {
          label: "Testimonies",
          heading: "Lives",
          heading_accent: "Changed",
          body:
            "<p>Take a look at these short videos to see how God is transforming the lives of 180 Life members! Check out our YouTube channel for the full playlist.</p>",
        },
        {
          label: "Your Story",
          heading: "Share Your",
          heading_accent: "Story",
          body:
            "<p>Our lives are each unfolding stories that hold incredible power. Whether you are in a great chapter or a challenging chapter, God can use your story to encourage, challenge, and build up those who hear it.</p><p>We believe collecting the stories of our people is a sacred work that can impact not only this generation, but those to come, and we would be honored to hear yours and add it to our library.</p>",
        },
      ],
      page_cta_heading: "Have a Story to Share?",
      page_cta_description:
        "We would love to hear how God has been working in your life.",
      page_cta_text: "Share Your Story",
      page_cta_link: "/contact",
    },
  },
];

// ---------------------------------------------------------------------------
// Ministry Pages — added in v1.5.0
// Data mirrors src/lib/subpage-fallbacks.ts → MINISTRY_PAGES.
// Editors will likely want to upload hero/leader photos after seeding.
// ---------------------------------------------------------------------------

const MINISTRY_PAGES = [
  {
    title: "180 Life Groups",
    slug: "life-groups",
    acf: {
      ministry_subtitle:
        "Life Groups are a great way to get to know others at the church on a more personal level.",
      ministry_description:
        "<p>With many people attending on a Sunday morning, it can sometimes be hard to get to know people. 180 Life Groups are a great way to meet others at the church on a more intimate level. This is a place you grow as a disciple of Christ as you study God's Word and fellowship with others.</p><p>Groups typically have around 8 to 15 people and follow along from the Sunday message. Some meet in person, others online, and some are hybrid.</p><p>We offer groups for families, women, men, young adults, and moms of young children.</p>",
      ministry_verse_text:
        "Two are better than one... if either of them falls down, one can help the other up.",
      ministry_verse_reference: "Ecclesiastes 4:9-10",
      ministry_accent_color: "#D4A054",
      ministry_hero_icon: "Users",
      ministry_hero_pattern: "network",
      ministry_feature_cards_label: "How Groups Work",
      ministry_feature_cards_heading: "Life is Better Together",
      ministry_feature_cards: [
        {
          icon: "BookOpen",
          label: "Study Together",
          description:
            "Groups follow the Sunday message — diving deeper into the Word together throughout the week.",
        },
        {
          icon: "Coffee",
          label: "Real Relationships",
          description:
            "Small enough for genuine connection, large enough to feel like family — 8 to 15 people per group.",
        },
        {
          icon: "MapPin",
          label: "Meet Anywhere",
          description:
            "In-person, online, or hybrid — find a group that fits your week and your stage of life.",
        },
      ],
      ministry_schedule: [
        {
          day: "Various Days",
          time: "Throughout the Week",
          location: "Various locations around Greater Hartford",
        },
      ],
      ministry_contact_email: "info@180lifechurch.org",
      ministry_external_links: [
        {
          label: "Find a Life Group",
          href: "https://180life.churchcenter.com/groups/180-life-groups",
          description: "Browse and join a group on Church Center",
        },
      ],
    },
  },
  {
    title: "Student Ministry",
    slug: "students",
    acf: {
      ministry_subtitle:
        "Student Ministry for grades 6 through 12 in Greater Hartford.",
      ministry_description:
        "<p>Our Student Ministry (Grades 6-12) partners with Wintonbury Church and their NextGen Youth Ministry. Our goal is to provide a safe place where students can feel comfortable sharing challenges during their teen years, help prepare them for their future by digging deeper into God's Word, and build relationships with trusted leaders.</p><p>Both Middle School and High School groups meet weekly and separately on two different days of the week. On Sunday mornings, students enjoy live worship in the adult service before connecting with small group leaders for lessons and activities.</p>",
      ministry_schedule: [
        { day: "Friday", time: "6:30 - 8:30 PM", location: "Middle School" },
        { day: "Sunday", time: "5:30 - 8:00 PM", location: "High School" },
      ],
      ministry_contact_email: "chip@180lifechurch.org",
    },
  },
  {
    title: "Young Adults",
    slug: "young-adults",
    acf: {
      ministry_subtitle:
        "Are you in your 20s or 30s and looking for community? Join our diverse group of Young Adults in the Greater Hartford area.",
      ministry_description:
        "<p>Our young adults are passionate about Jesus and life! We seek to create an authentic place where you can be yourself, make lasting friendships, and encourage one another in the Christian life.</p><p>We hang out together, serve together (in and outside the church), play sports leagues together, and gather every Tuesday evening for worship, teaching, and small groups.</p>",
      ministry_verse_text:
        "Don't let anyone look down on you because you are young, but set an example for the believers in speech, in conduct, in love, in faith and in purity.",
      ministry_verse_reference: "1 Timothy 4:12",
      ministry_accent_color: "#818CF8",
      ministry_hero_icon: "Sparkles",
      ministry_hero_pattern: "dots",
      ministry_feature_cards_label: "What to Expect",
      ministry_feature_cards_heading: "Faith, Friendship, Fun",
      ministry_feature_cards: [
        {
          icon: "Music",
          label: "Worship & Word",
          description:
            "Tuesday nights of live worship, teaching that meets you where you are, and small group conversation.",
        },
        {
          icon: "Users",
          label: "Real Community",
          description:
            "Sports leagues, hangouts, monthly lunches, serving together — friendships that go beyond the building.",
        },
        {
          icon: "HandHeart",
          label: "On Mission",
          description:
            "Serve together inside and outside the church. Discover purpose for this stage of life.",
        },
      ],
      ministry_schedule: [
        { day: "Tuesday", time: "6:30 PM", location: "180 Life Church" },
        {
          day: "First Sunday of the Month",
          time: "After Service",
          location: "Lunch together",
        },
      ],
      ministry_contact_email: "ben@180lifechurch.org",
    },
  },
  {
    title: "180 Life Kids",
    slug: "kids",
    acf: {
      ministry_subtitle:
        "From nursery through 5th grade, your kids will experience age-appropriate Bible teaching in a safe, fun environment.",
      ministry_description:
        "<p>180 Life Kids exists to partner with parents to make and send disciples who love and live like Jesus. Sunday mornings, your children (nursery through 5th grade) will experience age-appropriate Bible teaching, worship, and activities led by trained volunteers who love both Jesus and kids.</p><p>All check-in is digital and our team is screened and trained for safety.</p>",
      ministry_schedule: [
        { day: "Sundays", time: "9:00 AM & 11:00 AM" },
      ],
      ministry_contact_email: "jen@180lifechurch.org",
    },
  },
  {
    title: "Men's Ministry",
    slug: "mens",
    acf: {
      ministry_subtitle:
        "Men sharpening men through fellowship, accountability, and a Christ-centered pursuit of becoming better husbands, fathers, and leaders.",
      ministry_description:
        "<p>Men's Ministry at 180 Life Church is built on the conviction that 'as iron sharpens iron, so one person sharpens another.' We gather for breakfasts, retreats, and small group studies designed to build authentic friendships and grow in our walk with Christ.</p>",
      ministry_contact_email: "jim@180lifechurch.org",
    },
  },
  {
    title: "Women's Ministry",
    slug: "womens",
    acf: {
      ministry_subtitle:
        "Walking with one another through every season — drawing closer to Jesus and to one another.",
      ministry_description:
        "<p>180 Life Women's Ministry exists to encourage women in every season of life. We host Bible studies, brunches, retreats, and serving opportunities. Whether you've been walking with Jesus for years or are just getting started, there's a place for you.</p>",
      ministry_contact_email: "emily@180lifechurch.org",
    },
  },
  {
    title: "Missions & Outreach",
    slug: "missions",
    acf: {
      ministry_subtitle:
        "We seek to bring the love of Christ to a community and world in need of the Gospel.",
      ministry_description:
        "<p>At 180 Life we seek to bring the love of Christ to a community in need of the Gospel. We not only support local and worldwide missionaries, but we offer ways for the church body to participate in God's bigger story through mission trips. In the past we have traveled locally here in Connecticut, as well as Miami, West Virginia, and Haiti.</p><p>Whether you participate by yourself, with your family, or with friends, these trips are an opportunity to join in God's work among the nations.</p>",
      ministry_verse_text:
        "Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.",
      ministry_verse_reference: "Matthew 28:19",
      ministry_accent_color: "#14B8A6",
      ministry_hero_icon: "Globe",
      ministry_hero_pattern: "rays",
      ministry_feature_cards_label: "How We Engage",
      ministry_feature_cards_heading: "Local, National, Global",
      ministry_feature_cards: [
        {
          icon: "MapPin",
          label: "Local Outreach",
          description:
            "Serving our neighbors right here in the Greater Hartford area year-round.",
        },
        {
          icon: "Compass",
          label: "Mission Trips",
          description:
            "Past trips to Miami, West Virginia, and Haiti — opportunities for individuals, families, and groups.",
        },
        {
          icon: "Globe",
          label: "Missionaries We Support",
          description:
            "Partnering with workers around the world who are sharing the gospel where it's needed most.",
        },
      ],
      ministry_contact_email: "info@180lifechurch.org",
    },
  },
  {
    title: "Deaf Ministry",
    slug: "deaf-ministry",
    acf: {
      ministry_subtitle:
        "Sign language interpreted services every Sunday morning.",
      ministry_description:
        "<p>180 Life Church provides a high quality, professional interpreter in American Sign Language every Sunday morning. We believe that every person deserves to experience worship, community, and the love of God in a language and format that is accessible to them.</p>",
      ministry_verse_text:
        "And let the beauty of the Lord our God be upon us, and establish the work of our hands for us; Yes, establish the work of our hands.",
      ministry_verse_reference: "Psalms 90:17",
      ministry_accent_color: "#8B5CF6",
      ministry_hero_icon: "Ear",
      ministry_hero_pattern: "waves",
      ministry_feature_cards_label: "Accessible Worship",
      ministry_feature_cards_heading: "Every Person, Every Service",
      ministry_feature_cards: [
        {
          icon: "Ear",
          label: "Professional Interpretation",
          description:
            "Certified ASL interpreters every Sunday at both the 9 AM and 11 AM services.",
        },
        {
          icon: "Users",
          label: "Welcoming Community",
          description:
            "More than interpretation — full inclusion in worship, life groups, and church family.",
        },
        {
          icon: "HandHeart",
          label: "Serve on the Team",
          description:
            "Looking for interpreters and supporters to expand this ministry. Reach out if you're interested.",
        },
      ],
      ministry_schedule: [
        {
          day: "Sunday",
          time: "9:00 AM & 11:00 AM",
          location: "Main Auditorium, ASL Interpreted",
        },
      ],
      ministry_contact_email: "info@180lifechurch.org",
    },
  },
  {
    title: "Care Ministry",
    slug: "care",
    acf: {
      ministry_subtitle:
        "We connect people to Christ-centered spiritual, emotional, and relational assistance.",
      ministry_description:
        "<p>Depending on your needs, our Care Ministry may minister to you by walking alongside you through a difficult time, helping you develop discipleship relationships, connecting you to other ministries in the church, encouraging you with the truth of Scripture, recommending helpful books, sermons, and online articles, or referring you to a professional Christian counselor.</p><p>Our Pastoral Care team offers hospital visitation and funerals, premarital counseling and weddings, and baby and child dedications.</p>",
      ministry_verse_text:
        "Carry each other's burdens, and in this way you will fulfill the law of Christ.",
      ministry_verse_reference: "Galatians 6:2",
      ministry_accent_color: "#EC4899",
      ministry_hero_icon: "Heart",
      ministry_hero_pattern: "waves",
      ministry_feature_cards_label: "Ways We Care",
      ministry_feature_cards_heading: "Walking Together Through Every Season",
      ministry_feature_cards: [
        {
          icon: "Heart",
          label: "Pastoral Care",
          description:
            "Hospital visits, funerals, premarital counseling, weddings, and baby dedications.",
        },
        {
          icon: "HandHeart",
          label: "Helping Hands",
          description:
            "Meals for families welcoming new babies, navigating illness, or grieving a loss.",
        },
        {
          icon: "Shield",
          label: "Helping Hammers",
          description:
            "Hands-on practical help — home projects, maintenance, and skilled labor for those who need it.",
        },
      ],
      ministry_contact_email: "info@180lifechurch.org",
    },
  },
  {
    title: "Prayer Ministry",
    slug: "prayer",
    acf: {
      ministry_subtitle:
        "Prayer is a vital part of our relationship with God, as individuals and a church community.",
      ministry_description:
        "<p>As believers, it is a privilege and responsibility to thank God for all He is doing among us and to intercede for God's wisdom, direction, and provision in the needs of our community, our church, our ministries, and our people.</p><p>Join us for Pre-Service Prayer on Sunday mornings from 9:15 to 9:45 AM. All are welcome to attend!</p>",
      ministry_verse_text:
        "Devote yourselves to prayer, being watchful and thankful.",
      ministry_verse_reference: "Colossians 4:2",
      ministry_accent_color: "#6366F1",
      ministry_hero_icon: "Flame",
      ministry_hero_pattern: "crosses",
      ministry_feature_cards_label: "How We Pray",
      ministry_feature_cards_heading: "A Praying Church",
      ministry_feature_cards: [
        {
          icon: "Flame",
          label: "Pre-Service Prayer",
          description:
            "Sundays 9:15–9:45 AM. All welcome. Praying for the services, the church, and one another.",
        },
        {
          icon: "Heart",
          label: "Personal Prayer",
          description:
            "Reach out anytime — our team prays confidentially over needs in your life and family.",
        },
        {
          icon: "Users",
          label: "Join the Team",
          description:
            "Members with a heart for prayer are invited to join the intercessory team that lifts the church.",
        },
      ],
      ministry_schedule: [
        {
          day: "Sunday",
          time: "9:15 - 9:45 AM",
          location: "Pre-Service Prayer",
        },
      ],
      ministry_contact_email: "info@180lifechurch.org",
    },
  },
  {
    title: "Serving",
    slug: "serving",
    acf: {
      ministry_subtitle:
        "Discover your role. One of the primary ways of connecting into the life of 180 Life Church is to serve.",
      ministry_description:
        "<p>Our desire is to help believers discover how God has uniquely wired them with gifts, talents, and passions and to equip people to magnify God by serving in their church, community, and the world.</p><p>When you decide to make 180 Life Church your church home, we hope that service will become a part of your life's worship. There are many serving opportunities: setting up on a Sunday morning, greeting and ushering, hospitality, audio-visual, worship, participating in the Kids Ministry, and many more.</p>",
      ministry_verse_text:
        "Each of you should use whatever gift you have received to serve others, as faithful stewards of God's grace in its various forms.",
      ministry_verse_reference: "1 Peter 4:10",
      ministry_accent_color: "#F59E0B",
      ministry_hero_icon: "HandHeart",
      ministry_hero_pattern: "rays",
      ministry_feature_cards_label: "Where to Plug In",
      ministry_feature_cards_heading: "Discover Your Role",
      ministry_feature_cards: [
        {
          icon: "Sun",
          label: "Sunday Mornings",
          description:
            "Set-up, greeters, ushers, hospitality, parking — the team that opens the doors every week.",
        },
        {
          icon: "Music",
          label: "Worship & Tech",
          description:
            "Worship team, sound, lighting, video, slides — the people who shape the room.",
        },
        {
          icon: "Baby",
          label: "Kids Ministry",
          description:
            "Background-checked teammates pouring into the next generation in nursery, preschool, and elementary.",
        },
        {
          icon: "MessageCircle",
          label: "Guest Center",
          description:
            "Welcoming first-time visitors, answering questions, and helping people take their next step.",
        },
      ],
      ministry_contact_email: "info@180lifechurch.org",
      ministry_external_links: [
        {
          label: "Apply to Serve",
          href: "https://180life.churchcenter.com/people/forms/405849",
          description: "Fill out the serving application on Church Center",
        },
      ],
    },
  },
  {
    title: "Marriage Prep",
    slug: "marriage-prep",
    acf: {
      ministry_subtitle:
        "It is our goal at 180 Life Church to help you prepare for a successful marriage that glorifies God.",
      ministry_description:
        "<p>Congratulations on your engagement! We are very excited for you! This is a joyous occasion and we are excited to walk with you as you prepare for marriage.</p><p>While the coming months will be very busy with wedding planning and preparations, it is equally important to be preparing your relationship for a healthy and God-honoring marriage.</p><p>Step 1: We will need a few details to help get things started. Let us know a wedding date, location, and to request a pastor to officiate the ceremony.</p><p>Step 2: All couples are required to participate in premarital counseling with a biblical counselor. Premarital counseling should begin 4 to 6 months before the wedding date.</p>",
      ministry_verse_text:
        "Therefore what God has joined together, let no one separate.",
      ministry_verse_reference: "Mark 10:9",
      ministry_accent_color: "#F43F5E",
      ministry_hero_icon: "HeartHandshake",
      ministry_hero_pattern: "mountains",
      ministry_feature_cards_label: "Your Journey",
      ministry_feature_cards_heading: "How We Walk Alongside You",
      ministry_feature_cards: [
        {
          icon: "Calendar",
          label: "Start 4–6 Months Out",
          description:
            "Premarital counseling begins 4 to 6 months before the wedding so you have time to do the work well.",
        },
        {
          icon: "BookOpen",
          label: "Biblical Counseling",
          description:
            "5–6 sessions with a trained biblical counselor — communication, finances, conflict, faith, family.",
        },
        {
          icon: "HeartHandshake",
          label: "A Pastor's Care",
          description:
            "One of our pastors officiates the ceremony and walks with you into your first year of marriage.",
        },
      ],
      ministry_contact_email: "info@180lifechurch.org",
    },
  },
];

// ---------------------------------------------------------------------------
// Seed runners
// ---------------------------------------------------------------------------

async function seedSiteSettings() {
  if (!shouldRun("site-settings")) return;
  console.log("\n=== Site Settings (singleton) ===");
  const existing = await wpRequest(
    "GET",
    "site-settings?per_page=5&_fields=id,title"
  ).catch(() => []);

  if (existing.length > 0) {
    console.log(
      `  [skip] Site Settings singleton already exists (id=${existing[0].id}). Edit manually in wp-admin.`
    );
    return;
  }
  await createOrSkip("site-settings", "Site Settings", SITE_SETTINGS);
}

async function seedMinistries() {
  if (!shouldRun("ministries")) return;
  console.log("\n=== Ministries ===");
  for (const m of MINISTRIES) {
    const { title, ...acf } = m;
    await createOrSkip("ministry", title, acf);
  }
}

async function seedStaff() {
  if (!shouldRun("staff")) return;
  console.log("\n=== Staff (pastors + staff) ===");
  for (const s of STAFF) {
    const { title, ...acf } = s;
    await createOrSkip("staff", title, acf);
  }
}

async function seedElders() {
  if (!shouldRun("elders")) return;
  console.log("\n=== Elders ===");
  for (const e of ELDERS) {
    const { title, ...acf } = e;
    await createOrSkip("elder", title, acf);
  }
}

async function seedSermonSeries() {
  if (!shouldRun("sermon-series")) return;
  console.log(
    `\n=== Sermon Series — REMOVED (sourced from Planning Center now) ===`
  );
  console.log(
    `  Skipping. The headless site reads sermons directly from`
  );
  console.log(
    `  Planning Center Publishing API. The sermon_series CPT was`
  );
  console.log(
    `  removed in v1.1.0 of the 180 Life Sync plugin.`
  );
}

async function seedContentPages() {
  if (!shouldRun("content-pages")) return;
  console.log(
    "\n=== Content Pages (About / Partnership / Baptism / Stories) ==="
  );
  for (const page of CONTENT_PAGES) {
    // Match the WP post slug rather than the title so re-running picks
    // up the existing entry even if the editor renamed it.
    const existing = await wpRequest(
      "GET",
      `content-page?slug=${encodeURIComponent(page.slug)}&_fields=id,slug,title&per_page=1`
    ).catch(() => []);
    if (existing.length > 0) {
      console.log(
        `  [skip] "${page.title}" (slug=${page.slug}) already exists (id=${existing[0].id})`
      );
      continue;
    }
    if (DRY_RUN) {
      console.log(
        `  [dry-run] Would create: "${page.title}" (slug=${page.slug})`
      );
      continue;
    }
    const created = await wpRequest("POST", "content-page", {
      title: page.title,
      slug: page.slug,
      status: "publish",
      acf: page.acf,
    });
    console.log(`  [created] "${page.title}" (id=${created.id})`);
  }
}

async function seedMinistryPages() {
  if (!shouldRun("ministry-pages")) return;
  console.log("\n=== Ministry Pages (12 deep-detail ministry pages) ===");
  for (const page of MINISTRY_PAGES) {
    const existing = await wpRequest(
      "GET",
      `ministry-page?slug=${encodeURIComponent(page.slug)}&_fields=id,slug,title&per_page=1`
    ).catch(() => []);
    if (existing.length > 0) {
      console.log(
        `  [skip] "${page.title}" (slug=${page.slug}) already exists (id=${existing[0].id})`
      );
      continue;
    }
    if (DRY_RUN) {
      console.log(
        `  [dry-run] Would create: "${page.title}" (slug=${page.slug})`
      );
      continue;
    }
    const created = await wpRequest("POST", "ministry-page", {
      title: page.title,
      slug: page.slug,
      status: "publish",
      acf: page.acf,
    });
    console.log(`  [created] "${page.title}" (id=${created.id})`);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(`WordPress: ${WORDPRESS_URL}`);
  console.log(`User: ${WORDPRESS_USERNAME}`);
  console.log(`Mode: ${DRY_RUN ? "DRY RUN (no writes)" : "WRITE MODE"}`);
  if (ONLY) console.log(`Filter: only ${ONLY.join(", ")}`);
  console.log("");

  try {
    await seedSiteSettings();
    await seedMinistries();
    await seedStaff();
    await seedElders();
    await seedContentPages();
    await seedMinistryPages();
    await seedSermonSeries();

    console.log("\n✓ Done.");
    if (DRY_RUN) {
      console.log("\nThis was a dry run. Re-run with --write to actually create posts.");
    } else {
      console.log("\nNext steps:");
      console.log("  1. Log into wp-admin and verify the posts look correct");
      console.log("  2. Upload photos via the Media Library and attach to the corresponding entries");
      console.log("  3. Trigger revalidation to see changes on the preview site");
    }
  } catch (err) {
    console.error("\n✗ Seed failed:", err.message);
    process.exit(1);
  }
}

main();
