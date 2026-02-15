import { operatingSignalSchema } from "@/lib/schemas/common";
import { prisma } from "@/lib/prisma";
import { ensureAdminResponse } from "@/lib/auth/route-guard";
import { fail, ok } from "@/lib/utils/http";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const denied = await ensureAdminResponse();
  if (denied) return denied;

  const { id } = await context.params;
  const payload = operatingSignalSchema.partial().safeParse(await req.json());
  if (!payload.success) return fail(payload.error.message, 422);

  return ok(await prisma.operatingSignal.update({ where: { id }, data: payload.data }));
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  const denied = await ensureAdminResponse();
  if (denied) return denied;

  const { id } = await context.params;
  await prisma.operatingSignal.delete({ where: { id } });
  return ok({ deleted: true });
}
