import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { StaffCard } from "@/components/StaffCard";
import { FadeIn } from "@/components/FadeIn";
import Image from "next/image";
import { Mail } from "lucide-react";
import {
  fetchFooterProps,
  fetchLeadership,
  fetchElders,
  ELDERS_DESCRIPTION,
  ELDERS_EMAIL,
} from "@/lib/data";
import type { Metadata } from "next";

// SEO metadata mirrors the existing /leadership page on 180lifechurch.org.
// See docs/seo-audit-current-site.md.
export const metadata: Metadata = {
  title: "Church staff at West Hartford, CT | 180 Life Church",
  description:
    "Meet the 180 Life Church leadership team ready to encourage and equip you in your Christian faith. Info about our pastors, staff and elders in West Hartford.",
  alternates: { canonical: "/leadership" },
};

export default async function LeadershipPage() {
  const [footerProps, leadershipData, elders] = await Promise.all([
    fetchFooterProps(),
    fetchLeadership(),
    fetchElders(),
  ]);

  return (
    <>
      <Navbar />
      <PageHero
        title="Our Leadership"
        subtitle="Meet the pastors and team who serve 180 Life Church."
        breadcrumbs={[{ label: "Leadership", href: "/leadership" }]}
      />

      {/* Pastors — Featured Hero Treatment */}
      <section className="bg-soft-white py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-amber text-sm font-medium tracking-[0.2em] uppercase">
                The Heart Behind It
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold text-charcoal mt-3"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Our <span className="text-amber">Pastors</span>
              </h2>
              <p className="text-charcoal/50 mt-4 max-w-xl mx-auto leading-relaxed">
                The shepherds who lead, teach, and care for our church family.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {leadershipData.pastors.map((pastor, i) => (
              <FadeIn key={pastor.name} delay={i * 0.15}>
                <div className="group relative rounded-2xl overflow-hidden bg-white border border-charcoal/8 h-full">
                  {/* Large portrait */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={pastor.image}
                      alt={pastor.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {/* Gradient for text legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Name + role overlay at bottom of photo */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3
                        className="text-2xl sm:text-3xl font-bold text-white"
                        style={{ fontFamily: "var(--font-playfair)" }}
                      >
                        {pastor.name}
                      </h3>
                      <p className="text-amber text-sm font-semibold tracking-wide uppercase mt-1">
                        {pastor.role}
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  {pastor.bio && (
                    <div className="p-6">
                      <p className="text-charcoal/60 text-sm leading-relaxed">
                        {pastor.bio}
                      </p>
                    </div>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Staff — Grid with hover bio reveal */}
      {leadershipData.staff.length > 0 && (
        <section className="bg-white py-16 sm:py-24">
          <div className="max-w-5xl mx-auto px-6">
            <FadeIn>
              <div className="text-center mb-14">
                <span className="text-amber text-sm font-medium tracking-[0.2em] uppercase">
                  The People Who Make It Happen
                </span>
                <h2
                  className="text-3xl sm:text-4xl font-bold text-charcoal mt-3"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Our <span className="text-amber">Team</span>
                </h2>
                <p className="text-charcoal/50 mt-4 max-w-xl mx-auto leading-relaxed">
                  Dedicated staff serving behind the scenes and on the front lines every week.
                </p>
              </div>
            </FadeIn>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {leadershipData.staff.map((member, i) => (
                <StaffCard
                  key={member.name}
                  name={member.name}
                  role={member.role}
                  image={member.image}
                  bio={member.bio}
                  delay={i * 0.08}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Elders — Dark distinguished section */}
      <section
        className="py-16 sm:py-24"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(212, 160, 84, 0.1) 0%, transparent 60%), linear-gradient(to bottom, #1A1A1A, #201C16, #1A1A1A)",
        }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-amber text-sm font-medium tracking-[0.2em] uppercase">
                Shepherding With Integrity
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold text-white mt-3"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Our <span className="text-amber">Elders</span>
              </h2>
              <p className="text-white/45 mt-4 max-w-2xl mx-auto leading-relaxed">
                {ELDERS_DESCRIPTION}
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {elders.map((elder, i) => (
              <FadeIn key={elder.name} delay={i * 0.08}>
                <div className="group rounded-2xl overflow-hidden bg-white/[0.06] border border-white/10 backdrop-blur-sm hover:bg-white/[0.1] transition-colors duration-300">
                  {elder.image && (
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <Image
                        src={elder.image}
                        alt={elder.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    </div>
                  )}
                  <div className="p-5 text-center">
                    <h3 className="font-bold text-white">{elder.name}</h3>
                    <p className="text-amber/70 text-sm mt-1">{elder.role}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.4}>
            <div className="flex items-center justify-center gap-2 mt-10">
              <Mail size={16} className="text-white/30" />
              <p className="text-white/40 text-sm">
                Contact the Elders:{" "}
                <a
                  href={`mailto:${ELDERS_EMAIL}`}
                  className="text-amber hover:underline"
                >
                  {ELDERS_EMAIL}
                </a>
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer {...footerProps} />
    </>
  );
}
