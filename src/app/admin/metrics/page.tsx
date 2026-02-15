import { MetricsPanel } from "@/components/admin/metrics-panel";
import { prisma } from "@/lib/prisma";

export default async function AdminMetricsPage() {
  const rows = await prisma.metric.findMany({ orderBy: { sortOrder: "asc" } });

  return <MetricsPanel initialRows={rows} />;
}
