import { prisma } from "@/lib/prisma";
import { AdminCrudTable } from "@/components/admin/admin-crud";

export default async function AdminLeadershipPage() {
  const rows = await prisma.leadershipMember.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <AdminCrudTable
      title="Team Members"
      subtitle="Create, edit, and reorder items using the sort order field."
      endpoint="/api/admin/leadership"
      fields={[
        { key: "name", label: "name", widthClassName: "min-w-[180px]" },
        { key: "role", label: "role", widthClassName: "min-w-[180px]" },
        { key: "bio", label: "department", widthClassName: "min-w-[260px]" },
        { key: "avatarUrl", label: "image_path", type: "image", uploadFolder: "leadership", widthClassName: "min-w-[260px]" },
        { key: "visible", label: "visible", type: "boolean", widthClassName: "min-w-[120px]" },
        { key: "sortOrder", label: "sort_order", type: "number", widthClassName: "min-w-[140px]" }
      ]}
      initialRows={rows}
    />
  );
}
