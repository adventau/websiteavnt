// src/app/api/public/assets/[...key]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getObject } from "@/lib/s3";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const { key: keyParts } = await params;
  const key = keyParts.join("/");

  if (!process.env.BUCKET_NAME) {
    return NextResponse.json({ error: "Bucket not configured" }, { status: 503 });
  }

  const obj = await getObject(key);
  if (!obj) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(obj.body, {
    headers: {
      "Content-Type": obj.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
