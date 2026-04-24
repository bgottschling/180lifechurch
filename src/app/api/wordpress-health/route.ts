import { NextResponse } from "next/server";
import { checkWordPressHealth } from "@/lib/wordpress";

/**
 * GET /api/wordpress-health
 *
 * Diagnostic endpoint that runs a per-layer check of the WordPress
 * integration and returns actionable status/messages for each check.
 *
 * Protected by the same revalidation secret to prevent public access.
 *
 * Query params:
 *   ?secret=<WORDPRESS_REVALIDATION_SECRET>
 *
 * Response: see HealthReport in src/lib/wordpress.ts
 */
export async function GET(request: Request) {
  const secret =
    request.headers.get("x-revalidation-secret") ||
    new URL(request.url).searchParams.get("secret");

  if (!process.env.WORDPRESS_REVALIDATION_SECRET) {
    return NextResponse.json(
      {
        overall: "broken",
        summary: "Server misconfigured — revalidation secret not set.",
        error: "WORDPRESS_REVALIDATION_SECRET not configured on server",
      },
      { status: 500 }
    );
  }

  if (secret !== process.env.WORDPRESS_REVALIDATION_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  const health = await checkWordPressHealth();

  // Pick HTTP status based on overall: 200 healthy, 200 degraded (still usable), 503 broken
  const httpStatus = health.overall === "broken" ? 503 : 200;

  return NextResponse.json(
    {
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
    },
    { status: httpStatus }
  );
}
