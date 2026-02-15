import { describe, expect, it, vi } from "vitest";

vi.mock("../../src/lib/prisma", () => ({
  prisma: {
    metric: { findMany: vi.fn().mockResolvedValue([{ id: "1", label: "Metric", value: "10", trend: null }]) },
    project: { findMany: vi.fn().mockResolvedValue([{ id: "p1", title: "Project" }]) },
    operatingSignal: { findMany: vi.fn().mockResolvedValue([{ id: "s1", title: "Signal" }]) },
    leadershipMember: { findMany: vi.fn().mockResolvedValue([{ id: "l1", name: "Leader" }]) },
    credibilityItem: { findMany: vi.fn().mockResolvedValue([{ id: "c1", title: "Trust" }]) },
    networkLink: { findMany: vi.fn().mockResolvedValue([{ id: "n1", label: "X" }]) }
  }
}));

import { getPublicMetrics, getPublicProjects } from "../../src/lib/data/public";

describe("public data service", () => {
  it("returns metrics", async () => {
    await expect(getPublicMetrics()).resolves.toHaveLength(1);
  });

  it("returns projects", async () => {
    await expect(getPublicProjects()).resolves.toHaveLength(1);
  });
});
