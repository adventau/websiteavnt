import { prisma } from "@/lib/prisma";

const defaultSiteSettings = {
  id: 1,
  brandName: "AVNT Brand",
  logoUrl: null,
  footerText: "© AVNT Brand — All Rights Reserved",
  heroHeadline: "Structured leadership for digital communities and independent projects.",
  heroSubheadline:
    "AVNT Brand is a professional management and portfolio brand focused on overseeing, organizing, and supporting digital communities and independent projects.",
  aboutTitle: "About AVNT",
  aboutBody: "Professional management, intentional staffing, and portfolio oversight.",
  credibilityTitle: "Credibility",
  credibilitySubtitle: "Signals of trust: partners, platforms, and milestones.",
  gamesTitle: "Our Games",
  gamesSubtitle: "Active portfolio projects and community experiences.",
  pledgeTitle: "Our Quality Pledge",
  pledgeSubtitle: "A commitment to structure, security, and high operational standards.",
  teamTitle: "Our Team",
  teamSubtitle: "Leadership, operations, and delivery.",
  ctaTitle: "Join the network",
  ctaSubtitle: "Get updates, opportunities, and announcements across the AVNT portfolio."
};

export async function getSiteSettings() {
  return prisma.siteSettings.upsert({
    where: { id: 1 },
    create: defaultSiteSettings,
    update: {}
  });
}
