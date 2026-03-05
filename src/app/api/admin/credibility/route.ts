import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isAdminResponse } from "@/lib/admin-guard";
import { CredibilityItemSchema } from "@/lib/schemas";

export async function GET(req: NextRequest) {
  const guard = await requireAdmin();
  if (isAdminResponse(guard)) return guard;
  const data = await prisma.credibilityItem.findMany({ orderBy: [{ sortOrder: "asc" }] });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (isAdminResponse(guard)) return guard;
  const body = await req.json();
  const parsed = CredibilityItemSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 422 });
  const data = await prisma.credibilityItem.create({ data: parsed.data });
  return NextResponse.json({ data }, { status: 201 });
}
