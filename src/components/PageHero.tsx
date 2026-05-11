import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { FadeIn } from "./FadeIn";
import { Breadcrumb } from "./Breadcrumb";
import { isPlanningCenterImage } from "@/lib/image-utils";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href: string }[];
  /**
   * Optional full-width photo behind the hero. When set, renders the
   * darker image-backed variant with a gradient overlay so the title
   * stays legible. When omitted, falls back to the standard
   * amber-on-dark gradient treatment.
   */
  image?: string;
  /** Alt text for the hero image. Defaults to the page title. */
  imageAlt?: string;
  /**
   * Optional scripture verse rendered as a large playfair blockquote
   * above the title. Phase 2a: lets ministry pages match the polish
   * of the bespoke ones without bespoke code.
   */
  verse?: { text: string; reference: string };
  /**
   * Optional per-page accent color (hex). Themes the verse citation,
   * the hero icon medallion ring, and any caller-supplied decorations.
   * Falls back to brand amber.
   */
  accentColor?: string;
  /**
   * Optional Lucide icon shown as a circular medallion above the
   * title. Pass the component (from getLucideIcon) rather than the
   * name string so callers can do the lookup once.
   */
  heroIcon?: LucideIcon | null;
}

export function PageHero({
  title,
  subtitle,
  breadcrumbs,
  image,
  imageAlt,
  verse,
  accentColor,
  heroIcon: HeroIcon,
}: PageHeroProps) {
  const accent = accentColor || "#D4A054";

  // Hero icon medallion — rendered above the title when an icon is
  // provided. Uses accent color for ring + fill so the medallion
  // visually anchors to the rest of the page's accent palette.
  const heroIconBlock = HeroIcon ? (
    <FadeIn delay={0.05}>
      <div className="flex justify-center mt-6 mb-6">
        <div
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${accent}35, ${accent}1f)`,
            border: `1.5px solid ${accent}50`,
            boxShadow: `0 0 50px ${accent}25`,
          }}
        >
          <HeroIcon size={36} style={{ color: accent }} className="sm:w-11 sm:h-11" />
        </div>
      </div>
    </FadeIn>
  ) : null;

  // Verse block — playfair italic blockquote with accent-colored
  // citation. Rendered between the title and the subtitle so it
  // reads as a thematic anchor for the page.
  const verseBlock = verse ? (
    <FadeIn delay={0.2}>
      <blockquote className="max-w-2xl mx-auto mb-6">
        <p
          className="text-base sm:text-lg text-white/60 italic leading-relaxed"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          &ldquo;{verse.text}&rdquo;
        </p>
        <cite
          className="not-italic text-xs font-semibold uppercase tracking-widest mt-2 block"
          style={{ color: accent }}
        >
          {verse.reference}
        </cite>
      </blockquote>
    </FadeIn>
  ) : null;

  // Image-backed variant. Taller padding + stronger gradient so the
  // title carries weight without dropping legibility on busy photos.
  if (image) {
    return (
      <section className="relative pt-36 pb-20 sm:pt-44 sm:pb-28 overflow-hidden">
        <Image
          src={image}
          alt={imageAlt || title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
          unoptimized={isPlanningCenterImage(image)}
        />
        {/* Two-stop gradient: brand dark at top + bottom for navbar
            contrast and text legibility, slightly translucent at
            center so the photo still reads. */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/50 to-black/85" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <FadeIn>
              <Breadcrumb items={breadcrumbs} />
            </FadeIn>
          )}
          {heroIconBlock}
          <FadeIn delay={0.1}>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {title}
            </h1>
          </FadeIn>
          {verseBlock}
          {subtitle && (
            <FadeIn delay={0.25}>
              <p className="text-white/80 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
                {subtitle}
              </p>
            </FadeIn>
          )}
        </div>
      </section>
    );
  }

  // Default amber-on-dark variant — used when no hero image is set.
  // Accent color tints the existing radial gradient subtly so the
  // page color theme reads even before any photo loads.
  const radialAccent = `${accent}26`; // ~15% alpha hex
  return (
    <section
      className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at 50% 50%, ${radialAccent} 0%, transparent 60%), linear-gradient(to bottom, #1A1A1A, #201C16, #1A1A1A)`,
      }}
    >
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <FadeIn>
            <Breadcrumb items={breadcrumbs} />
          </FadeIn>
        )}
        {heroIconBlock}
        <FadeIn delay={0.1}>
          <h1
            className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {title}
          </h1>
        </FadeIn>
        {verseBlock}
        {subtitle && (
          <FadeIn delay={0.25}>
            <p className="text-white/60 text-lg max-w-xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
