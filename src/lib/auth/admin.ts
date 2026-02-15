import { auth, currentUser } from "@clerk/nextjs/server";
import { parseAdminEmails } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export async function getCurrentUserRole() {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: { role: true }
  });

  return user?.role ?? null;
}

export async function requireAdmin() {
  const session = await auth();

  if (!session.userId) {
    return { ok: false as const, reason: "Unauthorized" };
  }

  const role = await getCurrentUserRole();
  if (role === "ADMIN") {
    return { ok: true as const };
  }

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress?.toLowerCase();
  if (email && parseAdminEmails().includes(email)) {
    return { ok: true as const };
  }

  return { ok: false as const, reason: "Forbidden" };
}
