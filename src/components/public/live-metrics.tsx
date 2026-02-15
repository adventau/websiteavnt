"use client";

import { useEffect, useState } from "react";

type Metric = {
  id: string;
  label: string;
  value: string;
  trend: string | null;
};

type Props = {
  initial: Metric[];
};

function MetricIcon({ index }: { index: number }) {
  const base = "h-6 w-6 text-white/80";
  if (index === 0) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={base} aria-hidden>
        <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="2.2" />
        <path d="M4.5 19c1.7-3.1 4.3-4.6 7.5-4.6s5.8 1.5 7.5 4.6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={base} aria-hidden>
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
        <path d="M4 12h16M12 4c2.2 2.1 3.4 4.8 3.4 8S14.2 17.9 12 20M12 4c-2.2 2.1-3.4 4.8-3.4 8s1.2 5.9 3.4 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  if (index === 2) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={base} aria-hidden>
        <path
          d="M12 20s-6.8-4.4-8.8-8c-1.5-2.7-.5-6 2.5-7.3 2-.9 4.3-.4 5.8 1.4l.5.6.5-.6c1.5-1.8 3.8-2.3 5.8-1.4 3 1.3 4 4.6 2.5 7.3-2 3.6-8.8 8-8.8 8z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" className={base} aria-hidden>
      <rect x="6" y="4.5" width="12" height="15" rx="2.2" stroke="currentColor" strokeWidth="2" />
      <path d="M9 8h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function LiveMetrics({ initial }: Props) {
  const [metrics, setMetrics] = useState(initial);

  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const res = await fetch("/api/public/metrics", { cache: "no-store" });
        if (!res.ok) return;
        const json = (await res.json()) as { data: Metric[] };
        setMetrics(json.data);
      } catch {
        // Keep existing values if refresh fails.
      }
    }, 60000);

    return () => clearInterval(id);
  }, []);

  return (
    <div className="card-avnt relative mx-auto mt-10 w-full max-w-[860px] overflow-hidden border-white/20 bg-gradient-to-br from-[#4a33a0]/36 via-[#3b2782]/30 to-[#2f2069]/28 p-0 backdrop-blur-xl md:mt-12">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02)_32%,rgba(255,255,255,0.01)_100%)]" />
      <div className="relative grid grid-cols-2 md:grid-cols-4">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/6" />
        {metrics.map((metric, index) => (
          <div key={metric.id} className="relative p-6 text-center md:p-9">
            {index > 0 ? <div className="absolute bottom-8 left-0 top-8 w-px bg-white/14" /> : null}
            <div className="mx-auto mb-4 grid h-7 w-7 place-items-center text-white/80">
              <MetricIcon index={index} />
            </div>
            <p className="text-[clamp(2.2rem,6vw,3.35rem)] font-black leading-none text-white">{metric.value}</p>
            <p className="mt-3 text-[clamp(0.95rem,2.2vw,1.2rem)] font-semibold leading-snug text-[#d3cee8]">{metric.label}</p>
          </div>
        ))}
      </div>
      <div className="border-t border-white/12 px-6 py-5 text-center text-sm font-semibold text-[#b2adc7] md:text-[1.15rem]">
        Auto-refreshes every 60 seconds.
      </div>
    </div>
  );
}
