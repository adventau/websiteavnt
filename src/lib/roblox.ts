import type { Project } from "@prisma/client";

type RobloxGame = {
  id: number;
  name?: string;
  description?: string;
  playing?: number;
  visits?: number;
  favoritedCount?: number;
  favoritesCount?: number;
};

type RobloxTotals = {
  playersOnline: number;
  totalVisits: number;
  totalFavorites: number;
  gameCount: number;
  byUniverse: Map<number, RobloxGame>;
};

type RobloxThumbnailResponse = {
  data?: Array<{
    targetId: number;
    state: string;
    imageUrl?: string;
  }>;
};

const jsonHeaders = {
  "Content-Type": "application/json"
};

function chunk<T>(items: T[], size: number) {
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
}

function toMetricString(value: number) {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return `${value}`;
}

export async function getUniverseId(placeId: string) {
  const res = await fetch(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`, {
    headers: jsonHeaders,
    cache: "no-store"
  });

  if (!res.ok) {
    return null;
  }

  const json = (await res.json()) as { universeId?: number };
  return json.universeId ?? null;
}

async function getGamesByUniverseIds(universeIds: number[]) {
  if (!universeIds.length) return [] as RobloxGame[];

  const batches = chunk(universeIds, 100);
  const all: RobloxGame[] = [];

  for (const ids of batches) {
    const query = ids.join(",");
    const res = await fetch(`https://games.roblox.com/v1/games?universeIds=${query}`, {
      headers: jsonHeaders,
      cache: "no-store"
    });

    if (!res.ok) continue;
    const json = (await res.json()) as { data?: RobloxGame[] };
    all.push(...(json.data ?? []));
  }

  return all;
}

export async function getRobloxThumbnailByPlaceId(placeId: string) {
  const response = await fetch(
    `https://thumbnails.roblox.com/v1/places/gameicons?placeIds=${placeId}&returnPolicy=PlaceHolder&size=512x512&format=Png&isCircular=false`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    return null;
  }

  const json = (await response.json()) as RobloxThumbnailResponse;
  const first = json.data?.[0];
  if (!first?.imageUrl || first.state !== "Completed") {
    return null;
  }

  return first.imageUrl;
}

export function robloxGameUrlFromPlaceId(placeId: string) {
  return `https://www.roblox.com/games/${placeId}`;
}

export async function getRobloxProjectAutofillByPlaceId(placeId: string) {
  const universeId = await getUniverseId(placeId);
  if (!universeId) {
    return null;
  }

  const response = await fetch(`https://games.roblox.com/v1/games?universeIds=${universeId}`, {
    headers: jsonHeaders,
    cache: "no-store"
  });

  if (!response.ok) {
    return null;
  }

  const json = (await response.json()) as { data?: RobloxGame[] };
  const game = json.data?.[0];
  const thumbnailUrl = await getRobloxThumbnailByPlaceId(placeId);

  return {
    title: game?.name ?? null,
    description: game?.description ?? null,
    thumbnailUrl,
    robloxLink: robloxGameUrlFromPlaceId(placeId)
  };
}

export async function fetchRobloxTotals(projects: Pick<Project, "id" | "robloxPlaceId">[]): Promise<RobloxTotals> {
  const ids = projects.map((project) => project.robloxPlaceId).filter((id): id is string => Boolean(id));
  if (!ids.length) {
    return {
      playersOnline: 0,
      totalVisits: 0,
      totalFavorites: 0,
      gameCount: 0,
      byUniverse: new Map()
    };
  }

  const universes = await Promise.all(ids.map((placeId) => getUniverseId(placeId)));
  const universeIds = universes.filter((value): value is number => value !== null);
  const games = await getGamesByUniverseIds(universeIds);

  const totals = games.reduce(
    (acc, game) => {
      acc.playersOnline += game.playing ?? 0;
      acc.totalVisits += game.visits ?? 0;
      acc.totalFavorites += game.favoritedCount ?? game.favoritesCount ?? 0;
      return acc;
    },
    {
      playersOnline: 0,
      totalVisits: 0,
      totalFavorites: 0
    }
  );

  return {
    playersOnline: totals.playersOnline,
    totalVisits: totals.totalVisits,
    totalFavorites: totals.totalFavorites,
    gameCount: games.length,
    byUniverse: new Map(games.map((game) => [game.id, game]))
  };
}

export function toAutoDisplayMetrics(totals: Omit<RobloxTotals, "byUniverse" | "gameCount">) {
  return [
    {
      id: "players_online",
      label: "Players online now",
      value: toMetricString(totals.playersOnline),
      trend: "Live"
    },
    {
      id: "total_visits",
      label: "Total visits",
      value: toMetricString(totals.totalVisits),
      trend: "Live"
    },
    {
      id: "total_favorites",
      label: "Total favorites",
      value: toMetricString(totals.totalFavorites),
      trend: "Live"
    }
  ];
}
