import { NextResponse } from "next/server";
import { scryptSync } from "node:crypto";

export async function POST(request: Request) {
  const { password } = await request.json();
  const storedHash = process.env.PREVIEW_PASSWORD_HASH;

  if (!storedHash) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const [salt, hash] = storedHash.split(":");
  const inputHash = scryptSync(password, salt, 64).toString("hex");

  if (inputHash === hash) {
    const response = NextResponse.json({ success: true });
    response.cookies.set("preview_auth", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
    return response;
  }

  return NextResponse.json({ error: "Invalid password" }, { status: 401 });
}
