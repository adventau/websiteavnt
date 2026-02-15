import { reorderByIds } from "@/lib/data/admin";
import { ensureAdminResponse } from "@/lib/auth/route-guard";
import { reorderSchema } from "@/lib/schemas/common";
import { fail, ok } from "@/lib/utils/http";

export async function POST(req: Request) {
  const denied = await ensureAdminResponse();
  if (denied) return denied;

  const payload = reorderSchema.safeParse(await req.json());
  if (!payload.success) return fail(payload.error.message, 422);

  await reorderByIds("credibilityItem", payload.data.ids);
  return ok({ reordered: true });
}
