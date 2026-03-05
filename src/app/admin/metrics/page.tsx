// src/app/admin/metrics/page.tsx
"use client";

import { useEffect, useState } from "react";
import CrudTable, { FieldDef } from "@/components/admin/CrudTable";

const LOCKED_KEYS = ["players_online", "total_visits", "total_favorites"];

const fields: FieldDef[] = [
  { key: "key", label: "Key", type: "text" },
  { key: "label", label: "Label", type: "text" },
  { key: "value", label: "Value", type: "text" },
  { key: "trend", label: "Trend", type: "text" },
  { key: "visible", label: "Visible", type: "boolean" },
  { key: "sortOrder", label: "Order", type: "number" },
];

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/metrics");
      const json = await res.json();
      setMetrics(json.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const syncRoblox = async () => {
    setSyncing(true);
    setSyncMsg(null);
    try {
      const res = await fetch("/api/admin/metrics/sync-roblox", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Sync failed");
      setSyncMsg("✓ Synced Roblox metrics");
      load();
    } catch (e: any) {
      setSyncMsg(`✗ ${e.message}`);
    } finally {
      setSyncing(false);
    }
  };

  // Mark locked fields as readOnly for locked metrics
  const enrichedRows = metrics.map((m) => ({ ...m, _locked: LOCKED_KEYS.includes(m.key) }));

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-3xl text-avnt-text mb-1">Metrics</h1>
          <p className="text-avnt-muted text-sm">
            Keys <code className="text-avnt-purple-light text-xs">players_online</code>,{" "}
            <code className="text-avnt-purple-light text-xs">total_visits</code>,{" "}
            <code className="text-avnt-purple-light text-xs">total_favorites</code> are auto-synced from Roblox.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={syncRoblox}
            disabled={syncing}
            className="px-4 py-2 bg-avnt-purple hover:bg-purple-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {syncing ? "Syncing…" : "↻ Sync Roblox"}
          </button>
          {syncMsg && <span className="text-sm text-avnt-muted">{syncMsg}</span>}
        </div>
      </div>

      {loading ? (
        <div className="text-avnt-muted">Loading…</div>
      ) : (
        <CrudTable
          rows={enrichedRows}
          fields={fields}
          resourcePath="/api/admin/metrics"
          onRefresh={load}
        />
      )}
    </div>
  );
}
