import { MapPin, Phone, Mail, Clock } from "lucide-react";

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
  { label: "Small Groups", href: "#groups" },
  { label: "Volunteer", href: "#volunteer" },
  { label: "Prayer Request", href: "#prayer" },
];

export function Footer() {
  return (
    <footer id="contact" className="bg-charcoal border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Church info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-amber flex items-center justify-center text-charcoal font-bold text-lg">
                180
              </div>
              <div>
                <span className="text-white font-semibold text-lg">
                  180 Life
                </span>
                <span className="text-amber ml-1 font-light">Church</span>
              </div>
            </div>
            <p className="text-white/50 leading-relaxed mb-6">
              A warm, welcoming community where every life can experience a
              180-degree transformation.
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
                  Bloomfield, CT
                  <br />
                  <span className="text-white/30 text-xs">
                    (Full address coming soon)
                  </span>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="text-amber shrink-0" size={16} />
                <span className="text-white/50 text-sm">
                  Sundays at 10:00 AM
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-amber shrink-0" size={16} />
                <span className="text-white/50 text-sm">
                  (Coming soon)
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
            <a href="#privacy" className="text-white/30 hover:text-white/50 text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="text-white/30 hover:text-white/50 text-sm transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
