import { getPublicProjects } from "@/lib/data/public";
import { ok } from "@/lib/utils/http";

export async function GET() {
  const data = await getPublicProjects();
  return ok(data);
}
