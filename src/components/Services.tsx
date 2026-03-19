"use client";

import { FadeIn } from "./FadeIn";
import { Clock, MapPin, Heart } from "lucide-react";

const services = [
  {
    day: "Sunday",
    time: "10:00 AM",
    label: "Sunday Worship",
    description: "Contemporary worship, relevant teaching, and community for all ages.",
    icon: Heart,
  },
  {
    day: "Wednesday",
    time: "7:00 PM",
    label: "Midweek Bible Study",
    description: "Dive deeper into God's Word with small group discussion and prayer.",
    icon: Clock,
  },
];

export function Services() {
  return (
    <section id="services" className="relative py-24 sm:py-32 bg-charcoal overflow-hidden">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(212, 160, 84, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(59, 140, 140, 0.06) 0%, transparent 40%)
          `,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <FadeIn>
            <span className="text-amber text-sm font-medium tracking-[0.2em] uppercase">
              Join Us
            </span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2
              className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-6"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Service Times
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="flex items-center justify-center gap-2 text-white/60">
              <MapPin size={18} />
              <p className="text-lg">
                Bloomfield, CT
              </p>
            </div>
          </FadeIn>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {services.map((service, i) => (
            <FadeIn key={service.label} delay={0.1 * i} direction="up">
              <div className="group relative p-8 rounded-2xl bg-charcoal-light/50 border border-white/10 hover:border-amber/30 transition-all duration-500 hover:shadow-xl hover:shadow-amber/5">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-amber/10 flex items-center justify-center mb-6 group-hover:bg-amber/20 transition-colors">
                  <service.icon className="text-amber" size={24} />
                </div>

                {/* Time badge */}
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-amber font-bold text-2xl">
                    {service.day}
                  </span>
                  <span className="text-white/50 text-lg">
                    {service.time}
                  </span>
                </div>

                <h3 className="text-white text-xl font-semibold mb-3">
                  {service.label}
                </h3>
                <p className="text-white/50 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Plan a Visit CTA */}
        <FadeIn delay={0.4}>
          <div className="text-center mt-16" id="visit">
            <p className="text-white/50 mb-6 text-lg">
              First time? We&apos;d love to welcome you.
            </p>
            <a
              href="#visit-form"
              className="inline-flex items-center px-8 py-4 bg-amber text-charcoal font-semibold rounded-full text-lg hover:bg-amber-light transition-all hover:shadow-xl hover:shadow-amber/20 hover:-translate-y-0.5"
            >
              Plan Your First Visit &rarr;
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
