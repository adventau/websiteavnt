import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isAdminResponse } from "@/lib/admin-guard";
import { NetworkLinkSchema } from "@/lib/schemas";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin();
  if (isAdminResponse(guard)) return guard;
  const { id } = await params;
  const body = await req.json();
  const parsed = NetworkLinkSchema.partial().safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 422 });
  const data = await prisma.networkLink.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ data });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin();
  if (isAdminResponse(guard)) return guard;
  const { id } = await params;
  await prisma.networkLink.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
