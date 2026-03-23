import {
  Server,
  Wrench,
  Lightbulb,
  Building2,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";

export type ItemType =
  | "checkbox"
  | "text"
  | "textarea"
  | "select"
  | "multi-select";

export interface GuideContent {
  title: string;
  steps: string[];
}

export interface ChecklistItem {
  id: string;
  label: string;
  type: ItemType;
  placeholder?: string;
  options?: string[];
  guide?: GuideContent;
}

export interface ChecklistSection {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  items: ChecklistItem[];
}

export const checklistSections: ChecklistSection[] = [
  {
    id: "current-setup",
    title: "Your Current Setup",
    description:
      "Help us understand what you already have in place so we can build on it.",
    icon: Server,
    items: [
      {
        id: "wp-login",
        label: "Do you already have a WordPress site? If so, what's the login URL?",
        type: "text",
        placeholder: "e.g., 180lifechurch.org/wp-admin",
        guide: {
          title: "How to Find Your WordPress Login",
          steps: [
            "Try typing one of these into your browser: 180lifechurch.org/wp-admin, 180lifechurch.org/wp-login.php, or 180lifechurch.org/admin",
            "If one of those loads a login screen, that's it. Write down the full URL.",
            "If none of them work, your site may not be on WordPress, or it may be on a different platform (like Squarespace or Wix). That's fine too, just let us know.",
          ],
        },
      },
      {
        id: "hosting-provider",
        label: "Who is your current web hosting provider?",
        type: "text",
        placeholder: "e.g., GoDaddy, Bluehost, SiteGround",
        guide: {
          title: "How to Find Your Hosting Provider",
          steps: [
            "Check your email for receipts or billing notices. Search for \"hosting\", \"renewal\", or \"domain\" from companies like GoDaddy, Bluehost, SiteGround, WP Engine, HostGator, or Namecheap.",
            "Check your credit card or bank statement for a recurring charge from a hosting company (usually monthly or yearly).",
            "Ask the person who originally set up the website. They'll likely remember.",
            "Look up your domain at who.is. Type in 180lifechurch.org and scroll down. The \"Name Server\" entries sometimes tell you who the host is.",
          ],
        },
      },
      {
        id: "keeping-domain",
        label: "Are you keeping the domain 180lifechurch.org?",
        type: "select",
        options: ["Yes, keeping it", "No, changing it", "Not sure yet"],
        guide: {
          title: "How to Find Your Domain Registrar",
          steps: [
            "Your domain registrar is the company you bought 180lifechurch.org from. This is sometimes the same as your hosting company, but not always.",
            "Go to who.is and search for 180lifechurch.org.",
            "Look for \"Registrar\" near the top. That's the company that manages your domain name.",
            "If you need to log in there, check your email for messages from that company (GoDaddy, Namecheap, Google Domains, etc.).",
          ],
        },
      },
      {
        id: "editor-count",
        label: "How many people on your team need to edit the website?",
        type: "select",
        options: ["Just 1", "2-3 people", "4-5 people", "More than 5"],
      },
      {
        id: "editor-roles",
        label:
          "Who are they, and what should each person be able to change?",
        type: "textarea",
        placeholder:
          'e.g., "Pastor John can edit everything, Sarah can only add events"',
        guide: {
          title: "Understanding Editor Roles",
          steps: [
            "Administrator: Everything. Full control over the site. Good for the lead pastor or web team lead.",
            "Editor: Can edit all content, but can't change site settings or install plugins. Good for staff members who update content regularly.",
            "Author: Can add and edit their own content (like events) but not other people's. Good for volunteers who post events or announcements.",
            "Think about who on your team will be making updates and which role fits each person. If you're not sure, we can figure it out together.",
          ],
        },
      },
    ],
  },
  {
    id: "tools-you-use",
    title: "Tools You Already Use",
    description:
      "We can integrate with tools you already have so nothing gets duplicated.",
    icon: Wrench,
    items: [
      {
        id: "planning-center",
        label:
          "Do you use Planning Center or Church Center for events, check-ins, or groups?",
        type: "select",
        options: [
          "Yes, we use Planning Center",
          "Yes, we use Church Center",
          "We use both",
          "No",
          "Not sure",
        ],
        guide: {
          title: "How to Find Your Planning Center Info",
          steps: [
            "Planning Center is a suite of tools many churches use for service planning, check-ins, groups, and more.",
            "Go to planningcenteronline.com and try logging in.",
            "If you use Church Center (the public-facing app), your link is usually 180lifechurch.churchcenter.com. Try that in your browser.",
            "The main thing we need to know is: do you use it, and which parts? (Services, People, Groups, Registrations, Giving, Check-Ins)",
            "If you don't use Planning Center, that's totally fine. Just let us know.",
          ],
        },
      },
      {
        id: "giving-platform",
        label: "Do you use an online giving platform?",
        type: "text",
        placeholder: "e.g., Tithe.ly, Pushpay, Subsplash Giving, PayPal",
        guide: {
          title: "How to Find Your Online Giving Link",
          steps: [
            "Check your current website for a \"Give\" or \"Donate\" button. Click it and copy the URL it takes you to.",
            "Common giving platforms for churches: Tithe.ly, Pushpay, Subsplash, Planning Center Giving, or PayPal. Check your email for messages from any of these.",
            "Ask your finance or admin team. They'll know what platform you use and can share the public giving link.",
          ],
        },
      },
      {
        id: "podcast-links",
        label:
          "Do you have a podcast on Apple Podcasts or Spotify? If so, share the links.",
        type: "textarea",
        placeholder: "Paste your Apple Podcasts and/or Spotify links here",
        guide: {
          title: "How to Find Your Podcast Links",
          steps: [
            "Apple Podcasts: Open podcasts.apple.com or the Podcasts app on an iPhone/Mac. Search for \"180 Life Church\". Click on your podcast and copy the URL from your browser.",
            "Spotify: Open open.spotify.com in your browser or the Spotify app. Search for \"180 Life Church\". Click on your podcast, then click the three dots (...) next to the name, then \"Share\" and \"Copy link\".",
            "If you're not sure whether you have a podcast, check with whoever records or uploads your sermons. It may have been set up through a service like Subsplash, Buzzsprout, or Anchor.",
          ],
        },
      },
      {
        id: "sermon-platform",
        label: "Where do you upload sermon videos?",
        type: "select",
        options: [
          "YouTube",
          "Vimeo",
          "Facebook",
          "Multiple platforms",
          "We don't record sermons",
          "Other",
        ],
        guide: {
          title: "How to Find Your Sermon Video Links",
          steps: [
            "YouTube: Go to your church's YouTube channel. We need the channel URL (e.g., youtube.com/@180lifechurch). If you want to feature a specific sermon, open that video and copy its URL.",
            "Vimeo: Same idea. Go to your Vimeo page and copy the URL.",
            "Facebook: If you livestream on Facebook, go to your page, click \"Videos\" on the left sidebar, and find the video you want. Copy the URL.",
          ],
        },
      },
      {
        id: "newsletter-tool",
        label: "Do you use an email newsletter tool?",
        type: "text",
        placeholder: "e.g., Mailchimp, Constant Contact, Flodesk",
        guide: {
          title: "How to Find Your Email Newsletter Info",
          steps: [
            "Mailchimp: Log in at mailchimp.com. We can connect a signup form on the website to your Mailchimp list.",
            "Constant Contact: Log in at constantcontact.com.",
            "Other tools: Subsplash, Flodesk, or church-specific tools also work. Just let us know what you use.",
            "Not sure? Ask whoever sends the weekly or monthly church emails what tool they use.",
          ],
        },
      },
      {
        id: "contact-form",
        label: "Do you have a contact form, or do people just email you?",
        type: "select",
        options: [
          "We have a contact form",
          "People email us directly",
          "We use a form through our church app",
          "We don't have one yet",
        ],
      },
    ],
  },
  {
    id: "what-you-want",
    title: "What You Want",
    description:
      "Help us understand your goals so we build exactly what you need.",
    icon: Lightbulb,
    items: [
      {
        id: "want-blog",
        label: "Do you want a blog or news section on the site?",
        type: "select",
        options: [
          "Yes, we'd like a blog",
          "Maybe in the future",
          "No, not needed",
        ],
      },
      {
        id: "event-management",
        label: "How do you want to manage events?",
        type: "select",
        options: [
          "Manage events on the website",
          "Link out to Planning Center / Church Center",
          "Both",
          "Not sure yet",
        ],
      },
      {
        id: "sermon-management",
        label: "How do you want to handle sermons on the site?",
        type: "select",
        options: [
          "Manage sermons on the website",
          "Just link to YouTube / podcast",
          "Both (embed + link)",
          "Not sure yet",
        ],
      },
      {
        id: "acf-budget",
        label:
          "Is there a small budget for one plugin license? (Advanced Custom Fields Pro, about $49/year, which gives you the editing interface)",
        type: "select",
        options: ["Yes, that's fine", "Need to check", "That might be tough"],
      },
    ],
  },
  {
    id: "church-info",
    title: "Church Info to Gather",
    description:
      "This info will appear throughout the website. Fill in what you know now, and we can update the rest later.",
    icon: Building2,
    items: [
      {
        id: "church-name",
        label: "Church name (as you'd like it displayed)",
        type: "text",
        placeholder: "180 Life Church",
      },
      {
        id: "has-logo",
        label: "Do you have a high-quality logo file ready to share?",
        type: "select",
        options: [
          "Yes, I can share it",
          "We have one but it might be low quality",
          "We need a new logo",
        ],
        guide: {
          title: "Getting Your Logo Ready",
          steps: [
            "The best format is a PNG file with a transparent background, at least 500x500 pixels.",
            "If you only have a logo on a colored background, that's okay. We can work with it.",
            "Check with whoever designed your logo or your print materials. They may have the original files.",
            "If you have business cards, letterhead, or signage, the same logo file was likely used to create those.",
          ],
        },
      },
      {
        id: "tagline",
        label: "Church tagline",
        type: "text",
        placeholder: "e.g., Jesus Changes Everything",
      },
      {
        id: "mission-statement",
        label: "Mission statement",
        type: "textarea",
        placeholder:
          "e.g., We exist to make and send disciples who love and live like Jesus.",
      },
      {
        id: "phone",
        label: "Church phone number",
        type: "text",
        placeholder: "(860) 243-3576",
      },
      {
        id: "email",
        label: "Church email address",
        type: "text",
        placeholder: "info@180lifechurch.org",
      },
      {
        id: "address",
        label: "Church street address",
        type: "textarea",
        placeholder: "180 Still Road\nBloomfield, CT 06002",
      },
      {
        id: "social-links",
        label: "Social media profile links (Facebook, Instagram, YouTube)",
        type: "textarea",
        placeholder:
          "Facebook: facebook.com/...\nInstagram: instagram.com/...\nYouTube: youtube.com/...",
        guide: {
          title: "How to Find Your Social Media Links",
          steps: [
            "Facebook: Go to your church's Facebook page. The URL in your browser's address bar is what we need (e.g., facebook.com/180lifechurch).",
            "Instagram: Go to your profile on instagram.com. The URL will look like instagram.com/180lifechurch.",
            "YouTube: Go to your church's YouTube channel. Click on your channel name, then copy the URL from the address bar.",
          ],
        },
      },
      {
        id: "photos-ready",
        label: "Do you have photos of your church, congregation, or worship services?",
        type: "select",
        options: [
          "Yes, we have photos ready",
          "We have some, but need more",
          "We need to take new photos",
          "We're fine with placeholders for now",
        ],
        guide: {
          title: "Getting Photos Ready",
          steps: [
            "For large photos (the top banner, backgrounds), aim for at least 1600 pixels wide. For smaller images (ministry cards), 800 pixels wide is fine.",
            "JPG or PNG files work great. Photos from a smartphone taken in the last few years are usually plenty high quality.",
            "We'll need photos of: worship services (for the top banner), your congregation or community gathering, any ministry-specific shots, and optionally your church building exterior.",
            "Tips: Natural, candid moments work better than posed shots. Good lighting makes a big difference. Landscape (horizontal) orientation is usually better for the website layout.",
            "If you don't have professional photos yet, that's okay. We have placeholders in place and can swap in real ones whenever they're ready.",
          ],
        },
      },
      {
        id: "ministry-photos",
        label:
          "Can you provide photos for each ministry? (Worship, Life Groups, Students, Kids, Serving Teams, Young Adults)",
        type: "textarea",
        placeholder:
          'e.g., "We have worship photos but need to take students and kids photos" or "Our photographer can take some this month"',
        guide: {
          title: "Ministry-Specific Photography",
          steps: [
            "Each ministry section on the website has its own card with a background photo. Right now these are stock placeholders.",
            "Real photos of YOUR congregation, worship team, kids, students, and volunteers will make a huge difference in making the site feel authentic.",
            "We need one great photo per ministry: Worship (band or singing), Life Groups (small group of people), Students (teens hanging out), Kids (children in class or playing), Serving Teams (volunteers in action), Young Adults (20s/30s gathering).",
            "Photos should be at least 800 pixels wide. Landscape (horizontal) orientation works best for the card layout.",
            "If you can get a volunteer photographer to capture a few Sundays, that would give us plenty to work with.",
            "No rush. We can swap photos in one at a time as they become available.",
          ],
        },
      },
    ],
  },
  {
    id: "feedback",
    title: "Design Feedback",
    description:
      "Share your thoughts on the website preview. What do you love? What would you change? This helps us get the design just right.",
    icon: MessageSquare,
    items: [
      {
        id: "overall-impression",
        label: "What's your overall impression of the website preview?",
        type: "select",
        options: [
          "Love it, looks great!",
          "Looks good, just a few tweaks",
          "It's okay, needs some changes",
          "Not quite what we had in mind",
        ],
      },
      {
        id: "color-feel",
        label:
          "How do you feel about the colors (warm ambers, dark backgrounds)? Would you prefer something different?",
        type: "textarea",
        placeholder:
          'e.g., "Love the warm tones" or "We\'d prefer brighter colors" or "Can we add our church\'s brand color?"',
      },
      {
        id: "content-changes",
        label:
          "Is there any text or wording on the site you'd like changed?",
        type: "textarea",
        placeholder:
          'e.g., "Our tagline should be..." or "The About section doesn\'t quite capture our heart"',
      },
      {
        id: "missing-features",
        label: "Is there anything missing that you'd like to see on the site?",
        type: "textarea",
        placeholder:
          'e.g., "We need a staff page" or "We want a prayer request form" or "Can we add our livestream?"',
      },
      {
        id: "photo-preferences",
        label:
          "Any preferences for the photography style or specific images you'd like to see?",
        type: "textarea",
        placeholder:
          'e.g., "More photos of our congregation" or "We want to feature our youth ministry"',
      },
      {
        id: "other-feedback",
        label: "Anything else you'd like us to know?",
        type: "textarea",
        placeholder: "Any other thoughts, ideas, or concerns...",
      },
    ],
  },
];

export function formatChecklistForEmail(
  values: Record<string, string | boolean | string[]>
): string {
  const lines: string[] = [
    "180 Life Church - Discovery Checklist Responses",
    "=" .repeat(50),
    "",
  ];

  for (const section of checklistSections) {
    lines.push(`## ${section.title}`);
    lines.push("-".repeat(40));

    for (const item of section.items) {
      const value = values[item.id];
      const isEmpty =
        value === undefined || value === "" || value === false;
      const displayValue = isEmpty
        ? item.placeholder
          ? `(default) ${item.placeholder}`
          : "(not answered)"
        : value === true
          ? "Yes"
          : Array.isArray(value)
            ? value.join(", ")
            : String(value);

      lines.push(`${item.label}`);
      lines.push(`  > ${displayValue}`);
      lines.push("");
    }

    lines.push("");
  }

  return lines.join("\n");
}
