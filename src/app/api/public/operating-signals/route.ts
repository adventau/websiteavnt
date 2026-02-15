import { getPublicOperatingSignals } from "@/lib/data/public";
import { ok } from "@/lib/utils/http";

export async function GET() {
  const data = await getPublicOperatingSignals();
  return ok(data);
}
