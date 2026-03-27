"use client";

import { useEffect } from "react";

/**
 * Fixes Framer Motion animations that get stuck at opacity: 0 after
 * Next.js App Router client-side back/forward navigation.
 *
 * The App Router restores a cached React tree on popstate without
 * remounting components, so `initial={{ opacity: 0 }}` stays stuck
 * because `animate={{ opacity: 1 }}` already fired and won't replay.
 *
 * Two-pronged fix:
 * 1. bfcache: full page reload on `pageshow` with `persisted: true`
 * 2. SPA back/forward: URL-change detection via polling, then force
 *    all stuck opacity-0 elements to visible. Polling is used because
 *    Next.js intercepts popstate before custom listeners can act on
 *    the fully-rendered DOM.
 */
export function BfcacheReloader() {
  useEffect(() => {
    // 1. Handle actual bfcache restores (full page freeze/thaw)
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        window.location.reload();
      }
    };
    window.addEventListener("pageshow", handlePageShow);

    // 2. Detect URL changes and fix stuck Framer Motion elements
    let lastUrl = window.location.href;

    const checkUrl = setInterval(() => {
      const currentUrl = window.location.href;
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        // Use setTimeout to let Next.js finish rendering
        setTimeout(revealStuckElements, 100);
      }
    }, 200);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      clearInterval(checkUrl);
    };
  }, []);

  return null;
}

/**
 * Finds all elements with inline `opacity: 0` (set by Framer Motion's
 * `initial` prop) and smoothly transitions them to visible.
 */
function revealStuckElements() {
  document.querySelectorAll("[style]").forEach((el) => {
    if (!(el instanceof HTMLElement)) return;

    const isStuck = el.style.opacity === "0";
    const hasOffset =
      el.style.transform &&
      (el.style.transform.includes("translate") ||
        el.style.transform.includes("scale"));

    if (isStuck || hasOffset) {
      el.style.transition =
        "opacity 0.35s ease-out, transform 0.35s ease-out";

      if (isStuck) {
        el.style.opacity = "1";
      }
      if (hasOffset) {
        el.style.transform = "none";
      }
    }
  });
}
