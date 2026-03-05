// src/components/public/CredibilitySection.tsx
interface CredItem {
  id: string;
  title: string;
  body: string;
}

export default function CredibilitySection({
  title,
  items,
}: {
  title: string;
  items: CredItem[];
}) {
  return (
    <section id="credibility" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/20 to-transparent" />
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl md:text-5xl text-avnt-text mb-4">{title}</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <div
              key={item.id}
              className="glass rounded-2xl p-6 text-center hover:border-avnt-purple/30 transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-avnt-purple/15 flex items-center justify-center mx-auto mb-4 group-hover:bg-avnt-purple/25 transition-colors">
                <span className="font-display font-bold text-avnt-purple-light text-lg">{i + 1}</span>
              </div>
              <h3 className="font-display font-semibold text-avnt-text mb-3">{item.title}</h3>
              <p className="text-avnt-muted text-sm leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
