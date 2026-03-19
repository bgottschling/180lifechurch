"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        const from = searchParams.get("from") || "/";
        router.push(from);
        router.refresh();
      } else {
        setError("Incorrect password");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <Image
          src="/images/logo.png"
          alt="180 Life Church"
          width={80}
          height={80}
          className="brightness-0 invert mx-auto mb-8"
          priority
        />

        <p className="text-amber text-xs font-medium tracking-[0.2em] uppercase mb-2">
          Preview
        </p>
        <h1
          className="text-2xl font-bold text-white mb-8"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Website Preview
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full px-4 py-3 bg-charcoal-light border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-amber/50 transition-colors"
            autoFocus
          />

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full px-4 py-3 bg-amber text-charcoal font-semibold rounded-xl hover:bg-amber-light transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Enter Preview"}
          </button>
        </form>

        <p className="text-white/20 text-xs mt-8">
          This is a preview of the upcoming 180 Life Church website.
        </p>
      </div>
    </div>
  );
}
