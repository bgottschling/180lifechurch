import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { ContentSection } from "@/components/ContentSection";
import { FadeIn } from "@/components/FadeIn";
import { fetchFooterProps, fetchContentPage } from "@/lib/data";
import { Users, Heart, BookOpen, HandHeart, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | 180 Life Church",
  description: "We exist to make and send disciples who love and live like Jesus.",
};

const nextSteps = [
  {
    icon: Users,
    title: "Meet Our Team",
    description:
      "Get to know the pastors, staff, and elders who shepherd our church family.",
    href: "/leadership",
    color: "from-teal/80 to-charcoal/90",
  },
  {
    icon: Heart,
    title: "Partnership",
    description:
      "Learn how to become a partner and discover your place in the church body.",
    href: "/partnership",
    color: "from-amber/70 to-charcoal/90",
  },
  {
    icon: BookOpen,
    title: "Baptism & Dedication",
    description:
      "Ready to take your next step of faith? Learn about baptism and child dedication.",
    href: "/baptism",
    color: "from-indigo-500/70 to-charcoal/90",
  },
  {
    icon: HandHeart,
    title: "Stories",
    description:
      "See how God is transforming lives at 180 Life Church.",
    href: "/stories",
    color: "from-rose-500/70 to-charcoal/90",
  },
];

export default async function AboutPage() {
  const [footerProps, data] = await Promise.all([
    fetchFooterProps(),
    fetchContentPage("about"),
  ]);

  if (!data) return null;

  return (
    <>
      <Navbar />
      <PageHero
        title={data.title}
        subtitle={data.subtitle}
        breadcrumbs={data.breadcrumbs}
      />

      {data.sections.map((section, i) => (
        <ContentSection
          key={i}
          label={section.label}
          heading={section.heading}
          headingAccent={section.headingAccent}
          body={section.body}
          image={section.image}
          background={i % 2 === 0 ? "soft-white" : "white"}
        />
      ))}

      {/* Next Steps */}
      <section className="bg-soft-white py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-12">
              <span className="text-amber text-sm font-medium tracking-[0.2em] uppercase">
                Go Deeper
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold text-charcoal mt-3"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Next <span className="text-amber">Steps</span>
              </h2>
            </div>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {nextSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <FadeIn key={step.title} delay={i * 0.05}>
                  <a
                    href={step.href}
                    className={`group relative block rounded-2xl overflow-hidden cursor-pointer h-full min-h-[240px] flex flex-col hover:-translate-y-1.5 transition-all duration-500 hover:shadow-2xl hover:shadow-black/20`}
                  >
                    {/* Gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color}`} />

                    {/* Watermark */}
                    <div className="absolute top-3 right-3 opacity-[0.08] group-hover:opacity-[0.15] transition-opacity duration-500">
                      <Icon size={100} className="text-white" strokeWidth={1} />
                    </div>

                    {/* Content */}
                    <div className="relative p-6 flex flex-col flex-1 z-10">
                      <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-auto">
                        <Icon className="text-white" size={18} />
                      </span>

                      <div className="mt-auto">
                        <h3 className="text-white text-lg font-bold mb-2">
                          {step.title}
                        </h3>
                        <p className="text-white/60 text-sm leading-relaxed mb-3 group-hover:text-white/80 transition-colors duration-300">
                          {step.description}
                        </p>
                        <div className="flex items-center gap-2 pt-3 border-t border-white/10 group-hover:border-white/20 transition-colors">
                          <span className="text-white/70 text-sm font-medium group-hover:text-amber transition-colors duration-300">
                            Explore
                          </span>
                          <ArrowRight size={14} className="text-white/40 group-hover:text-amber group-hover:translate-x-1.5 transition-all duration-300" />
                        </div>
                      </div>
                    </div>
                  </a>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      {data.cta && (
        <section
          className="py-16 sm:py-20 text-center"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(212, 160, 84, 0.15) 0%, transparent 60%), linear-gradient(to bottom, #1A1A1A, #201C16, #1A1A1A)",
          }}
        >
          <div className="max-w-3xl mx-auto px-6">
            <FadeIn>
              <h2
                className="text-3xl sm:text-4xl font-bold text-white mb-6"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {data.cta.heading}
              </h2>
              {data.cta.description && (
                <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
                  {data.cta.description}
                </p>
              )}
              <a
                href={data.cta.link}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber text-charcoal font-semibold rounded-full hover:bg-amber-light transition-all hover:shadow-lg hover:shadow-amber/25"
              >
                {data.cta.text}
              </a>
            </FadeIn>
          </div>
        </section>
      )}

      <Footer {...footerProps} />
    </>
  );
}
