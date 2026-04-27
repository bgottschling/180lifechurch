import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

const VALID_TAGS = [
  "wordpress",
  "events",
  "ministries",
  "leadership",
  "sermons",
  "settings",
  "pages",
];

/**
 * POST /api/revalidate
 *
 * On-demand ISR revalidation webhook. Call this from WordPress (via the
 * "180 Life Revalidation" plugin) whenever content is updated so pages
 * refresh without waiting for the 1-hour ISR timer.
 *
 * Headers:
 *   x-revalidation-secret: <WORDPRESS_REVALIDATION_SECRET>
 *
 * Body (JSON, optional):
 *   { "tag":  "wordpress" }                          -- single tag (legacy form)
 *   { "tags": ["wordpress", "ministries"] }          -- multiple tags (preferred)
 *
 * If no body is provided, defaults to revalidating the broad "wordpress" tag.
 *
 * Valid tags: wordpress, events, ministries, leadership, sermons, settings, pages.
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

  // Parse tags from body. Accept both "tag" (string) and "tags" (array) forms.
  let tags: string[] = ["wordpress"];
  try {
    const body = await request.json();
    if (Array.isArray(body?.tags) && body.tags.length > 0) {
      tags = body.tags.filter((t: unknown) => typeof t === "string");
    } else if (typeof body?.tag === "string" && body.tag.length > 0) {
      tags = [body.tag];
    }
  } catch {
    // No body or invalid JSON -- fall through to default
  }

  // Validate every requested tag
  const invalid = tags.filter((t) => !VALID_TAGS.includes(t));
  if (invalid.length > 0) {
    return NextResponse.json(
      {
        error: `Invalid tag(s): ${invalid.join(", ")}. Valid tags: ${VALID_TAGS.join(", ")}`,
      },
      { status: 400 }
    );
  }

  // De-duplicate before revalidating
  const uniqueTags = Array.from(new Set(tags));
  for (const tag of uniqueTags) {
    revalidateTag(tag, "max");
  }

  return NextResponse.json({
    revalidated: true,
    tags: uniqueTags,
    now: Date.now(),
  });
}
