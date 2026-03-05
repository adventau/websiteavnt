// src/app/page.tsx
import { Suspense } from "react";
import Nav from "@/components/public/Nav";
import HeroSection from "@/components/public/HeroSection";
import MetricsSection from "@/components/public/MetricsSection";
import AboutSection from "@/components/public/AboutSection";
import GamesSection from "@/components/public/GamesSection";
import CredibilitySection from "@/components/public/CredibilitySection";
import TeamSection from "@/components/public/TeamSection";
import NetworkSection from "@/components/public/NetworkSection";
import Footer from "@/components/public/Footer";
import {
  getSiteSettings,
  getPublicProjects,
  getPublicOperatingSignals,
  getPublicLeadership,
  getPublicCredibility,
  getPublicNetworkLinks,
} from "@/lib/public-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, projects, signals, leaders, credibility, networkLinks] =
    await Promise.all([
      getSiteSettings(),
      getPublicProjects(),
      getPublicOperatingSignals(),
      getPublicLeadership(),
      getPublicCredibility(),
      getPublicNetworkLinks(),
    ]);

  return (
    <main className="min-h-screen bg-avnt-bg overflow-x-hidden">
      <Nav brand={settings.brand} logoUrl={settings.logoUrl} />

      <HeroSection
        title={settings.heroTitle}
        subtitle={settings.heroSubtitle}
        cta={settings.heroCta}
      />

      <Suspense fallback={<div className="h-48" />}>
        <MetricsSection
          title={settings.metricsTitle}
          subtitle={settings.metricsSubtitle}
        />
      </Suspense>

      <AboutSection
        title={settings.aboutTitle}
        body={settings.aboutBody}
        signals={signals}
      />

      <GamesSection
        title={settings.gamesTitle}
        subtitle={settings.gamesSubtitle}
        projects={projects}
      />

      <CredibilitySection
        title={settings.credTitle}
        items={credibility}
      />

      <TeamSection
        title={settings.teamTitle}
        subtitle={settings.teamSubtitle}
        members={leaders}
      />

      <NetworkSection
        title={settings.networkTitle}
        subtitle={settings.networkSubtitle}
        links={networkLinks}
      />

      <Footer text={settings.footerText} links={networkLinks.slice(0, 4)} />
    </main>
  );
}
