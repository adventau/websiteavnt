// src/app/admin/dashboard/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const [projects, metrics, signals, credibility, leadership, networkLinks] =
    await Promise.all([
      prisma.project.count(),
      prisma.metric.count(),
      prisma.operatingSignal.count(),
      prisma.credibilityItem.count(),
      prisma.leadershipMember.count(),
      prisma.networkLink.count(),
    ]);

  const cards = [
    { label: "Games", count: projects, href: "/admin/games", icon: "🎮" },
    { label: "Metrics", count: metrics, href: "/admin/metrics", icon: "📊" },
    { label: "Operating Signals", count: signals, href: "/admin/operating-signals", icon: "⚡" },
    { label: "Credibility Items", count: credibility, href: "/admin/credibility", icon: "✓" },
    { label: "Team Members", count: leadership, href: "/admin/leadership", icon: "👥" },
    { label: "Social Links", count: networkLinks, href: "/admin/network-links", icon: "🔗" },
  ];

  return (
    <div>
      <h1 className="font-display font-bold text-3xl text-avnt-text mb-2">Dashboard</h1>
      <p className="text-avnt-muted mb-8">Overview of all AVNT content.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="glass rounded-2xl p-6 hover:border-avnt-purple/40 transition-all duration-200 group"
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-3xl">{c.icon}</span>
              <span className="font-display font-bold text-4xl gradient-text">{c.count}</span>
            </div>
            <p className="text-avnt-muted text-sm font-medium group-hover:text-avnt-text transition-colors">
              {c.label}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
