// src/app/api/admin/projects/lookup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, isAdminResponse } from "@/lib/admin-guard";
import { autofillFromPlaceId } from "@/lib/roblox";

export async function GET(req: NextRequest) {
  const guard = await requireAdmin();
  if (isAdminResponse(guard)) return guard;

  const placeId = req.nextUrl.searchParams.get("placeId");
  if (!placeId) {
    return NextResponse.json({ error: "placeId required" }, { status: 400 });
  }

  const data = await autofillFromPlaceId(placeId);
  if (!data) {
    return NextResponse.json({ error: "Could not fetch Roblox data" }, { status: 404 });
  }

  return NextResponse.json({ data });
}
