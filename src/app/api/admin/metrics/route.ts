import { metricSchema } from "@/lib/schemas/common";
import { slugifyMetricKey } from "@/lib/metrics";
import { prisma } from "@/lib/prisma";
import { ensureAdminResponse } from "@/lib/auth/route-guard";
import { fail, ok } from "@/lib/utils/http";

export async function GET() {
  const denied = await ensureAdminResponse();
  if (denied) return denied;

  return ok(await prisma.metric.findMany({ orderBy: { sortOrder: "asc" } }));
}

export async function POST(req: Request) {
  const denied = await ensureAdminResponse();
  if (denied) return denied;

  const input = (await req.json()) as Record<string, unknown>;
  const payload = metricSchema.safeParse({
    ...input,
    key: typeof input.key === "string" && input.key.trim() ? input.key : slugifyMetricKey(String(input.label ?? "metric"))
  });
  if (!payload.success) return fail(payload.error.message, 422);

  return ok(await prisma.metric.create({ data: payload.data }));
}
