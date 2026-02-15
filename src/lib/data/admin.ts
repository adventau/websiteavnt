import { prisma } from "@/lib/prisma";

export async function reorderByIds(
  model: "project" | "metric" | "operatingSignal" | "credibilityItem" | "leadershipMember" | "networkLink",
  ids: string[]
) {
  await prisma.$transaction(async (tx) => {
    for (const [index, id] of ids.entries()) {
      switch (model) {
        case "project":
          await tx.project.update({ where: { id }, data: { sortOrder: index } });
          break;
        case "metric":
          await tx.metric.update({ where: { id }, data: { sortOrder: index } });
          break;
        case "operatingSignal":
          await tx.operatingSignal.update({ where: { id }, data: { sortOrder: index } });
          break;
        case "credibilityItem":
          await tx.credibilityItem.update({ where: { id }, data: { sortOrder: index } });
          break;
        case "leadershipMember":
          await tx.leadershipMember.update({ where: { id }, data: { sortOrder: index } });
          break;
        case "networkLink":
          await tx.networkLink.update({ where: { id }, data: { sortOrder: index } });
          break;
      }
    }
  });
}
