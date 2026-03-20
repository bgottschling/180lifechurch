"use client";

import { useState, useCallback } from "react";
import { pdf } from "@react-pdf/renderer";
import {
  FileDown,
  Send,
  RotateCcw,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { ChecklistPDF } from "./ChecklistPDF";
import { formatChecklistForEmail } from "@/lib/checklist-data";

// Formspree form endpoint - create a form in your Formspree project dashboard
// to get the hash ID (e.g., "xwpkgvzo"), then set NEXT_PUBLIC_FORMSPREE_ID
const FORMSPREE_ID =
  process.env.NEXT_PUBLIC_FORMSPREE_ID || "xpqynyda";
const FORMSPREE_ENDPOINT = `https://formspree.io/f/${FORMSPREE_ID}`;

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
  const [pdfLoading, setPdfLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleDownloadPDF = useCallback(async () => {
    setPdfLoading(true);
    try {
      const blob = await pdf(
        <ChecklistPDF values={values} progress={progress} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `180-Life-Church-Discovery-Checklist.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setPdfLoading(false);
    }
  }, [values, progress]);

  const handleSubmitOnline = useCallback(async () => {
    setSubmitLoading(true);
    setSubmitError("");
    try {
      const formattedText = formatChecklistForEmail(values);
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: "180 Life Church - Discovery Checklist Submission",
          checklist: formattedText,
          completedItems: `${progress.completed} of ${progress.total}`,
          submittedAt: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        setSubmitSuccess(true);
      } else {
        setSubmitError("Submission failed. Please download the PDF instead.");
      }
    } catch {
      setSubmitError(
        "Could not connect. Please download the PDF and email it."
      );
    } finally {
      setSubmitLoading(false);
    }
  }, [values, progress]);

  function handleReset() {
    if (showConfirmReset) {
      onReset();
      setShowConfirmReset(false);
      setSubmitSuccess(false);
    } else {
      setShowConfirmReset(true);
      setTimeout(() => setShowConfirmReset(false), 3000);
    }
  }

  const allDone = progress.completed === progress.total;

  return (
    <div className="border-t border-charcoal/10 pt-12 pb-8">
      <div className="text-center mb-8">
        <p className="text-amber text-sm font-medium tracking-[0.2em] uppercase mb-3">
          {allDone ? "All Done!" : "Ready to Submit?"}
        </p>
        <h2
          className="text-3xl font-bold text-charcoal mb-3"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {allDone ? "Your Checklist is Complete" : "Send Us What You Have"}
        </h2>
        <p className="text-charcoal/50 max-w-lg mx-auto">
          {allDone
            ? "Thanks for completing the checklist! Download the PDF and email it to us, or submit it directly online."
            : "Don't worry if you haven't filled everything out. Send what you have and we can work through the rest together."}
        </p>
      </div>

      {/* Success state */}
      {submitSuccess && (
        <div className="max-w-md mx-auto mb-8 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
          <Check size={24} className="text-green-600 mx-auto mb-2" />
          <p className="text-green-800 font-semibold text-sm">
            Submitted successfully!
          </p>
          <p className="text-green-600 text-xs mt-1">
            Brandon will receive your responses and follow up with you soon.
          </p>
        </div>
      )}

      {/* Error state */}
      {submitError && (
        <div className="max-w-md mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
          <AlertCircle size={20} className="text-red-500 mx-auto mb-2" />
          <p className="text-red-700 text-sm">{submitError}</p>
        </div>
      )}

      {/* Action cards */}
      <div className="max-w-xl mx-auto grid sm:grid-cols-2 gap-4 mb-8">
        {/* Download PDF card */}
        <button
          onClick={handleDownloadPDF}
          disabled={pdfLoading}
          className="group relative p-6 bg-white border-2 border-amber/30 rounded-2xl hover:border-amber hover:shadow-lg hover:shadow-amber/10 transition-all text-left disabled:opacity-60"
        >
          <div className="w-12 h-12 rounded-xl bg-amber/10 flex items-center justify-center mb-4 group-hover:bg-amber/20 transition-colors">
            {pdfLoading ? (
              <Loader2 size={22} className="text-amber animate-spin" />
            ) : (
              <FileDown size={22} className="text-amber" />
            )}
          </div>
          <p className="font-bold text-charcoal mb-1">
            {pdfLoading ? "Generating PDF..." : "Download PDF"}
          </p>
          <p className="text-charcoal/50 text-sm leading-relaxed">
            Get a polished PDF with all your responses. Email it to{" "}
            <span className="text-amber font-medium">
              bgottschling@gmail.com
            </span>
          </p>
          <span className="absolute top-4 right-4 text-xs font-medium text-amber bg-amber/10 px-2 py-1 rounded-full">
            Recommended
          </span>
        </button>

        {/* Submit online card */}
        <button
          onClick={handleSubmitOnline}
          disabled={submitLoading || submitSuccess}
          className="group relative p-6 bg-white border-2 border-charcoal/10 rounded-2xl hover:border-charcoal/30 hover:shadow-lg transition-all text-left disabled:opacity-60"
        >
          <div className="w-12 h-12 rounded-xl bg-charcoal/5 flex items-center justify-center mb-4 group-hover:bg-charcoal/10 transition-colors">
            {submitLoading ? (
              <Loader2 size={22} className="text-charcoal/60 animate-spin" />
            ) : submitSuccess ? (
              <Check size={22} className="text-green-600" />
            ) : (
              <Send size={22} className="text-charcoal/60" />
            )}
          </div>
          <p className="font-bold text-charcoal mb-1">
            {submitLoading
              ? "Submitting..."
              : submitSuccess
                ? "Submitted!"
                : "Submit Online"}
          </p>
          <p className="text-charcoal/50 text-sm leading-relaxed">
            {submitSuccess
              ? "Your responses have been sent. Brandon will be in touch."
              : "Send your responses directly to Brandon with one click. No email needed."}
          </p>
        </button>
      </div>

      {/* Reset */}
      <div className="text-center">
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
