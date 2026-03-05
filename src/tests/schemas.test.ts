// src/tests/schemas.test.ts
import { describe, it, expect } from "vitest";
import { ProjectSchema, MetricSchema, NetworkLinkSchema } from "../lib/schemas";

describe("ProjectSchema", () => {
  it("validates a valid project", () => {
    const result = ProjectSchema.safeParse({
      title: "Test Game",
      status: "ACTIVE",
      visible: true,
      featured: false,
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing title", () => {
    const result = ProjectSchema.safeParse({
      status: "ACTIVE",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid status", () => {
    const result = ProjectSchema.safeParse({
      title: "Test",
      status: "INVALID",
    });
    expect(result.success).toBe(false);
  });

  it("coerces boolean strings", () => {
    const result = ProjectSchema.safeParse({
      title: "Test",
      featured: "true",
      visible: "false",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.featured).toBe(true);
      expect(result.data.visible).toBe(false);
    }
  });

  it("coerces number strings", () => {
    const result = ProjectSchema.safeParse({
      title: "Test",
      sortOrder: "5",
      visits: "1000",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.sortOrder).toBe(5);
      expect(result.data.visits).toBe(1000);
    }
  });

  it("accepts optional nullable fields", () => {
    const result = ProjectSchema.safeParse({
      title: "Test",
      description: null,
      thumbnailUrl: null,
      robloxPlaceId: null,
    });
    expect(result.success).toBe(true);
  });
});

describe("MetricSchema", () => {
  it("validates a valid metric", () => {
    const result = MetricSchema.safeParse({
      key: "players_online",
      label: "Players Online",
      value: "1.2K",
      trend: "+5%",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing key", () => {
    const result = MetricSchema.safeParse({
      label: "Players",
      value: "100",
    });
    expect(result.success).toBe(false);
  });
});

describe("NetworkLinkSchema", () => {
  it("rejects invalid URL", () => {
    const result = NetworkLinkSchema.safeParse({
      label: "Twitter",
      url: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid URL", () => {
    const result = NetworkLinkSchema.safeParse({
      label: "Twitter",
      url: "https://twitter.com/avnt",
    });
    expect(result.success).toBe(true);
  });
});
