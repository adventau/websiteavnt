import { ensureAdminResponse } from "@/lib/auth/route-guard";
import { getRobloxProjectAutofillByPlaceId } from "@/lib/roblox";
import { fail, ok } from "@/lib/utils/http";

export async function GET(req: Request) {
  const denied = await ensureAdminResponse();
  if (denied) return denied;

  const { searchParams } = new URL(req.url);
  const placeId = (searchParams.get("placeId") ?? "").trim();

  if (!/^[0-9]+$/.test(placeId)) {
    return fail("Invalid placeId", 422);
  }

  const data = await getRobloxProjectAutofillByPlaceId(placeId);
  if (!data) {
    return fail("Could not fetch Roblox metadata for this place id", 404);
  }

  return ok(data);
}
