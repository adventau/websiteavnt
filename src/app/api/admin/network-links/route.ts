import { networkLinkSchema } from "@/lib/schemas/common";
import { prisma } from "@/lib/prisma";
import { ensureAdminResponse } from "@/lib/auth/route-guard";
import { fail, ok } from "@/lib/utils/http";

export async function GET() {
  const denied = await ensureAdminResponse();
  if (denied) return denied;

  return ok(await prisma.networkLink.findMany({ orderBy: { sortOrder: "asc" } }));
}

export async function POST(req: Request) {
  const denied = await ensureAdminResponse();
  if (denied) return denied;

  const payload = networkLinkSchema.safeParse(await req.json());
  if (!payload.success) return fail(payload.error.message, 422);

  return ok(await prisma.networkLink.create({ data: payload.data }));
}
