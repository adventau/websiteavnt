// src/lib/schemas.ts
import { z } from "zod";

const boolCoerce = z
  .union([z.boolean(), z.string()])
  .transform((v) => v === true || v === "true");

const numCoerce = z.coerce.number();

export const ProjectSchema = z.object({
  title: z.string().min(1, "Title required"),
  thumbnailUrl: z.string().url().optional().nullable(),
  description: z.string().optional().nullable(),
  status: z.enum(["ACTIVE", "SCALING", "PAUSED"]).default("ACTIVE"),
  category: z.string().optional().nullable(),
  robloxLink: z.string().url().optional().nullable(),
  robloxPlaceId: z.string().optional().nullable(),
  visits: numCoerce.optional().default(0),
  favorites: numCoerce.optional().default(0),
  featured: boolCoerce.optional().default(false),
  visible: boolCoerce.optional().default(true),
  sortOrder: numCoerce.optional().default(0),
});

export const MetricSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  value: z.string(),
  trend: z.string().optional().nullable(),
  visible: boolCoerce.optional().default(true),
  sortOrder: numCoerce.optional().default(0),
});

export const OperatingSignalSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  visible: boolCoerce.optional().default(true),
  sortOrder: numCoerce.optional().default(0),
});

export const CredibilityItemSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  visible: boolCoerce.optional().default(true),
  sortOrder: numCoerce.optional().default(0),
});

export const LeadershipMemberSchema = z.object({
  role: z.string().min(1),
  name: z.string().min(1),
  bio: z.string().optional().nullable(),
  avatarUrl: z.string().url().optional().nullable(),
  visible: boolCoerce.optional().default(true),
  sortOrder: numCoerce.optional().default(0),
});

export const NetworkLinkSchema = z.object({
  label: z.string().min(1),
  url: z.string().url("Must be a valid URL"),
  description: z.string().optional().nullable(),
  visible: boolCoerce.optional().default(true),
  sortOrder: numCoerce.optional().default(0),
});

export const SiteSettingsSchema = z.object({
  brand: z.string().optional(),
  logoUrl: z.string().url().optional().nullable(),
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  heroCta: z.string().optional(),
  aboutTitle: z.string().optional(),
  aboutBody: z.string().optional(),
  metricsTitle: z.string().optional(),
  metricsSubtitle: z.string().optional(),
  gamesTitle: z.string().optional(),
  gamesSubtitle: z.string().optional(),
  credTitle: z.string().optional(),
  teamTitle: z.string().optional(),
  teamSubtitle: z.string().optional(),
  networkTitle: z.string().optional(),
  networkSubtitle: z.string().optional(),
  footerText: z.string().optional(),
});

export const ReorderSchema = z.object({
  ids: z.array(z.string()).min(1),
});

export type ProjectInput = z.infer<typeof ProjectSchema>;
export type MetricInput = z.infer<typeof MetricSchema>;
export type SiteSettingsInput = z.infer<typeof SiteSettingsSchema>;
