"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Menu, X, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Leadership", href: "/leadership" },
  { label: "Ministries", href: "/ministries" },
  { label: "Sermons", href: "/sermons" },
  { label: "Events", href: "https://180life.churchcenter.com/registrations/events/campus/13393", external: true },
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
        <div className="hidden xl:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={cn(
                "text-sm font-medium tracking-wide uppercase transition-colors",
                pathname === link.href
                  ? "text-amber"
                  : "text-white/80 hover:text-amber"
              )}
            >
              {link.label}
            </a>
          ))}
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
            className="px-5 py-2.5 text-sm font-semibold text-white rounded-full bg-gradient-to-b from-white/10 to-white/[0.02] border border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] hover:from-white/20 hover:to-white/[0.08] hover:border-white/50 hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-300"
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
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "text-base font-medium py-2 transition-colors",
                    pathname === link.href
                      ? "text-amber"
                      : "text-white/80 hover:text-amber"
                  )}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                <a
                  href="/new"
                  className="px-5 py-3 text-sm font-semibold text-charcoal rounded-full text-center bg-gradient-to-b from-amber-light to-amber border border-amber-light/60 shadow-[0_4px_14px_rgba(212,160,84,0.35),inset_0_1px_0_rgba(255,255,255,0.45)] transition-all"
                >
                  I&apos;m New
                </a>
                <a
                  href="/give"
                  className="px-5 py-3 text-sm font-semibold text-white rounded-full text-center bg-gradient-to-b from-white/10 to-white/[0.02] border border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] transition-all"
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
