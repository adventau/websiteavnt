import { prisma } from "@/lib/prisma";
import { AdminCrudTable } from "@/components/admin/admin-crud";

export default async function AdminCredibilityPage() {
  const rows = await prisma.credibilityItem.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <AdminCrudTable
      title="Credibility Items"
      subtitle="Create, edit, and reorder items using the sort order field."
      endpoint="/api/admin/credibility"
      fields={[
        { key: "title", label: "title", widthClassName: "min-w-[220px]" },
        { key: "body", label: "subtitle", type: "textarea", widthClassName: "min-w-[340px]" },
        { key: "visible", label: "visible", type: "boolean", widthClassName: "min-w-[120px]" },
        { key: "sortOrder", label: "sort_order", type: "number", widthClassName: "min-w-[140px]" }
      ]}
      initialRows={rows}
    />
  );
}
