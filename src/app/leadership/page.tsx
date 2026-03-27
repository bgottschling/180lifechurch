import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { StaffCard } from "@/components/StaffCard";
import { FadeIn } from "@/components/FadeIn";
import { getFooterProps } from "@/lib/wordpress-fallbacks";
import {
  LEADERSHIP_DATA,
  ELDERS,
  ELDERS_DESCRIPTION,
  ELDERS_EMAIL,
} from "@/lib/subpage-fallbacks";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leadership | 180 Life Church",
  description:
    "Meet the pastors and staff who lead 180 Life Church in Bloomfield, CT.",
};

export default function LeadershipPage() {
  const footerProps = getFooterProps();

  return (
    <>
      <Navbar />
      <PageHero
        title="Our Leadership"
        subtitle="Meet the pastors and team who serve 180 Life Church."
        breadcrumbs={[{ label: "Leadership", href: "/leadership" }]}
      />

      {/* Pastors */}
      <section className="bg-soft-white py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn>
            <h2
              className="text-3xl font-bold text-charcoal mb-10 text-center"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Our <span className="text-amber">Pastors</span>
            </h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {LEADERSHIP_DATA.pastors.map((pastor, i) => (
              <StaffCard
                key={pastor.name}
                name={pastor.name}
                role={pastor.role}
                image={pastor.image}
                bio={pastor.bio}
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Staff */}
      {LEADERSHIP_DATA.staff.length > 0 && (
        <section className="bg-white py-16 sm:py-20">
          <div className="max-w-5xl mx-auto px-6">
            <FadeIn>
              <h2
                className="text-3xl font-bold text-charcoal mb-10 text-center"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Our <span className="text-amber">Team</span>
              </h2>
            </FadeIn>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {LEADERSHIP_DATA.staff.map((member, i) => (
                <StaffCard
                  key={member.name}
                  name={member.name}
                  role={member.role}
                  image={member.image}
                  bio={member.bio}
                  delay={i * 0.1}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Elders */}
      <section className="bg-soft-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn>
            <h2
              className="text-3xl font-bold text-charcoal mb-4 text-center"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Our <span className="text-amber">Elders</span>
            </h2>
            <p className="text-charcoal/60 text-center max-w-2xl mx-auto mb-10 leading-relaxed">
              {ELDERS_DESCRIPTION}
            </p>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ELDERS.map((elder, i) => (
              <FadeIn key={elder.name} delay={i * 0.05}>
                <div className="bg-white rounded-2xl border border-charcoal/8 p-6 text-center">
                  <h3 className="font-bold text-charcoal">{elder.name}</h3>
                  <p className="text-amber text-sm mt-1">{elder.role}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.3}>
            <p className="text-center text-charcoal/50 text-sm mt-8">
              Contact the Elders:{" "}
              <a
                href={`mailto:${ELDERS_EMAIL}`}
                className="text-amber hover:underline"
              >
                {ELDERS_EMAIL}
              </a>
            </p>
          </FadeIn>
        </div>
      </section>

      <Footer hideChecklistBanner {...footerProps} />
    </>
  );
}
