// src/components/public/LiveMetrics.tsx
"use client";

import { useEffect, useState } from "react";

interface Metric {
  id: string;
  key: string;
  label: string;
  value: string;
  trend?: string | null;
}

export default function LiveMetrics({ initial }: { initial: Metric[] }) {
  const [metrics, setMetrics] = useState<Metric[]>(initial);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch("/api/public/metrics");
        if (res.ok) {
          const json = await res.json();
          setMetrics(json.data);
        }
      } catch {}
    };

    const interval = setInterval(fetchMetrics, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {metrics.map((m) => (
        <div key={m.id} className="glass rounded-2xl p-6 text-center avnt-glow">
          <div className="font-display font-bold text-4xl md:text-5xl gradient-text mb-2">
            {m.value}
          </div>
          <div className="text-avnt-muted text-sm font-medium mb-2">{m.label}</div>
          {m.trend && (
            <div className="inline-flex items-center gap-1 text-green-400 text-xs font-semibold">
              <span>↑</span>
              <span>{m.trend}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
