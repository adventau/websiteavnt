// src/app/api/admin/metrics/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isAdminResponse } from "@/lib/admin-guard";
import { MetricSchema } from "@/lib/schemas";

export async function GET(req: NextRequest) {
  const guard = await requireAdmin();
  if (isAdminResponse(guard)) return guard;

  const metrics = await prisma.metric.findMany({
    orderBy: [{ sortOrder: "asc" }],
  });
  return NextResponse.json({ data: metrics });
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (isAdminResponse(guard)) return guard;

  const body = await req.json();
  const parsed = MetricSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 422 }
    );
  }

  const metric = await prisma.metric.create({ data: parsed.data });
  return NextResponse.json({ data: metric }, { status: 201 });
}
