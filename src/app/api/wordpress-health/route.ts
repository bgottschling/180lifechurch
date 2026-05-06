import { NextResponse } from "next/server";
import { checkWordPressHealth } from "@/lib/wordpress";
import { checkPlanningCenterHealth } from "@/lib/planning-center";

/**
 * GET /api/wordpress-health
 *
 * Unified site-health diagnostic. Runs reachability, auth, and content
 * checks against every external system the headless site depends on:
 *
 *   - WordPress REST API + ACF + each managed CPT
 *   - Planning Center Registrations API (events / signups)
 *   - Planning Center Publishing API (sermons channel)
 *
 * Returns a single HealthReport-shaped response that the 180 Life Sync
 * plugin renders on its Site Health tab. Endpoint kept at /api/wordpress-health
 * for backward compatibility with existing plugin installations even
 * though it now covers more than just WordPress.
 *
 * Protected by the revalidation secret to prevent public exposure of
 * env-var presence and post counts.
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

  // Run WP and PC checks in parallel — they hit different APIs and
  // don't share state, so there's no reason to serialize them.
  const [wpHealth, pcChecks] = await Promise.all([
    checkWordPressHealth(),
    checkPlanningCenterHealth(),
  ]);

  // Merge: WP checks first (existing UI ordering), then PC checks
  const allChecks = [...wpHealth.checks, ...pcChecks];

  // Recompute overall status from the union — broken if anything
  // failed, degraded if anything warned, healthy otherwise. Mirrors
  // the logic in checkWordPressHealth() so we stay consistent.
  const hasFail = allChecks.some((c) => c.status === "fail");
  const hasWarn = allChecks.some((c) => c.status === "warn");
  const overall: "healthy" | "degraded" | "broken" = hasFail
    ? "broken"
    : hasWarn
      ? "degraded"
      : "healthy";

  const summary =
    overall === "healthy"
      ? "All checks passing — WordPress and Planning Center integrations are fully operational."
      : overall === "degraded"
        ? "Site is connected but some content is incomplete. Site will use hardcoded fallbacks where needed."
        : "One or more integrations have errors that prevent content from loading. See failed checks below.";

  // Pick HTTP status based on overall: 200 healthy/degraded, 503 broken.
  // Health monitors that alert on non-2xx will only fire when the site
  // truly cannot serve fresh content.
  const httpStatus = overall === "broken" ? 503 : 200;

  return NextResponse.json(
    {
      overall,
      summary,
      checks: allChecks,
      // Backward-compatible legacy flags consumed by older plugin versions
      connected: wpHealth.connected,
      authenticated: wpHealth.authenticated,
      acfAvailable: wpHealth.acfAvailable,
      env: {
        WORDPRESS_URL: process.env.WORDPRESS_URL ? "set" : "missing",
        WORDPRESS_USERNAME: process.env.WORDPRESS_USERNAME ? "set" : "missing",
        WORDPRESS_AUTH_TOKEN: process.env.WORDPRESS_AUTH_TOKEN ? "set" : "missing",
        WORDPRESS_REVALIDATION_SECRET: process.env.WORDPRESS_REVALIDATION_SECRET
          ? "set"
          : "missing",
        PLANNING_CENTER_APP_ID: process.env.PLANNING_CENTER_APP_ID
          ? "set"
          : "missing",
        PLANNING_CENTER_SECRET: process.env.PLANNING_CENTER_SECRET
          ? "set"
          : "missing",
      },
      timestamp: new Date().toISOString(),
    },
    { status: httpStatus }
  );
}
