"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { ChevronDown } from "lucide-react";

const rotatingWords = [
  "Everything",
  "You",
  "Your Family",
  "Your Story",
  "Your Marriage",
  "Your Purpose",
  "Your Future",
  "Your Heart",
  "Communities",
  "Generations",
];

export function Hero() {
  const [wordIndex, setWordIndex] = useState(0);
  const { scrollY } = useScroll();

  // Hero logo: ascends upward and dissolves as user scrolls
  const heroLogoOpacity = useTransform(scrollY, [0, 150, 300], [1, 0.5, 0]);
  const heroLogoY = useTransform(scrollY, [0, 300], [0, -200]);
  // Slight scale-up as it rises (like it's ascending away)
  const heroLogoScale = useTransform(scrollY, [0, 300], [1, 1.15]);
  // CSS filter blur to create dissolve/ethereal effect
  const heroLogoBlur = useTransform(scrollY, [0, 150, 300], [0, 2, 12]);

  // Cycle words
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background worship band image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-worship.jpg"
          alt="Worship service at 180 Life Church"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 hero-gradient-warm" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Hero logo - ascends and dissolves upward on scroll */}
        <motion.div
          className="mb-10"
          style={{
            scale: heroLogoScale,
            opacity: heroLogoOpacity,
            y: heroLogoY,
            filter: useTransform(heroLogoBlur, (v) => `blur(${v}px)`),
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
          >
            <Image
              src="/images/logo.png"
              alt="180 Life Church"
              width={200}
              height={200}
              className="brightness-0 invert drop-shadow-2xl mx-auto"
              priority
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-6"
        >
          <span className="inline-block text-amber/90 text-sm font-medium tracking-[0.3em] uppercase">
            No Perfect People Allowed
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1] mb-8"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Jesus Changes
          <br />
          <span className="text-amber inline-block relative h-[1.15em] overflow-hidden align-bottom">
            <AnimatePresence mode="wait">
              <motion.span
                key={rotatingWords[wordIndex]}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="inline-block"
              >
                {rotatingWords[wordIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          We exist to make and send disciples who love and live like Jesus.
          Come as you are. You&apos;re welcome here.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#visit"
            className="group px-8 py-4 bg-amber text-charcoal font-semibold rounded-full text-lg hover:bg-amber-light transition-all hover:shadow-xl hover:shadow-amber/20 hover:-translate-y-0.5"
          >
            Plan Your Visit
            <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">
              &rarr;
            </span>
          </a>
          <a
            href="#watch"
            className="px-8 py-4 text-white font-semibold rounded-full text-lg border-2 border-white/20 hover:bg-white/10 transition-all hover:-translate-y-0.5"
          >
            Watch Online
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="text-white/40" size={28} />
        </motion.div>
      </motion.div>
    </section>
  );
}
