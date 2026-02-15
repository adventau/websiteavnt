import { prisma } from "@/lib/prisma";
import { AdminCrudTable } from "@/components/admin/admin-crud";

export default async function AdminNetworkLinksPage() {
  const rows = await prisma.networkLink.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <AdminCrudTable
      title="Social Links"
      subtitle="Create, edit, and reorder items using the sort order field."
      endpoint="/api/admin/network-links"
      fields={[
        { key: "label", label: "label", widthClassName: "min-w-[180px]" },
        { key: "url", label: "url", type: "url", widthClassName: "min-w-[300px]" },
        { key: "description", label: "description", widthClassName: "min-w-[240px]" },
        { key: "visible", label: "visible", type: "boolean", widthClassName: "min-w-[120px]" },
        { key: "sortOrder", label: "sort_order", type: "number", widthClassName: "min-w-[140px]" }
      ]}
      initialRows={rows}
    />
  );
}
