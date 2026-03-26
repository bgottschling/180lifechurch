import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const secret = request.headers.get("x-revalidation-secret");

  if (!process.env.WORDPRESS_REVALIDATION_SECRET) {
    return NextResponse.json(
      { error: "Revalidation secret not configured" },
      { status: 500 }
    );
  }

  if (secret !== process.env.WORDPRESS_REVALIDATION_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  revalidateTag("wordpress", "default");

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
