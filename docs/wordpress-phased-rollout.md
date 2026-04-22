# WordPress CMS Phased Rollout

**For:** 180 Life Church leadership and editorial team
**Prepared by:** Brandon Gottschling
**Last updated:** April 21, 2026

This document explains how WordPress content editing will roll out to the team, what editors can change at each phase, and what stays in code. The goal is a calm, predictable launch where editors have what they need on day one without being overwhelmed by a fully-wired CMS.

---

## Current Status (as of April 21, 2026)

| Component | Status |
|---|---|
| WordPress REST API connectivity | ✅ Verified (WP 6.9.4, PHP 8.2.30) |
| Application Password authentication | ✅ Working |
| ACF Pro installed | ✅ Installed (Apr 21) |
| Custom Post Type UI installed | ✅ Installed (Apr 21) |
| Revalidation webhook | ✅ Wired — fires on publish |
| Vercel environment variables | ✅ Set in preview scope |
| Custom post types created | ⏳ In progress |
| ACF field groups created | ⏳ In progress |
| Content populated | ⏳ In progress |

---

## The Three Phases

### Phase A — Launch Critical (Go-live May 25)
**What editors can change from day one.**

Focus: the content that changes most often and has the highest visibility. Five custom post types cover 90% of what the editorial team needs day-to-day.

| Custom Post Type | Powers | Why Phase A |
|---|---|---|
| **Site Settings** (singleton) | Homepage hero, footer contact info, social links, CTA copy, mission statement | Editors change hero copy and contact info often; these appear on every page |
| **Ministry** | Six ministry cards on the homepage | Ministries can be added/retired; cards need regular photo refreshes |
| **Staff Member** | Pastors and staff on the Leadership page | Leadership changes cause immediate updates when someone joins or leaves |
| **Elder** | Elder list on the Leadership page | Same reasoning as Staff |
| **Sermon Series** | Sermons page: 26 existing series + all future series | New series launch every 6-8 weeks and need immediate publishing |

**What editors will do in Phase A:**
- Update homepage hero text, rotating words, and CTA buttons
- Change the church address, phone, email, and service times sitewide
- Update social media links
- Add/edit/remove ministry cards on the homepage
- Add new staff members when hired, remove when they leave
- Update pastor/staff bios and photos
- Add new sermon series with video links and artwork
- Update the mission statement and church tagline

**What stays in code (Phase A):**
- Page layouts and design
- Eight simple ministry subpages (Life Groups, Care, Prayer, Marriage Prep, Missions, Serving, Young Adults, Deaf Ministry) — still render from current hardcoded content
- Four custom-themed ministry subpages (Kids, Men's, Women's, Students) — elaborate designs stay locked
- Five content pages (About, Baptism, Partnership, New to Faith, Stories) — hardcoded for launch
- Legal pages (Privacy, Terms)
- Give page (structural content)
- /new visitor onboarding flow

---

### Phase B — Post-Launch Enhancement (Weeks 1-6 after go-live)
**Editors gain full content control over subpages.**

After the initial launch and first editorial training session, we add two more custom post types that unlock editing for all the simple subpages.

| Custom Post Type | Powers | Scope |
|---|---|---|
| **Ministry Page** | 8 simple ministry subpages (Life Groups, Care, Prayer, Marriage Prep, Missions, Serving, Young Adults, Deaf Ministry) | Full content editing |
| **Content Page** | 5 core content pages (About, Baptism, Partnership, New to Faith, Stories) | Flexible sections + CTAs |

**What editors can additionally do in Phase B:**
- Edit the title, description, schedule, and contact info for 8 ministry subpages
- Edit the About page sections and Next Steps cards
- Edit the Baptism page content
- Edit the Partnership (Membership) page
- Edit the New to Faith page
- Edit the Stories page and add new testimonies

**What still stays in code:**
- All page layouts and design
- Four custom-themed ministry pages (Kids, Men's, Women's, Students) — their designs are intentional and intricate
- Legal pages
- Give page structure
- /new onboarding flow

---

### Phase C — Long-Term / As Needed
**Rarely-changing or externally-managed content.**

These custom post types are low priority because the underlying content rarely changes or is managed by another system of record.

| Custom Post Type | Powers | Why Phase C |
|---|---|---|
| **Event** | Homepage event cards | Planning Center is the source of truth for events; the live API integration handles this automatically |
| **Service** | Service day/time/description list | Service times change maybe once every 2-5 years; easier to update in code than maintain a CPT |

**These may never be created.** Planning Center already feeds events into the homepage via API, and service times are effectively static.

---

## Editor Access Plan

| Person | Role | Phase A access | Phase B access |
|---|---|---|---|
| Chip Anthony | Administrator | All of Phase A | All of Phase A + B |
| Grace Valentine | Editor | All of Phase A | All of Phase A + B |
| Future editors | Editor | Same as Grace | Same as Grace |

The WordPress admin will be simplified for editor accounts: Posts, Comments, Default Pages, Plugins, and Themes will be hidden. Editors will see only:
- Site Settings
- Ministries
- Staff
- Elders
- Sermon Series
- Media (for uploading photos)
- (Phase B adds) Ministry Pages, Content Pages

---

## How Updates Reach the Live Site

1. Editor logs into `cms.180lifechurch.org` (WordPress) and edits content
2. Editor clicks **Publish** or **Update**
3. WordPress sends a webhook to Vercel (the live site)
4. Vercel rebuilds only the pages that changed (takes ~5 seconds)
5. Visitors see the updated content immediately

No developer involvement, no deployments, no downtime.

---

## Decisions Still Pending

These don't block launch but should be resolved before or during Phase B:

- **Contact form provider.** Currently on Brandon's personal Formspree account. Options: Formspree ($10/mo), FormSubmit.co (free/unlimited), or Planning Center People Forms (free if already subscribed).
- **WordPress subdomain.** Plan to move WordPress from `180lifechurch.org` to `cms.180lifechurch.org` before DNS cutover so the Next.js site can live at the main domain. Requires GoDaddy access.
- **Planning Center PAT.** Needed for the live events integration on the homepage. Without it, events fall back to hardcoded cards.
- **Ministry photography.** AI-generated placeholder images are in place. Real photography will replace them over Phase B.
- **Ministry leader design feedback.** Some ministry pages may want additional visual customization once leaders review.

---

## What "Editable" Actually Means

A common question: "Can editors just create a brand new page whenever they want?"

**Short answer:** Within the defined post types, yes. Outside of them, no.

Editors can:
- Create a new **Staff Member** and they instantly appear on the Leadership page
- Create a new **Sermon Series** and it appears in the sermons grid
- Create a new **Ministry** entry and it appears as a card on the homepage
- Edit any existing page's text, photos, and structured fields

Editors cannot:
- Create a brand-new page type with a unique design (e.g., a "Missions Trip" campaign page)
- Change the layout or visual design of existing pages
- Reorganize the sitemap

For anything outside the defined templates, Brandon can add a new page type within a day or two and deploy it. Editors then get a new section in wp-admin to manage it.

This is by design. A structured CMS keeps the site consistent, fast, and on-brand. Full flexibility would require a more complex system and a longer learning curve for editors.

---

## Questions

Contact Brandon Gottschling at `b@gottschling.dev`.
