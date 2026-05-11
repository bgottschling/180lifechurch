import Image from "next/image";
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
}

export function PageHero({
  title,
  subtitle,
  breadcrumbs,
  image,
  imageAlt,
}: PageHeroProps) {
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
          <FadeIn delay={0.1}>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {title}
            </h1>
          </FadeIn>
          {subtitle && (
            <FadeIn delay={0.2}>
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
  return (
    <section
      className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 50%, rgba(212, 160, 84, 0.15) 0%, transparent 60%), linear-gradient(to bottom, #1A1A1A, #201C16, #1A1A1A)",
      }}
    >
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <FadeIn>
            <Breadcrumb items={breadcrumbs} />
          </FadeIn>
        )}
        <FadeIn delay={0.1}>
          <h1
            className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {title}
          </h1>
        </FadeIn>
        {subtitle && (
          <FadeIn delay={0.2}>
            <p className="text-white/60 text-lg max-w-xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
