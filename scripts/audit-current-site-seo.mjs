#!/usr/bin/env node
/**
 * SEO Audit of the current 180lifechurch.org WordPress site.
 *
 * Fetches each URL and extracts:
 *   - title
 *   - meta description
 *   - canonical URL
 *   - OG title / description / image
 *   - Twitter card meta
 *   - robots directives
 *   - JSON-LD schema @type values
 *
 * Outputs a markdown table for the audit doc and a JSON dump for
 * programmatic comparison with the new site.
 *
 * Usage:
 *   node scripts/audit-current-site-seo.mjs           # writes to stdout
 *   node scripts/audit-current-site-seo.mjs --json    # JSON output
 *   node scripts/audit-current-site-seo.mjs --md      # markdown table
 *   node scripts/audit-current-site-seo.mjs --md > docs/seo-audit-current-site.md
 */

const URLS = [
  // Top-level pages (corrected from page-sitemap.xml)
  ["Homepage", "https://180lifechurch.org/"],
  ["About", "https://180lifechurch.org/about/"],
  ["Contact", "https://180lifechurch.org/contact/"],
  ["Give", "https://180lifechurch.org/give/"],
  ["Leadership", "https://180lifechurch.org/leadership/"],
  ["Baptism", "https://180lifechurch.org/baptism/"],
  ["Serving", "https://180lifechurch.org/serving/"],
  ["Partnership", "https://180lifechurch.org/partnership/"],
  ["Membership", "https://180lifechurch.org/membership/"],
  ["Messages (Sermons hub)", "https://180lifechurch.org/messages/"],
  ["I'm New", "https://180lifechurch.org/new-here/"],
  ["New to Faith", "https://180lifechurch.org/new-to-faith/"],
  ["Stories", "https://180lifechurch.org/stories/"],
  ["Ministries Hub", "https://180lifechurch.org/west-hartford-church-ministries/"],
  // Ministry pages (regular posts at root in old site)
  ["180 Life Groups", "https://180lifechurch.org/180-life-groups/"],
  ["Kids Ministry", "https://180lifechurch.org/childrens-kids-ministry/"],
  ["Student Ministry", "https://180lifechurch.org/students/"],
  ["Young Adults", "https://180lifechurch.org/young-adults/"],
  ["Men's Ministry", "https://180lifechurch.org/mens-ministry/"],
  ["Women's Ministry", "https://180lifechurch.org/womens-ministry/"],
  ["Marriage Prep", "https://180lifechurch.org/marriage-prep/"],
  ["Care", "https://180lifechurch.org/care/"],
  ["Prayer", "https://180lifechurch.org/prayer/"],
  ["Deaf Ministry", "https://180lifechurch.org/deaf-ministry/"],
  ["Missions", "https://180lifechurch.org/church-missions/"],
  // Sermon series at root in old site
  ["Series: At The Movies", "https://180lifechurch.org/at-the-movies/"],
  ["Series: Sabbath", "https://180lifechurch.org/sabbath/"],
  ["Series: Say Yes", "https://180lifechurch.org/say-yes/"],
  ["Series: 21 Days of Prayer", "https://180lifechurch.org/21daysofprayer/"],
  ["Series: As It Is In Heaven", "https://180lifechurch.org/asitisinheaven/"],
  ["Series: Easter Events 2025", "https://180lifechurch.org/easter-events-2025-hartford-ct-church/"],
];

function extract(html, regex) {
  const match = html.match(regex);
  return match ? match[1].replace(/&quot;/g, '"').replace(/&amp;/g, "&") : "";
}

function extractAll(html, regex) {
  const matches = [...html.matchAll(regex)];
  return matches.map((m) => m[1]);
}

async function auditUrl(label, url) {
  const result = {
    label,
    url,
    httpStatus: 0,
    title: "",
    description: "",
    canonical: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    ogType: "",
    twitterCard: "",
    twitterSite: "",
    robots: "",
    schemaTypes: [],
    error: "",
  };

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SEOAudit/1.0)" },
      redirect: "follow",
    });
    result.httpStatus = res.status;
    if (!res.ok) {
      result.error = `HTTP ${res.status} ${res.statusText}`;
      return result;
    }
    const html = await res.text();

    result.title = extract(html, /<title>([^<]*)<\/title>/i);
    result.description = extract(
      html,
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i
    );
    result.canonical = extract(
      html,
      /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i
    );
    result.ogTitle = extract(
      html,
      /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i
    );
    result.ogDescription = extract(
      html,
      /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/i
    );
    result.ogImage = extract(
      html,
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']*)["']/i
    );
    result.ogType = extract(
      html,
      /<meta[^>]+property=["']og:type["'][^>]+content=["']([^"']*)["']/i
    );
    result.twitterCard = extract(
      html,
      /<meta[^>]+name=["']twitter:card["'][^>]+content=["']([^"']*)["']/i
    );
    result.twitterSite = extract(
      html,
      /<meta[^>]+name=["']twitter:site["'][^>]+content=["']([^"']*)["']/i
    );
    result.robots = extract(
      html,
      /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i
    );

    const types = extractAll(html, /"@type"\s*:\s*"([^"]+)"/g);
    result.schemaTypes = [...new Set(types)];
  } catch (err) {
    result.error = err.message;
  }

  return result;
}

async function main() {
  const flag = process.argv[2] || "--md";

  // Run with limited concurrency so we don't hammer the server
  const CONCURRENCY = 4;
  const results = [];
  for (let i = 0; i < URLS.length; i += CONCURRENCY) {
    const batch = URLS.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(
      batch.map(([label, url]) => auditUrl(label, url))
    );
    results.push(...batchResults);
  }

  if (flag === "--json") {
    console.log(JSON.stringify(results, null, 2));
    return;
  }

  // Markdown output
  console.log("# Current 180lifechurch.org SEO Audit");
  console.log("");
  console.log(
    `Generated: ${new Date().toISOString()} from production WordPress site (AIOSEO 4.9.5.1).`
  );
  console.log(
    `Use this as the source of truth when implementing SEO on the headless site.`
  );
  console.log("");

  for (const r of results) {
    console.log(`## ${r.label}`);
    console.log("");
    console.log(`**URL:** \`${r.url}\``);
    if (r.error) {
      console.log("");
      console.log(`> ⚠ Could not audit: ${r.error}`);
      console.log("");
      continue;
    }
    console.log("");
    console.log(`| Field | Value |`);
    console.log(`|---|---|`);
    console.log(`| HTTP | ${r.httpStatus} |`);
    console.log(`| Title | ${r.title || "_(not set)_"} |`);
    console.log(`| Description | ${r.description || "_(not set)_"} |`);
    console.log(`| Canonical | ${r.canonical || "_(not set)_"} |`);
    console.log(`| OG Title | ${r.ogTitle || "_(not set)_"} |`);
    console.log(`| OG Description | ${r.ogDescription || "_(not set)_"} |`);
    console.log(`| OG Image | ${r.ogImage || "_(not set)_"} |`);
    console.log(`| OG Type | ${r.ogType || "_(not set)_"} |`);
    console.log(`| Twitter Card | ${r.twitterCard || "_(not set)_"} |`);
    console.log(`| Twitter Site | ${r.twitterSite || "_(not set)_"} |`);
    console.log(`| Robots | ${r.robots || "_(not set)_"} |`);
    console.log(
      `| Schema @types | ${r.schemaTypes.length ? r.schemaTypes.join(", ") : "_(none detected)_"} |`
    );
    console.log("");
  }
}

main().catch((err) => {
  console.error("Audit failed:", err);
  process.exit(1);
});
