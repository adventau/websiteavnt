import { NextResponse } from "next/server";
import { getPublicLeadership } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getPublicLeadership();
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
