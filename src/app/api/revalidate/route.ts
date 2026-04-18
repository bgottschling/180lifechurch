import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * POST /api/revalidate
 *
 * On-demand ISR revalidation webhook. Call this from WordPress (via a
 * plugin or custom hook) whenever content is updated so pages refresh
 * without waiting for the 1-hour ISR timer.
 *
 * Headers:
 *   x-revalidation-secret: <WORDPRESS_REVALIDATION_SECRET>
 *
 * Body (optional JSON):
 *   { "tag": "wordpress" }        -- revalidate all WP content (default)
 *   { "tag": "events" }           -- revalidate only events
 *   { "tag": "ministries" }       -- revalidate only ministries
 *   { "tag": "leadership" }       -- revalidate only leadership
 *   { "tag": "sermons" }          -- revalidate only sermons
 */
export async function POST(request: Request) {
  const secret = request.headers.get("x-revalidation-secret");

  if (!process.env.WORDPRESS_REVALIDATION_SECRET) {
    return NextResponse.json(
      { error: "Revalidation secret not configured on server" },
      { status: 500 }
    );
  }

  if (secret !== process.env.WORDPRESS_REVALIDATION_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  // Parse optional tag from body
  let tag = "wordpress";
  try {
    const body = await request.json();
    if (body?.tag && typeof body.tag === "string") {
      tag = body.tag;
    }
  } catch {
    // No body or invalid JSON -- revalidate all WordPress content
  }

  const validTags = [
    "wordpress",
    "events",
    "ministries",
    "leadership",
    "sermons",
    "settings",
    "pages",
  ];

  if (!validTags.includes(tag)) {
    return NextResponse.json(
      { error: `Invalid tag. Valid tags: ${validTags.join(", ")}` },
      { status: 400 }
    );
  }

  revalidateTag(tag, "max");

  return NextResponse.json({
    revalidated: true,
    tag,
    now: Date.now(),
  });
}
