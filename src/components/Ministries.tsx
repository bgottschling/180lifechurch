"use client";

import { FadeIn } from "./FadeIn";
import {
  Users,
  Music,
  BookOpen,
  Baby,
  HandHeart,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const ministries = [
  {
    title: "Worship",
    description:
      "Our worship team leads with passion and authenticity every Sunday. If you play an instrument or love to sing, there's a spot for you.",
    icon: Music,
    gradient: "from-amber-dark/90 to-amber/70",
    iconBg: "bg-white/20",
    tag: "Sundays",
  },
  {
    title: "180 Life Groups",
    description:
      "Life is better together. Our small groups meet throughout the week for real conversation, prayer, and growing deeper in faith.",
    icon: Users,
    gradient: "from-teal/90 to-teal/60",
    iconBg: "bg-white/20",
    tag: "Weekly",
  },
  {
    title: "Students",
    description:
      "A place where teens can be themselves, ask tough questions, and discover what it looks like to follow Jesus.",
    icon: BookOpen,
    gradient: "from-charcoal/95 to-charcoal-light/90",
    iconBg: "bg-amber/20",
    tag: "Grades 6-12",
  },
  {
    title: "180 Life Kids",
    description:
      "From nursery through 5th grade, your kids will experience age-appropriate Bible teaching in a safe, fun environment.",
    icon: Baby,
    gradient: "from-amber/80 to-amber-light/70",
    iconBg: "bg-white/25",
    tag: "Nursery - 5th",
  },
  {
    title: "Serving Teams",
    description:
      "Discover how God has wired you with gifts and passions to make a difference in the church, community, and the world.",
    icon: HandHeart,
    gradient: "from-charcoal-light/95 to-charcoal/85",
    iconBg: "bg-teal/20",
    tag: "Multiple Teams",
  },
  {
    title: "Young Adults",
    description:
      "For those in their 20s and 30s navigating life, faith, and community. We meet on Tuesdays.",
    icon: Sparkles,
    gradient: "from-teal/80 to-teal/50",
    iconBg: "bg-white/20",
    tag: "Tuesdays",
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
              Find Your Place
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-warm-gray-light text-lg max-w-2xl mx-auto">
              There&apos;s a spot for everyone at 180 Life. However God has
              wired you, we&apos;d love to help you take your next step.
            </p>
          </FadeIn>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ministries.map((ministry, i) => (
            <FadeIn key={ministry.title} delay={0.05 * i}>
              <div className="group relative rounded-2xl overflow-hidden cursor-pointer h-full min-h-[300px] flex flex-col hover:-translate-y-1.5 transition-all duration-500 hover:shadow-xl">
                {/* Gradient background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${ministry.gradient} transition-all duration-500`}
                />

                {/* Subtle pattern overlay */}
                <div
                  className="absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                    backgroundSize: "24px 24px",
                  }}
                />

                {/* Content */}
                <div className="relative p-7 flex flex-col flex-1">
                  {/* Top row: tag + icon */}
                  <div className="flex items-start justify-between mb-5">
                    <span className="text-white/60 text-xs font-semibold tracking-[0.15em] uppercase bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                      {ministry.tag}
                    </span>
                    <div
                      className={`w-12 h-12 rounded-xl ${ministry.iconBg} flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-500`}
                    >
                      <ministry.icon className="text-white" size={22} />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-white text-xl font-bold mb-3 mt-auto">
                    {ministry.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/70 text-sm leading-relaxed mb-4">
                    {ministry.description}
                  </p>

                  {/* Action row */}
                  <div className="flex items-center gap-2 mt-auto pt-3 border-t border-white/10">
                    <span className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">
                      Learn More
                    </span>
                    <ArrowRight
                      size={16}
                      className="text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
