// src/components/public/GamesSection.tsx
import Image from "next/image";

interface Project {
  id: string;
  title: string;
  thumbnailUrl?: string | null;
  description?: string | null;
  status: "ACTIVE" | "SCALING" | "PAUSED";
  category?: string | null;
  robloxLink?: string | null;
}

const statusConfig = {
  ACTIVE: { label: "Active", color: "text-green-400", bg: "bg-green-400/10 border-green-400/20" },
  SCALING: { label: "Scaling", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20" },
  PAUSED: { label: "Paused", color: "text-gray-400", bg: "bg-gray-400/10 border-gray-400/20" },
};

export default function GamesSection({
  title,
  subtitle,
  projects,
}: {
  title: string;
  subtitle: string;
  projects: Project[];
}) {
  return (
    <section id="games" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl md:text-5xl text-avnt-text mb-4">{title}</h2>
          <p className="text-avnt-muted text-lg max-w-xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => {
            const status = statusConfig[p.status] ?? statusConfig.ACTIVE;
            return (
              <div
                key={p.id}
                className="glass rounded-2xl overflow-hidden hover:border-avnt-purple/30 transition-all duration-300 group hover:-translate-y-1"
              >
                {/* Thumbnail */}
                <div className="relative h-48 bg-avnt-bg2 overflow-hidden">
                  {p.thumbnailUrl ? (
                    <Image
                      src={p.thumbnailUrl}
                      alt={p.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-avnt-purple/20 flex items-center justify-center">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-avnt-purple-light" strokeWidth="1.5">
                          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                        </svg>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${status.bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${status.color} bg-current`} />
                      <span className={status.color}>{status.label}</span>
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-display font-semibold text-avnt-text text-lg leading-tight">
                      {p.title}
                    </h3>
                    {p.category && (
                      <span className="text-avnt-purple-light text-xs font-medium bg-avnt-purple/10 px-2 py-1 rounded-md whitespace-nowrap">
                        {p.category}
                      </span>
                    )}
                  </div>

                  {p.description && (
                    <p className="text-avnt-muted text-sm leading-relaxed mb-4 line-clamp-2">
                      {p.description}
                    </p>
                  )}

                  {p.robloxLink && (
                    <a
                      href={p.robloxLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-avnt-purple-light hover:text-white text-sm font-medium transition-colors group/link"
                    >
                      <span>Play on Roblox</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover/link:translate-x-0.5 transition-transform">
                        <path d="M7 17L17 7M17 7H7M17 7v10" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
