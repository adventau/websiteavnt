// src/components/public/MetricsSection.tsx
import { getPublicMetrics } from "@/lib/public-data";
import LiveMetrics from "./LiveMetrics";

export default async function MetricsSection({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const metrics = await getPublicMetrics();
  const serialized = metrics.map((m) => ({ ...m, visits: undefined } as any));

  return (
    <section id="metrics" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-avnt-purple/5 to-transparent" />
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl md:text-5xl text-avnt-text mb-4">
            {title}
          </h2>
          <p className="text-avnt-muted text-lg max-w-xl mx-auto">{subtitle}</p>
        </div>
        <LiveMetrics initial={serialized} />
      </div>
    </section>
  );
}
