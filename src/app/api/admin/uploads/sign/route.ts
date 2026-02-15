import { ensureAdminResponse } from "@/lib/auth/route-guard";
import { uploadSignSchema } from "@/lib/schemas/upload";
import { createUploadSignature } from "@/lib/storage/bucket";
import { fail, ok } from "@/lib/utils/http";

export async function POST(req: Request) {
  const denied = await ensureAdminResponse();
  if (denied) return denied;

  const payload = uploadSignSchema.safeParse(await req.json());
  if (!payload.success) {
    return fail(payload.error.message, 422);
  }

  try {
    const data = await createUploadSignature(payload.data);
    return ok(data);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Failed to sign upload", 500);
  }
}
