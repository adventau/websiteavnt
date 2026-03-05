// src/app/api/admin/metrics/sync-roblox/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isAdminResponse } from "@/lib/admin-guard";
import { fetchLiveMetrics } from "@/lib/roblox";

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (isAdminResponse(guard)) return guard;

  const projects = await prisma.project.findMany({
    where: { visible: true, robloxPlaceId: { not: null } },
    select: { robloxPlaceId: true },
  });

  const placeIds = projects.map((p) => p.robloxPlaceId!).filter(Boolean);
  if (placeIds.length === 0) {
    return NextResponse.json({ error: "No projects with Roblox place IDs" }, { status: 400 });
  }

  const live = await fetchLiveMetrics(placeIds);
  if (!live) {
    return NextResponse.json({ error: "Failed to fetch Roblox metrics" }, { status: 502 });
  }

  function formatNum(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
    if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
    return n.toString();
  }

  const upserts = [
    { key: "players_online", label: "Players Online", value: formatNum(live.playersOnline), trend: null },
    { key: "total_visits", label: "Total Visits", value: formatNum(live.totalVisits), trend: null },
    { key: "total_favorites", label: "Total Favorites", value: formatNum(live.totalFavorites), trend: null },
    { key: "games_in_portfolio", label: "Games in Portfolio", value: live.gamesCount.toString(), trend: null },
  ];

  const results = await Promise.all(
    upserts.map((u) =>
      prisma.metric.upsert({
        where: { key: u.key },
        update: { value: u.value },
        create: { ...u, visible: true, sortOrder: upserts.indexOf(u) },
      })
    )
  );

  return NextResponse.json({ data: results });
}
