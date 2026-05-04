# WordPress CMS Setup - Phase A

This directory contains the ACF Pro imports needed to set up the Phase A custom post types and field groups for the 180 Life Church website.

## What's in here

| File | Purpose |
|---|---|
| `acf-post-types.json` | Registers 4 custom post types: Site Settings, Ministry, Staff, Elder |
| `acf-field-groups.json` | Defines all ACF fields for those 5 post types (~55 fields total) |
| `seed-content.mjs` | Populates the 5 post types with the content currently hardcoded in the Next.js fallbacks |

## Import Steps

### Prerequisites
- WordPress 5.6+ with ACF Pro 6.x installed
- Admin access to wp-admin
- Application Password configured (for the Next.js site to read data)

### Step 1: Import the Post Types

1. Log into `wp-admin`
2. Navigate to **ACF → Tools**
3. Under **Import Post Types**, click **Choose File** and select `acf-post-types.json`
4. Click **Import JSON**
5. You should see 4 new items registered: Site Settings, Ministry, Staff, Elder
6. Verify the new menu items appear in the WordPress admin sidebar

### Step 2: Import the Field Groups

1. Still in **ACF → Tools**
2. Under **Import Field Groups**, click **Choose File** and select `acf-field-groups.json`
3. Click **Import JSON**
4. You should see 4 field groups: Site Settings Fields, Ministry Fields, Staff Member Fields, Elder Fields
5. Each field group is automatically attached to its corresponding post type

### Step 3: Create the Singleton Site Settings Entry

The Site Settings post type is designed as a **singleton** — only one entry should exist.

1. Navigate to **Site Settings → Edit Site Settings** in the admin menu
2. Click **Add New Site Settings** (the menu says "Edit" but the first visit requires creating the entry)
3. Enter "Site Settings" as the title (this is internal only, never shown to visitors)
4. Fill in the fields across the six tabs: Hero, About, Contact, Social, CTA, Church Identity
5. The default values match what's currently on the live site, so you can publish immediately and adjust later
6. Click **Publish**

**Important:** Only create ONE Site Settings entry. The Next.js site reads the first entry and ignores any others.

### Step 4: Verify Everything Is Wired Up

Hit the health check endpoint on your Vercel preview:

```
https://<your-preview-url>/api/wordpress-health?secret=180life-revalidate-2026
```

Expected response:
```json
{
  "connected": true,
  "authenticated": true,
  "acfAvailable": true,
  "env": { "WORDPRESS_URL": "set", "WORDPRESS_USERNAME": "set", ... }
}
```

Then check that Site Settings data is flowing through. Open any page and view the page source — you should see your configured hero tagline, contact info, etc.

## Post Type Reference

### Site Settings (`site_settings`)
**Singleton** — only one entry. Powers the hero, about section, contact info, social links, CTAs, and church identity across every page.

| Tab | Fields |
|---|---|
| Hero | tagline, heading prefix, rotating words (repeater), description, image, primary + secondary CTAs |
| About | label, heading, accent, body (WYSIWYG), image, link text + URL |
| Contact | address (2 lines), phone, email, service times summary, doors open text |
| Social | Facebook, Instagram, YouTube, Vimeo URLs |
| CTA | label, heading, accent, body, primary + secondary buttons |
| Church Identity | mission statement, church tagline |

### Ministry (`ministry`)
One entry per homepage ministry card. 6 ministries expected: Life Groups, Students, Young Adults, Kids, Men's, Women's (or whatever the church decides).

Fields: description, card image, tag, icon, page slug, sort order.

### Staff Member (`staff`)
Pastors + staff on the Leadership page. Rule: any entry with "Pastor" in the role shows in the pastor section; everyone else shows as staff.

Fields: role, photo, bio, email.

### Elder (`elder`)
Elder list on the Leadership page. Simpler than Staff.

Fields: role (defaults to "Elder"), photo.

### ~~Sermon Series~~ (REMOVED in v1.1.0)
Sermon series are now sourced live from Planning Center Publishing API, no longer from a WordPress CPT. See `docs/planning-center-integration.md` for the architecture. Editors only update sermons in Church Center; the public site picks them up within 24 hours.

## Troubleshooting

### "The ACF field group is not showing up when I edit a post"
Double-check the Location Rules. Each field group should be set to "Post Type is equal to {slug}" where `{slug}` matches the post type. The import should handle this automatically.

### "Custom post types aren't appearing in the REST API"
Verify each CPT has `show_in_rest: true` and `rest_base` set correctly. The Next.js data layer expects these exact rest_base values:
- `site-settings`, `ministry`, `staff`, `elder`

### "ACF fields aren't appearing in the REST API response"
In ACF Pro 5.11+, fields are exposed automatically. Verify "Show in REST API" is enabled on each field group (the import sets `show_in_rest: 1`).

### "Changes aren't appearing on the live site"
The Next.js frontend caches WordPress responses for up to 1 hour (ISR). To force an immediate refresh, configure the revalidation webhook (see `docs/wordpress-editorial-guide.md`) so WordPress pings Vercel on publish.

## What's NOT in here

The following post types are intentionally out of scope for Phase A:
- `ministry_page` — individual ministry subpages (Phase B)
- `content_page` — About, Baptism, Partnership, etc. (Phase B)
- `event` — homepage event cards (Phase C, if ever — Planning Center handles this via API)
- `service` — service times (Phase C, rarely changes)

See `docs/wordpress-phased-rollout.md` for the full phased rollout plan.

## Next Steps After Import

After the ACF JSON is imported, you can either populate content manually
through wp-admin OR use the included seed script to populate everything
at once.

### Option 1: Automated Seed (Recommended)

The seed script pushes the hardcoded fallback content from
`src/lib/wordpress-fallbacks.ts` and `src/lib/subpage-fallbacks.ts`
directly into WordPress via the REST API.

**Prerequisites:**
- ACF post types and field groups already imported (Steps 1 + 2 above)
- Node.js 18+ installed locally
- `.env.local` configured with `WORDPRESS_URL`, `WORDPRESS_USERNAME`, `WORDPRESS_AUTH_TOKEN`

**Preview what will be created (dry run):**
```bash
node wordpress/seed-content.mjs
```

**Actually create the posts:**
```bash
node wordpress/seed-content.mjs --write
```

**Seed only specific post types:**
```bash
node wordpress/seed-content.mjs --write --only=ministries,staff
```

Valid types: `site-settings`, `ministries`, `staff`, `elders`. (`sermon-series` removed in v1.1.0; sermons sourced from Planning Center now.)

The script is **idempotent** — it looks up posts by title before creating.
If a post already exists, it is skipped. Safe to run multiple times.

**What gets seeded:**
- 1 Site Settings entry (hero, about, contact, social, CTA, identity)
- 6 Ministry entries (homepage cards)
- 9 Staff entries (2 pastors + 7 staff)
- 4 Elder entries
- ~~28 Sermon Series entries~~ (removed in v1.1.0 — Planning Center is now the source of truth)

**What the script does NOT do:**
- Upload photos (images reference the old WP Media library URLs, but not as ACF image fields — you'll need to upload photos and attach them to each entry manually after seeding)
- Activate the Site Settings singleton (you may need to verify it's set to `publish` status in wp-admin)

### Option 2: Manual Entry

If you prefer to enter content one at a time:

1. Create the singleton Site Settings entry (fill all 6 tabs)
2. Create 6 Ministry entries (one for each homepage card)
3. Create 9 Staff entries (pastors + staff)
4. Create 4 Elder entries
5. ~~Migrate sermon series~~ (auto-sourced from Planning Center in v1.1.0+)
6. Test on preview, then verify live

Questions? Contact Brandon Gottschling at `b@gottschling.dev`.
