// src/components/public/AboutSection.tsx
interface Signal {
  id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
}

export default function AboutSection({
  title,
  body,
  signals,
}: {
  title: string;
  body: string;
  signals: Signal[];
}) {
  return (
    <section id="about" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-avnt-text mb-6">
              {title}
            </h2>
            <p className="text-avnt-muted text-lg leading-relaxed">{body}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {signals.map((s) => (
              <div
                key={s.id}
                className="glass rounded-2xl p-6 hover:border-avnt-purple/30 transition-all duration-300 group"
              >
                <h3 className="font-display font-semibold text-avnt-text mb-1 group-hover:text-avnt-purple-light transition-colors">
                  {s.title}
                </h3>
                {s.subtitle && (
                  <p className="text-avnt-purple-light text-xs font-medium mb-2 uppercase tracking-wider">
                    {s.subtitle}
                  </p>
                )}
                {s.description && (
                  <p className="text-avnt-muted text-sm leading-relaxed">{s.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
