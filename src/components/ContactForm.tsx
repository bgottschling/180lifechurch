"use client";

import { useState, FormEvent } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

interface ContactFormProps {
  /**
   * @deprecated Kept for backwards-compat with existing callers. The form
   * now posts to /api/contact (which forwards to Planning Center People
   * with a Formspree email fallback). This prop is no longer used.
   */
  formId?: string;
  heading?: string;
  description?: string;
}

export function ContactForm({
  heading = "Send Us a Message",
  description,
}: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = e.currentTarget;
    const data = new FormData(form);

    // Build a clean JSON payload — POST /api/contact validates this
    // shape server-side before calling Planning Center.
    const payload = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      phone: String(data.get("phone") || ""),
      subject: String(data.get("subject") || "general"),
      message: String(data.get("message") || ""),
      // Honeypot — must remain empty. Real users never see this field.
      _company: String(data.get("_company") || ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (res.ok && body.ok) {
        setSubmitted(true);
        form.reset();
      } else {
        setError(
          body.error ||
            "Something went wrong sending your message. Please try again or email info@180lifechurch.org directly."
        );
      }
    } catch {
      setError(
        "Could not reach the server. Please check your connection and try again, or email info@180lifechurch.org directly."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border border-charcoal/8 p-10 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="text-green-600" size={32} />
        </div>
        <h3 className="text-xl font-bold text-charcoal mb-2">Message Sent!</h3>
        <p className="text-charcoal/60">
          Thank you for reaching out. We&apos;ll get back to you soon.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-6 text-amber hover:text-amber-light text-sm font-medium transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-charcoal/8 p-8">
      {heading && (
        <h3
          className="text-2xl font-bold text-charcoal mb-2"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {heading}
        </h3>
      )}
      {description && (
        <p className="text-charcoal/60 mb-6">{description}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Honeypot — hidden from humans, autofilled by bots. The
            server-side route rejects submissions where this is
            non-empty. tabIndex=-1 + aria-hidden so assistive tech
            ignores it. Positioned offscreen rather than display:none
            because some bots skip display:none inputs. */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "-9999px",
            width: "1px",
            height: "1px",
            overflow: "hidden",
          }}
        >
          <label htmlFor="_company">Company (do not fill in)</label>
          <input
            id="_company"
            name="_company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-charcoal mb-1.5">
              Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-charcoal/15 bg-soft-white text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-amber/50 focus:border-amber transition-all"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-1.5">
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-charcoal/15 bg-soft-white text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-amber/50 focus:border-amber transition-all"
              placeholder="you@email.com"
            />
          </div>
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-charcoal mb-1.5">
            Phone (optional)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="w-full px-4 py-3 rounded-xl border border-charcoal/15 bg-soft-white text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-amber/50 focus:border-amber transition-all"
            placeholder="(860) 555-1234"
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-charcoal mb-1.5">
            Subject
          </label>
          <select
            id="subject"
            name="subject"
            className="w-full px-4 py-3 rounded-xl border border-charcoal/15 bg-soft-white text-charcoal focus:outline-none focus:ring-2 focus:ring-amber/50 focus:border-amber transition-all"
          >
            <option value="general">General Inquiry</option>
            <option value="visit">Planning a Visit</option>
            <option value="prayer">Prayer Request</option>
            <option value="volunteer">I Want to Serve</option>
            <option value="groups">Life Groups</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-charcoal mb-1.5">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="w-full px-4 py-3 rounded-xl border border-charcoal/15 bg-soft-white text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-amber/50 focus:border-amber transition-all resize-none"
            placeholder="How can we help?"
          />
        </div>
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm"
          >
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber text-charcoal font-semibold rounded-full hover:bg-amber-light transition-all hover:shadow-lg hover:shadow-amber/25 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Sending..." : "Send Message"}
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
