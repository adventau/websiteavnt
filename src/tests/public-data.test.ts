// src/tests/public-data.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Prisma
vi.mock("../lib/prisma", () => ({
  prisma: {
    project: {
      findMany: vi.fn(),
    },
    metric: {
      findMany: vi.fn(),
    },
    operatingSignal: {
      findMany: vi.fn(),
    },
    leadershipMember: {
      findMany: vi.fn(),
    },
    credibilityItem: {
      findMany: vi.fn(),
    },
    networkLink: {
      findMany: vi.fn(),
    },
    siteSettings: {
      upsert: vi.fn(),
    },
  },
}));

// Mock Roblox to avoid network calls
vi.mock("../lib/roblox", () => ({
  fetchLiveMetrics: vi.fn().mockResolvedValue(null),
}));

import { prisma } from "../lib/prisma";
import {
  getPublicProjects,
  getPublicOperatingSignals,
  getPublicLeadership,
  getPublicCredibility,
  getPublicNetworkLinks,
} from "../lib/public-data";

describe("getPublicProjects", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns visible projects", async () => {
    const mockProjects = [
      { id: "1", title: "Game A", visible: true, sortOrder: 0 },
    ];
    (prisma.project.findMany as any).mockResolvedValue(mockProjects);

    const result = await getPublicProjects();
    expect(result).toEqual(mockProjects);
    expect(prisma.project.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { visible: true },
      })
    );
  });
});

describe("getPublicOperatingSignals", () => {
  it("returns visible signals ordered by sortOrder", async () => {
    const mockSignals = [{ id: "1", title: "Signal 1", visible: true }];
    (prisma.operatingSignal.findMany as any).mockResolvedValue(mockSignals);

    const result = await getPublicOperatingSignals();
    expect(result).toEqual(mockSignals);
    expect(prisma.operatingSignal.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { visible: true } })
    );
  });
});

describe("getPublicLeadership", () => {
  it("returns visible members", async () => {
    const mockMembers = [{ id: "1", name: "Alice", role: "CEO", visible: true }];
    (prisma.leadershipMember.findMany as any).mockResolvedValue(mockMembers);

    const result = await getPublicLeadership();
    expect(result).toEqual(mockMembers);
  });
});

describe("getPublicCredibility", () => {
  it("returns visible items", async () => {
    const mockItems = [{ id: "1", title: "Cred 1", body: "Body", visible: true }];
    (prisma.credibilityItem.findMany as any).mockResolvedValue(mockItems);

    const result = await getPublicCredibility();
    expect(result).toEqual(mockItems);
  });
});

describe("getPublicNetworkLinks", () => {
  it("returns visible links", async () => {
    const mockLinks = [{ id: "1", label: "Twitter", url: "https://twitter.com", visible: true }];
    (prisma.networkLink.findMany as any).mockResolvedValue(mockLinks);

    const result = await getPublicNetworkLinks();
    expect(result).toEqual(mockLinks);
  });
});
