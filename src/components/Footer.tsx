import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Logo } from "./Logo";
import type { WPContactData, WPSocialData } from "@/lib/wordpress-types";

const quickLinks = [
  { label: "About", href: "/about" },
  { label: "Leadership", href: "/leadership" },
  { label: "Ministries", href: "/ministries" },
  { label: "Sermons", href: "/sermons" },
  { label: "Events", href: "https://180life.churchcenter.com/pages/events-landing-page", external: true },
  { label: "Give", href: "/give" },
  { label: "Watch Live", href: "https://180life.online.church/", external: true },
];

const connectLinks = [
  { label: "Plan a Visit", href: "/new" },
  { label: "Next Steps", href: "/connect" },
  { label: "Partnership", href: "/partnership" },
  { label: "Baptism", href: "/baptism" },
  { label: "New to Faith", href: "/new-to-faith" },
  { label: "Life Groups", href: "https://180life.churchcenter.com/groups/180-life-groups", external: true },
  { label: "Serve", href: "https://180life.churchcenter.com/people/forms/405849", external: true },
  { label: "Stories", href: "/stories" },
  { label: "Prayer Request", href: "/contact" },
];

interface FooterProps {
  contact: WPContactData;
  missionStatement: string;
  churchTagline: string;
}

export function Footer({
  contact,
  missionStatement,
  churchTagline,
}: FooterProps) {
  return (
    <>
      <footer
        id="contact"
        className="bg-charcoal border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Church info */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="mb-6">
                <Logo size={80} />
              </div>
              <p className="text-white/50 leading-relaxed mb-4">
                {missionStatement}
              </p>
              <p className="text-white/30 text-sm italic">{churchTagline}</p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="text-white/50 hover:text-amber transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">
                Connect
              </h4>
              <ul className="space-y-3">
                {connectLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="text-white/50 hover:text-amber transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">
                Visit Us
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin
                    className="text-amber mt-0.5 shrink-0"
                    size={16}
                  />
                  <span className="text-white/50 text-sm">
                    {contact.addressLine1}
                    <br />
                    {contact.addressLine2}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="text-amber shrink-0" size={16} />
                  <span className="text-white/50 text-sm">
                    {contact.serviceTimesSummary}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="text-amber shrink-0" size={16} />
                  <span className="text-white/50 text-sm">
                    {contact.phone}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="text-amber shrink-0" size={16} />
                  <span className="text-white/50 text-sm">
                    {contact.email}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-sm">
              &copy; {new Date().getFullYear()} 180 Life Church. All rights
              reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="/privacy"
                className="text-white/30 hover:text-white/50 text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-white/30 hover:text-white/50 text-sm transition-colors"
              >
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
