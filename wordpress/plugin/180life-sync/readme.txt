=== 180 Life Sync ===
Contributors: bgottschling
Tags: webhook, revalidation, headless, nextjs, vercel, health-check
Requires at least: 5.6
Tested up to: 6.9
Requires PHP: 7.4
Stable tag: 2.1.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Keeps the live Next.js site in sync with WordPress. Auto-fires cache revalidation webhooks when content is published or updated, and periodically verifies the headless integration is healthy.

== Description ==

Built for the 180 Life Church headless WordPress + Vercel architecture, but works with any Next.js site that exposes a `/api/revalidate` endpoint with a shared secret.

= What it does =

* **Auto-revalidation:** When an editor publishes or updates content, the plugin fires a webhook to the Next.js site so changes appear within seconds rather than waiting for the 1-hour ISR cache to expire.
* **Periodic health checks:** Every 6 hours by default, the plugin polls the Next.js diagnostic endpoint to verify the integration is working and stores the result. If overall status drops to "broken," an admin email alert is sent (debounced).
* **Activity log:** Last 50 webhook events with status, timing, and trigger source.

= Premium admin UI =

Built on WordPress core design language with status indicators, masked credential fields, in-page test buttons, and inline diagnostic results. No external dependencies.

= Four-tab settings page =

1. **General** - webhook URL, revalidation secret, Vercel bypass token, master enable/disable, test connection button
2. **Tag Mapping** - configurable per-post-type cache tag mapping with auto-discovery of registered post types
3. **Site Health** - periodic check schedule, alert email, manual run button, latest diagnostic detail
4. **Activity Log** - last 50 webhook events with status badges and round-trip timings

= Vercel preview support =

Optional bypass token field for testing on protected preview deployments before flipping to production. Switch URLs and clear the token when going live.

== Installation ==

1. Upload the `180life-sync` folder to `/wp-content/plugins/`
2. Activate the plugin through the **Plugins** menu in WordPress
3. Go to **Settings → 180 Life Sync**
4. Fill in the General tab:
   - **Webhook URL** - Next.js `/api/revalidate` endpoint
   - **Revalidation Secret** - must match `WORDPRESS_REVALIDATION_SECRET` in Vercel env vars
   - **Vercel Bypass Token** - optional, for protected preview deployments only
5. Click **Run Test** to verify the connection
6. Click **Save Settings**
7. Optionally, configure the **Site Health** tab to enable periodic checks and alerts

== Frequently Asked Questions ==

= Why isn't the webhook firing for my post? =

Check the Tag Mapping tab. Only post types listed there with at least one tag will trigger webhooks. Built-in `post` and `page` are not mapped by default.

= How often do periodic health checks run? =

Default is every 6 hours. Configurable to hourly, twice daily, or daily on the Site Health tab. WordPress runs scheduled tasks lazily - they fire on the next page request after the scheduled time, not at the exact second.

= Will I get spammed with alert emails if the site stays broken? =

No. Alerts are debounced - you only receive an email when overall status transitions into "broken" from a previous non-broken state. Subsequent re-checks that confirm the same broken status do not re-send.

= What are valid cache tags? =

`wordpress`, `events`, `ministries`, `leadership`, `sermons`, `settings`, `pages`. The `wordpress` tag invalidates everything; the others are more granular.

== Changelog ==

= 2.1.0 =
* **Content Pages match the engagement of Ministry Pages.** Content Pages (About, Partnership, Baptism & Dedication, New to Faith, Stories, Immeasurably More) now support the same Phase 2a/2b engagement fields as Ministry Pages:
    * Hero verse with scripture reference
    * Per-page accent color (themes the hero icon medallion, verse citation, feature card icons, and CTA band)
    * Hero icon medallion (19 Lucide icons)
    * Hero decoration pattern (waves, mountains, dots, rays, network, crosses)
    * Feature card grid (3-4 cards with icon + label + description)
    * Process steps timeline (4-step journeys with numbered badges)
    * Callout band (FAQ snippets, important notices)
   All fields are optional - blank ones render nothing. The fallback content for the 5 Next-Step content pages now ships with thematic defaults so the pages look engaging out of the box; editors can override anything in wp-admin.
* New: "New to Faith" page seeded with full content (was previously missing from the seed script entirely).
* New: navigation restructured. Top-nav gains a "Connect" dropdown grouping Partnership / Baptism / New to Faith. Stories promoted to its own top-nav link. A new /connect hub page lists all next-step destinations in one place.
* Internal: fixed a bug where the migration script that converted paragraph-array fallback content into HTML strings left visible "\n" artifacts between paragraphs on /new-to-faith and a few other pages.
* Internal: em-dashes (U+2014) scrubbed from 162 places across editorial content and UI strings, replaced with regular hyphens. Em-dashes were reading as an AI-tell in our prose.

= 2.0.1 =
* Companion Next.js change: visible-fallback image for ministry tiles is now the 180 Life Church logo (hosted on the WordPress side) instead of generic stock photos. When you see the logo on a tile, the fallback chain is rendering - the matching Ministry Page doesn't have a Card Image yet, or the data path is broken. Makes debugging "why isn't my image showing" obvious at a glance.
* Companion Next.js change: defensive slug-based deduplication on the homepage Ministries data path. Belt-and-suspenders for the rare case where duplicate ministry_page entries with the same slug make it into the response (the seed script's already idempotent, but if duplicates ever appear they no longer render duplicate tiles).

= 2.0.0 =
* **Homepage Cards merged into Ministry Pages.** Editors now control whether a ministry appears on the homepage from inside that ministry's page, instead of editing two separate post types. Each Ministry Page entry has a new "Card / Homepage" tab with:
   * **Show on Homepage** - toggle that decides whether this ministry surfaces as a tile on the homepage.
   * **Homepage Sort Order** - lower numbers render first (default 100; leave 10/20/30 gaps so you can slot ministries in front later).
   * **Card Description** - the short blurb shown on the tile (separate from the deep-page description, which is the rich-text body).
   * Card Image and Card Tag remain as before, now serving both the /ministries hub featured tile AND the homepage tile.
* **The legacy "Homepage Cards" (`ministry`) CPT is hidden from wp-admin** in this release. Existing entries stay readable via REST as a fallback so installs that haven't migrated keep rendering homepage tiles; new edits should happen on Ministry Pages going forward. Long-term you can simply delete those legacy entries after toggling Show on Homepage on the corresponding Ministry Pages.
* **Migration note for editors.** After upgrading and re-importing `wordpress/acf-field-groups.json` and `wordpress/acf-post-types.json`: open each ministry currently shown on your homepage (Life Groups, Students, Kids, Serving, Young Adults, Men's by default) under 180 Life → Ministry Pages → Card / Homepage tab, toggle Show on Homepage on, set the sort order, and fill in Card Image / Card Tag / Card Description. The seed script `node wordpress/seed-content.mjs --write --only=ministry-pages` does this automatically for fresh installs.
* **New content page: Immeasurably More.** Vision-cast companion page to /give, at `/immeasurably-more`. Reached via a callout on the /give page so the practical "Give Now" button stays one click away while visitors who want the why have somewhere meaningful to land. Editor-managed through the standard content_page CPT - re-seed to populate the default content or write your own from scratch in wp-admin.
* Companion change on the Next.js side: `fetchMinistries()` now reads from Ministry Pages first (filtering on Show on Homepage), falling back to the legacy CPT only if no entries are flagged.

= 1.9.0 =
* **Rich text rendering fix.** WYSIWYG fields (Ministry Description, Content Page sections, Callout body) now render bold, italic, links, lists, and blockquotes properly on the live site. Previously the editor's HTML was being escaped as plain text. No editor action needed - just upload the new plugin and any existing rich text will start rendering correctly. Re-import `wordpress/acf-field-groups.json` to pick up the enhanced field instructions.
* **Enhanced field instructions across the board.** All 153 editor-facing fields now have actionable instructions text with examples - particularly the 21 fields that were missing instructions entirely (mostly the new Phase 2a/2b fields like Feature Card icons, Process Steps, Tier Card icons, Callout icon, Leader name/role/photo).
* **Renamed "Ministries" CPT to "Homepage Cards"** to eliminate confusion with the deeper "Ministry Pages" CPT. The underlying post type slug is unchanged (`ministry`) so all existing entries continue to work - only the editor-facing labels in wp-admin change. Sidebar menu now reads "Homepage Cards" and "Ministry Pages" side by side, with clear descriptions explaining each one's scope:
    * **Homepage Cards** - tiles in the Ministries section of the homepage only
    * **Ministry Pages** - full deep-detail subpages at /ministries/<slug>
* The Content Hub landing page card icon for Homepage Cards changes from `dashicons-groups` to `dashicons-grid-view` to visually reinforce that these are layout tiles rather than ministry profiles.

= 1.8.0 =
* **Ministry Page polish - Phase 2b.** Three more section types added to the Ministry Page CPT to finish parity with the bespoke pages (Kids / Mens / Students / Womens):
   * **Process Steps** - horizontal timeline of icon + label + 1-line description (e.g. "Check-in → Worship → Lesson → Pick-up", or onboarding journeys for Life Groups / Serving / Missions / Marriage Prep). Steps connect with a thin accent line on wide screens.
   * **Group Tiers** - colored cards for age groups, program tiers, or any breakdown into distinct categories. Each card carries its own tint so the groups read at a glance. Used by the bespoke Kids page for Nursery / Preschool / Elementary / Middle School - the field exists for migrating those pages off bespoke code without losing their identity.
   * **Callout Block** - long-form emphasized text band with optional icon medallion and accent-tinted left border. Good for safety policies, FAQ, important notices.
* Each section is independently optional - fields left blank cause the section to be omitted entirely from the rendered page. Re-import `wordpress/acf-field-groups.json` via ACF → Tools after upgrading.
* Defaults baked into the 8 template-driven ministry fallbacks: Life Groups / Missions / Serving / Marriage Prep got Process Steps; Care got a Callout. The Vercel preview will show the new sections immediately; editors can refine or add per-ministry in wp-admin.
* `seedMinistryPages()` seeds the new fields too.

= 1.7.0 =
* **Hero Pattern picker on Ministry Pages.** New "Hero Pattern" dropdown on the Ministry Page CPT - pick from six themable inline SVG decorations layered over the gradient hero (Waves, Mountains, Dots & Stars, Rays, Network, Crosses). Mirrors the mountain silhouette treatment on the Men's Ministry bespoke page but as themable inline SVGs that tint to the page's accent color automatically. Re-import `wordpress/acf-field-groups.json` via ACF → Tools to surface the field.
* Companion change on the Next.js side: new `HeroPattern` component renders the selected pattern at low opacity, tinted via `currentColor` so editors get cohesive results without picking the color twice. The eight template-driven ministries ship with thematic defaults (Life Groups → network, Young Adults → dots, Missions / Serving → rays, Care / Deaf Ministry → waves, Prayer → crosses, Marriage Prep → mountains).
* Seed script: `seedMinistryPages()` now seeds `ministry_hero_pattern` too.

= 1.6.0 =
* **Ministry Page polish - Phase 2a.** Five new fields on the Ministry Page CPT bring the template-driven subpages up to the polish level of the bespoke ones (Kids, Mens, Students, Womens): hero scripture verse with citation, per-page accent color (any hex), hero icon medallion (dropdown of 19 Lucide icons), and a Feature Cards repeater for "pillars" / "values" / "what we stand for" grids. Each field is independently optional - leave blank and the section is omitted. Re-import `wordpress/acf-field-groups.json` via ACF → Tools after upgrading.
* Companion change on the Next.js side: `PageHero` and `MinistryPageTemplate` render the new fields. Eight template-driven ministries (Life Groups, Young Adults, Missions, Deaf Ministry, Care, Prayer, Serving, Marriage Prep) ship with default verse / accent / icon / feature-card values so the pages look polished out of the box - the editor can refine per-ministry later without breaking anything.
* Seed script: `seedMinistryPages()` now seeds the new fields too. Re-running on a fresh install populates everything; existing entries are skipped (by slug) so editors who have already customized a page won't have their work overwritten.

= 1.5.0 =
* **New post type: Ministry Pages.** Each ministry's deep-detail subpage (e.g. /ministries/kids, /ministries/life-groups) is now editable from wp-admin under 180 Life → Ministry Pages. Tabs cover Page Content (subtitle, hero image, WYSIWYG description), Schedule, External Links (Church Center, YouTube etc), Leaders (mini staff cards specific to the ministry), Contact email, Card Thumbnail (image + tag shown on /ministries hub featured cards), and per-page SEO. Re-import `wordpress/acf-post-types.json` and `wordpress/acf-field-groups.json` via ACF → Tools after upgrading.
* **Site Settings → Ministries Hub.** New tab on the Site Settings singleton that controls the section structure of /ministries - which groups exist, what they're called, which ministry is featured in each, and which ministries appear in each group. Lets the church team reorganize the hub without a code deploy.
* **Site Settings → Leadership Page.** Section eyebrow labels, headings, accents, and descriptions for the Pastors / Staff / Elders sections on /leadership are now editor-controlled. The leader cards themselves still come from the Staff and Elder CPTs - only the framing copy changes here.
* Tag mapping: a new default entry `ministry_page → wordpress, ministries` so saving any ministry page busts the right cache tags. Note: editors who imported plugin v1.0 or earlier may need to reset the tag mapping (Tag Mapping tab → defaults) to pick up new entries automatically.
* Companion change on the Next.js side: `MinistryPageTemplate` and `/ministries` hub now read editor-managed values from these new fields, falling back to bundled defaults so the site renders identically out of the box.
* New seed runners in `wordpress/seed-content.mjs`: `seedContentPages()` and `seedMinistryPages()` create starter entries for all 4 content pages and all 12 ministry pages with the current default copy. Idempotent - skips entries that already exist. Run `node wordpress/seed-content.mjs --write` after importing the updated ACF JSON.

= 1.4.0 =
* **New post type: Content Pages.** Editorial subpages - About, Partnership, Baptism & Dedication, Stories - are now editable from wp-admin under 180 Life → Content Pages instead of being hardcoded in the headless site. Each entry has tabs for Page Content (subtitle, hero image, repeatable body sections), Card Thumbnail (image + tag + copy shown when this page appears in cross-page grids like /about's Next Steps), Closing CTA, and per-page SEO. Re-import `wordpress/acf-post-types.json` and `wordpress/acf-field-groups.json` via ACF → Tools after upgrading to register the new post type and field group.
* New: hero image support across all content pages. Upload a photo in the Page Content tab and the live site renders an image-backed hero on that page; leave it blank to use the existing amber-on-dark hero treatment. Used on /about, /partnership, /baptism, /stories.
* New: editor-managed card thumbnails on /about's Next Steps grid. Upload an image (or edit the card title / tag / description) under the matching content page, and the corresponding card on /about flows through - same image, one upload.
* Content Hub: a "Content Pages" card now appears on the 180 Life landing page in wp-admin alongside Site Settings, Ministries, Staff, and Elders so editors can find the new post type.
* Tag mapping: a new default entry `content_page → wordpress, pages` ensures saving any content page busts the right cache tags so changes appear within seconds, not on the next ISR cycle.
* Companion change on the Next.js side: the unified site-health endpoint now expects 4 content pages by default - sub-counts surface as `degraded` rather than `broken` so a missing or in-progress page never wakes anyone up at 3 AM.

= 1.3.0 =
* New: **Analytics tab.** Enable Google Analytics 4 tracking on the live site by entering your Measurement ID (looks like `G-XXXXXXXXXX`) and toggling tracking on. Changes take effect on the next page load - no deploy required. Pair with the new Search Console verification field below it to verify domain ownership in Google Search Console using the HTML tag method.
* Internal: companion change on the Next.js side. The public site reads these values from a new public REST endpoint (`/wp-json/180life-sync/v1/public-config`) and injects the GA4 tag plus the Search Console verification meta tag into the document head on every render. Falls back to disabled-everywhere if the REST endpoint is unreachable, so a plugin outage will never accidentally enable or disable tracking.

= 1.2.2 =
* **Hotfix:** the Content Hub landing page (180 Life menu) crashed with "There has been a critical error on this website" because the new Quick Actions panel called `Health::latest()` - but the class is actually named `HealthChecker`. Fixed the typo. If you were affected by this: update to 1.2.2 and the hub renders normally again.
* Companion change on the Next.js side: tightened the health-status rationale so a missing or 404ing custom post type now surfaces as `degraded` rather than `broken`. Rationale: the data layer has hardcoded fallbacks for every WordPress CPT, so a missing post type means the site renders fallback content for that section - visitors still see a working page. `broken` is now reserved for foundational failures (env not set, REST API unreachable, auth fully rejected, PC PAT revoked) that genuinely take the integration down. This means the plugin's broken-status email alert no longer fires for localized issues that don't impact visitors.

= 1.2.1 =
* New: **Send Test Alert button** on the Site Health tab next to the Alert Email field. Verifies wp_mail() delivery works on this WordPress host without waiting for a real outage. Most common reason real alerts never arrive is silent SMTP failure on shared hosts that block PHP sendmail; the test button surfaces this immediately and recommends installing an SMTP plugin if delivery fails.
* Improved: when a real broken-status alert is sent (or fails to send), the result is now logged to the Activity Log with the recipient address and the wp_mail() return value. If wp_mail returned false, the log entry includes the captured PHPMailer error and a hint about SMTP configuration.

= 1.2.0 =
* New: **Quick Actions on the Content Hub.** "Site Health" status pill and "Refresh Content" panel are now surfaced directly on the 180 Life landing page in wp-admin, so editors can see at a glance whether the live site integration is healthy and force-refresh the cache without digging into Settings. The full diagnostic table and configuration options still live on the Sync settings page.
* Internal: removed the legacy `sermon-series` post-type entry from the headless-site health probe - Sermon Series was deprecated in v1.1.0 (sermons sourced from Planning Center Publishing API), and the probe was producing a misleading "post type not found" warning every time it ran.
* Companion change on the Next.js side: the `/api/wordpress-health` endpoint now also pings Planning Center's Registrations and Publishing APIs, so a future API rebrand surfaces as a `degraded` health status (and triggers an alert email if configured) before it can break the next deploy.

= 1.1.2 =
* "Refresh Planning Center Content" replaced with a more flexible "Refresh Content" panel that supports a scope selector. Default is "All content" (full global cache reset). Narrow scopes available for "Planning Center only" and "WordPress only" if you only want to invalidate one source's cache.
* The Activity Log now records the chosen scope (e.g. `admin/refresh-all`, `admin/refresh-planning-center`) so you can see at a glance which kind of refresh was triggered.

= 1.1.1 =
* New: "Refresh Planning Center Content" button on the General tab → Quick Actions section. Force-refreshes events and sermons from Church Center on demand, skipping the 24-hour cache wait. Use this immediately after publishing a new sermon series or event registration.
* Companion change on the Next.js side: a second Vercel Cron schedule fires automatically every Sunday at ~10:30 AM Eastern (14:30 UTC) so the Sunday morning service has the freshest content right when traffic peaks.

= 1.1.0 =
* **Sermon Series CPT removed.** Sermons are now sourced live from Planning Center Publishing API directly by the headless Next.js site, with daily refresh via Vercel Cron. No more dual-entry between Church Center and WordPress.
* `Sermon Series` removed from default Tag Mapping, Content Hub landing page, and managed CPT list.
* Editors with existing Sermon Series entries can safely deactivate or delete them after the headless site picks up Planning Center as the source of truth (no data is read from these entries anymore).

= 1.0.3 =
* New: consolidated admin menu. All church-managed content (Site Settings, Ministries, Staff, Elders, Sermon Series) is grouped under a single "180 Life" top-level menu in wp-admin instead of free-floating top-level entries. Includes a content hub landing page with quick-access cards for each content type and a count of published entries.
* New: "Consolidate Menus" toggle on the General tab to opt in or out (defaults to ON for new installs).
* Internal: AdminMenu class hooks `register_post_type_args` to redirect each managed CPT's `show_in_menu` to the parent slug; uses `parent_file` filter for accurate sidebar highlighting.

= 1.0.2 =
* **Critical fix:** Saving the General tab no longer silently disables the Site Health periodic check, and saving the Site Health tab no longer disables the master enabled toggle. Each tab now preserves the other tab's checkbox states across saves. Recommended for anyone who hit "I can't have both webhooks AND periodic checks turned on at the same time."
* Internal: sanitize uses array_key_exists() to distinguish "field not on this form" from "field explicitly unchecked"; checkbox markup adds a hidden input fallback so unchecked submits as 0 rather than missing.

= 1.0.1 =
* Fix: status bar now shows the gray "idle" indicator when the master toggle is off (previously showed green if the last test had passed, which was misleading)
* Add: inline warning notice on the General tab when webhooks are disabled, so editors know publish events won't trigger revalidation
* Add: download Activity Log as CSV (Excel-friendly) or JSON (full detail for debugging) from the Activity Log tab
* Polish: refresh / clear / download buttons grouped with dashicons in the log toolbar

= 1.0.0 =
* Initial release
* Renamed from "180 Life Revalidation" to "180 Life Sync" before first install
* Webhook firing on `transition_post_status` and `acf/save_post`
* Settings page with four tabs (General, Tag Mapping, Site Health, Activity Log)
* AJAX test connection button
* AJAX manual health check button
* Periodic health checks via WP-Cron with configurable frequency
* Email alerts on health-status transition to broken (debounced)
* 50-entry activity log
* Vercel bypass token support for preview deployments
