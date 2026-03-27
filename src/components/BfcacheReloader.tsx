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
 * 2. SPA back/forward: on `popstate` (only fires for browser back/forward,
 *    NOT for forward link clicks), wait for Next.js to render, then
 *    smoothly reveal any elements still stuck at opacity: 0.
 */
export function BfcacheReloader() {
  useEffect(() => {
    // 1. Handle actual bfcache restores (full page freeze/thaw)
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        window.location.reload();
      }
    };

    // 2. Handle SPA back/forward navigation (popstate only fires on
    //    browser back/forward buttons, not on Link clicks or router.push)
    const handlePopState = () => {
      // Give Next.js time to swap in the cached page and settle.
      // Use setTimeout (not rAF) because rAF is throttled in background tabs.
      setTimeout(revealStuckElements, 300);
    };

    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return null;
}

/**
 * Finds elements with inline `opacity: 0` (set by Framer Motion's
 * `initial` prop) and smoothly fades them in. Only touches opacity,
 * not transforms, to avoid interfering with scroll-driven motion
 * values or layout.
 */
function revealStuckElements() {
  document.querySelectorAll("[style]").forEach((el) => {
    if (!(el instanceof HTMLElement)) return;
    if (el.style.opacity === "0") {
      el.style.transition = "opacity 0.4s ease-out";
      el.style.opacity = "1";
    }
  });
}
