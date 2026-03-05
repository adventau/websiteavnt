// src/app/api/admin/uploads/sign/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, isAdminResponse } from "@/lib/admin-guard";
import { createPresignedUploadUrl, getBucketPublicUrl } from "@/lib/s3";
import { z } from "zod";

const SignSchema = z.object({
  filename: z.string().min(1),
  contentType: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (isAdminResponse(guard)) return guard;

  const body = await req.json();
  const parsed = SignSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "filename and contentType required" }, { status: 422 });
  }

  const { filename, contentType } = parsed.data;
  const ext = filename.split(".").pop() ?? "bin";
  const key = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const uploadUrl = await createPresignedUploadUrl(key, contentType);
  if (!uploadUrl) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
  }

  return NextResponse.json({
    key,
    uploadUrl,
    publicPath: getBucketPublicUrl(key),
  });
}
