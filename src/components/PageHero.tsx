import { FadeIn } from "./FadeIn";
import { Breadcrumb } from "./Breadcrumb";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href: string }[];
}

export function PageHero({ title, subtitle, breadcrumbs }: PageHeroProps) {
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
