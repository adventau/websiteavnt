import { describe, expect, it } from "vitest";
import { projectSchema } from "../../src/lib/schemas/project";

describe("projectSchema", () => {
  it("accepts valid project payload", () => {
    const result = projectSchema.safeParse({
      title: "AVNT Ops",
      thumbnailUrl: "https://example.com/a.png",
      description: "A long enough description for the project payload.",
      status: "ACTIVE",
      category: "Community",
      robloxLink: "https://roblox.com/games/1",
      visits: 100,
      favorites: 20,
      featured: true,
      visible: true,
      sortOrder: 0
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid status", () => {
    const result = projectSchema.safeParse({
      title: "Bad",
      description: "A long enough description for validation.",
      status: "UNKNOWN",
      category: "Test",
      visits: 0,
      favorites: 0,
      featured: false,
      visible: true,
      sortOrder: 0
    });

    expect(result.success).toBe(false);
  });
});
