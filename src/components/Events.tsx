"use client";

import Image from "next/image";
import { FadeIn } from "./FadeIn";
import { Calendar, ArrowRight } from "lucide-react";
import type { WPEvent } from "@/lib/wordpress-types";
import { isPlanningCenterImage } from "@/lib/image-utils";

interface EventsProps {
  events: WPEvent[];
}

export function Events({ events }: EventsProps) {
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
          {events.map((event, i) => {
            // When the event has an editor-uploaded image in Planning
            // Center, render the card with the image as a background
            // and a dark gradient overlay so text stays readable. When
            // there's no image, fall back to the existing solid /
            // bordered card style (cream + dark for featured).
            const hasImage = Boolean(event.image);

            return (
              <FadeIn key={event.id} delay={0.1 * i}>
                <div
                  className={`group relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 cursor-pointer h-full min-h-[280px] flex flex-col ${
                    hasImage
                      ? "text-white shadow-md hover:shadow-2xl hover:shadow-charcoal/30"
                      : event.featured
                        ? "bg-charcoal text-white p-6 hover:shadow-xl hover:shadow-charcoal/20"
                        : "bg-white border border-cream-dark text-charcoal p-6 hover:border-amber/30 hover:shadow-lg hover:shadow-amber/5"
                  }`}
                >
                  {hasImage && (
                    <>
                      {/* Background event image (editor-uploaded in PC) */}
                      <Image
                        src={event.image as string}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105 -z-10"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        unoptimized={isPlanningCenterImage(event.image)}
                      />
                      {/* Dark gradient for text legibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/30 group-hover:from-black/95 group-hover:via-black/65 transition-all duration-500" />
                    </>
                  )}

                  <div
                    className={`relative z-10 flex flex-col h-full ${
                      hasImage ? "p-6" : ""
                    }`}
                  >
                    {/* Date badge */}
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4 self-start ${
                        hasImage
                          ? "bg-black/40 text-amber backdrop-blur"
                          : event.featured
                            ? "bg-amber/20 text-amber"
                            : "bg-amber/10 text-amber-dark"
                      }`}
                    >
                      <Calendar size={12} />
                      {event.date}
                      {event.time ? <> &middot; {event.time}</> : null}
                    </div>

                    <h3
                      className={`text-xl font-semibold mb-3 ${
                        hasImage || event.featured
                          ? "text-white"
                          : "text-charcoal"
                      }`}
                    >
                      {event.title}
                    </h3>
                    <p
                      className={`leading-relaxed mb-4 ${
                        hasImage
                          ? "text-white/85"
                          : event.featured
                            ? "text-white/60"
                            : "text-warm-gray-light"
                      }`}
                    >
                      {event.description}
                    </p>

                    {event.planningCenterLink ? (
                      <a
                        href={event.planningCenterLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1 text-sm font-medium transition-all group-hover:gap-2 mt-auto ${
                          hasImage || event.featured
                            ? "text-amber"
                            : "text-amber-dark"
                        }`}
                      >
                        Details <ArrowRight size={14} />
                      </a>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-1 text-sm font-medium transition-all group-hover:gap-2 mt-auto ${
                          hasImage || event.featured
                            ? "text-amber"
                            : "text-amber-dark"
                        }`}
                      >
                        Details <ArrowRight size={14} />
                      </span>
                    )}
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn delay={0.4}>
          <div className="text-center mt-12">
            <a
              href="https://180life.churchcenter.com/registrations/events/campus/13393"
              target="_blank"
              rel="noopener noreferrer"
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
