import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [projects, metrics, signals, credibility, leadership, links] = await Promise.all([
    prisma.project.count(),
    prisma.metric.count(),
    prisma.operatingSignal.count(),
    prisma.credibilityItem.count(),
    prisma.leadershipMember.count(),
    prisma.networkLink.count()
  ]);

  const cards = [
    { label: "Site Settings", value: 1, href: "/admin/site-settings" },
    { label: "Projects", value: projects, href: "/admin/projects" },
    { label: "Metrics", value: metrics, href: "/admin/metrics" },
    { label: "Signals", value: signals, href: "/admin/operating-signals" },
    { label: "Credibility", value: credibility, href: "/admin/credibility" },
    { label: "Leadership", value: leadership, href: "/admin/leadership" },
    { label: "Links", value: links, href: "/admin/network-links" }
  ];

  return (
    <div>
      <h2 className="text-5xl font-black">Dashboard</h2>
      <p className="mt-2 text-lg text-muted">Overview of content models and quick navigation.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="card-avnt p-5 transition hover:-translate-y-1">
            <p className="text-sm uppercase tracking-wide text-muted">{card.label}</p>
            <p className="mt-2 text-4xl font-black">{card.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
