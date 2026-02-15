"use client";

import { useMemo, useState } from "react";

const lockedKeys = new Set(["players_online", "total_visits", "total_favorites"]);

type MetricRow = {
  id: string;
  key: string;
  label: string;
  value: string;
  trend: string | null;
  visible: boolean;
  sortOrder: number;
};

type DraftMetric = {
  label: string;
  value: string;
  trend: string;
  visible: boolean;
  sortOrder: number;
};

const inputClass =
  "w-full min-w-[140px] rounded-xl border border-white/15 bg-black/35 px-3 py-2 text-sm text-white placeholder:text-[#8d86aa]";

export function MetricsPanel({ initialRows }: { initialRows: MetricRow[] }) {
  const [rows, setRows] = useState(initialRows);
  const [syncing, setSyncing] = useState(false);
  const [draft, setDraft] = useState<DraftMetric>({
    label: "",
    value: "",
    trend: "",
    visible: true,
    sortOrder: rows.length + 1
  });

  const ordered = useMemo(() => [...rows].sort((a, b) => a.sortOrder - b.sortOrder), [rows]);

  async function syncRoblox() {
    setSyncing(true);
    const res = await fetch("/api/admin/metrics/sync-roblox", { method: "POST" });
    setSyncing(false);

    if (!res.ok) {
      alert("Failed to sync Roblox metrics.");
      return;
    }

    const fresh = await fetch("/api/admin/metrics", { cache: "no-store" });
    const json = (await fresh.json()) as { data: MetricRow[] };
    setRows(json.data);
  }

  async function saveRow(row: MetricRow) {
    const isLocked = lockedKeys.has(row.key);
    const res = await fetch(`/api/admin/metrics/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        label: row.label,
        value: row.value,
        trend: row.trend,
        visible: row.visible,
        sortOrder: row.sortOrder,
        ...(isLocked ? {} : { key: row.key })
      })
    });

    if (!res.ok) {
      const text = await res.text();
      alert(`Save failed: ${text}`);
      return;
    }

    alert("Saved.");
  }

  async function deleteRow(id: string) {
    const res = await fetch(`/api/admin/metrics/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const text = await res.text();
      alert(`Delete failed: ${text}`);
      return;
    }
    setRows((prev) => prev.filter((row) => row.id !== id));
  }

  async function createRow() {
    const res = await fetch("/api/admin/metrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft)
    });

    if (!res.ok) {
      const text = await res.text();
      alert(`Create failed: ${text}`);
      return;
    }

    const fresh = await fetch("/api/admin/metrics", { cache: "no-store" });
    const json = (await fresh.json()) as { data: MetricRow[] };
    setRows(json.data);
    setDraft({ label: "", value: "", trend: "", visible: true, sortOrder: json.data.length + 1 });
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-5xl font-black">Metrics</h1>
          <p className="mt-2 text-lg text-muted">Roblox totals are read-only and refreshed via Sync Roblox.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={syncRoblox}
            type="button"
            className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-bold"
          >
            {syncing ? "Syncing..." : "Sync Roblox"}
          </button>
          <button
            onClick={createRow}
            className="rounded-full bg-white px-6 py-3 text-sm font-bold text-black"
            type="button"
          >
            New
          </button>
        </div>
      </div>

      <div className="card-avnt overflow-x-auto p-5">
        <table className="w-full min-w-[1100px] border-collapse text-left">
          <thead>
            <tr className="border-b border-white/10 text-sm uppercase tracking-wide text-[#9b93bb]">
              <th className="px-3 py-3">label</th>
              <th className="px-3 py-3">value</th>
              <th className="px-3 py-3">note</th>
              <th className="px-3 py-3">visible</th>
              <th className="px-3 py-3">sort_order</th>
              <th className="px-3 py-3">actions</th>
            </tr>
          </thead>
          <tbody>
            {ordered.map((row, index) => {
              const isLocked = lockedKeys.has(row.key);
              return (
                <tr key={row.id} className="border-b border-white/5">
                  <td className="px-3 py-3">
                    <input
                      className={inputClass}
                      value={row.label}
                      readOnly={isLocked}
                      onChange={(event) => {
                        const next = [...ordered];
                        next[index] = { ...row, label: event.target.value };
                        setRows(next);
                      }}
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      className={inputClass}
                      value={row.value}
                      readOnly={isLocked}
                      onChange={(event) => {
                        const next = [...ordered];
                        next[index] = { ...row, value: event.target.value };
                        setRows(next);
                      }}
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      className={inputClass}
                      value={row.trend ?? ""}
                      readOnly={isLocked}
                      onChange={(event) => {
                        const next = [...ordered];
                        next[index] = { ...row, trend: event.target.value };
                        setRows(next);
                      }}
                    />
                  </td>
                  <td className="px-3 py-3">
                    <select
                      className={inputClass}
                      value={String(row.visible)}
                      onChange={(event) => {
                        const next = [...ordered];
                        next[index] = { ...row, visible: event.target.value === "true" };
                        setRows(next);
                      }}
                    >
                      <option value="true">true</option>
                      <option value="false">false</option>
                    </select>
                  </td>
                  <td className="px-3 py-3">
                    <input
                      className={inputClass}
                      type="number"
                      value={row.sortOrder}
                      onChange={(event) => {
                        const next = [...ordered];
                        next[index] = { ...row, sortOrder: Number(event.target.value || 0) };
                        setRows(next);
                      }}
                    />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveRow(row)}
                        className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold"
                        type="button"
                      >
                        Save
                      </button>
                      {!isLocked ? (
                        <button
                          onClick={() => deleteRow(row.id)}
                          className="rounded-full border border-red-400/30 bg-red-700/20 px-4 py-2 text-sm font-bold text-red-100"
                          type="button"
                        >
                          Delete
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}

            <tr>
              <td className="px-3 py-3">
                <input
                  className={inputClass}
                  placeholder="label"
                  value={draft.label}
                  onChange={(event) => setDraft((prev) => ({ ...prev, label: event.target.value }))}
                />
              </td>
              <td className="px-3 py-3">
                <input
                  className={inputClass}
                  placeholder="value"
                  value={draft.value}
                  onChange={(event) => setDraft((prev) => ({ ...prev, value: event.target.value }))}
                />
              </td>
              <td className="px-3 py-3">
                <input
                  className={inputClass}
                  placeholder="note"
                  value={draft.trend}
                  onChange={(event) => setDraft((prev) => ({ ...prev, trend: event.target.value }))}
                />
              </td>
              <td className="px-3 py-3">
                <select
                  className={inputClass}
                  value={String(draft.visible)}
                  onChange={(event) => setDraft((prev) => ({ ...prev, visible: event.target.value === "true" }))}
                >
                  <option value="true">true</option>
                  <option value="false">false</option>
                </select>
              </td>
              <td className="px-3 py-3">
                <input
                  className={inputClass}
                  type="number"
                  value={draft.sortOrder}
                  onChange={(event) => setDraft((prev) => ({ ...prev, sortOrder: Number(event.target.value || 0) }))}
                />
              </td>
              <td className="px-3 py-3 text-sm text-muted">Create with New</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
