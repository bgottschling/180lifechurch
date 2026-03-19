"use client";

import { FadeIn } from "./FadeIn";
import { Calendar, ArrowRight } from "lucide-react";

const events = [
  {
    title: "Easter Sunday Celebration",
    date: "April 20",
    time: "10:00 AM",
    description: "A special celebration of hope and new life. Invite a friend!",
    featured: true,
  },
  {
    title: "Community Potluck",
    date: "March 28",
    time: "12:00 PM",
    description: "Bring a dish and enjoy fellowship after Sunday service.",
    featured: false,
  },
  {
    title: "Youth Night",
    date: "Every Friday",
    time: "6:30 PM",
    description: "Games, worship, and real talk for teens in grades 6-12.",
    featured: false,
  },
];

export function Events() {
  return (
    <section id="events" className="relative py-24 sm:py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <FadeIn>
            <span className="text-amber-dark text-sm font-medium tracking-[0.2em] uppercase">
              What&apos;s Happening
            </span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2
              className="text-4xl sm:text-5xl font-bold text-charcoal mt-4 mb-6"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Upcoming Events
            </h2>
          </FadeIn>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {events.map((event, i) => (
            <FadeIn key={event.title} delay={0.1 * i}>
              <div
                className={`group relative p-6 rounded-2xl transition-all duration-500 hover:-translate-y-1 cursor-pointer ${
                  event.featured
                    ? "bg-charcoal text-white hover:shadow-xl hover:shadow-charcoal/20"
                    : "bg-white border border-cream-dark hover:border-amber/30 hover:shadow-lg hover:shadow-amber/5"
                }`}
              >
                {/* Date badge */}
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4 ${
                    event.featured
                      ? "bg-amber/20 text-amber"
                      : "bg-amber/10 text-amber-dark"
                  }`}
                >
                  <Calendar size={12} />
                  {event.date} &middot; {event.time}
                </div>

                <h3
                  className={`text-xl font-semibold mb-3 ${
                    event.featured ? "text-white" : "text-charcoal"
                  }`}
                >
                  {event.title}
                </h3>
                <p
                  className={`leading-relaxed mb-4 ${
                    event.featured ? "text-white/60" : "text-warm-gray-light"
                  }`}
                >
                  {event.description}
                </p>

                <span
                  className={`inline-flex items-center gap-1 text-sm font-medium transition-all group-hover:gap-2 ${
                    event.featured ? "text-amber" : "text-amber-dark"
                  }`}
                >
                  Details <ArrowRight size={14} />
                </span>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.4}>
          <div className="text-center mt-12">
            <a
              href="#all-events"
              className="inline-flex items-center text-amber-dark font-semibold hover:text-amber transition-colors group text-lg"
            >
              View All Events
              <span className="ml-2 transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
