// src/app/admin/network-links/page.tsx
"use client";

import { useEffect, useState } from "react";
import CrudTable, { FieldDef } from "@/components/admin/CrudTable";

const fields: FieldDef[] = [
  { key: "label", label: "Label", type: "text" },
  { key: "url", label: "URL", type: "url" },
  { key: "description", label: "Description", type: "text" },
  { key: "visible", label: "Visible", type: "boolean" },
  { key: "sortOrder", label: "Order", type: "number" },
];

export default function NetworkLinksPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/network-links");
      const json = await res.json();
      setRows(json.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h1 className="font-display font-bold text-3xl text-avnt-text mb-2">Social Links</h1>
      <p className="text-avnt-muted text-sm mb-6">Network / social links shown in the footer and CTA section.</p>
      {loading ? <div className="text-avnt-muted">Loading…</div> : (
        <CrudTable rows={rows} fields={fields} resourcePath="/api/admin/network-links" onRefresh={load} />
      )}
    </div>
  );
}
