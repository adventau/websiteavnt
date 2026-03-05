// src/app/admin/operating-signals/page.tsx
"use client";

import { useEffect, useState } from "react";
import CrudTable, { FieldDef } from "@/components/admin/CrudTable";

const fields: FieldDef[] = [
  { key: "title", label: "Title", type: "text" },
  { key: "subtitle", label: "Subtitle", type: "text" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "visible", label: "Visible", type: "boolean" },
  { key: "sortOrder", label: "Order", type: "number" },
];

export default function OperatingSignalsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/operating-signals");
      const json = await res.json();
      setRows(json.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h1 className="font-display font-bold text-3xl text-avnt-text mb-2">Operating Signals</h1>
      <p className="text-avnt-muted text-sm mb-6">Core pillars shown on the homepage.</p>
      {loading ? <div className="text-avnt-muted">Loading…</div> : (
        <CrudTable rows={rows} fields={fields} resourcePath="/api/admin/operating-signals" onRefresh={load} />
      )}
    </div>
  );
}
