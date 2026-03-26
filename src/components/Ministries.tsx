"use client";

import Image from "next/image";
import { FadeIn } from "./FadeIn";
import {
  Users,
  Music,
  BookOpen,
  Baby,
  HandHeart,
  Sparkles,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import type { WPMinistry } from "@/lib/wordpress-types";

const iconMap: Record<string, LucideIcon> = {
  Music,
  Users,
  BookOpen,
  Baby,
  HandHeart,
  Sparkles,
};

interface MinistriesProps {
  ministries: WPMinistry[];
}

export function Ministries({ ministries }: MinistriesProps) {
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
          {ministries.map((ministry, i) => {
            const Icon = iconMap[ministry.iconName] || Users;
            const isRemoteImage = ministry.image.startsWith("http");

            return (
              <FadeIn key={ministry.id} delay={0.05 * i}>
                <div className="group relative rounded-2xl overflow-hidden cursor-pointer h-full min-h-[320px] flex flex-col hover:-translate-y-1.5 transition-all duration-500 hover:shadow-2xl hover:shadow-black/20">
                  {/* Background photo */}
                  <Image
                    src={ministry.image}
                    alt={ministry.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    {...(isRemoteImage ? { unoptimized: true } : {})}
                  />

                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 group-hover:from-black/95 group-hover:via-black/60 transition-all duration-500" />

                  {/* Large watermark icon */}
                  <div className="absolute top-4 right-4 opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-500">
                    <Icon
                      size={120}
                      className="text-white"
                      strokeWidth={1}
                    />
                  </div>

                  {/* Content */}
                  <div className="relative p-7 flex flex-col flex-1 z-10">
                    {/* Top row: tag */}
                    <div className="flex items-start mb-auto">
                      <span className="text-white/70 text-xs font-semibold tracking-[0.15em] uppercase bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                        {ministry.tag}
                      </span>
                    </div>

                    {/* Bottom content */}
                    <div className="mt-auto">
                      <h3 className="text-white text-2xl font-bold mb-2">
                        {ministry.title}
                      </h3>

                      <p className="text-white/60 text-sm leading-relaxed mb-4 line-clamp-3 group-hover:text-white/80 transition-colors duration-300">
                        {ministry.description}
                      </p>

                      {/* Action row */}
                      <div className="flex items-center gap-2 pt-3 border-t border-white/10 group-hover:border-white/20 transition-colors">
                        <span className="text-white/70 text-sm font-medium group-hover:text-amber transition-colors duration-300">
                          Learn More
                        </span>
                        <ArrowRight
                          size={16}
                          className="text-white/40 group-hover:text-amber group-hover:translate-x-1.5 transition-all duration-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* Placeholder note */}
        <FadeIn delay={0.4}>
          <p className="text-center text-warm-gray-light/50 text-xs mt-8 italic">
            Photos shown are placeholders. Real photography coming soon.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
