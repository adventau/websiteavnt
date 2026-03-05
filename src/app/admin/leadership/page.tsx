// src/app/admin/leadership/page.tsx
"use client";

import { useEffect, useState } from "react";
import CrudTable, { FieldDef } from "@/components/admin/CrudTable";

const fields: FieldDef[] = [
  { key: "name", label: "Name", type: "text" },
  { key: "role", label: "Role", type: "text" },
  { key: "bio", label: "Bio", type: "textarea" },
  { key: "avatarUrl", label: "Avatar", type: "image" },
  { key: "visible", label: "Visible", type: "boolean" },
  { key: "sortOrder", label: "Order", type: "number" },
];

export default function LeadershipPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/leadership");
      const json = await res.json();
      setRows(json.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h1 className="font-display font-bold text-3xl text-avnt-text mb-2">Team Members</h1>
      <p className="text-avnt-muted text-sm mb-6">Leadership members shown on the homepage.</p>
      {loading ? <div className="text-avnt-muted">Loading…</div> : (
        <CrudTable rows={rows} fields={fields} resourcePath="/api/admin/leadership" onRefresh={load} />
      )}
    </div>
  );
}
