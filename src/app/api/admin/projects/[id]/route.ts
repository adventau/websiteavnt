import { projectSchema } from "@/lib/schemas/project";
import { prisma } from "@/lib/prisma";
import { ensureAdminResponse } from "@/lib/auth/route-guard";
import { getRobloxProjectAutofillByPlaceId, getRobloxThumbnailByPlaceId, robloxGameUrlFromPlaceId } from "@/lib/roblox";
import { fail, ok } from "@/lib/utils/http";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const denied = await ensureAdminResponse();
  if (denied) return denied;

  const { id } = await context.params;
  const payload = projectSchema.partial().safeParse(await req.json());
  if (!payload.success) {
    return fail(payload.error.message, 422);
  }

  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) {
    return fail("Project not found", 404);
  }

  const data = { ...payload.data };
  const placeId = data.robloxPlaceId ?? existing.robloxPlaceId;
  if (placeId) {
    const auto = await getRobloxProjectAutofillByPlaceId(placeId);
    if (auto?.title && (data.robloxPlaceId || !existing.title)) {
      data.title = auto.title;
    }
    if (auto?.description && (data.robloxPlaceId || !existing.description)) {
      data.description = auto.description;
    }
    if ((data.robloxLink ?? existing.robloxLink) == null) {
      data.robloxLink = auto?.robloxLink ?? robloxGameUrlFromPlaceId(placeId);
    }
    if ((data.thumbnailUrl ?? existing.thumbnailUrl) == null) {
      data.thumbnailUrl = auto?.thumbnailUrl ?? (await getRobloxThumbnailByPlaceId(placeId));
    }
  }

  const updated = await prisma.project.update({
    where: { id },
    data
  });

  return ok(updated);
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  const denied = await ensureAdminResponse();
  if (denied) return denied;

  const { id } = await context.params;
  await prisma.project.delete({ where: { id } });
  return ok({ deleted: true });
}
