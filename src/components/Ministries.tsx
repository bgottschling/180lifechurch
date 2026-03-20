"use client";

import { FadeIn } from "./FadeIn";
import { Users, Music, BookOpen, Baby, HandHeart, Sparkles } from "lucide-react";

const ministries = [
  {
    title: "Worship",
    description:
      "Our worship team leads with passion and authenticity every Sunday. If you play an instrument or love to sing, there's a spot for you.",
    icon: Music,
    color: "amber",
  },
  {
    title: "180 Life Groups",
    description:
      "Life is better together. Our small groups meet throughout the week for real conversation, prayer, and growing deeper in faith.",
    icon: Users,
    color: "teal",
  },
  {
    title: "Students",
    description:
      "A place where teens can be themselves, ask tough questions, and discover what it looks like to follow Jesus.",
    icon: BookOpen,
    color: "amber",
  },
  {
    title: "180 Life Kids",
    description:
      "From nursery through 5th grade, your kids will experience age-appropriate Bible teaching in a safe, fun environment.",
    icon: Baby,
    color: "teal",
  },
  {
    title: "Serving Teams",
    description:
      "Discover how God has wired you with gifts and passions to make a difference in the church, community, and the world.",
    icon: HandHeart,
    color: "amber",
  },
  {
    title: "Young Adults",
    description:
      "For those in their 20s and 30s navigating life, faith, and community. We meet on Tuesdays.",
    icon: Sparkles,
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
              <div className="group relative p-8 rounded-2xl bg-white border border-cream-dark hover:border-amber/30 transition-all duration-500 hover:shadow-lg hover:shadow-amber/5 hover:-translate-y-1 cursor-pointer h-full min-h-[280px] flex flex-col">
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
                      ministry.color === "amber"
                        ? "text-amber-dark"
                        : "text-teal"
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

                <span className="inline-flex items-center mt-auto pt-4 text-sm font-medium text-amber-dark opacity-0 group-hover:opacity-100 transition-opacity">
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
