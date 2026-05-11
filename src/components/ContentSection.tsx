import Image from "next/image";
import { ReactNode } from "react";
import { FadeIn } from "./FadeIn";
import { isPlanningCenterImage } from "@/lib/image-utils";

interface ContentSectionProps {
  label?: string;
  heading: string;
  headingAccent?: string;
  body: string | string[];
  image?: { src: string; alt: string; position?: "left" | "right" };
  children?: ReactNode;
  background?: "white" | "soft-white" | "dark";
}

const bgMap = {
  white: "bg-white",
  "soft-white": "bg-soft-white",
  dark: "bg-charcoal text-white",
};

export function ContentSection({
  label,
  heading,
  headingAccent,
  body,
  image,
  children,
  background = "white",
}: ContentSectionProps) {
  const paragraphs = Array.isArray(body) ? body : [body];
  const isDark = background === "dark";
  const imgPosition = image?.position ?? "right";

  return (
    <section className={`${bgMap[background]} py-20 sm:py-24`}>
      <div className="max-w-6xl mx-auto px-6">
        <div
          className={`flex flex-col ${
            image ? "lg:flex-row lg:items-center lg:gap-16" : ""
          } ${image && imgPosition === "left" ? "lg:flex-row-reverse" : ""}`}
        >
          {/* Text content. Sections without an image center the
              eyebrow + heading for a more intentional "title card"
              feel; the body stays left-aligned because justified
              prose at center is hard to read. */}
          <div
            className={
              image
                ? "lg:w-1/2"
                : "max-w-3xl mx-auto text-center"
            }
          >
            {/* Decorative amber bar above the label on no-image
                sections — gives each section a small visual anchor
                so the page doesn't feel like a wall of text. */}
            {!image && (
              <FadeIn>
                <div className="flex justify-center mb-4">
                  <span
                    aria-hidden
                    className="block w-12 h-[2px] bg-amber rounded-full"
                  />
                </div>
              </FadeIn>
            )}
            {label && (
              <FadeIn>
                <span className="text-amber text-sm font-medium tracking-[0.2em] uppercase">
                  {label}
                </span>
              </FadeIn>
            )}
            <FadeIn delay={0.1}>
              <h2
                className={`text-3xl sm:text-4xl font-bold mt-3 mb-6 ${
                  isDark ? "text-white" : "text-charcoal"
                }`}
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {heading}{" "}
                {headingAccent && <span className="text-amber">{headingAccent}</span>}
              </h2>
            </FadeIn>
            {/* Reset to left-aligned for paragraphs in centered
                sections — text-left override only kicks in when the
                parent is centered. */}
            <div className={image ? "" : "text-left"}>
              {paragraphs.map((p, i) => (
                <FadeIn key={i} delay={0.15 + i * 0.05}>
                  <p
                    className={`leading-relaxed mb-4 ${
                      isDark ? "text-white/60" : "text-charcoal/70"
                    }`}
                  >
                    {p}
                  </p>
                </FadeIn>
              ))}
              {children && <FadeIn delay={0.25}>{children}</FadeIn>}
            </div>
          </div>

          {/* Image */}
          {image && (
            <FadeIn
              delay={0.2}
              direction={imgPosition === "right" ? "left" : "right"}
              className="lg:w-1/2 mt-10 lg:mt-0"
            >
              <div className="group/img relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg shadow-charcoal/10">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover/img:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  unoptimized={isPlanningCenterImage(image.src)}
                />
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </section>
  );
}
