import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";

export async function GET() {
  // Read the logo file and encode as base64 data URL
  const logoPath = join(process.cwd(), "public", "images", "logo-white.png");
  const logoData = await readFile(logoPath);
  const logoBase64 = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1A1A1A 0%, #201C16 50%, #1A1A1A 100%)",
          position: "relative",
        }}
      >
        {/* Subtle amber glow */}
        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(212, 160, 84, 0.15) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Logo */}
        <img
          src={logoBase64}
          width={220}
          height={220}
          style={{ marginBottom: "32px" }}
        />

        {/* Tagline */}
        <p
          style={{
            color: "#D4A054",
            fontSize: "20px",
            letterSpacing: "6px",
            textTransform: "uppercase",
            marginBottom: "12px",
            fontFamily: "sans-serif",
          }}
        >
          Bloomfield, CT
        </p>

        {/* Main heading */}
        <h1
          style={{
            color: "white",
            fontSize: "48px",
            fontWeight: 700,
            textAlign: "center",
            lineHeight: 1.2,
            margin: 0,
            fontFamily: "serif",
          }}
        >
          Jesus Changes Everything
        </h1>

        {/* Subtitle */}
        <p
          style={{
            color: "rgba(255, 255, 255, 0.5)",
            fontSize: "22px",
            marginTop: "16px",
            fontFamily: "sans-serif",
          }}
        >
          Sundays at 9:00 AM &amp; 11:00 AM
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
