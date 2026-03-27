import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { StaffCard } from "@/components/StaffCard";
import { getFooterProps } from "@/lib/wordpress-fallbacks";
import { Calendar, MapPin, Mail } from "lucide-react";
import type { MinistryPageData } from "@/lib/subpage-types";

interface MinistryPageTemplateProps {
  data: MinistryPageData;
}

export function MinistryPageTemplate({ data }: MinistryPageTemplateProps) {
  const footerProps = getFooterProps();

  return (
    <>
      <Navbar />
      <PageHero
        title={data.title}
        subtitle={data.subtitle}
        breadcrumbs={[
          { label: "Ministries", href: "/ministries" },
          { label: data.title, href: "#" },
        ]}
      />

      {/* Description */}
      <section className="bg-soft-white py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-6">
          {data.description.map((p, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <p className="text-charcoal/70 leading-relaxed mb-4 text-lg">{p}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Schedule */}
      {data.schedule && data.schedule.length > 0 && (
        <section className="bg-white py-16 sm:py-20">
          <div className="max-w-3xl mx-auto px-6">
            <FadeIn>
              <h2
                className="text-3xl font-bold text-charcoal mb-8"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                When We <span className="text-amber">Meet</span>
              </h2>
            </FadeIn>
            <div className="space-y-4">
              {data.schedule.map((s, i) => (
                <FadeIn key={i} delay={i * 0.05}>
                  <div className="flex items-start gap-4 p-5 rounded-xl bg-soft-white border border-charcoal/5">
                    <div className="w-10 h-10 rounded-lg bg-amber/10 flex items-center justify-center shrink-0">
                      <Calendar className="text-amber" size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-charcoal">
                        {s.day} at {s.time}
                      </p>
                      {s.location && (
                        <p className="text-charcoal/50 text-sm flex items-center gap-1.5 mt-1">
                          <MapPin size={14} /> {s.location}
                        </p>
                      )}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Leaders */}
      {data.leaders && data.leaders.length > 0 && (
        <section className="bg-soft-white py-16 sm:py-20">
          <div className="max-w-5xl mx-auto px-6">
            <FadeIn>
              <h2
                className="text-3xl font-bold text-charcoal mb-8 text-center"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Meet Our <span className="text-amber">Leaders</span>
              </h2>
            </FadeIn>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.leaders.map((leader, i) => (
                <StaffCard
                  key={leader.name}
                  name={leader.name}
                  role={leader.role}
                  image={leader.image}
                  delay={i * 0.1}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA */}
      {data.contactEmail && (
        <section className="bg-white py-16 sm:py-20">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <FadeIn>
              <div className="w-14 h-14 rounded-2xl bg-amber/10 flex items-center justify-center mx-auto mb-6">
                <Mail className="text-amber" size={24} />
              </div>
              <h2
                className="text-3xl font-bold text-charcoal mb-4"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Have <span className="text-amber">Questions?</span>
              </h2>
              <p className="text-charcoal/60 mb-6">
                We&apos;d love to hear from you. Reach out and we&apos;ll get back to you soon.
              </p>
              <a
                href={`mailto:${data.contactEmail}`}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber text-charcoal font-semibold rounded-full hover:bg-amber-light transition-all hover:shadow-lg hover:shadow-amber/25"
              >
                Email Us
                <Mail size={16} />
              </a>
            </FadeIn>
          </div>
        </section>
      )}

      <Footer {...footerProps} />
    </>
  );
}
