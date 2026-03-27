"use client";

import { FadeIn } from "./FadeIn";
import {
  Clock,
  MapPin,
  Sun,
  Sunrise,
  DoorOpen,
  ChevronRight,
} from "lucide-react";
import type { WPService, WPContactData } from "@/lib/wordpress-types";

const serviceStyles = [
  {
    icon: Sunrise,
    accent: "from-amber/20 to-amber/5",
    iconBg: "bg-gradient-to-br from-amber/20 to-amber/10",
    borderHover: "hover:border-amber/40",
    glow: "group-hover:shadow-amber/10",
  },
  {
    icon: Sun,
    accent: "from-teal/20 to-teal/5",
    iconBg: "bg-gradient-to-br from-teal/20 to-teal/10",
    borderHover: "hover:border-teal/40",
    glow: "group-hover:shadow-teal/10",
  },
];

interface ServicesProps {
  services: WPService[];
  contact: WPContactData;
}

export function Services({ services, contact }: ServicesProps) {
  return (
    <section
      id="services"
      className="relative py-24 sm:py-32 bg-charcoal overflow-hidden"
    >
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
              Join Us This Sunday
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
                {contact.addressLine1}, {contact.addressLine2}
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.25}>
            <div className="flex items-center justify-center gap-2 text-white/40 mt-2">
              <DoorOpen size={16} />
              <p className="text-sm">{contact.doorsOpenText}</p>
            </div>
          </FadeIn>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {services.map((service, i) => {
            const style = serviceStyles[i % serviceStyles.length];

            return (
              <FadeIn key={service.id} delay={0.1 * i} direction="up">
                <div
                  className={`group relative rounded-2xl bg-charcoal-light/50 border border-white/10 ${style.borderHover} transition-all duration-500 hover:shadow-2xl ${style.glow} h-full min-h-[280px] flex flex-col overflow-hidden`}
                >
                  {/* Top gradient accent bar */}
                  <div
                    className={`h-1.5 bg-gradient-to-r ${style.accent}`}
                  />

                  {/* Inner content */}
                  <div className="p-8 flex flex-col flex-1">
                    {/* Top row: icon + time */}
                    <div className="flex items-start justify-between mb-6">
                      <div
                        className={`w-16 h-16 rounded-2xl ${style.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}
                      >
                        <style.icon className="text-amber" size={28} />
                      </div>
                      <div className="text-right">
                        <span className="block text-white/40 text-xs font-medium tracking-[0.15em] uppercase">
                          {service.day}
                        </span>
                        <span className="block text-amber font-bold text-3xl leading-tight">
                          {service.time}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-white text-xl font-bold mb-3">
                      {service.label}
                    </h3>
                    <p className="text-white/45 leading-relaxed flex-1">
                      {service.description}
                    </p>

                    {/* Bottom action hint */}
                    <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/5">
                      <Clock size={14} className="text-white/30" />
                      <span className="text-white/30 text-sm">
                        ~75 minutes
                      </span>
                      <ChevronRight
                        size={16}
                        className="text-amber/0 group-hover:text-amber ml-auto transition-all duration-300 group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* Plan a Visit CTA */}
        <FadeIn delay={0.4}>
          <div className="text-center mt-16" id="visit">
            <p className="text-white/50 mb-6 text-lg">
              First time? We&apos;d love to meet you.
            </p>
            <a
              href="/new"
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
