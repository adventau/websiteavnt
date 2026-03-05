// src/app/api/public/metrics/route.ts
import { NextResponse } from "next/server";
import { getPublicMetrics } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getPublicMetrics();
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 });
  }
}
