import Image from "next/image";
import { ReactNode } from "react";
import { FadeIn } from "./FadeIn";

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
    <section className={`${bgMap[background]} py-16 sm:py-20`}>
      <div className="max-w-6xl mx-auto px-6">
        <div
          className={`flex flex-col ${
            image ? "lg:flex-row lg:items-center lg:gap-16" : ""
          } ${image && imgPosition === "left" ? "lg:flex-row-reverse" : ""}`}
        >
          {/* Text content */}
          <div className={image ? "lg:w-1/2" : "max-w-3xl mx-auto"}>
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

          {/* Image */}
          {image && (
            <FadeIn
              delay={0.2}
              direction={imgPosition === "right" ? "left" : "right"}
              className="lg:w-1/2 mt-10 lg:mt-0"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </section>
  );
}
