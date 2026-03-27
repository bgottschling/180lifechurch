"use client";

import { motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
  duration?: number;
}

export function FadeIn({
  children,
  delay = 0,
  direction = "up",
  className,
  duration = 0.6,
}: FadeInProps) {
  const [isBfcache, setIsBfcache] = useState(false);

  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      // persisted = true means the page was restored from bfcache
      if (e.persisted) {
        setIsBfcache(true);
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  const directionOffset = {
    up: { y: 30 },
    down: { y: -30 },
    left: { x: 30 },
    right: { x: -30 },
    none: {},
  };

  // If restored from bfcache, skip animation entirely — show content immediately
  if (isBfcache) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...directionOffset[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
