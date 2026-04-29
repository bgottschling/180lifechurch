import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { FadeIn } from "@/components/FadeIn";
import { fetchFooterProps, fetchSiteSettings } from "@/lib/data";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import type { Metadata } from "next";

// SEO metadata mirrors the existing /contact page on 180lifechurch.org.
// See docs/seo-audit-current-site.md.
export const metadata: Metadata = {
  title: "Contact our West Hartford, CT church | 180 Life Church",
  description:
    "Connect with our West Hartford, CT church. Send us your question or comment about 180 Life Church and we'll be in touch real soon.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const [footerProps, settings] = await Promise.all([
    fetchFooterProps(),
    fetchSiteSettings(),
  ]);
  const { contact } = settings;

  return (
    <>
      <Navbar />
      <PageHero
        title="Contact Us"
        subtitle="We'd love to hear from you. Reach out with questions, prayer requests, or just to say hello."
        breadcrumbs={[{ label: "Contact", href: "/contact" }]}
      />

      <section className="bg-soft-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-10">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <FadeIn>
                <ContactForm
                  heading="Send Us a Message"
                  description="Fill out the form below and we'll get back to you as soon as possible."
                />
              </FadeIn>
            </div>

            {/* Contact Info Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              <FadeIn delay={0.1}>
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-charcoal to-charcoal/95 p-7">
                  {/* Subtle amber glow */}
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      background: "radial-gradient(ellipse at 20% 20%, rgba(212, 160, 84, 0.2) 0%, transparent 60%)",
                    }}
                  />
                  <div className="relative z-10">
                    <h3
                      className="text-xl font-bold text-white mb-6"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      Visit <span className="text-amber">Us</span>
                    </h3>
                    <ul className="space-y-5">
                      <li className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                          <MapPin className="text-amber" size={16} />
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm">Address</p>
                          <p className="text-white/50 text-sm">
                            {contact.addressLine1}
                            <br />
                            {contact.addressLine2}
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Clock className="text-amber" size={16} />
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm">Service Times</p>
                          <p className="text-white/50 text-sm">
                            {contact.serviceTimesSummary}
                            <br />
                            {contact.doorsOpenText}
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Phone className="text-amber" size={16} />
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm">Phone</p>
                          <a
                            href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}
                            className="text-white/50 text-sm hover:text-amber transition-colors"
                          >
                            {contact.phone}
                          </a>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Mail className="text-amber" size={16} />
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm">Email</p>
                          <a
                            href={`mailto:${contact.email}`}
                            className="text-white/50 text-sm hover:text-amber transition-colors"
                          >
                            {contact.email}
                          </a>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </FadeIn>

              {/* Map */}
              <FadeIn delay={0.2}>
                <div className="rounded-2xl overflow-hidden shadow-lg shadow-charcoal/10">
                  <iframe
                    title="180 Life Church Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2980.5!2d-72.74!3d41.83!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s180+Still+Road+Bloomfield+CT!5e0!3m2!1sen!2sus!4v1"
                    width="100%"
                    height="280"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      <Footer {...footerProps} />
    </>
  );
}
