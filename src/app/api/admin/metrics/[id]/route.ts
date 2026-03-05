// src/app/api/admin/metrics/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isAdminResponse } from "@/lib/admin-guard";
import { MetricSchema } from "@/lib/schemas";

const LOCKED_KEYS = ["players_online", "total_visits", "total_favorites"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (isAdminResponse(guard)) return guard;

  const { id } = await params;
  const body = await req.json();

  // Check if this is a locked metric
  const existing = await prisma.metric.findUnique({ where: { id } });
  if (existing && LOCKED_KEYS.includes(existing.key)) {
    // Only allow sortOrder and visible changes on locked metrics
    const { sortOrder, visible } = body;
    const metric = await prisma.metric.update({
      where: { id },
      data: {
        ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) }),
        ...(visible !== undefined && { visible: visible === true || visible === "true" }),
      },
    });
    return NextResponse.json({ data: metric });
  }

  const parsed = MetricSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 422 }
    );
  }

  const metric = await prisma.metric.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ data: metric });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (isAdminResponse(guard)) return guard;

  const { id } = await params;
  const existing = await prisma.metric.findUnique({ where: { id } });
  if (existing && LOCKED_KEYS.includes(existing.key)) {
    return NextResponse.json({ error: "Cannot delete locked metric" }, { status: 403 });
  }

  await prisma.metric.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
