// src/app/api/admin/metrics/reorder/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isAdminResponse } from "@/lib/admin-guard";
import { ReorderSchema } from "@/lib/schemas";

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (isAdminResponse(guard)) return guard;

  const body = await req.json();
  const parsed = ReorderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 422 });
  }

  await prisma.$transaction(
    parsed.data.ids.map((id, index) =>
      prisma.metric.update({ where: { id }, data: { sortOrder: index } })
    )
  );

  return NextResponse.json({ success: true });
}
