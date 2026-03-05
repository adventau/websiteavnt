// src/lib/roblox.ts

const ROBLOX_API = "https://apis.roblox.com";
const GAMES_API = "https://games.roblox.com";
const THUMBNAILS_API = "https://thumbnails.roblox.com";
const UNIVERSES_API = "https://games.roblox.com";

export async function getUniverseIdFromPlaceId(
  placeId: string
): Promise<string | null> {
  try {
    const res = await fetch(
      `${GAMES_API}/v1/games/multiget-place-details?placeIds=${placeId}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.[0]?.universeId?.toString() ?? null;
  } catch {
    return null;
  }
}

export interface RobloxGameData {
  universeId: string;
  name: string;
  description: string;
  playing: number;
  visits: number;
  favoritedCount: number;
  rootPlaceId: string;
}

export async function getGamesData(
  universeIds: string[]
): Promise<RobloxGameData[]> {
  if (universeIds.length === 0) return [];

  const chunks: string[][] = [];
  for (let i = 0; i < universeIds.length; i += 100) {
    chunks.push(universeIds.slice(i, i + 100));
  }

  const results: RobloxGameData[] = [];

  for (const chunk of chunks) {
    try {
      const res = await fetch(
        `${GAMES_API}/v1/games?universeIds=${chunk.join(",")}`,
        { next: { revalidate: 60 } }
      );
      if (!res.ok) continue;
      const data = await res.json();
      for (const g of data.data ?? []) {
        results.push({
          universeId: g.id?.toString(),
          name: g.name,
          description: g.description,
          playing: g.playing ?? 0,
          visits: g.visits ?? 0,
          favoritedCount: g.favoritedCount ?? 0,
          rootPlaceId: g.rootPlaceId?.toString(),
        });
      }
    } catch {
      // skip chunk on error
    }
  }

  return results;
}

export async function getPlaceThumbnail(
  universeId: string
): Promise<string | null> {
  try {
    const res = await fetch(
      `${THUMBNAILS_API}/v1/games/icons?universeIds=${universeId}&returnPolicy=PlaceHolder&size=512x512&format=Png&isCircular=false`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data?.[0]?.imageUrl ?? null;
  } catch {
    return null;
  }
}

export function buildRobloxGameUrl(placeId: string): string {
  return `https://www.roblox.com/games/${placeId}`;
}

export async function autofillFromPlaceId(placeId: string) {
  const universeId = await getUniverseIdFromPlaceId(placeId);
  if (!universeId) return null;

  const [games, thumbnail] = await Promise.all([
    getGamesData([universeId]),
    getPlaceThumbnail(universeId),
  ]);

  const game = games[0];
  if (!game) return null;

  return {
    title: game.name,
    description: game.description,
    thumbnailUrl: thumbnail,
    robloxLink: buildRobloxGameUrl(placeId),
    visits: game.visits,
    favorites: game.favoritedCount,
  };
}

export async function fetchLiveMetrics(
  placeIds: string[]
): Promise<{
  playersOnline: number;
  totalVisits: number;
  totalFavorites: number;
  gamesCount: number;
} | null> {
  try {
    const universeIds: string[] = [];
    await Promise.all(
      placeIds.map(async (pid) => {
        const uid = await getUniverseIdFromPlaceId(pid);
        if (uid) universeIds.push(uid);
      })
    );

    if (universeIds.length === 0) return null;

    const games = await getGamesData(universeIds);
    if (games.length === 0) return null;

    return {
      playersOnline: games.reduce((s, g) => s + g.playing, 0),
      totalVisits: games.reduce((s, g) => s + g.visits, 0),
      totalFavorites: games.reduce((s, g) => s + g.favoritedCount, 0),
      gamesCount: games.length,
    };
  } catch {
    return null;
  }
}
