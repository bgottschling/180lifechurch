import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { fetchFooterProps } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | 180 Life Church",
  description:
    "Privacy policy for 180 Life Church. Learn how we collect, use, and protect your personal information.",
};

export default async function PrivacyPage() {
  const footerProps = await fetchFooterProps();

  return (
    <>
      <Navbar />
      <PageHero
        title="Privacy Policy"
        subtitle="Your privacy is important to us."
        breadcrumbs={[{ label: "Privacy Policy", href: "/privacy" }]}
      />

      <section className="bg-soft-white py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <div className="prose prose-charcoal max-w-none space-y-6">
              <p className="text-charcoal/60 text-sm">
                Last updated: March 2026
              </p>

              <h2
                className="text-2xl font-bold text-charcoal"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Information We Collect
              </h2>
              <p className="text-charcoal/70 leading-relaxed">
                180 Life Church collects personal information that you
                voluntarily provide when you fill out forms on our website, such
                as your name, email address, phone number, and message content.
                We also collect information when you register for events, submit
                prayer requests, or sign up for communications.
              </p>

              <h2
                className="text-2xl font-bold text-charcoal"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                How We Use Your Information
              </h2>
              <p className="text-charcoal/70 leading-relaxed">
                We use your information to respond to your inquiries, process
                event registrations, send communications you have opted into,
                and improve our website and services. We do not sell, rent, or
                share your personal information with third parties for marketing
                purposes.
              </p>

              <h2
                className="text-2xl font-bold text-charcoal"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Third-Party Services
              </h2>
              <p className="text-charcoal/70 leading-relaxed">
                Our website may use third-party services such as Formspree for
                form handling, Google Maps for location display, YouTube for
                video content, and Church Center by Planning Center for event
                registrations and online giving. These services have their own
                privacy policies governing how they handle your data.
              </p>

              <h2
                className="text-2xl font-bold text-charcoal"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Cookies
              </h2>
              <p className="text-charcoal/70 leading-relaxed">
                Our website may use cookies and similar technologies to enhance
                your browsing experience. You can adjust your browser settings
                to refuse cookies, though some features may not function
                properly without them.
              </p>

              <h2
                className="text-2xl font-bold text-charcoal"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Data Security
              </h2>
              <p className="text-charcoal/70 leading-relaxed">
                We take reasonable measures to protect your personal information
                from unauthorized access, use, or disclosure. However, no
                method of transmission over the internet is completely secure.
              </p>

              <h2
                className="text-2xl font-bold text-charcoal"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Contact Us
              </h2>
              <p className="text-charcoal/70 leading-relaxed">
                If you have questions about this privacy policy, please contact
                us at{" "}
                <a
                  href="mailto:info@180lifechurch.org"
                  className="text-amber hover:underline"
                >
                  info@180lifechurch.org
                </a>
                .
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer {...footerProps} />
    </>
  );
}
