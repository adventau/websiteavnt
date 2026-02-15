import Image from "next/image";
import Link from "next/link";
import { LiveMetrics } from "@/components/public/live-metrics";
import {
  getPublicCredibility,
  getPublicLeadership,
  getLivePublicMetrics,
  getPublicNetworkLinks,
  getPublicOperatingSignals,
  getPublicProjects,
  getPublicSiteSettings
} from "@/lib/data/public";

function statusTone(status: string) {
  if (status === "ACTIVE") return "var(--status-active-color)";
  if (status === "SCALING") return "var(--status-scaling-color)";
  return "var(--status-paused-color)";
}

function toTitleCaseStatus(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export default async function HomePage() {
  const [metrics, projects, signals, leadership, credibility, links, siteSettings] = await Promise.all([
    getLivePublicMetrics(),
    getPublicProjects(),
    getPublicOperatingSignals(),
    getPublicLeadership(),
    getPublicCredibility(),
    getPublicNetworkLinks(),
    getPublicSiteSettings()
  ]);

  return (
    <main className="pb-24">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#070418]/85 backdrop-blur">
        <nav className="container-avnt flex items-center justify-between py-4">
          <a href="#home" className="flex items-center gap-3 font-bold">
            <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-[#6e47ff] text-sm">
              {siteSettings.logoUrl ? (
                <Image src={siteSettings.logoUrl} alt={`${siteSettings.brandName} logo`} width={40} height={40} className="h-full w-full object-cover" />
              ) : (
                "AV"
              )}
            </span>
            <span>{siteSettings.brandName}</span>
          </a>
          <div className="hidden gap-7 text-xs font-bold tracking-wide text-muted md:flex">
            <a href="#home">HOME</a>
            <a href="#about">ABOUT</a>
            <a href="#games">GAMES</a>
            <a href="#team">TEAM</a>
          </div>
          <Link href="/sign-in?redirect_url=/admin" className="rounded-full bg-white px-5 py-2 text-sm font-bold text-black">
            Staff Login
          </Link>
        </nav>
      </header>

      <section id="home" className="container-avnt pt-24 pb-16 md:pb-24">
        <div className="grid items-center gap-14 md:grid-cols-2">
          <div className="fade-in-up rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#6e47ff]/35 to-transparent p-8 shadow-[0_0_100px_-30px_rgba(110,71,255,0.7)]">
            <div className="mx-auto grid h-52 w-52 place-items-center overflow-hidden rounded-[2rem] border border-white/20 bg-[#6e47ff]/75 text-7xl font-black">
              {siteSettings.logoUrl ? (
                <Image src={siteSettings.logoUrl} alt={`${siteSettings.brandName} logo`} width={208} height={208} className="h-full w-full object-cover" />
              ) : (
                "AV"
              )}
            </div>
          </div>
          <div className="fade-in-up" style={{ animationDelay: "120ms" }}>
            <p className="text-xs uppercase tracking-[0.25em] text-[#8d86aa]">Portfolio Operator</p>
            <h1 className="mt-4 text-6xl font-black leading-[1]">{siteSettings.brandName}</h1>
            <p className="mt-6 max-w-xl text-lg text-muted">{siteSettings.heroHeadline}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#games" className="rounded-full bg-white px-6 py-3 font-bold text-black">
                View Portfolio
              </a>
              <a href="#about" className="rounded-full border border-white/20 bg-white/10 px-6 py-3 font-bold">
                How we operate
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="container-avnt relative mt-24 md:mt-28">
        <div className="pointer-events-none absolute inset-x-12 -top-8 h-[22rem] rounded-[3rem] bg-[radial-gradient(ellipse_at_center,rgba(140,115,255,0.2),rgba(140,115,255,0.08)_40%,transparent_72%)] blur-2xl" />
        <h2 className="text-center text-5xl font-black">Millions engage with our portfolio</h2>
        <p className="mt-5 text-center text-muted">Live Roblox metrics, updated periodically.</p>
        <LiveMetrics
          initial={metrics.map((metric) => ({ id: metric.id, label: metric.label, value: metric.value, trend: metric.trend }))}
        />
      </section>

      <section id="about" className="container-avnt mt-40 scroll-mt-32 space-y-20 md:mt-44 md:scroll-mt-36">
        <div className="grid items-start gap-14 lg:grid-cols-[1.2fr,0.8fr] lg:gap-20">
          <div>
            <h2 className="text-6xl font-black leading-[1.02]">{siteSettings.heroHeadline}</h2>
            <p className="mt-7 max-w-2xl text-2xl text-muted">{siteSettings.heroSubheadline}</p>
          </div>
          <div className="card-avnt p-6 lg:p-7">
            <p className="section-kicker">Operating Signals</p>
            <div className="mt-4 space-y-3">
              {signals.map((signal) => (
                <article key={signal.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-2xl font-bold">{signal.title}</h3>
                    <p className="text-sm text-muted">{signal.subtitle}</p>
                  </div>
                  <p className="mt-2 text-muted">{signal.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-14 md:grid-cols-2 md:gap-16">
          <div>
            <p className="section-kicker">About</p>
            <h2 className="mt-3 text-5xl font-black">{siteSettings.aboutTitle}</h2>
            <p className="mt-5 max-w-xl text-lg text-muted">{siteSettings.aboutBody}</p>
          </div>
          <div className="card-avnt p-8 text-xl leading-relaxed text-[#d4d0e6]">{siteSettings.aboutBody}</div>
        </div>
      </section>

      <section id="games" className="container-avnt mt-28 scroll-mt-32 md:scroll-mt-36">
        <p className="section-kicker">Games</p>
        <h2 className="mt-3 text-5xl font-black">{siteSettings.gamesTitle}</h2>
        <p className="mt-4 text-lg text-muted">{siteSettings.gamesSubtitle}</p>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <article key={project.id} className="card-avnt overflow-hidden rounded-[1.6rem] border-white/15">
              <div className="relative h-52">
                <Image
                  src={project.thumbnailUrl ?? "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80"}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-4xl font-black leading-none">{project.title}</h3>
                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold text-[#d8d3f0]">
                    Roblox
                  </span>
                </div>
                <p className="mt-4 text-lg text-muted">{project.description}</p>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs text-[#9590af]">Genre</p>
                    <p className="mt-2 break-words text-[clamp(1.3rem,3.4vw,2rem)] font-bold leading-tight">
                      {project.category}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs text-[#9590af]">Status</p>
                    <p
                      className="mt-2 break-words text-[clamp(1.3rem,3.4vw,2rem)] font-bold leading-tight"
                      style={{ color: statusTone(project.status) }}
                    >
                      {toTitleCaseStatus(project.status)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 h-px w-full bg-white/10" />

                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-sm text-[#9f99bb]">• Portfolio item</span>
                  {project.robloxLink ? (
                    <a
                      href={project.robloxLink}
                      target="_blank"
                      className="inline-flex items-center gap-2 text-lg font-bold text-white"
                      rel="noreferrer"
                    >
                      Open on Roblox
                      <span aria-hidden>↗</span>
                    </a>
                  ) : (
                    <span className="text-sm text-muted">Roblox link unavailable</span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container-avnt mt-32 md:mt-36">
        <p className="section-kicker">Credibility</p>
        <h2 className="mt-3 text-5xl font-black">{siteSettings.credibilityTitle}</h2>
        <p className="mt-5 text-lg text-muted">{siteSettings.credibilitySubtitle}</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3 md:gap-7">
          {credibility.map((item) => (
            <article key={item.id} className="card-avnt p-6">
              <h3 className="text-2xl font-bold">{item.title}</h3>
              <p className="mt-2 text-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="team" className="container-avnt mt-32 scroll-mt-32 md:mt-36 md:scroll-mt-36">
        <p className="section-kicker">People</p>
        <h2 className="mt-3 text-5xl font-black">{siteSettings.teamTitle}</h2>
        <p className="mt-5 text-lg text-muted">{siteSettings.teamSubtitle}</p>
        <div className="mt-10 grid gap-6 md:grid-cols-2 md:gap-7">
          {leadership.map((member) => (
            <article key={member.id} className="card-avnt flex items-center gap-4 p-6">
              <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-white/20">
                {member.avatarUrl ? (
                  <Image src={member.avatarUrl} alt={member.name} fill className="object-cover" />
                ) : (
                  <div className="grid h-full place-items-center bg-[#6e47ff]/50 font-bold">AV</div>
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold">{member.name}</h3>
                <p className="text-sm text-[#d0cbeb]">{member.role}</p>
                <p className="mt-1 text-sm text-muted">{member.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="network" className="container-avnt mt-24 md:mt-28">
        <div className="card-avnt p-8">
          <p className="section-kicker">Network</p>
          <h2 className="mt-3 text-5xl font-black">{siteSettings.ctaTitle}</h2>
          <p className="mt-4 max-w-2xl text-lg text-muted">{siteSettings.ctaSubtitle}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-bold hover:bg-white hover:text-black"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer className="container-avnt mt-16 border-t border-white/10 py-8 text-sm text-muted">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p>{siteSettings.footerText}</p>
          <div className="flex gap-5">
            {links.slice(0, 4).map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
