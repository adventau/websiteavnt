// src/app/admin/games/page.tsx
"use client";

import { useEffect, useState } from "react";
import CrudTable, { FieldDef } from "@/components/admin/CrudTable";

const fields: FieldDef[] = [
  { key: "title", label: "Title", type: "text" },
  { key: "robloxPlaceId", label: "Place ID", type: "text" },
  { key: "category", label: "Category", type: "text" },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "ACTIVE", label: "Active" },
      { value: "SCALING", label: "Scaling" },
      { value: "PAUSED", label: "Paused" },
    ],
  },
  { key: "description", label: "Description", type: "textarea" },
  { key: "thumbnailUrl", label: "Thumbnail", type: "image" },
  { key: "robloxLink", label: "Roblox Link", type: "url" },
  { key: "featured", label: "Featured", type: "boolean" },
  { key: "visible", label: "Visible", type: "boolean" },
  { key: "sortOrder", label: "Order", type: "number" },
];

export default function GamesPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [autofillingId, setAutofillingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects");
      const json = await res.json();
      setProjects(json.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const autofill = async (placeId: string, rowId: string) => {
    if (!placeId) return;
    setAutofillingId(rowId);
    try {
      const res = await fetch(`/api/admin/projects/lookup?placeId=${placeId}`);
      if (!res.ok) return;
      const { data } = await res.json();
      // Patch the row
      await fetch(`/api/admin/projects/${rowId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      load();
    } finally {
      setAutofillingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-3xl text-avnt-text mb-1">Games</h1>
          <p className="text-avnt-muted text-sm">Manage your Roblox game portfolio.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-avnt-muted">Loading…</div>
      ) : (
        <CrudTable
          rows={projects}
          fields={fields}
          resourcePath="/api/admin/projects"
          onRefresh={load}
          extraActions={(row) =>
            row.robloxPlaceId ? (
              <button
                onClick={() => autofill(row.robloxPlaceId, row.id)}
                disabled={autofillingId === row.id}
                className="text-xs text-avnt-purple-light hover:text-white px-2 py-1.5 border border-avnt-purple/20 rounded transition-colors"
              >
                {autofillingId === row.id ? "Fetching…" : "↺ Autofill"}
              </button>
            ) : null
          }
        />
      )}
    </div>
  );
}
