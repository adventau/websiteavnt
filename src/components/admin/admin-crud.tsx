"use client";

import { useMemo, useState } from "react";

type Field = {
  key: string;
  label: string;
  type?: "text" | "number" | "boolean" | "textarea" | "url" | "image";
  showInTable?: boolean;
  showInCreate?: boolean;
  readOnly?: boolean;
  widthClassName?: string;
  uploadFolder?: string;
};

type Props<T extends Record<string, unknown>> = {
  title: string;
  subtitle: string;
  endpoint: string;
  fields: Field[];
  initialRows: T[];
};

const inputClass =
  "w-full min-w-[120px] rounded-xl border border-white/15 bg-black/35 px-3 py-2 text-sm text-white placeholder:text-[#8d86aa]";

export function AdminCrudTable<T extends Record<string, unknown>>({
  title,
  subtitle,
  endpoint,
  fields,
  initialRows
}: Props<T>) {
  const [rows, setRows] = useState(initialRows);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [autoFilling, setAutoFilling] = useState<Record<string, boolean>>({});
  const [draft, setDraft] = useState<Record<string, string>>(() => {
    const value: Record<string, string> = {};
    fields.forEach((field) => {
      value[field.key] = field.type === "boolean" ? "false" : "";
    });
    return value;
  });
  const isProjectsEndpoint = endpoint === "/api/admin/projects";

  const tableFields = useMemo(() => fields.filter((field) => field.showInTable !== false), [fields]);
  const editableFields = useMemo(
    () => fields.filter((field) => field.key !== "id" && field.showInCreate !== false),
    [fields]
  );

  async function refresh() {
    const res = await fetch(endpoint, { cache: "no-store" });
    const json = (await res.json()) as { data: T[] };
    setRows(json.data);
  }

  async function uploadImage(file: File, folder: string) {
    const signRes = await fetch("/api/admin/uploads/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type || "application/octet-stream",
        folder
      })
    });

    if (!signRes.ok) return null;

    const signJson = (await signRes.json()) as { data?: { uploadUrl: string; publicPath: string } };
    const uploadUrl = signJson.data?.uploadUrl;
    const publicPath = signJson.data?.publicPath;
    if (!uploadUrl || !publicPath) return null;

    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type || "application/octet-stream" },
      body: file
    });

    if (!uploadRes.ok) return null;
    return publicPath;
  }

  async function lookupProjectByPlaceId(placeId: string) {
    const trimmed = placeId.trim();
    if (!/^[0-9]+$/.test(trimmed)) return null;

    const res = await fetch(`/api/admin/projects/lookup?placeId=${encodeURIComponent(trimmed)}`, {
      cache: "no-store"
    });
    if (!res.ok) return null;

    const json = (await res.json()) as {
      data?: { title: string | null; description: string | null; thumbnailUrl: string | null; robloxLink: string | null };
    };
    return json.data ?? null;
  }

  function castValue(raw: string, type: Field["type"]) {
    if (type === "number") return Number(raw || 0);
    if (type === "boolean") return raw === "true";
    if (raw.trim() === "") return null;
    return raw;
  }

  async function createItem() {
    const payload: Record<string, unknown> = {};
    editableFields.forEach((field) => {
      payload[field.key] = castValue(draft[field.key] ?? "", field.type);
    });

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => null)) as { error?: string } | null;
      alert(err?.error ?? "Create failed");
      return;
    }

    await refresh();
  }

  async function updateItem(id: string, row: T) {
    const payload: Record<string, unknown> = {};
    fields.forEach((field) => {
      if (field.key === "id" || field.readOnly) return;
      payload[field.key] = row[field.key];
    });

    const res = await fetch(`${endpoint}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => null)) as { error?: string } | null;
      alert(err?.error ?? "Update failed");
      return;
    }

    await refresh();
  }

  async function deleteItem(id: string) {
    const res = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = (await res.json().catch(() => null)) as { error?: string } | null;
      alert(err?.error ?? "Delete failed");
      return;
    }
    await refresh();
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-5xl font-black">{title}</h1>
          <p className="mt-2 text-lg text-muted">{subtitle}</p>
        </div>
        <button
          onClick={createItem}
          className="rounded-full bg-white px-6 py-3 text-sm font-bold text-black"
          type="button"
        >
          New
        </button>
      </div>

      <div className="card-avnt max-w-full overflow-x-auto p-5">
        <table className="w-full min-w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-white/10 text-sm uppercase tracking-wide text-[#9b93bb]">
              {tableFields.map((field) => (
                <th key={field.key} className={`whitespace-nowrap px-3 py-3 font-semibold ${field.widthClassName ?? ""}`}>
                  {field.label}
                </th>
              ))}
              <th className="px-3 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => {
              const id = String(row.id ?? rowIndex);
              return (
                <tr key={id} className="border-b border-white/5 align-top">
                  {tableFields.map((field) => {
                    const value = row[field.key];
                    const fieldId = `${id}-${field.key}`;

                    return (
                      <td key={fieldId} className="px-3 py-3">
                        {field.type === "textarea" ? (
                          <textarea
                            className={`${inputClass} min-w-[220px]`}
                            value={String(value ?? "")}
                            readOnly={field.readOnly}
                            onChange={(event) => {
                              const next = [...rows];
                              next[rowIndex] = { ...row, [field.key]: event.target.value };
                              setRows(next);
                            }}
                          />
                        ) : field.type === "boolean" ? (
                          <select
                            className={inputClass}
                            value={String(Boolean(value))}
                            disabled={field.readOnly}
                            onChange={(event) => {
                              const next = [...rows];
                              next[rowIndex] = { ...row, [field.key]: event.target.value === "true" };
                              setRows(next);
                            }}
                          >
                            <option value="true">true</option>
                            <option value="false">false</option>
                          </select>
                        ) : field.type === "image" ? (
                          <div className="min-w-[220px] space-y-2">
                            <input
                              className={inputClass}
                              type="text"
                              value={String(value ?? "")}
                              readOnly={field.readOnly}
                              onChange={(event) => {
                                const next = [...rows];
                                next[rowIndex] = { ...row, [field.key]: event.target.value };
                                setRows(next);
                              }}
                            />
                            <input
                              className={`${inputClass} file:mr-3 file:rounded-full file:border-0 file:bg-white file:px-3 file:py-1 file:text-xs file:font-bold file:text-black`}
                              type="file"
                              accept="image/*"
                              disabled={field.readOnly || uploading[fieldId]}
                              onChange={async (event) => {
                                const file = event.target.files?.[0];
                                if (!file) return;

                                setUploading((prev) => ({ ...prev, [fieldId]: true }));
                                const publicPath = await uploadImage(file, field.uploadFolder ?? "leadership");
                                setUploading((prev) => ({ ...prev, [fieldId]: false }));

                                if (!publicPath) {
                                  alert("Image upload failed");
                                  return;
                                }

                                const next = [...rows];
                                next[rowIndex] = { ...row, [field.key]: publicPath };
                                setRows(next);
                              }}
                            />
                            <p className="text-xs text-muted">{uploading[fieldId] ? "Uploading image..." : "Upload image file"}</p>
                          </div>
                        ) : (
                          <input
                            className={inputClass}
                            type={field.type === "number" ? "number" : "text"}
                            value={String(value ?? "")}
                            readOnly={field.readOnly}
                            onChange={(event) => {
                              const next = [...rows];
                              next[rowIndex] = {
                                ...row,
                                [field.key]: field.type === "number" ? Number(event.target.value || 0) : event.target.value
                              };
                              setRows(next);
                            }}
                            onBlur={async (event) => {
                              if (!isProjectsEndpoint || field.key !== "robloxPlaceId") return;
                              const placeId = event.target.value;
                              if (!/^[0-9]+$/.test(placeId.trim())) return;

                              setAutoFilling((prev) => ({ ...prev, [`row-${rowIndex}`]: true }));
                              const auto = await lookupProjectByPlaceId(placeId);
                              setAutoFilling((prev) => ({ ...prev, [`row-${rowIndex}`]: false }));
                              if (!auto) return;

                              const next = [...rows];
                              next[rowIndex] = {
                                ...row,
                                robloxPlaceId: placeId.trim(),
                                title: auto.title ?? row.title,
                                thumbnailUrl: auto.thumbnailUrl ?? row.thumbnailUrl,
                                robloxLink: auto.robloxLink ?? row.robloxLink,
                                description: auto.description ?? row.description
                              };
                              setRows(next);
                            }}
                          />
                        )}
                        {isProjectsEndpoint && field.key === "robloxPlaceId" ? (
                          <p className="mt-2 text-xs text-muted">
                            {autoFilling[`row-${rowIndex}`]
                              ? "Auto-filling title and thumbnail from Roblox..."
                              : "Place ID auto-fills title, thumbnail, and Roblox URL on blur."}
                          </p>
                        ) : null}
                      </td>
                    );
                  })}
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateItem(id, row)}
                        className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold"
                        type="button"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => deleteItem(id)}
                        className="rounded-full border border-red-400/30 bg-red-700/20 px-4 py-2 text-sm font-bold text-red-100"
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            <tr>
              {tableFields.map((field) => (
                <td key={field.key} className="px-3 py-3">
                  {field.showInCreate === false ? (
                    <span className="text-sm text-muted">auto</span>
                  ) : field.type === "textarea" ? (
                    <textarea
                      className={`${inputClass} min-w-[220px]`}
                      placeholder={field.label}
                      value={draft[field.key] ?? ""}
                      onChange={(event) => setDraft((prev) => ({ ...prev, [field.key]: event.target.value }))}
                    />
                  ) : field.type === "boolean" ? (
                    <select
                      className={inputClass}
                      value={draft[field.key] ?? "false"}
                      onChange={(event) => setDraft((prev) => ({ ...prev, [field.key]: event.target.value }))}
                    >
                      <option value="true">true</option>
                      <option value="false">false</option>
                    </select>
                  ) : field.type === "image" ? (
                    <div className="min-w-[220px] space-y-2">
                      <input
                        className={inputClass}
                        type="text"
                        placeholder={field.label}
                        value={draft[field.key] ?? ""}
                        onChange={(event) => setDraft((prev) => ({ ...prev, [field.key]: event.target.value }))}
                      />
                      <input
                        className={`${inputClass} file:mr-3 file:rounded-full file:border-0 file:bg-white file:px-3 file:py-1 file:text-xs file:font-bold file:text-black`}
                        type="file"
                        accept="image/*"
                        disabled={uploading[`draft-${field.key}`]}
                        onChange={async (event) => {
                          const file = event.target.files?.[0];
                          if (!file) return;

                          setUploading((prev) => ({ ...prev, [`draft-${field.key}`]: true }));
                          const publicPath = await uploadImage(file, field.uploadFolder ?? "leadership");
                          setUploading((prev) => ({ ...prev, [`draft-${field.key}`]: false }));

                          if (!publicPath) {
                            alert("Image upload failed");
                            return;
                          }

                          setDraft((prev) => ({ ...prev, [field.key]: publicPath }));
                        }}
                      />
                      <p className="text-xs text-muted">
                        {uploading[`draft-${field.key}`] ? "Uploading image..." : "Upload image file"}
                      </p>
                    </div>
                  ) : (
                    <input
                      className={inputClass}
                      type={field.type === "number" ? "number" : "text"}
                      placeholder={field.label}
                      value={draft[field.key] ?? ""}
                      onChange={(event) => setDraft((prev) => ({ ...prev, [field.key]: event.target.value }))}
                      onBlur={async (event) => {
                        if (!isProjectsEndpoint || field.key !== "robloxPlaceId") return;
                        const placeId = event.target.value;
                        if (!/^[0-9]+$/.test(placeId.trim())) return;

                        setAutoFilling((prev) => ({ ...prev, "draft-place-id": true }));
                        const auto = await lookupProjectByPlaceId(placeId);
                        setAutoFilling((prev) => ({ ...prev, "draft-place-id": false }));
                        if (!auto) return;

                        setDraft((prev) => ({
                          ...prev,
                          robloxPlaceId: placeId.trim(),
                          title: auto.title ?? prev.title,
                          thumbnailUrl: auto.thumbnailUrl ?? prev.thumbnailUrl,
                          robloxLink: auto.robloxLink ?? prev.robloxLink,
                          description: auto.description ?? prev.description
                        }));
                      }}
                    />
                  )}
                  {isProjectsEndpoint && field.key === "robloxPlaceId" ? (
                    <p className="mt-2 text-xs text-muted">
                      {autoFilling["draft-place-id"]
                        ? "Auto-filling title and thumbnail from Roblox..."
                        : "Place ID auto-fills title, thumbnail, and Roblox URL on blur."}
                    </p>
                  ) : null}
                </td>
              ))}
              <td className="px-3 py-3 text-sm text-muted">Create with New</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
