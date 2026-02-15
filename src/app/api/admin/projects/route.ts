import { projectSchema } from "@/lib/schemas/project";
import { ProjectStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ensureAdminResponse } from "@/lib/auth/route-guard";
import { getRobloxProjectAutofillByPlaceId, getRobloxThumbnailByPlaceId, robloxGameUrlFromPlaceId } from "@/lib/roblox";
import { fail, ok } from "@/lib/utils/http";

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asOptionalString(value: unknown) {
  const text = asString(value);
  return text.length > 0 ? text : null;
}

function asNumber(value: unknown, fallback: number) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function asBoolean(value: unknown, fallback: boolean) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value === "true";
  return fallback;
}

function normalizeStatus(value: unknown): ProjectStatus {
  const raw = asString(value).toUpperCase();
  if (raw === "ACTIVE" || raw === "SCALING" || raw === "PAUSED") return raw as ProjectStatus;
  return "ACTIVE";
}

export async function GET() {
  const denied = await ensureAdminResponse();
  if (denied) return denied;

  const data = await prisma.project.findMany({ orderBy: { sortOrder: "asc" } });
  return ok(data);
}

export async function POST(req: Request) {
  const denied = await ensureAdminResponse();
  if (denied) return denied;

  const raw = (await req.json()) as Record<string, unknown>;
  const placeId = asOptionalString(raw.robloxPlaceId);
  const auto = placeId ? await getRobloxProjectAutofillByPlaceId(placeId) : null;

  const normalized = {
    title: asString(raw.title) || auto?.title || (placeId ? `Roblox Game ${placeId}` : "Untitled Game"),
    thumbnailUrl: asOptionalString(raw.thumbnailUrl) ?? auto?.thumbnailUrl ?? null,
    description: asString(raw.description) || auto?.description || "Portfolio game item. Update this description in admin.",
    status: normalizeStatus(raw.status),
    category: asString(raw.category) || "General",
    robloxLink: asOptionalString(raw.robloxLink) ?? (placeId ? auto?.robloxLink ?? robloxGameUrlFromPlaceId(placeId) : null),
    robloxPlaceId: placeId,
    visits: asNumber(raw.visits, 0),
    favorites: asNumber(raw.favorites, 0),
    featured: asBoolean(raw.featured, false),
    visible: asBoolean(raw.visible, true),
    sortOrder: asNumber(raw.sortOrder, 0)
  };

  if (placeId && !normalized.thumbnailUrl) {
    normalized.thumbnailUrl = await getRobloxThumbnailByPlaceId(placeId);
  }

  const payload = projectSchema.safeParse(normalized);
  if (!payload.success) {
    return fail(payload.error.errors[0]?.message ?? payload.error.message, 422);
  }

  const created = await prisma.project.create({ data: payload.data });
  return ok(created);
}
