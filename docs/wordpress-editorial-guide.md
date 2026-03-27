# 180 Life Church Website - Editorial Guide

> A plain-English guide for updating website content through WordPress.
> No coding required. If you can use Facebook or Google Docs, you can do this.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Updating Staff and Leadership](#updating-staff-and-leadership)
- [Updating Ministry Pages](#updating-ministry-pages)
- [Adding or Editing Events](#adding-or-editing-events)
- [Updating Service Times](#updating-service-times)
- [Managing Sermon Series](#managing-sermon-series)
- [Updating the Homepage](#updating-the-homepage)
- [Editing Other Pages](#editing-other-pages)
- [Working with Images](#working-with-images)
- [How Changes Go Live](#how-changes-go-live)
- [Common Tasks Cheat Sheet](#common-tasks-cheat-sheet)
- [FAQ](#faq)

---

## Getting Started

### Logging In

1. Go to **https://180lifechurch.org/wp-admin** in your browser
2. Enter your username and password
3. You will land on the WordPress Dashboard

### Finding Your Way Around

The left sidebar is your main menu. The items you will use most often:

| Sidebar Item | What It Controls |
|-------------|-----------------|
| **Staff** | Pastor and team member bios and photos |
| **Elders** | Elder names, roles, and photos |
| **Events** | Upcoming events shown on the homepage |
| **Ministries** | The 6 ministry cards on the homepage |
| **Ministry Pages** | The detailed pages for each ministry (Kids, Life Groups, etc.) |
| **Content Pages** | About, Partnership, Baptism, Stories, and New to Faith pages |
| **Services** | Sunday service times |
| **Sermon Series** | Sermon series with YouTube video links |
| **Site Settings** | Homepage hero banner, church contact info, social media links |

---

## Updating Staff and Leadership

### Adding a New Staff Member

1. In the left sidebar, click **Staff**
2. Click the **Add New** button at the top
3. In the **Title** field, type the person's full name (e.g. "Josh Poteet")
4. Scroll down to the custom fields section:
   - **Role:** Type their title (e.g. "Lead Pastor" or "Children's Ministry Director")
   - **Photo:** Click "Add Image" and upload their headshot
   - **Bio:** Write a short paragraph about them
5. Click the blue **Publish** button in the top right

> **Tip:** If someone's role includes the word "Pastor", they will automatically
> appear in the **Pastors** section at the top of the leadership page. Everyone
> else appears in the **Team** section below.

### Editing an Existing Staff Member

1. Click **Staff** in the sidebar
2. Find the person's name in the list and click on it
3. Make your changes
4. Click **Update**

### Removing a Staff Member

1. Click **Staff** in the sidebar
2. Hover over the person's name
3. Click **Trash**

### Updating Elders

Same process as Staff, but click **Elders** in the sidebar instead. Elder fields are:

- **Title:** The elder's name
- **Role:** Their position (Chair, Secretary, Treasurer, or Elder)
- **Photo:** Optional headshot

---

## Updating Ministry Pages

There are two different places for ministry content. Here is when to use each:

### Homepage Ministry Cards (the 6 cards visitors see first)

These are short previews that appear on the homepage.

1. Click **Ministries** in the sidebar
2. Click on the ministry you want to edit
3. You can change:
   - **Description:** The short blurb on the card
   - **Image:** The card background photo
   - **Tag:** The label in the corner (e.g. "Sundays", "Weekly")
   - **Sort Order:** A number that controls the display order (lower numbers appear first)
4. Click **Update**

### Detailed Ministry Pages (the full page when someone clicks "Learn More")

These are the in-depth pages with schedules, descriptions, and links.

1. Click **Ministry Pages** in the sidebar
2. Click on the ministry you want to edit (e.g. "Kids Ministry", "Life Groups")
3. You can change:
   - **Subtitle:** The text shown below the title at the top of the page
   - **Description:** The main body text. You can use bold, italic, and links just like in a Word document
   - **Schedule:** Click "Add Row" to add meeting times. Each row has:
     - Day (e.g. "Sunday")
     - Time (e.g. "9:00 AM & 11:00 AM")
     - Location (e.g. "Main Auditorium") - optional
   - **Contact Email:** The email address shown in the "Have Questions?" section
   - **External Links:** Links to Church Center, Google Drive, YouTube, etc. Each row has:
     - Label (e.g. "Find a Life Group")
     - URL (paste the full link)
     - Description (e.g. "Browse and join a group on Church Center") - optional
4. Click **Update**

> **Important:** Do not change the "slug" (the URL-friendly name) of ministry pages.
> If you rename "life-groups" to "small-groups", the website link will break.
> If you need to rename a ministry, contact your web administrator.

---

## Adding or Editing Events

### Adding a New Event

1. Click **Events** in the sidebar
2. Click **Add New**
3. In the **Title** field, type the event name (e.g. "Easter at 180 Life")
4. Fill in the fields:
   - **Date:** Type the date as you want it displayed (e.g. "April 20" or "Every Tuesday")
   - **Time:** Type the time (e.g. "9:00 AM & 11:00 AM")
   - **Description:** A short description (1-2 sentences) for the event card
   - **Featured:** Check this box to make the event stand out with a dark card
   - **Link:** Paste a Church Center registration link if the event has online signup
5. Click **Publish**

### Removing an Old Event

1. Click **Events** in the sidebar
2. Hover over the event name
3. Click **Trash**

> **Tip:** Keep only 3-4 events visible at a time. Too many events on the homepage
> can feel overwhelming to visitors.

---

## Updating Service Times

1. Click **Services** in the sidebar
2. Click on the service you want to edit (e.g. "First Service")
3. You can change:
   - **Day:** e.g. "Sunday"
   - **Time:** e.g. "9:00 AM"
   - **Description:** A short note about the service
   - **Sort Order:** Controls the display order
4. Click **Update**

### Adding a New Service (e.g. a special holiday service)

1. Click **Services** > **Add New**
2. Give it a title (e.g. "Christmas Eve Service")
3. Fill in the fields and click **Publish**

---

## Managing Sermon Series

### Adding a New Sermon Series

1. Click **Sermon Series** in the sidebar
2. Click **Add New**
3. In the **Title** field, type the series name (e.g. "At the Movies")
4. Fill in:
   - **Slug:** A URL-friendly version of the name using lowercase letters and hyphens (e.g. "at-the-movies"). This becomes part of the web address.
   - **Subtitle:** A short tagline
   - **Description:** A paragraph about the series
   - **Image:** Upload a series cover image or thumbnail
5. To add sermons to the series, scroll to the **Sermons** section and click **Add Row** for each sermon:
   - **Title:** The sermon title (e.g. "At the Movies: Week 1")
   - **Date:** Display date (e.g. "February 2024")
   - **YouTube ID:** The video code from YouTube. To find this:
     1. Go to the sermon video on YouTube
     2. Look at the URL: `https://www.youtube.com/watch?v=ABC123xyz`
     3. The ID is the part after `v=` -- in this example, `ABC123xyz`
   - **Speaker:** The speaker's name (optional)
6. Click **Publish**

### Finding a YouTube Video ID

Here is a visual breakdown:

```
Full URL:  https://www.youtube.com/watch?v=dQw4w9WgXcQ
                                           ^^^^^^^^^^^
                                           This part is the ID

Short URL: https://youtu.be/dQw4w9WgXcQ
                            ^^^^^^^^^^^
                            This part is the ID
```

Just copy the characters after `v=` (or after `youtu.be/`) and paste it into the YouTube ID field.

---

## Updating the Homepage

The homepage pulls content from several places. Here is where to find each section:

### Hero Banner (the big image and text at the top)

1. Click **Site Settings** in the sidebar (or go to the Settings/Options page if using ACF Pro)
2. Look for the **Hero Section** fields:
   - **Tagline:** The small text above the heading (e.g. "No Perfect People Allowed")
   - **Heading Prefix:** The main heading (e.g. "Jesus Changes")
   - **Rotating Words:** The words that cycle through in amber. Click "Add Row" for each word
   - **Description:** The paragraph below the heading
   - **Image:** The background photo
   - **Primary Button:** Text and link for the gold button (e.g. "Plan Your Visit" linking to "/new")
   - **Secondary Button:** Text and link for the outline button (e.g. "Watch Online" linking to the livestream)
3. Click **Update**

### "A Place Where You Belong" Section

Same **Site Settings** page, scroll to the **About Section**:
- **Label, Heading, Heading Accent:** Control the section title
- **Body:** The two paragraphs of text
- **Image:** The community photo
- **Link Text/URL:** The "Learn More About Us" link

### Church Contact Info (footer and contact page)

Same **Site Settings** page, scroll to the **Contact Info** section:
- Address, phone, email, service times

### Social Media Links

Same **Site Settings** page, scroll to **Social Media**:
- Facebook, Instagram, YouTube, Vimeo URLs

### Mission Statement and Tagline

Same **Site Settings** page, at the bottom:
- **Mission Statement:** Appears in the footer
- **Church Tagline:** Appears in the footer in italic

---

## Editing Other Pages

### About, Partnership, Baptism, Stories, and New to Faith

1. Click **Content Pages** in the sidebar
2. Click on the page you want to edit
3. You can change:
   - **Subtitle:** Text shown at the top of the page below the title
   - **Sections:** Each section has its own heading, optional label, body text, and optional image. Click "Add Row" to add a new section or use the arrows to reorder them
   - **Call-to-Action:** The banner at the bottom with a heading, description, button text, and button link
4. Click **Update**

> **Tip:** For the CTA button link, you can use:
> - An internal page like `/contact` (just the path, starting with `/`)
> - An external link like `https://180life.churchcenter.com/giving` (full URL)
> External links will automatically open in a new tab for visitors.

---

## Working with Images

### Recommended Image Sizes

| Where | Recommended Size | Format |
|-------|-----------------|--------|
| Staff/Elder headshot | 600 x 800 px (portrait) | JPG or PNG |
| Hero background | 1920 x 1080 px (landscape) | JPG |
| Ministry card | 800 x 600 px (landscape) | JPG |
| Sermon series cover | 1280 x 720 px (16:9) | JPG or PNG |
| About/community photo | 800 x 600 px | JPG |

### Uploading Images

1. When you see an Image field, click **Add Image** (or **Select Image**)
2. You can either:
   - **Upload:** Drag a file from your computer, or click "Select Files"
   - **Media Library:** Choose a photo you have already uploaded
3. Click **Select** to confirm

### Image Tips

- **Headshots** look best when the person is centered and the photo is cropped from roughly chest-level up
- **Compress large images** before uploading. Use a free tool like [TinyPNG](https://tinypng.com) to reduce file size without losing quality
- **Use JPG** for photographs and **PNG** for logos or graphics with transparent backgrounds
- **Avoid images with text baked in** as they cannot be read by screen readers or search engines

---

## How Changes Go Live

When you click **Publish** or **Update** in WordPress:

1. WordPress saves your changes immediately
2. Within a few seconds, a signal is sent to the website
3. The website clears its cached version of that page
4. The next visitor to that page sees the updated content

**You do not need to do anything else.** There is no separate "deploy" or "push live" step.

> **Note:** It may take up to 60 seconds for changes to appear. If you do not see
> your changes right away, try refreshing the page (Ctrl+R or Cmd+R). If changes
> still do not appear after a few minutes, contact your web administrator.

---

## Common Tasks Cheat Sheet

| I want to... | Go to... | Then... |
|-------------|---------|---------|
| Add a new staff member | Staff > Add New | Fill in name, role, photo, bio > Publish |
| Update someone's bio | Staff > click their name | Edit the Bio field > Update |
| Remove a staff member | Staff > hover name > Trash | |
| Change service times | Services > click the service | Edit time/day > Update |
| Add an upcoming event | Events > Add New | Fill in details > Publish |
| Remove a past event | Events > hover name > Trash | |
| Update a ministry page | Ministry Pages > click it | Edit fields > Update |
| Add a Church Center link to a ministry | Ministry Pages > External Links > Add Row | Fill in label and URL > Update |
| Change the homepage banner text | Site Settings > Hero Section | Edit fields > Update |
| Update the church phone number | Site Settings > Contact Info | Edit phone > Update |
| Add a new sermon series | Sermon Series > Add New | Fill in details + YouTube IDs > Publish |
| Change a social media link | Site Settings > Social Media | Edit URL > Update |

---

## FAQ

**Q: I made a change but the website still shows the old content.**
A: Wait 60 seconds and refresh the page. If it still has not changed, try opening the page in a private/incognito browser window. Your browser may be showing a cached version.

**Q: Can I preview my changes before publishing?**
A: Yes. When editing, click **Preview** (or **Save Draft** first, then **Preview**) to see how your changes will look. The preview is only visible to you.

**Q: I accidentally deleted something. Can I get it back?**
A: Yes. In the sidebar, click on the content type (e.g. Staff), then click the **Trash** link above the list. Find the item and click **Restore**.

**Q: Can I schedule a change to go live in the future?**
A: Yes. Instead of clicking Publish, click the **Edit** link next to "Publish immediately" and set a future date and time. WordPress will publish it automatically at that time.

**Q: How do I reorder the ministries on the homepage?**
A: Go to Ministries, open each one, and change the **Sort Order** number. Lower numbers appear first (1, 2, 3...).

**Q: What if I need to add a completely new page to the website?**
A: Adding a new route to the website requires a code change. Contact your web administrator. However, you can add new entries to existing sections (new staff, new events, new sermon series, new ministry pages) without any code changes.

**Q: Who do I contact if something is broken?**
A: Reach out to your web administrator. If the website itself is down, check [Vercel Status](https://www.vercel-status.com) to see if there is a platform-wide issue.

**Q: I do not see "Staff" or "Ministry Pages" in my sidebar.**
A: Your WordPress account may not have the right permissions. Ask an admin to ensure your role is set to **Editor** or **Administrator**.

**Q: What are "slugs" and why should I not change them?**
A: A slug is the URL-friendly name that appears in the web address. For example, the Kids Ministry page lives at `180lifechurch.com/ministries/kids`. The slug is `kids`. If you change it to something else, the old link will break and visitors will see a "Page Not Found" error. If you need to rename something, contact your web administrator so they can update the website code to match.
