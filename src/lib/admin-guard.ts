// src/lib/admin-guard.ts
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function requireAdmin(): Promise<
  { userId: string } | NextResponse
> {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  // Check email from session claims
  const emailFromClaims = (sessionClaims?.email as string) ?? "";
  if (adminEmails.includes(emailFromClaims)) {
    return { userId };
  }

  // Check DB role
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: { role: true },
  });

  if (user?.role === "ADMIN") {
    return { userId };
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export function isAdminResponse(
  result: { userId: string } | NextResponse
): result is NextResponse {
  return result instanceof NextResponse;
}
