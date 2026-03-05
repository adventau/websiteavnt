// src/components/public/Footer.tsx
interface Link {
  id: string;
  label: string;
  url: string;
}

export default function Footer({ text, links }: { text: string; links: Link[] }) {
  return (
    <footer className="border-t border-avnt-border py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <p className="text-avnt-muted text-sm">{text}</p>
        <div className="flex items-center gap-6">
          {links.map((l) => (
            <a
              key={l.id}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-avnt-muted hover:text-avnt-text text-sm transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
