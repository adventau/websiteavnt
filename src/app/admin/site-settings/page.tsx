// src/app/admin/site-settings/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";

const fields = [
  { key: "brand", label: "Brand Name", type: "text" },
  { key: "logoUrl", label: "Logo URL", type: "url" },
  { key: "heroTitle", label: "Hero Title", type: "text" },
  { key: "heroSubtitle", label: "Hero Subtitle", type: "textarea" },
  { key: "heroCta", label: "Hero CTA Text", type: "text" },
  { key: "aboutTitle", label: "About Title", type: "text" },
  { key: "aboutBody", label: "About Body", type: "textarea" },
  { key: "metricsTitle", label: "Metrics Title", type: "text" },
  { key: "metricsSubtitle", label: "Metrics Subtitle", type: "text" },
  { key: "gamesTitle", label: "Games Title", type: "text" },
  { key: "gamesSubtitle", label: "Games Subtitle", type: "text" },
  { key: "credTitle", label: "Credibility Title", type: "text" },
  { key: "teamTitle", label: "Team Title", type: "text" },
  { key: "teamSubtitle", label: "Team Subtitle", type: "text" },
  { key: "networkTitle", label: "Network Title", type: "text" },
  { key: "networkSubtitle", label: "Network Subtitle", type: "text" },
  { key: "footerText", label: "Footer Text", type: "text" },
];

export default function SiteSettingsPage() {
  const [data, setData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/site-settings");
      const json = await res.json();
      setData(json.data ?? {});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Save failed");
      setMsg({ type: "success", text: "Settings saved!" });
    } catch (e: any) {
      setMsg({ type: "error", text: e.message });
    } finally {
      setSaving(false);
    }
  };

  const uploadLogo = async (file: File) => {
    setUploading(true);
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
      setData((d) => ({ ...d, logoUrl: publicPath }));
    } catch (e: any) {
      setMsg({ type: "error", text: `Logo upload failed: ${e.message}` });
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="text-avnt-muted">Loading…</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="font-display font-bold text-3xl text-avnt-text mb-2">Site Settings</h1>
      <p className="text-avnt-muted text-sm mb-8">Edit homepage copy and branding.</p>

      {msg && (
        <div className={`mb-6 p-3 rounded-lg text-sm border ${
          msg.type === "success"
            ? "bg-green-500/10 border-green-500/20 text-green-400"
            : "bg-red-500/10 border-red-500/20 text-red-400"
        }`}>
          {msg.text}
        </div>
      )}

      <div className="glass rounded-2xl p-6 space-y-5">
        {/* Logo upload */}
        <div>
          <label className="block text-xs font-semibold text-avnt-muted uppercase tracking-wider mb-2">
            Logo
          </label>
          <div className="flex items-center gap-3">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadLogo(file);
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="text-sm text-avnt-purple-light hover:text-white px-3 py-2 border border-avnt-border rounded-lg transition-colors"
            >
              {uploading ? "Uploading…" : "Upload Logo"}
            </button>
            <input
              type="url"
              value={data.logoUrl ?? ""}
              onChange={(e) => setData((d) => ({ ...d, logoUrl: e.target.value }))}
              placeholder="or paste URL"
              className="flex-1 text-sm bg-avnt-bg2 border border-avnt-border rounded-lg px-3 py-2 text-avnt-text focus:outline-none focus:border-avnt-purple/50"
            />
          </div>
        </div>

        {fields.filter((f) => f.key !== "logoUrl").map((f) => (
          <div key={f.key}>
            <label className="block text-xs font-semibold text-avnt-muted uppercase tracking-wider mb-2">
              {f.label}
            </label>
            {f.type === "textarea" ? (
              <textarea
                value={data[f.key] ?? ""}
                onChange={(e) => setData((d) => ({ ...d, [f.key]: e.target.value }))}
                rows={3}
                className="w-full text-sm bg-avnt-bg2 border border-avnt-border rounded-lg px-3 py-2 text-avnt-text focus:outline-none focus:border-avnt-purple/50 resize-none"
              />
            ) : (
              <input
                type={f.type === "url" ? "url" : "text"}
                value={data[f.key] ?? ""}
                onChange={(e) => setData((d) => ({ ...d, [f.key]: e.target.value }))}
                className="w-full text-sm bg-avnt-bg2 border border-avnt-border rounded-lg px-3 py-2 text-avnt-text focus:outline-none focus:border-avnt-purple/50"
              />
            )}
          </div>
        ))}

        <div className="pt-2">
          <button
            onClick={save}
            disabled={saving}
            className="px-6 py-2.5 bg-avnt-purple hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
