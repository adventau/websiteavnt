import { NextResponse } from "next/server";
import { getPublicCredibility } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getPublicCredibility();
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
