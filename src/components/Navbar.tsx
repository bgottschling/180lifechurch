"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Leadership", href: "/leadership" },
  { label: "Ministries", href: "/ministries" },
  { label: "Sermons", href: "/sermons" },
  { label: "Events", href: "https://180life.churchcenter.com/registrations/events/campus/13393", external: true },
  { label: "Watch Live", href: "https://180life.online.church/", external: true },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { scrollY } = useScroll();

  // On homepage: navbar logo fades in as hero logo fades out
  // On subpages: always visible
  const navLogoOpacity = useTransform(scrollY, [150, 400], [0, 1]);

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
            className="px-5 py-2.5 text-sm font-semibold text-charcoal bg-amber rounded-full hover:bg-amber-light transition-all hover:shadow-lg hover:shadow-amber/25"
          >
            I&apos;m New
          </a>
          <a
            href="/give"
            className="px-5 py-2.5 text-sm font-semibold text-white border border-white/30 rounded-full hover:bg-white/10 transition-all"
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
                  className="px-5 py-3 text-sm font-semibold text-charcoal bg-amber rounded-full text-center hover:bg-amber-light transition-all"
                >
                  I&apos;m New
                </a>
                <a
                  href="/give"
                  className="px-5 py-3 text-sm font-semibold text-white border border-white/30 rounded-full text-center hover:bg-white/10 transition-all"
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
