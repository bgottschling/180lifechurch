import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { fetchFooterProps, fetchSiteSettings } from "@/lib/data";
import {
  MapPin,
  Clock,
  Heart,
  Users,
  Baby,
  Coffee,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "I'm New | 180 Life Church",
  description:
    "Planning your first visit to 180 Life Church? Here is everything you need to know about what to expect, what to wear, and where to go.",
};

export default async function NewHerePage() {
  const [footerProps, settings] = await Promise.all([
    fetchFooterProps(),
    fetchSiteSettings(),
  ]);
  const { contact } = settings;

  const whatToExpect = [
    {
      icon: Clock,
      title: "Service Times",
      description: `We meet every Sunday at 9:00 AM and 11:00 AM. ${contact.doorsOpenText}. Services are about 75 minutes. Please arrive early, especially if you have children, to ensure ample time to check them into kids ministry.`,
    },
    {
      icon: Coffee,
      title: "Come As You Are",
      description:
        "We want you to feel the freedom to come as you are. Some people dress up while others dress casually. Join us in an outfit that you are comfortable in.",
    },
    {
      icon: Heart,
      title: "Worship & Teaching",
      description:
        "We start with worship, announcements, followed by a message from one of our pastors. Our services are relevant, Bible-based, and practical.",
    },
    {
      icon: Users,
      title: "Guest Center",
      description:
        "If you are new, be sure to head over to the Guest Center after church where we have a special gift for you and can answer any of your questions. Join us after service for free coffee and refreshments.",
    },
    {
      icon: Baby,
      title: "Kids Are Welcome",
      description:
        "We have safe, fun, age-appropriate programs for kids from nursery through 5th grade during both services, and middle school programming during our 11 AM service.",
    },
    {
      icon: MapPin,
      title: "Easy to Find",
      description: `Our building is located at ${contact.addressLine1}, ${contact.addressLine2}. Look for our signs and our welcoming team in the parking lot.`,
    },
  ];

  const faqs = [
    {
      q: "What should I wear?",
      a: "Whatever you are comfortable in! You will see everything from jeans to suits. There is no dress code.",
    },
    {
      q: "How long is the service?",
      a: "About 75 minutes. We start with worship music, have a time for announcements, and then hear a message from one of our pastors.",
    },
    {
      q: "Is there parking?",
      a: "Yes! We have a large parking lot with plenty of space. Our parking team will help guide you.",
    },
    {
      q: "Do I need to bring anything?",
      a: "Just yourself! We have Bibles available and everything you need will be provided.",
    },
    {
      q: "What about my kids?",
      a: "We have dedicated kids programs during both services for ages nursery through 5th grade, and middle school during our 11 AM service. All volunteers are background-checked.",
    },
    {
      q: "I just gave my life to Christ. What now?",
      a: (<>Congratulations! We have resources to help you grow in your new faith. Visit our <a href="/new-to-faith" className="text-amber font-medium hover:underline">New to Faith</a> page or talk to someone at the Guest Center after service.</>),
    },
  ];

  return (
    <>
      <Navbar />
      <PageHero
        title="We Saved You a Seat"
        subtitle="Whether you're exploring faith for the first time or looking for a new church home, you're welcome here."
      />

      {/* What to Expect — flowing timeline */}
      <section className="bg-soft-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="text-amber text-sm font-medium tracking-[0.2em] uppercase">
                Your First Visit
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold text-charcoal mt-3"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                What to <span className="text-amber">Expect</span>
              </h2>
              <p className="text-charcoal/50 mt-4 max-w-xl mx-auto leading-relaxed">
                Here&apos;s a quick look at what your first Sunday with us will be like.
              </p>
            </div>
          </FadeIn>

          {/* Timeline items */}
          <div className="relative">
            {/* Vertical connecting line */}
            <div
              className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px sm:-translate-x-px"
              style={{
                background: "linear-gradient(to bottom, transparent 0%, rgba(212, 160, 84, 0.25) 10%, rgba(212, 160, 84, 0.25) 90%, transparent 100%)",
              }}
              aria-hidden="true"
            />

            {whatToExpect.map((item, i) => {
              const Icon = item.icon;
              const isEven = i % 2 === 0;

              return (
                <FadeIn key={item.title} delay={i * 0.08}>
                  <div className={`relative flex items-start gap-6 sm:gap-12 mb-12 last:mb-0 ${
                    isEven ? "sm:flex-row" : "sm:flex-row-reverse"
                  }`}>
                    {/* Text content */}
                    <div className={`flex-1 pl-16 sm:pl-0 ${
                      isEven ? "sm:text-right sm:pr-12" : "sm:text-left sm:pl-12"
                    }`}>
                      <h3
                        className="text-xl font-bold text-charcoal mb-2"
                        style={{ fontFamily: "var(--font-playfair)" }}
                      >
                        {item.title}
                      </h3>
                      <p className="text-charcoal/60 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Center icon node */}
                    <div className="absolute left-0 sm:relative sm:left-auto flex items-center justify-center shrink-0">
                      <div className="w-12 h-12 rounded-full bg-amber/10 border-2 border-amber/30 flex items-center justify-center z-10 bg-soft-white">
                        <Icon className="text-amber" size={20} />
                      </div>
                    </div>

                    {/* Spacer for opposite side on desktop */}
                    <div className="hidden sm:block flex-1" />
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ — clean conversational list */}
      <section className="bg-white py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-amber text-sm font-medium tracking-[0.2em] uppercase">
                FAQ
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold text-charcoal mt-3"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Common <span className="text-amber">Questions</span>
              </h2>
            </div>
          </FadeIn>

          <div className="divide-y divide-charcoal/10">
            {faqs.map((faq, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="py-8 sm:py-10 first:pt-0 last:pb-0">
                  <h3 className="text-lg sm:text-xl font-semibold text-charcoal mb-3">
                    {faq.q}
                  </h3>
                  <p className="text-charcoal/55 leading-relaxed sm:text-[17px]">
                    {faq.a}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
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
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              We Can&apos;t Wait to Meet You
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
              Have questions before your visit? We would love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/contact"
                className="px-8 py-3.5 bg-amber text-charcoal font-semibold rounded-full hover:bg-amber-light transition-all hover:shadow-lg hover:shadow-amber/25"
              >
                Contact Us
              </a>
              <a
                href="/new-to-faith"
                className="px-8 py-3.5 text-white border border-white/30 font-semibold rounded-full hover:bg-white/10 transition-all"
              >
                New to Faith?
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer {...footerProps} />
    </>
  );
}
