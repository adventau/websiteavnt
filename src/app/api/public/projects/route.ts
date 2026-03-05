// src/app/api/public/projects/route.ts
import { NextResponse } from "next/server";
import { getPublicProjects } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getPublicProjects();
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}
