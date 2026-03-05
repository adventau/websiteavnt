// src/components/public/HeroSection.tsx
export default function HeroSection({
  title,
  subtitle,
  cta,
}: {
  title: string;
  subtitle: string;
  cta: string;
}) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      data-testid="hero-section"
    >
      {/* Background gradient orbs */}
      <div className="absolute inset-0 bg-avnt-gradient" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-avnt-purple/10 blur-[120px] -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-purple-900/15 blur-[100px] translate-y-1/3 -translate-x-1/4" />
      <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full bg-violet-800/8 blur-[80px] -translate-x-1/2 -translate-y-1/2" />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-glow" />
          <span className="text-avnt-muted text-sm font-medium">Live Games Active</span>
        </div>

        {/* Headline */}
        <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight mb-6">
          <span className="gradient-text">{title}</span>
        </h1>

        {/* Subheadline */}
        <p className="text-avnt-muted text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          {subtitle}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#games"
            className="px-8 py-3.5 bg-avnt-purple hover:bg-purple-600 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-purple-600/30 font-display"
          >
            {cta}
          </a>
          <a
            href="#about"
            className="px-8 py-3.5 glass text-avnt-text hover:border-avnt-purple/40 font-semibold rounded-lg transition-all duration-200 font-display"
          >
            Learn More
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-avnt-muted/50 animate-float">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 4v16M2 14l6 6 6-6" />
          </svg>
        </div>
      </div>
    </section>
  );
}
