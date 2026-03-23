"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Ministries", href: "#ministries" },
  { label: "Events", href: "#events" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  // Navbar logo fades in smoothly as hero logo fades out
  const navLogoOpacity = useTransform(scrollY, [150, 400], [0, 1]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-charcoal/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo - fades in as hero logo fades out */}
        <motion.a
          href="/"
          className="flex items-center group"
          style={{ opacity: navLogoOpacity }}
        >
          <Logo size={80} className="transition-transform group-hover:scale-105" />
        </motion.a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-white/80 hover:text-amber transition-colors text-sm font-medium tracking-wide uppercase"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#visit"
            className="px-5 py-2.5 text-sm font-semibold text-charcoal bg-amber rounded-full hover:bg-amber-light transition-all hover:shadow-lg hover:shadow-amber/25"
          >
            I&apos;m New
          </a>
          <a
            href="#give"
            className="px-5 py-2.5 text-sm font-semibold text-white border border-white/30 rounded-full hover:bg-white/10 transition-all"
          >
            Give
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white p-2"
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
            className="md:hidden bg-charcoal/98 backdrop-blur-lg border-t border-white/10 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-white/80 hover:text-amber transition-colors text-base font-medium py-2"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                <a
                  href="#visit"
                  className="px-5 py-3 text-sm font-semibold text-charcoal bg-amber rounded-full text-center hover:bg-amber-light transition-all"
                >
                  I&apos;m New
                </a>
                <a
                  href="#give"
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
