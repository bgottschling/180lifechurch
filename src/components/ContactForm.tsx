"use client";

import { useState, FormEvent } from "react";
import { Send, CheckCircle } from "lucide-react";

interface ContactFormProps {
  formId?: string;
  heading?: string;
  description?: string;
}

export function ContactForm({
  formId = "xpqynyda",
  heading = "Send Us a Message",
  description,
}: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const data = new FormData(form);

    const res = await fetch(`https://formspree.io/f/${formId}`, {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    });

    setSubmitting(false);
    if (res.ok) {
      setSubmitted(true);
      form.reset();
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
