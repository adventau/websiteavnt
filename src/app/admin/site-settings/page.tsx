"use client";

import { useEffect, useState } from "react";

type Settings = {
  brandName: string;
  logoUrl: string | null;
  footerText: string;
  heroHeadline: string;
  heroSubheadline: string;
  aboutTitle: string;
  aboutBody: string;
  credibilityTitle: string;
  credibilitySubtitle: string;
  gamesTitle: string;
  gamesSubtitle: string;
  pledgeTitle: string;
  pledgeSubtitle: string;
  teamTitle: string;
  teamSubtitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
};

function Field({ label, value, onChange, textarea = false }: { label: string; value: string; onChange: (value: string) => void; textarea?: boolean }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-[#bdb7d8]">{label}</span>
      {textarea ? (
        <textarea
          className="h-32 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          className="w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  );
}

const fallback: Settings = {
  brandName: "AVNT Brand",
  logoUrl: null,
  footerText: "© AVNT Brand — All Rights Reserved",
  heroHeadline: "Structured leadership for digital communities and independent projects.",
  heroSubheadline:
    "AVNT Brand is a professional management and portfolio brand focused on overseeing, organizing, and supporting digital communities and independent projects.",
  aboutTitle: "About AVNT",
  aboutBody: "Professional management, intentional staffing, and portfolio oversight.",
  credibilityTitle: "Credibility",
  credibilitySubtitle: "Signals of trust: partners, platforms, and milestones.",
  gamesTitle: "Our Games",
  gamesSubtitle: "Active portfolio projects and community experiences.",
  pledgeTitle: "Our Quality Pledge",
  pledgeSubtitle: "A commitment to structure, security, and high operational standards.",
  teamTitle: "Our Team",
  teamSubtitle: "Leadership, operations, and delivery.",
  ctaTitle: "Join the network",
  ctaSubtitle: "Get updates, opportunities, and announcements across the AVNT portfolio."
};

export default function AdminSiteSettingsPage() {
  const [form, setForm] = useState<Settings>(fallback);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    fetch("/api/admin/site-settings", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (json?.data) {
          setForm(json.data as Settings);
        }
      })
      .catch(() => {
        // Keep defaults if fetch fails.
      });
  }, []);

  async function save() {
    setSaving(true);
    const res = await fetch("/api/admin/site-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setSaving(false);

    if (!res.ok) {
      const err = (await res.json().catch(() => null)) as { error?: string } | null;
      alert(err?.error ?? "Failed to save site settings.");
      return;
    }

    alert("Site settings updated.");
  }

  async function uploadLogo(file: File) {
    setUploadingLogo(true);
    const contentType = file.type || "application/octet-stream";

    const signRes = await fetch("/api/admin/uploads/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: file.name,
        contentType,
        folder: "logos"
      })
    });

    if (!signRes.ok) {
      setUploadingLogo(false);
      const err = (await signRes.json().catch(() => null)) as { error?: string } | null;
      alert(err?.error ?? "Failed to prepare logo upload.");
      return;
    }

    const signJson = (await signRes.json()) as { data?: { uploadUrl: string; publicPath: string } };
    const uploadUrl = signJson.data?.uploadUrl;
    const publicPath = signJson.data?.publicPath;
    if (!uploadUrl || !publicPath) {
      setUploadingLogo(false);
      alert("Invalid upload response.");
      return;
    }

    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": contentType },
      body: file
    });

    setUploadingLogo(false);
    if (!uploadRes.ok) {
      alert("Logo upload failed.");
      return;
    }

    setForm((prev) => ({ ...prev, logoUrl: publicPath }));
    alert("Logo uploaded. Click Save to apply it.");
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-5xl font-black">Site Settings</h1>
          <p className="mt-2 text-lg text-muted">Update core content displayed on the public page.</p>
        </div>
        <button onClick={save} disabled={saving} className="rounded-full bg-white px-6 py-3 text-sm font-bold text-black" type="button">
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="card-avnt grid gap-5 p-6 md:grid-cols-2">
        <Field label="Brand name" value={form.brandName} onChange={(value) => setForm((prev) => ({ ...prev, brandName: value }))} />
        <Field
          label="Logo URL (optional)"
          value={form.logoUrl ?? ""}
          onChange={(value) => setForm((prev) => ({ ...prev, logoUrl: value.trim() === "" ? null : value }))}
        />
        <div className="md:col-span-2">
          <label className="block">
            <span className="mb-2 block text-sm text-[#bdb7d8]">Upload logo file</span>
            <input
              type="file"
              accept="image/*"
              className="w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void uploadLogo(file);
                }
              }}
            />
          </label>
          <p className="mt-2 text-sm text-muted">{uploadingLogo ? "Uploading logo..." : "Uploads via Railway bucket."}</p>
          {form.logoUrl ? (
            <div className="mt-3 inline-flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-3 py-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.logoUrl} alt="Logo preview" className="h-12 w-12 rounded-lg object-cover" />
              <span className="text-sm text-muted">Current logo preview</span>
            </div>
          ) : null}
        </div>
        <Field label="Footer" value={form.footerText} onChange={(value) => setForm((prev) => ({ ...prev, footerText: value }))} />
        <div className="md:col-span-2">
          <Field label="Hero headline" value={form.heroHeadline} onChange={(value) => setForm((prev) => ({ ...prev, heroHeadline: value }))} />
        </div>
        <div className="md:col-span-2">
          <Field label="Hero subheadline" value={form.heroSubheadline} onChange={(value) => setForm((prev) => ({ ...prev, heroSubheadline: value }))} textarea />
        </div>
        <Field label="About title" value={form.aboutTitle} onChange={(value) => setForm((prev) => ({ ...prev, aboutTitle: value }))} />
        <Field label="Credibility title" value={form.credibilityTitle} onChange={(value) => setForm((prev) => ({ ...prev, credibilityTitle: value }))} />
        <div className="md:col-span-2">
          <Field label="About body" value={form.aboutBody} onChange={(value) => setForm((prev) => ({ ...prev, aboutBody: value }))} textarea />
        </div>
        <div className="md:col-span-2">
          <Field label="Credibility subtitle" value={form.credibilitySubtitle} onChange={(value) => setForm((prev) => ({ ...prev, credibilitySubtitle: value }))} />
        </div>
        <Field label="Games title" value={form.gamesTitle} onChange={(value) => setForm((prev) => ({ ...prev, gamesTitle: value }))} />
        <Field label="Games subtitle" value={form.gamesSubtitle} onChange={(value) => setForm((prev) => ({ ...prev, gamesSubtitle: value }))} />
        <Field label="Pledge title" value={form.pledgeTitle} onChange={(value) => setForm((prev) => ({ ...prev, pledgeTitle: value }))} />
        <Field label="Pledge subtitle" value={form.pledgeSubtitle} onChange={(value) => setForm((prev) => ({ ...prev, pledgeSubtitle: value }))} />
        <Field label="Team title" value={form.teamTitle} onChange={(value) => setForm((prev) => ({ ...prev, teamTitle: value }))} />
        <Field label="Team subtitle" value={form.teamSubtitle} onChange={(value) => setForm((prev) => ({ ...prev, teamSubtitle: value }))} />
        <Field label="CTA title" value={form.ctaTitle} onChange={(value) => setForm((prev) => ({ ...prev, ctaTitle: value }))} />
        <Field label="CTA subtitle" value={form.ctaSubtitle} onChange={(value) => setForm((prev) => ({ ...prev, ctaSubtitle: value }))} />
      </div>
    </section>
  );
}
