// src/lib/public-data.ts
import { prisma } from "@/lib/prisma";
import { fetchLiveMetrics } from "@/lib/roblox";

export async function getPublicProjects() {
  return prisma.project.findMany({
    where: { visible: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

export async function getPublicMetrics() {
  // Try live Roblox data
  try {
    const projects = await prisma.project.findMany({
      where: { visible: true, robloxPlaceId: { not: null } },
      select: { robloxPlaceId: true },
    });

    const placeIds = projects
      .map((p) => p.robloxPlaceId!)
      .filter(Boolean);

    if (placeIds.length > 0) {
      const live = await fetchLiveMetrics(placeIds);
      if (live) {
        const storedMetrics = await prisma.metric.findMany({
          where: { visible: true },
          orderBy: [{ sortOrder: "asc" }],
        });

        return storedMetrics.map((m) => {
          if (m.key === "players_online")
            return { ...m, value: formatNumber(live.playersOnline) };
          if (m.key === "total_visits")
            return { ...m, value: formatNumber(live.totalVisits) };
          if (m.key === "total_favorites")
            return { ...m, value: formatNumber(live.totalFavorites) };
          if (m.key === "games_in_portfolio")
            return { ...m, value: live.gamesCount.toString() };
          return m;
        });
      }
    }
  } catch {
    // fall through to stored metrics
  }

  return prisma.metric.findMany({
    where: { visible: true },
    orderBy: [{ sortOrder: "asc" }],
  });
}

export async function getPublicOperatingSignals() {
  return prisma.operatingSignal.findMany({
    where: { visible: true },
    orderBy: [{ sortOrder: "asc" }],
  });
}

export async function getPublicLeadership() {
  return prisma.leadershipMember.findMany({
    where: { visible: true },
    orderBy: [{ sortOrder: "asc" }],
  });
}

export async function getPublicCredibility() {
  return prisma.credibilityItem.findMany({
    where: { visible: true },
    orderBy: [{ sortOrder: "asc" }],
  });
}

export async function getPublicNetworkLinks() {
  return prisma.networkLink.findMany({
    where: { visible: true },
    orderBy: [{ sortOrder: "asc" }],
  });
}

export async function getSiteSettings() {
  return prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}
