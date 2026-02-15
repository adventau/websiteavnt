export const AUTO_ROBLOX_METRIC_KEYS = ["players_online", "total_visits", "total_favorites"] as const;

export function isAutoRobloxMetricKey(key: string) {
  return AUTO_ROBLOX_METRIC_KEYS.includes(key as (typeof AUTO_ROBLOX_METRIC_KEYS)[number]);
}

export function slugifyMetricKey(label: string) {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 40);
}
