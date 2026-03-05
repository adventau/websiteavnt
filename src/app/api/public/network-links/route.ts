import { NextResponse } from "next/server";
import { getPublicNetworkLinks } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getPublicNetworkLinks();
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
