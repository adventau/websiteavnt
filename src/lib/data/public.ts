import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/data/site-settings";
import { fetchRobloxTotals, toAutoDisplayMetrics } from "@/lib/roblox";

export async function getPublicMetrics() {
  return prisma.metric.findMany({
    where: { visible: true },
    orderBy: { sortOrder: "asc" }
  });
}

export async function getLivePublicMetrics() {
  const [projects, storedMetrics] = await Promise.all([
    prisma.project.findMany({
      where: { visible: true, robloxPlaceId: { not: null } },
      select: { id: true, robloxPlaceId: true }
    }),
    prisma.metric.findMany({
      where: { visible: true },
      orderBy: { sortOrder: "asc" }
    })
  ]);

  if (!projects.length) {
    return storedMetrics;
  }

  try {
    const totals = await fetchRobloxTotals(projects);
    const autoCards = toAutoDisplayMetrics(totals);

    const gamesMetric = storedMetrics.find((metric) => metric.key === "games_in_portfolio") ?? {
      id: "games_in_portfolio",
      key: "games_in_portfolio",
      label: "Games in portfolio",
      value: String(totals.gameCount),
      trend: "Live"
    };

    return [
      ...autoCards,
      {
        id: gamesMetric.id,
        label: gamesMetric.label,
        value: gamesMetric.value,
        trend: gamesMetric.trend
      }
    ];
  } catch {
    return storedMetrics;
  }
}

export async function getPublicProjects() {
  return prisma.project.findMany({
    where: { visible: true },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }]
  });
}

export async function getPublicOperatingSignals() {
  return prisma.operatingSignal.findMany({
    where: { visible: true },
    orderBy: { sortOrder: "asc" }
  });
}

export async function getPublicLeadership() {
  return prisma.leadershipMember.findMany({
    where: { visible: true },
    orderBy: { sortOrder: "asc" }
  });
}

export async function getPublicCredibility() {
  return prisma.credibilityItem.findMany({
    where: { visible: true },
    orderBy: { sortOrder: "asc" }
  });
}

export async function getPublicNetworkLinks() {
  return prisma.networkLink.findMany({
    where: { visible: true },
    orderBy: { sortOrder: "asc" }
  });
}

export async function getPublicSiteSettings() {
  return getSiteSettings();
}
