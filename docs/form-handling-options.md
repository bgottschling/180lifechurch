# Form Handling: Current State and Options

## What 180 Life Uses Today (WordPress/Divi)

### Contact Form
- **How it works**: Divi theme's built-in contact module (`et_pb_contact_form`)
- **Processing**: Server-side PHP on the WordPress host; emails sent via the hosting provider's mail server
- **Cost**: $0 (included with Divi theme license and hosting)
- **Limitation**: Only works inside WordPress; cannot be used in a headless/Next.js front-end

### Newsletter Signup (Footer)
- **Service**: Mailchimp
- **Account name**: Still under "Calvary Hartford" (legacy name)
- **Mailchimp list URL**: `calvaryhartford.us7.list-manage.com/subscribe/post?u=f7f4da0906e80524d0af7fdd1&id=bffdeffd28`
- **Cost**: Free tier (250 contacts, 500 sends/month)

---

## The Problem

Moving to a headless Next.js front-end means the Divi contact form no longer works. We need a replacement for:

1. **Contact form** on `/contact` (name, email, message submissions)
2. **Newsletter signup** in the footer (already on Mailchimp, just needs the embed wired up)

The church likely receives **fewer than 50 form submissions per month**, but could spike during events, Easter, or outreach campaigns. We want a solution that stays free or near-free even during busy seasons.

---

## Option Comparison

### Option A: FormSubmit.co (Recommended -- $0/year)

| | |
|---|---|
| **Cost** | Free forever. No paid tiers. No account required. |
| **How it works** | Point the form `action` to `https://formsubmit.co/your@email.com`. Submissions are emailed directly. |
| **Submission limit** | Unlimited |
| **Spam protection** | Built-in CAPTCHA (can be disabled), honeypot field |
| **Features** | Custom redirect after submit, CC/BCC, auto-response, file uploads |
| **Downsides** | No dashboard/submission history, no webhook integrations, less polished than paid options |
| **Setup effort** | ~10 minutes. Change the form action URL and add a hidden `_next` field for redirect. |

**Why this is the best fit**: A church contact form is simple (name, email, message). There is no need for a dashboard, analytics, or integrations. FormSubmit delivers the message to the church email inbox, which is all that is needed.

### Option B: Next.js API Route + Resend ($0/year for typical usage)

| | |
|---|---|
| **Cost** | Free up to 100 emails/day (3,000/month). Paid: $20/month for 50K emails. |
| **How it works** | Form posts to a Vercel serverless function (`/api/contact`), which calls the Resend API to send an email. |
| **Submission limit** | 100/day on free tier (more than enough for a church) |
| **Spam protection** | You implement it (honeypot, rate limiting) |
| **Features** | Full control over email formatting (HTML templates), delivery tracking, custom from address |
| **Downsides** | Requires a verified domain (DNS record), more code to maintain, need a Resend account |
| **Setup effort** | ~1 hour. Create Resend account, verify domain, build API route, add env var. |

**Why you might choose this**: If the church wants branded emails ("From: no-reply@180lifechurch.org") or needs to trigger other actions on form submit (e.g., add to a CRM).

### Option C: Web3Forms ($0/year up to 250/month)

| | |
|---|---|
| **Cost** | Free up to 250 submissions/month. Paid: $14/month for 10K/month. |
| **How it works** | Similar to FormSubmit but requires a free API key (no account password needed). |
| **Submission limit** | 250/month free |
| **Spam protection** | Built-in, includes hCaptcha option |
| **Features** | Submission dashboard, webhooks, Slack/Discord notifications |
| **Downsides** | 250/month limit could be hit during campaigns. $168/year if you exceed it. |
| **Setup effort** | ~15 minutes. Get access key from web3forms.com, add to form. |

### Option D: Formspree (Current implementation -- $0-$120/year)

| | |
|---|---|
| **Cost** | Free up to 50 submissions/month. Paid: $10/month ($120/year) for 200/month. |
| **How it works** | Form posts to `https://formspree.io/f/{form_id}`. Dashboard shows all submissions. |
| **Submission limit** | 50/month free (lowest of all options) |
| **Spam protection** | reCAPTCHA, honeypot |
| **Features** | Nice dashboard, file uploads, integrations (Slack, Airtable, Zapier) |
| **Downsides** | Most expensive option. 50/month is tight for a church. $120/year for the next tier. |
| **Setup effort** | Already implemented (form ID: `xpqynyda`). |

### Option E: WordPress REST API ($0/year, requires WP connection)

| | |
|---|---|
| **Cost** | $0 (uses existing WordPress hosting) |
| **How it works** | Form posts to a custom WP REST endpoint. WordPress processes the form and sends the email via its mail server. |
| **Submission limit** | Unlimited (bounded by hosting) |
| **Spam protection** | WP plugins (Akismet, etc.) |
| **Features** | Submissions stored in WP database, full control |
| **Downsides** | Requires WordPress to be connected and running. More complex setup. Ties form availability to WP uptime. |
| **Setup effort** | ~2-3 hours. Build WP plugin or use Contact Form 7 REST API. Only viable after WP headless integration is complete. |

---

## Recommendation

**Short-term (now)**: Switch from Formspree to **FormSubmit.co**. Zero cost, unlimited submissions, 10 minutes to implement. The church gets form submissions in their email inbox, which is the same experience they have today with Divi.

**Newsletter**: Wire the existing **Mailchimp** embed into the footer. Zero cost, uses their existing audience list.

**Long-term (after WP integration)**: If the church wants form submissions stored in WordPress (for record-keeping, follow-up workflows), build a WP REST endpoint. FormSubmit continues to work as a fallback if WP is ever down.

---

## Migration Path: Formspree to FormSubmit.co

### Code Change (ContactForm.tsx)

```diff
- <form action="https://formspree.io/f/xpqynyda" method="POST">
+ <form action="https://formsubmit.co/info@180lifechurch.org" method="POST">
+   <input type="hidden" name="_next" value="https://180lifechurch.org/contact?submitted=true" />
+   <input type="hidden" name="_subject" value="New Contact Form Submission - 180 Life Church" />
+   <input type="hidden" name="_captcha" value="true" />
+   <input type="text" name="_honey" style="display:none" />
```

### First Submission
FormSubmit requires a one-time email confirmation the first time a form is submitted to a new email address. After clicking the confirmation link, all future submissions go through automatically.

---

## Mailchimp Newsletter Integration

The footer should include a simple email signup that posts to:

```
https://calvaryhartford.us7.list-manage.com/subscribe/post?u=f7f4da0906e80524d0af7fdd1&id=bffdeffd28
```

This sends new subscribers directly to the church's existing Mailchimp audience. No additional cost.

**Note for church staff**: The Mailchimp account is under "Calvary Hartford" (the church's former name). If you need to log in to manage subscribers, look for the Calvary Hartford account at mailchimp.com. Consider renaming the account to "180 Life Church" for clarity.
