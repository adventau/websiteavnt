// src/components/public/TeamSection.tsx
import Image from "next/image";

interface Member {
  id: string;
  role: string;
  name: string;
  bio?: string | null;
  avatarUrl?: string | null;
}

export default function TeamSection({
  title,
  subtitle,
  members,
}: {
  title: string;
  subtitle: string;
  members: Member[];
}) {
  return (
    <section id="team" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl md:text-5xl text-avnt-text mb-4">{title}</h2>
          <p className="text-avnt-muted text-lg max-w-xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((m) => (
            <div key={m.id} className="glass rounded-2xl p-8 text-center group hover:border-avnt-purple/30 transition-all duration-300">
              <div className="relative w-20 h-20 mx-auto mb-5">
                {m.avatarUrl ? (
                  <Image
                    src={m.avatarUrl}
                    alt={m.name}
                    fill
                    className="rounded-2xl object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-avnt-purple to-purple-900 flex items-center justify-center">
                    <span className="font-display font-bold text-2xl text-white">
                      {m.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="text-avnt-purple-light text-xs font-semibold uppercase tracking-widest mb-1">
                {m.role}
              </div>
              <h3 className="font-display font-semibold text-avnt-text text-xl mb-3">{m.name}</h3>
              {m.bio && (
                <p className="text-avnt-muted text-sm leading-relaxed">{m.bio}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
