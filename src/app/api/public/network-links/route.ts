import { getPublicNetworkLinks } from "@/lib/data/public";
import { ok } from "@/lib/utils/http";

export async function GET() {
  const data = await getPublicNetworkLinks();
  return ok(data);
}
