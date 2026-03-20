"use client";

import { useState } from "react";
import { Mail, Copy, RotateCcw, Check } from "lucide-react";
import { formatChecklistForEmail } from "@/lib/checklist-data";

interface ChecklistSummaryProps {
  values: Record<string, string | boolean | string[]>;
  progress: { total: number; completed: number };
  onReset: () => void;
}

export function ChecklistSummary({
  values,
  progress,
  onReset,
}: ChecklistSummaryProps) {
  const [copied, setCopied] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const formattedText = formatChecklistForEmail(values);

  const mailtoHref = `mailto:bgottschling@gmail.com,info@180lifechurch.org?subject=${encodeURIComponent(
    "180 Life Church - Discovery Checklist"
  )}&body=${encodeURIComponent(formattedText)}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(formattedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback: select a textarea
    }
  }

  function handleReset() {
    if (showConfirmReset) {
      onReset();
      setShowConfirmReset(false);
    } else {
      setShowConfirmReset(true);
      setTimeout(() => setShowConfirmReset(false), 3000);
    }
  }

  return (
    <div className="border-t border-charcoal/10 pt-12 pb-8">
      <div className="text-center mb-8">
        <p className="text-amber text-sm font-medium tracking-[0.2em] uppercase mb-3">
          {progress.completed === progress.total
            ? "All Done!"
            : "Ready to Submit?"}
        </p>
        <h2
          className="text-3xl font-bold text-charcoal mb-3"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {progress.completed === progress.total
            ? "Your Checklist is Complete"
            : "Send Us What You Have"}
        </h2>
        <p className="text-charcoal/50 max-w-lg mx-auto">
          {progress.completed === progress.total
            ? "Thanks for completing the checklist! Send it over and we'll get started."
            : "Don't worry if you haven't filled everything out. Send what you have and we can work through the rest together."}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {/* Email button */}
        <a
          href={mailtoHref}
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber text-charcoal font-semibold rounded-full hover:bg-amber-light transition-all hover:shadow-lg hover:shadow-amber/20 text-sm"
        >
          <Mail size={18} />
          Email Your Responses
        </a>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-6 py-3 border border-charcoal/15 text-charcoal font-semibold rounded-full hover:bg-charcoal/5 transition-all text-sm"
        >
          {copied ? (
            <>
              <Check size={18} className="text-green-600" />
              Copied!
            </>
          ) : (
            <>
              <Copy size={18} />
              Copy to Clipboard
            </>
          )}
        </button>

        {/* Reset button */}
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 px-6 py-3 text-charcoal/40 font-medium rounded-full hover:text-red-500 hover:bg-red-50 transition-all text-sm"
        >
          <RotateCcw size={16} />
          {showConfirmReset ? "Click again to confirm" : "Start Over"}
        </button>
      </div>
    </div>
  );
}
