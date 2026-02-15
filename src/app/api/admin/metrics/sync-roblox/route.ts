import { ensureAdminResponse } from "@/lib/auth/route-guard";
import { prisma } from "@/lib/prisma";
import { fetchRobloxTotals, toAutoDisplayMetrics } from "@/lib/roblox";
import { fail, ok } from "@/lib/utils/http";

export async function POST() {
  const denied = await ensureAdminResponse();
  if (denied) return denied;

  const projects = await prisma.project.findMany({
    where: { robloxPlaceId: { not: null } },
    select: { id: true, robloxPlaceId: true }
  });

  if (!projects.length) {
    return fail("No projects with robloxPlaceId found.", 400);
  }

  const totals = await fetchRobloxTotals(projects);
  const cards = toAutoDisplayMetrics(totals);

  for (const [index, card] of cards.entries()) {
    await prisma.metric.upsert({
      where: { key: card.id },
      create: {
        key: card.id,
        label: card.label,
        value: card.value,
        trend: card.trend,
        sortOrder: index + 1,
        visible: true
      },
      update: {
        label: card.label,
        value: card.value,
        trend: card.trend,
        sortOrder: index + 1
      }
    });
  }

  return ok({ synced: true, cards });
}
