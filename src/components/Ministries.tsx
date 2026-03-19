"use client";

import { FadeIn } from "./FadeIn";
import { Users, Music, BookOpen, Baby, HandHeart, Globe } from "lucide-react";

const ministries = [
  {
    title: "Worship",
    description: "Express your faith through music and creative arts.",
    icon: Music,
    color: "amber",
  },
  {
    title: "Small Groups",
    description: "Build deep relationships in a close-knit community.",
    icon: Users,
    color: "teal",
  },
  {
    title: "Youth",
    description: "Empowering the next generation to live boldly for Christ.",
    icon: BookOpen,
    color: "amber",
  },
  {
    title: "Children",
    description: "A safe, fun environment where kids learn about God's love.",
    icon: Baby,
    color: "teal",
  },
  {
    title: "Outreach",
    description: "Serving our neighbors and making a difference in Bloomfield.",
    icon: HandHeart,
    color: "amber",
  },
  {
    title: "Missions",
    description: "Reaching beyond our walls to impact the world.",
    icon: Globe,
    color: "teal",
  },
];

export function Ministries() {
  return (
    <section id="ministries" className="relative py-24 sm:py-32 bg-soft-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <FadeIn>
            <span className="text-amber-dark text-sm font-medium tracking-[0.2em] uppercase">
              Get Connected
            </span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2
              className="text-4xl sm:text-5xl font-bold text-charcoal mt-4 mb-6"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Ministries
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-warm-gray-light text-lg max-w-2xl mx-auto">
              There&apos;s a place for everyone at 180 Life Church. Find your
              community and start making an impact.
            </p>
          </FadeIn>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ministries.map((ministry, i) => (
            <FadeIn key={ministry.title} delay={0.05 * i}>
              <div className="group relative p-8 rounded-2xl bg-white border border-cream-dark hover:border-amber/30 transition-all duration-500 hover:shadow-lg hover:shadow-amber/5 hover:-translate-y-1 cursor-pointer">
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors ${
                    ministry.color === "amber"
                      ? "bg-amber/10 group-hover:bg-amber/20"
                      : "bg-teal/10 group-hover:bg-teal/20"
                  }`}
                >
                  <ministry.icon
                    className={
                      ministry.color === "amber" ? "text-amber-dark" : "text-teal"
                    }
                    size={24}
                  />
                </div>

                <h3 className="text-charcoal text-xl font-semibold mb-3">
                  {ministry.title}
                </h3>
                <p className="text-warm-gray-light leading-relaxed">
                  {ministry.description}
                </p>

                <span className="inline-flex items-center mt-4 text-sm font-medium text-amber-dark opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn More &rarr;
                </span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
