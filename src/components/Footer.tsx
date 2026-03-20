import { MapPin, Phone, Mail, Clock, ClipboardList } from "lucide-react";
import { Logo } from "./Logo";

const quickLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Ministries", href: "#ministries" },
  { label: "Events", href: "#events" },
  { label: "Sermons", href: "#watch" },
  { label: "Give", href: "#give" },
];

const connectLinks = [
  { label: "Plan a Visit", href: "#visit" },
  { label: "Life Groups", href: "#groups" },
  { label: "Serve", href: "#serve" },
  { label: "Prayer Request", href: "#prayer" },
];

export function Footer() {
  return (
    <footer id="contact" className="bg-charcoal border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Church info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-6">
              <Logo size={80} />
            </div>
            <p className="text-white/50 leading-relaxed mb-4">
              We exist to make and send disciples who love and live like Jesus.
            </p>
            <p className="text-white/30 text-sm italic">
              Jesus Changes Everything
            </p>
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
                <MapPin className="text-amber mt-0.5 shrink-0" size={16} />
                <span className="text-white/50 text-sm">
                  180 Still Road
                  <br />
                  Bloomfield, CT 06002
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="text-amber shrink-0" size={16} />
                <span className="text-white/50 text-sm">
                  Sundays at 9:00 &amp; 11:00 AM
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-amber shrink-0" size={16} />
                <span className="text-white/50 text-sm">
                  (860) 243-3576
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-amber shrink-0" size={16} />
                <span className="text-white/50 text-sm">
                  info@180lifechurch.org
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
              href="#privacy"
              className="text-white/30 hover:text-white/50 text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#terms"
              className="text-white/30 hover:text-white/50 text-sm transition-colors"
            >
              Terms
            </a>
          </div>
        </div>
      </div>

      {/* Checklist banner - large, unmissable CTA */}
      <div
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #2A2218 0%, #1A1A1A 40%, #201C16 100%)",
        }}
      >
        {/* Amber glow */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(212, 160, 84, 0.3) 0%, transparent 70%)",
          }}
        />
        {/* Top accent line */}
        <div className="h-1 bg-gradient-to-r from-transparent via-amber to-transparent" />

        <div className="relative max-w-4xl mx-auto px-6 py-16 sm:py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber/15 flex items-center justify-center mx-auto mb-6 border border-amber/20">
            <ClipboardList className="text-amber" size={30} />
          </div>
          <p className="text-amber text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase mb-4">
            Church Leadership
          </p>
          <h3
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Ready to Get Started?
          </h3>
          <p className="text-white/50 text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Complete our quick discovery checklist so we can connect your new
            website to the tools you already use. It takes about 10 minutes
            and your progress saves automatically.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/checklist"
              className="inline-flex items-center gap-2 px-8 py-4 bg-amber text-charcoal font-bold rounded-full hover:bg-amber-light transition-all hover:shadow-xl hover:shadow-amber/30 text-base"
            >
              Start the Checklist
              <span className="text-lg">&rarr;</span>
            </a>
            <span className="text-white/30 text-sm">
              No account needed. No password required.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
