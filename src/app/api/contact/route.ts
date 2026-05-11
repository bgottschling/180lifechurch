/**
 * POST /api/contact
 *
 * Receives website contact-form submissions and lands them in Planning
 * Center People as the primary system of record, with an email
 * fallback (via Formspree) so a PC outage never silently drops a lead.
 *
 * Flow:
 *   1. Validate the body. Reject malformed submissions with 400 so we
 *      don't pollute PC with junk and so spam bots get clear feedback.
 *   2. Try to find-or-create the Person in PC, attach email/phone,
 *      and (if configured) add a workflow card.
 *   3. On hard PC failure, POST to Formspree so the message still
 *      reaches info@180lifechurch.org. The fallback runs regardless of
 *      WHICH PC step failed — partial success on PC (person created
 *      but workflow card failed) is treated as success and surfaces
 *      as a soft warning in the server logs.
 *   4. Return { ok: true } to the client either way, so the form's UX
 *      doesn't reveal which path succeeded.
 *
 * Honeypot: a hidden `_company` field rejects submissions silently.
 * Bots fill every input; humans don't see the field.
 */

import { NextResponse } from "next/server";
import {
  submitContactToPC,
  splitName,
  type ContactSubmission,
} from "@/lib/planning-center";

// Subject values shown on the form. Anything else is rejected to keep
// the PC tags / workflow notes consistent.
const VALID_SUBJECTS = new Set([
  "general",
  "visit",
  "prayer",
  "volunteer",
  "groups",
  "other",
]);

// Formspree form ID for the email fallback. Already wired and proven
// from the previous integration. NEXT_PUBLIC_FORMSPREE_ID is the
// editor-overridable env; xpqynyda is the historical default.
const FORMSPREE_ID =
  process.env.NEXT_PUBLIC_FORMSPREE_ID || "xpqynyda";

interface ContactRequestBody {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  /** Honeypot — must be empty for a real submission. */
  _company?: string;
}

function isEmail(v: string): boolean {
  // Cheap RFC-ish check — full validation is the SMTP server's job.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(req: Request) {
  let body: ContactRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  // Honeypot — silent reject. Bots get 200 so they don't retry.
  if (body._company && body._company.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  // ---------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------
  const name = (body.name || "").trim();
  const email = (body.email || "").trim().toLowerCase();
  const phone = (body.phone || "").trim();
  const subject = (body.subject || "general").trim().toLowerCase();
  const message = (body.message || "").trim();

  if (!name || name.length > 200) {
    return NextResponse.json(
      { ok: false, error: "Name is required (1–200 characters)." },
      { status: 400 }
    );
  }
  if (!isEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "A valid email address is required." },
      { status: 400 }
    );
  }
  if (!message || message.length > 5000) {
    return NextResponse.json(
      { ok: false, error: "Message is required (1–5000 characters)." },
      { status: 400 }
    );
  }
  if (!VALID_SUBJECTS.has(subject)) {
    return NextResponse.json(
      { ok: false, error: "Invalid subject." },
      { status: 400 }
    );
  }
  if (phone && phone.length > 30) {
    return NextResponse.json(
      { ok: false, error: "Phone number is too long." },
      { status: 400 }
    );
  }

  const { firstName, lastName } = splitName(name);
  const submission: ContactSubmission = {
    firstName,
    lastName,
    email,
    phone: phone || undefined,
    subject,
    message,
  };

  // ---------------------------------------------------------------------
  // Primary: Planning Center
  // ---------------------------------------------------------------------
  let pcSucceeded = false;
  let pcWarnings: string[] = [];
  try {
    const result = await submitContactToPC(submission);
    pcSucceeded = true;
    pcWarnings = result.warnings;
    // Log soft warnings — partial successes — to Vercel logs so we
    // notice if e.g. the workflow card consistently fails to create.
    if (result.warnings.length > 0) {
      console.warn(
        "[contact] PC submission partially succeeded:",
        JSON.stringify({
          personId: result.personId,
          isNew: result.isNew,
          warnings: result.warnings,
        })
      );
    }
  } catch (err) {
    console.error(
      "[contact] PC submission failed, falling back to email:",
      err instanceof Error ? err.message : err
    );
  }

  // ---------------------------------------------------------------------
  // Fallback: email via Formspree
  //
  // Fires when PC errored entirely. We do NOT also fire on partial
  // success (person created, workflow card failed) — partial success
  // still lands the lead in PC, which is what we need.
  // ---------------------------------------------------------------------
  if (!pcSucceeded) {
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: `[180lifechurch.org] ${subject} — ${name}`,
          _replyto: email,
          name,
          email,
          phone: phone || "(not provided)",
          subject,
          message,
          _note:
            "This submission could not be delivered to Planning Center " +
            "and is being relayed via the email fallback. Check the " +
            "Vercel function logs for the PC error.",
          submittedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) {
        // Both paths failed — return 502 so the client shows an error
        // and the visitor can try again or reach out by phone.
        console.error(
          "[contact] Email fallback also failed:",
          res.status,
          res.statusText
        );
        return NextResponse.json(
          {
            ok: false,
            error:
              "We couldn't deliver your message. Please email info@180lifechurch.org directly.",
          },
          { status: 502 }
        );
      }
    } catch (err) {
      console.error(
        "[contact] Email fallback threw:",
        err instanceof Error ? err.message : err
      );
      return NextResponse.json(
        {
          ok: false,
          error:
            "We couldn't deliver your message. Please email info@180lifechurch.org directly.",
        },
        { status: 502 }
      );
    }
  }

  // ---------------------------------------------------------------------
  // Success response
  //
  // We intentionally don't tell the client which path succeeded — the
  // editor experience is the same either way ("Message Sent!"), and
  // exposing internal routing detail leaks information.
  // ---------------------------------------------------------------------
  return NextResponse.json({
    ok: true,
    // Useful for our own debugging in dev / staging; harmless in prod.
    via: pcSucceeded ? "planning-center" : "email-fallback",
    warnings: pcWarnings.length > 0 ? pcWarnings : undefined,
  });
}
