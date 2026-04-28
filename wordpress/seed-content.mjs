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
  console.log(`\n=== Sermon Series (${SERMON_SERIES.length} entries) ===`);
  for (const s of SERMON_SERIES) {
    const { title, ...acf } = s;
    await createOrSkip("sermon-series", title, acf);
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
