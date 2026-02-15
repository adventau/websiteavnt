import { requireAdmin } from "@/lib/auth/admin";
import { fail } from "@/lib/utils/http";

export async function ensureAdminResponse() {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return fail(admin.reason, admin.reason === "Unauthorized" ? 401 : 403);
  }

  return null;
}
