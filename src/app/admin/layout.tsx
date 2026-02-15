import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { guardAdminPage } from "@/lib/auth/page-guard";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await guardAdminPage();

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#060315] pb-16">
      <header className="border-b border-white/10 bg-black/20">
        <div className="container-avnt flex flex-wrap items-center justify-between gap-3 py-5">
          <h1 className="text-3xl font-black">AVNT Admin</h1>
          <div className="flex items-center gap-3">
            <Link href="/" className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold">
              View site
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>
      <div className="container-avnt mt-7 grid gap-6 lg:grid-cols-[260px,minmax(0,1fr)]">
        <aside className="card-avnt h-fit p-3 lg:sticky lg:top-24">
          <nav className="flex flex-col gap-2 text-sm font-semibold">
            <Link href="/admin" className="rounded-xl px-3 py-2 hover:bg-white/10">Dashboard</Link>
            <Link href="/admin/site-settings" className="rounded-xl px-3 py-2 hover:bg-white/10">Site Settings</Link>
            <Link href="/admin/projects" className="rounded-xl px-3 py-2 hover:bg-white/10">Games</Link>
            <Link href="/admin/metrics" className="rounded-xl px-3 py-2 hover:bg-white/10">Metrics</Link>
            <Link href="/admin/operating-signals" className="rounded-xl px-3 py-2 hover:bg-white/10">Operating Signals</Link>
            <Link href="/admin/credibility" className="rounded-xl px-3 py-2 hover:bg-white/10">Credibility Items</Link>
            <Link href="/admin/leadership" className="rounded-xl px-3 py-2 hover:bg-white/10">Team Members</Link>
            <Link href="/admin/network-links" className="rounded-xl px-3 py-2 hover:bg-white/10">Social Links</Link>
          </nav>
        </aside>
        <section className="min-w-0">{children}</section>
      </div>
    </main>
  );
}
