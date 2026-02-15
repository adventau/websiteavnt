import { ensureAdminResponse } from "@/lib/auth/route-guard";
import { getSiteSettings } from "@/lib/data/site-settings";
import { prisma } from "@/lib/prisma";
import { siteSettingsSchema } from "@/lib/schemas/site-settings";
import { fail, ok } from "@/lib/utils/http";

export async function GET() {
  const denied = await ensureAdminResponse();
  if (denied) return denied;

  return ok(await getSiteSettings());
}

export async function PUT(req: Request) {
  const denied = await ensureAdminResponse();
  if (denied) return denied;

  const payload = siteSettingsSchema.safeParse(await req.json());
  if (!payload.success) {
    return fail(payload.error.message, 422);
  }

  const updated = await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: { id: 1, ...payload.data },
    update: payload.data
  });

  return ok(updated);
}
