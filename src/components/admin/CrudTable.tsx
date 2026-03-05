// src/components/admin/CrudTable.tsx
"use client";

import { useState, useRef } from "react";
import Image from "next/image";

export interface FieldDef {
  key: string;
  label: string;
  type: "text" | "textarea" | "url" | "boolean" | "number" | "image" | "select";
  options?: { value: string; label: string }[];
  locked?: boolean;
  readOnly?: boolean;
}

interface CrudTableProps {
  rows: Record<string, any>[];
  fields: FieldDef[];
  resourcePath: string; // e.g. "/api/admin/projects"
  onRefresh: () => void;
  extraActions?: (row: Record<string, any>) => React.ReactNode;
  title?: string;
}

export default function CrudTable({
  rows,
  fields,
  resourcePath,
  onRefresh,
  extraActions,
  title,
}: CrudTableProps) {
  const [editing, setEditing] = useState<Record<string, Record<string, any>>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [drafting, setDrafting] = useState(false);
  const [draft, setDraft] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const startEdit = (row: Record<string, any>) => {
    const init: Record<string, any> = {};
    fields.forEach((f) => (init[f.key] = row[f.key] ?? ""));
    setEditing((e) => ({ ...e, [row.id]: init }));
  };

  const cancelEdit = (id: string) => {
    setEditing((e) => {
      const next = { ...e };
      delete next[id];
      return next;
    });
  };

  const saveEdit = async (id: string) => {
    setSaving((s) => ({ ...s, [id]: true }));
    setError(null);
    try {
      const res = await fetch(`${resourcePath}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing[id]),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Save failed");
      cancelEdit(id);
      onRefresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving((s) => ({ ...s, [id]: false }));
    }
  };

  const deleteRow = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    setError(null);
    try {
      const res = await fetch(`${resourcePath}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      onRefresh();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const saveDraft = async () => {
    setSaving((s) => ({ ...s, _new: true }));
    setError(null);
    try {
      const res = await fetch(resourcePath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Create failed");
      setDrafting(false);
      setDraft({});
      onRefresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving((s) => ({ ...s, _new: false }));
    }
  };

  const uploadImage = async (
    file: File,
    id: string,
    fieldKey: string,
    isNew: boolean
  ) => {
    setUploading((u) => ({ ...u, [`${id}-${fieldKey}`]: true }));
    try {
      const signRes = await fetch("/api/admin/uploads/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });
      if (!signRes.ok) throw new Error("Sign failed");
      const { uploadUrl, publicPath } = await signRes.json();

      await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (isNew) {
        setDraft((d) => ({ ...d, [fieldKey]: publicPath }));
      } else {
        setEditing((e) => ({
          ...e,
          [id]: { ...e[id], [fieldKey]: publicPath },
        }));
      }
    } catch (e: any) {
      setError(`Upload failed: ${e.message}`);
    } finally {
      setUploading((u) => ({ ...u, [`${id}-${fieldKey}`]: false }));
    }
  };

  const renderCell = (
    field: FieldDef,
    value: any,
    onChange: (v: any) => void,
    id: string,
    isNew: boolean
  ) => {
    const uploaderKey = `${id}-${field.key}`;

    if (field.type === "boolean") {
      return (
        <input
          type="checkbox"
          checked={value === true || value === "true"}
          onChange={(e) => onChange(e.target.checked)}
          disabled={field.locked || field.readOnly}
          className="w-4 h-4 accent-purple-500"
        />
      );
    }

    if (field.type === "image") {
      return (
        <div className="flex items-center gap-2">
          {value && (
            <div className="relative w-10 h-10 rounded overflow-hidden">
              <Image src={value} alt="" fill className="object-cover" />
            </div>
          )}
          <input
            ref={(el) => {
              fileRefs.current[uploaderKey] = el;
            }}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadImage(file, id, field.key, isNew);
            }}
          />
          <button
            type="button"
            onClick={() => fileRefs.current[uploaderKey]?.click()}
            disabled={uploading[uploaderKey]}
            className="text-xs text-avnt-purple-light hover:text-white px-2 py-1 border border-avnt-border rounded hover:border-avnt-purple/40 transition-colors"
          >
            {uploading[uploaderKey] ? "Uploading…" : "Upload"}
          </button>
          <input
            type="text"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="or paste URL"
            className="flex-1 text-xs bg-avnt-bg2 border border-avnt-border rounded px-2 py-1 text-avnt-text focus:outline-none focus:border-avnt-purple/50 min-w-0"
          />
        </div>
      );
    }

    if (field.type === "textarea") {
      return (
        <textarea
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          disabled={field.locked || field.readOnly}
          className="w-full text-sm bg-avnt-bg2 border border-avnt-border rounded px-2 py-1 text-avnt-text focus:outline-none focus:border-avnt-purple/50 resize-none disabled:opacity-50"
        />
      );
    }

    if (field.type === "select" && field.options) {
      return (
        <select
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={field.locked || field.readOnly}
          className="w-full text-sm bg-avnt-bg2 border border-avnt-border rounded px-2 py-1 text-avnt-text focus:outline-none focus:border-avnt-purple/50"
        >
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      );
    }

    if (field.type === "number") {
      return (
        <input
          type="number"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={field.locked || field.readOnly}
          className="w-full text-sm bg-avnt-bg2 border border-avnt-border rounded px-2 py-1 text-avnt-text focus:outline-none focus:border-avnt-purple/50 disabled:opacity-50"
        />
      );
    }

    return (
      <input
        type={field.type === "url" ? "url" : "text"}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={field.locked || field.readOnly}
        className="w-full text-sm bg-avnt-bg2 border border-avnt-border rounded px-2 py-1 text-avnt-text focus:outline-none focus:border-avnt-purple/50 disabled:opacity-50"
      />
    );
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {error}
          <button className="ml-2 underline" onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-avnt-border">
                {fields.map((f) => (
                  <th
                    key={f.key}
                    className="px-4 py-3 text-left text-xs font-semibold text-avnt-muted uppercase tracking-wider whitespace-nowrap"
                  >
                    {f.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-xs font-semibold text-avnt-muted uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-avnt-border">
              {rows.map((row) => {
                const isEditing = !!editing[row.id];
                const vals = editing[row.id] ?? row;

                return (
                  <tr key={row.id} className="hover:bg-avnt-purple/5 transition-colors">
                    {fields.map((f) => (
                      <td key={f.key} className="px-4 py-3 max-w-[200px]">
                        {isEditing ? (
                          renderCell(
                            f,
                            vals[f.key],
                            (v) =>
                              setEditing((e) => ({
                                ...e,
                                [row.id]: { ...e[row.id], [f.key]: v },
                              })),
                            row.id,
                            false
                          )
                        ) : (
                          <span className="text-sm text-avnt-text truncate block max-w-[180px]">
                            {f.type === "boolean"
                              ? row[f.key] ? "✓" : "✗"
                              : f.type === "image" && row[f.key]
                              ? (
                                <div className="relative w-8 h-8 rounded overflow-hidden">
                                  <Image src={row[f.key]} alt="" fill className="object-cover" />
                                </div>
                              )
                              : String(row[f.key] ?? "—")}
                          </span>
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {extraActions?.(row)}
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => saveEdit(row.id)}
                              disabled={saving[row.id]}
                              className="text-xs bg-avnt-purple hover:bg-purple-600 text-white px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {saving[row.id] ? "Saving…" : "Save"}
                            </button>
                            <button
                              onClick={() => cancelEdit(row.id)}
                              className="text-xs text-avnt-muted hover:text-avnt-text px-3 py-1.5 rounded-lg border border-avnt-border hover:border-avnt-purple/30 transition-colors"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(row)}
                              className="text-xs text-avnt-muted hover:text-avnt-text px-3 py-1.5 rounded-lg border border-avnt-border hover:border-avnt-purple/30 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteRow(row.id)}
                              className="text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg border border-red-500/20 hover:border-red-400/30 transition-colors"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* New row draft */}
              {drafting && (
                <tr className="bg-avnt-purple/5">
                  {fields.map((f) => (
                    <td key={f.key} className="px-4 py-3 max-w-[200px]">
                      {renderCell(
                        f,
                        draft[f.key] ?? "",
                        (v) => setDraft((d) => ({ ...d, [f.key]: v })),
                        "_new",
                        true
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={saveDraft}
                        disabled={saving["_new"]}
                        className="text-xs bg-avnt-purple hover:bg-purple-600 text-white px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {saving["_new"] ? "Creating…" : "Create"}
                      </button>
                      <button
                        onClick={() => { setDrafting(false); setDraft({}); }}
                        className="text-xs text-avnt-muted hover:text-avnt-text px-3 py-1.5 rounded-lg border border-avnt-border transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-avnt-border">
          <button
            onClick={() => setDrafting(true)}
            disabled={drafting}
            className="text-sm text-avnt-purple-light hover:text-white px-4 py-2 border border-avnt-purple/30 hover:border-avnt-purple hover:bg-avnt-purple/10 rounded-lg transition-all disabled:opacity-50"
          >
            + Add New
          </button>
        </div>
      </div>
    </div>
  );
}
