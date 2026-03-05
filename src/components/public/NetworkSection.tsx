// src/components/public/NetworkSection.tsx
interface Link {
  id: string;
  label: string;
  url: string;
  description?: string | null;
}

export default function NetworkSection({
  title,
  subtitle,
  links,
}: {
  title: string;
  subtitle: string;
  links: Link[];
}) {
  return (
    <section id="network" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-avnt-purple/8 to-transparent" />
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[400px] rounded-full bg-avnt-purple/5 blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <h2 className="font-display font-bold text-3xl md:text-5xl text-avnt-text mb-4">{title}</h2>
        <p className="text-avnt-muted text-lg mb-12">{subtitle}</p>

        <div className="flex flex-wrap justify-center gap-4">
          {links.map((l) => (
            <a
              key={l.id}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass px-6 py-4 rounded-xl hover:border-avnt-purple/40 hover:bg-avnt-purple/10 transition-all duration-300 group min-w-[140px]"
            >
              <div className="font-display font-semibold text-avnt-text group-hover:text-avnt-purple-light transition-colors mb-1">
                {l.label}
              </div>
              {l.description && (
                <div className="text-avnt-muted text-xs">{l.description}</div>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
