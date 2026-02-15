import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";

export async function guardAdminPage() {
  const admin = await requireAdmin();

  if (!admin.ok) {
    redirect("/");
  }
}
