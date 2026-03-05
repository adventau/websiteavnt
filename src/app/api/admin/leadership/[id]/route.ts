import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isAdminResponse } from "@/lib/admin-guard";
import { LeadershipMemberSchema } from "@/lib/schemas";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin();
  if (isAdminResponse(guard)) return guard;
  const { id } = await params;
  const body = await req.json();
  const parsed = LeadershipMemberSchema.partial().safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 422 });
  const data = await prisma.leadershipMember.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ data });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin();
  if (isAdminResponse(guard)) return guard;
  const { id } = await params;
  await prisma.leadershipMember.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
