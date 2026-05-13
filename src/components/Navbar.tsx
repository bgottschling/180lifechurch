"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Menu, X, Radio, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { usePathname } from "next/navigation";

/**
 * Top-level nav structure.
 *
 * Items with a `children` array render as a dropdown on desktop
 * (hover/focus-within trigger, opens a panel beneath the label) and
 * as an expandable accordion section in the mobile menu. The parent
 * label itself stays clickable — it routes to its own href (the
 * Connect hub page), and the dropdown's role is quick-access to the
 * most common destinations underneath without forcing visitors to
 * the hub first.
 */
type NavLink = {
  label: string;
  href: string;
  external?: boolean;
  children?: { label: string; href: string; description?: string }[];
};

const navLinks: NavLink[] = [
  { label: "About", href: "/about" },
  {
    label: "Connect",
    href: "/connect",
    children: [
      {
        label: "Partnership",
        href: "/partnership",
        description: "Become a partner and find your place in the church body.",
      },
      {
        label: "Baptism & Dedication",
        href: "/baptism",
        description:
          "Take your next step of faith or dedicate your child to God.",
      },
      {
        label: "New to Faith",
        href: "/new-to-faith",
        description: "Just starting your journey? Start here.",
      },
    ],
  },
  { label: "Leadership", href: "/leadership" },
  { label: "Ministries", href: "/ministries" },
  { label: "Stories", href: "/stories" },
  { label: "Sermons", href: "/sermons" },
  {
    label: "Events",
    href: "https://180life.churchcenter.com/registrations/events/campus/13393",
    external: true,
  },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { scrollY } = useScroll();

  // On homepage: navbar logo fades in as hero logo fades out
  // On subpages: always visible
  const navLogoOpacity = useTransform(scrollY, [150, 400], [0, 1]);

  useEffect(() => {
    let cancelled = false;

    const checkLiveStatus = async () => {
      try {
        const res = await fetch("/api/live-status");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setIsLive(Boolean(data.isLive));
      } catch {
        // Silently ignore — banner just stays hidden
      }
    };

    checkLiveStatus();
    // Re-check every 5 minutes so the banner appears/disappears
    // around service start/end without a page reload.
    const interval = setInterval(checkLiveStatus, 5 * 60 * 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // On subpages, always show scrolled state immediately
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll(); // Run on mount to catch restored scroll positions (back button)
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <motion.header
      initial={false}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled || !isHome
          ? "bg-charcoal/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      )}
    >
      {/* Live Service Banner — shows during Sunday services (9 AM / 11 AM ET) */}
      <AnimatePresence>
        {isLive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="overflow-hidden bg-gradient-to-r from-amber/90 via-amber to-amber/90"
          >
            <a
              href="https://180life.online.church/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2 text-charcoal text-sm font-semibold hover:opacity-80 transition-opacity"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              We&apos;re Live — Watch the Service Now
              <Radio size={16} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo - on subpages always visible, on homepage fades in on scroll */}
        <motion.a
          href="/"
          className="flex items-center group"
          style={isHome ? { opacity: navLogoOpacity } : { opacity: 1 }}
        >
          <Logo size={56} className="transition-transform group-hover:scale-105" />
        </motion.a>

        {/* Desktop Nav */}
        <div className="hidden xl:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.children?.some((c) => pathname === c.href) ?? false);

            // Items without children — plain link
            if (!link.children) {
              return (
                <a
                  key={link.href}
                  href={link.href}
                  {...(link.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className={cn(
                    "text-sm font-medium tracking-wide uppercase transition-colors",
                    isActive ? "text-amber" : "text-white/80 hover:text-amber"
                  )}
                >
                  {link.label}
                </a>
              );
            }

            // Items with children — clickable parent label + dropdown panel.
            // Uses focus-within and a `group` hover trigger so the dropdown
            // opens on either pointer hover or keyboard focus on the
            // trigger / any panel link, and stays open as the user moves
            // between them.
            return (
              <div key={link.href} className="relative group">
                <a
                  href={link.href}
                  aria-haspopup="true"
                  className={cn(
                    "inline-flex items-center gap-1 text-sm font-medium tracking-wide uppercase transition-colors",
                    isActive ? "text-amber" : "text-white/80 hover:text-amber"
                  )}
                >
                  {link.label}
                  <ChevronDown
                    size={14}
                    className="opacity-70 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
                  />
                </a>

                {/* Dropdown panel — hidden until the group is hovered
                    or focus moves into it. invisible+opacity pair
                    rather than display:none so the focus-within trigger
                    actually works (focus can't enter display:none). */}
                <div className="absolute left-0 top-full pt-3 w-72 invisible group-hover:visible group-focus-within:visible opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-200">
                  <div className="rounded-2xl bg-charcoal/98 border border-white/10 shadow-2xl shadow-black/40 backdrop-blur-md overflow-hidden">
                    {link.children.map((child, i) => (
                      <a
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "block px-5 py-4 text-left transition-colors",
                          i > 0 ? "border-t border-white/5" : "",
                          pathname === child.href
                            ? "bg-amber/10 text-amber"
                            : "text-white/85 hover:bg-white/[0.04] hover:text-amber"
                        )}
                      >
                        <div className="text-sm font-semibold tracking-wide">
                          {child.label}
                        </div>
                        {child.description && (
                          <div className="text-xs text-white/45 mt-1 leading-relaxed">
                            {child.description}
                          </div>
                        )}
                      </a>
                    ))}
                    <a
                      href={link.href}
                      className="block px-5 py-3 text-xs font-semibold tracking-[0.2em] uppercase text-amber/80 hover:text-amber hover:bg-white/[0.04] border-t border-white/10 transition-colors text-center"
                    >
                      View Connect Hub →
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Buttons */}
        <div className="hidden xl:flex items-center gap-3">
          <a
            href="/new"
            className="px-5 py-2.5 text-sm font-semibold text-charcoal rounded-full bg-gradient-to-b from-amber-light to-amber border border-amber-light/60 shadow-[0_4px_14px_rgba(212,160,84,0.35),inset_0_1px_0_rgba(255,255,255,0.45)] hover:shadow-[0_6px_20px_rgba(212,160,84,0.55),inset_0_1px_0_rgba(255,255,255,0.55)] hover:-translate-y-0.5 transition-all duration-300"
          >
            I&apos;m New
          </a>
          <a
            href="/give"
            className="px-5 py-2.5 text-sm font-semibold text-white rounded-full bg-gradient-to-b from-teal-light to-teal border border-teal-light/60 shadow-[0_4px_14px_rgba(59,140,140,0.4),inset_0_1px_0_rgba(255,255,255,0.25)] hover:shadow-[0_6px_20px_rgba(59,140,140,0.6),inset_0_1px_0_rgba(255,255,255,0.35)] hover:-translate-y-0.5 transition-all duration-300"
          >
            Give
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="xl:hidden text-white p-2"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden bg-charcoal/98 backdrop-blur-lg border-t border-white/10 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.children?.some((c) => pathname === c.href) ?? false);

                if (!link.children) {
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      {...(link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "text-base font-medium py-2 transition-colors",
                        isActive
                          ? "text-amber"
                          : "text-white/80 hover:text-amber"
                      )}
                    >
                      {link.label}
                    </a>
                  );
                }

                // Dropdown parent on mobile — renders the parent as a
                // single tappable link AND a flat indented sub-list of
                // children below it. No accordion toggle here since the
                // entire mobile menu is already a sheet; one less tap
                // for visitors to reach the destination they want.
                return (
                  <div key={link.href} className="py-1">
                    <a
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block text-base font-medium py-2 transition-colors",
                        isActive
                          ? "text-amber"
                          : "text-white/80 hover:text-amber"
                      )}
                    >
                      {link.label}
                    </a>
                    <div className="pl-4 border-l border-white/10 ml-1 mt-1 mb-2 flex flex-col gap-1">
                      {link.children.map((child) => (
                        <a
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "text-sm py-1.5 transition-colors",
                            pathname === child.href
                              ? "text-amber"
                              : "text-white/65 hover:text-amber"
                          )}
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })}
              <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                <a
                  href="/new"
                  className="px-5 py-3 text-sm font-semibold text-charcoal rounded-full text-center bg-gradient-to-b from-amber-light to-amber border border-amber-light/60 shadow-[0_4px_14px_rgba(212,160,84,0.35),inset_0_1px_0_rgba(255,255,255,0.45)] transition-all"
                >
                  I&apos;m New
                </a>
                <a
                  href="/give"
                  className="px-5 py-3 text-sm font-semibold text-white rounded-full text-center bg-gradient-to-b from-teal-light to-teal border border-teal-light/60 shadow-[0_4px_14px_rgba(59,140,140,0.4),inset_0_1px_0_rgba(255,255,255,0.25)] transition-all"
                >
                  Give
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
