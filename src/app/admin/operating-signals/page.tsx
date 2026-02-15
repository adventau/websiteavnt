import { prisma } from "@/lib/prisma";
import { AdminCrudTable } from "@/components/admin/admin-crud";

export default async function AdminOperatingSignalsPage() {
  const rows = await prisma.operatingSignal.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <AdminCrudTable
      title="Operating Signals"
      subtitle="Create, edit, and reorder items using the sort order field."
      endpoint="/api/admin/operating-signals"
      fields={[
        { key: "title", label: "value", widthClassName: "min-w-[220px]" },
        { key: "subtitle", label: "label", widthClassName: "min-w-[220px]" },
        { key: "description", label: "note", type: "textarea", widthClassName: "min-w-[320px]" },
        { key: "visible", label: "visible", type: "boolean", widthClassName: "min-w-[120px]" },
        { key: "sortOrder", label: "sort_order", type: "number", widthClassName: "min-w-[140px]" }
      ]}
      initialRows={rows}
    />
  );
}
