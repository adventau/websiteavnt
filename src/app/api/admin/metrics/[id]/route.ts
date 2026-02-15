import { metricSchema } from "@/lib/schemas/common";
import { isAutoRobloxMetricKey } from "@/lib/metrics";
import { prisma } from "@/lib/prisma";
import { ensureAdminResponse } from "@/lib/auth/route-guard";
import { fail, ok } from "@/lib/utils/http";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const denied = await ensureAdminResponse();
  if (denied) return denied;

  const { id } = await context.params;
  const existing = await prisma.metric.findUnique({ where: { id } });
  if (!existing) {
    return fail("Metric not found", 404);
  }

  const payload = metricSchema.partial().safeParse(await req.json());
  if (!payload.success) return fail(payload.error.message, 422);

  if (isAutoRobloxMetricKey(existing.key)) {
    const forbidden = ["label", "value", "key", "trend"].some((field) => field in payload.data);
    if (forbidden) {
      return fail("Auto Roblox metrics are read-only. Use Sync Roblox to update them.", 403);
    }
  }

  return ok(await prisma.metric.update({ where: { id }, data: payload.data }));
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  const denied = await ensureAdminResponse();
  if (denied) return denied;

  const { id } = await context.params;
  const existing = await prisma.metric.findUnique({ where: { id } });
  if (!existing) {
    return fail("Metric not found", 404);
  }
  if (isAutoRobloxMetricKey(existing.key)) {
    return fail("Auto Roblox metrics cannot be deleted.", 403);
  }
  await prisma.metric.delete({ where: { id } });
  return ok({ deleted: true });
}
