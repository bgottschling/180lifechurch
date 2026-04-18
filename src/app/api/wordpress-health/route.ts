import { NextResponse } from "next/server";
import { checkWordPressHealth } from "@/lib/wordpress";

/**
 * GET /api/wordpress-health
 *
 * Diagnostic endpoint that tests WordPress REST API connectivity,
 * authentication, and ACF plugin availability.
 *
 * Protected by the same revalidation secret to prevent public access.
 */
export async function GET(request: Request) {
  const secret =
    request.headers.get("x-revalidation-secret") ||
    new URL(request.url).searchParams.get("secret");

  if (!process.env.WORDPRESS_REVALIDATION_SECRET) {
    return NextResponse.json(
      { error: "Revalidation secret not configured" },
      { status: 500 }
    );
  }

  if (secret !== process.env.WORDPRESS_REVALIDATION_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  const health = await checkWordPressHealth();

  return NextResponse.json({
    ...health,
    env: {
      WORDPRESS_URL: process.env.WORDPRESS_URL ? "set" : "missing",
      WORDPRESS_USERNAME: process.env.WORDPRESS_USERNAME ? "set" : "missing",
      WORDPRESS_AUTH_TOKEN: process.env.WORDPRESS_AUTH_TOKEN ? "set" : "missing",
      WORDPRESS_REVALIDATION_SECRET: process.env.WORDPRESS_REVALIDATION_SECRET
        ? "set"
        : "missing",
    },
    timestamp: new Date().toISOString(),
  });
}
