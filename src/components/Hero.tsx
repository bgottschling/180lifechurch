"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background — dim worship band placeholder */}
      <div className="absolute inset-0 bg-charcoal">
        {/* Placeholder for worship band imagery */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 30% 50%, rgba(212, 160, 84, 0.15) 0%, transparent 60%),
              radial-gradient(ellipse at 70% 30%, rgba(59, 140, 140, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 80%, rgba(212, 160, 84, 0.1) 0%, transparent 40%),
              linear-gradient(to bottom, #1A1A1A 0%, #2A2520 50%, #1A1A1A 100%)
            `,
          }}
        />
        {/* Simulated stage light bokeh */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-teal/5 rounded-full blur-3xl" />
      </div>

      {/* Overlay grain texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIxIi8+PC9zdmc+')]" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-6"
        >
          <span className="inline-block text-amber/90 text-sm font-medium tracking-[0.3em] uppercase">
            Welcome Home
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-[var(--font-display)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1] mb-8"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Life Was Meant
          <br />
          <span className="text-amber">For More</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Join a community where every person matters, every story is valued,
          and every life can be transformed. You belong here.
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
