// src/app/admin/layout.tsx
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: "⊞" },
  { label: "Site Settings", href: "/admin/site-settings", icon: "⚙" },
  { label: "Games", href: "/admin/games", icon: "🎮" },
  { label: "Metrics", href: "/admin/metrics", icon: "📊" },
  { label: "Operating Signals", href: "/admin/operating-signals", icon: "⚡" },
  { label: "Credibility Items", href: "/admin/credibility", icon: "✓" },
  { label: "Team Members", href: "/admin/leadership", icon: "👥" },
  { label: "Social Links", href: "/admin/network-links", icon: "🔗" },
];

async function checkAdmin() {
  const { userId, sessionClaims } = await auth();
  if (!userId) redirect("/sign-in");

  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  const email = sessionClaims?.email as string ?? "";
  if (adminEmails.includes(email)) return;

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: { role: true },
  });
  if (user?.role !== "ADMIN") redirect("/");
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkAdmin();

  return (
    <div className="min-h-screen bg-avnt-bg flex">
      {/* Sidebar */}
      <aside className="w-64 glass-strong border-r border-avnt-border flex flex-col fixed h-full z-30">
        <div className="p-6 border-b border-avnt-border">
          <Link href="/" className="font-display font-bold text-xl gradient-text">
            AVNT Admin
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-avnt-muted hover:text-avnt-text hover:bg-avnt-purple/10 transition-all duration-200 text-sm font-medium group"
            >
              <span className="text-base group-hover:scale-110 transition-transform">
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="glass-strong border-b border-avnt-border px-6 h-14 flex items-center justify-between sticky top-0 z-20">
          <div />
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-avnt-muted hover:text-avnt-text text-sm flex items-center gap-1.5 transition-colors"
            >
              <span>View Site</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
