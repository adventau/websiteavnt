import { prisma } from "@/lib/prisma";
import { AdminCrudTable } from "@/components/admin/admin-crud";

export default async function AdminProjectsPage() {
  const rows = await prisma.project.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <AdminCrudTable
      title="Games"
      subtitle="Create, edit, and reorder items using the sort order field."
      endpoint="/api/admin/projects"
      fields={[
        { key: "title", label: "title", widthClassName: "min-w-[180px]" },
        { key: "robloxPlaceId", label: "place_id", widthClassName: "min-w-[150px]" },
        { key: "category", label: "genre", widthClassName: "min-w-[140px]" },
        { key: "status", label: "status", widthClassName: "min-w-[120px]" },
        { key: "featured", label: "featured", type: "boolean", widthClassName: "min-w-[120px]" },
        { key: "visible", label: "visible", type: "boolean", widthClassName: "min-w-[120px]" },
        { key: "sortOrder", label: "sort_order", type: "number", widthClassName: "min-w-[120px]" },
        { key: "description", label: "description", type: "textarea", widthClassName: "min-w-[320px]" },
        { key: "robloxLink", label: "roblox_url", type: "url", showInTable: false },
        { key: "thumbnailUrl", label: "thumbnail_path", type: "url", showInTable: false },
        { key: "visits", label: "visits", type: "number", showInTable: false },
        { key: "favorites", label: "favorites", type: "number", showInTable: false }
      ]}
      initialRows={rows}
    />
  );
}
