// src/app/api/admin/projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isAdminResponse } from "@/lib/admin-guard";
import { ProjectSchema, ReorderSchema } from "@/lib/schemas";

export async function GET(req: NextRequest) {
  const guard = await requireAdmin();
  if (isAdminResponse(guard)) return guard;

  const projects = await prisma.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ data: projects });
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (isAdminResponse(guard)) return guard;

  const body = await req.json();
  const parsed = ProjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 422 }
    );
  }

  const project = await prisma.project.create({ data: parsed.data as any });
  return NextResponse.json({ data: project }, { status: 201 });
}
