import { z } from "zod";

export const idSchema = z.object({ id: z.string().min(1) });

export const metricSchema = z.object({
  key: z.string().min(2),
  label: z.string().min(2),
  value: z.string().min(1),
  trend: z.string().optional().nullable(),
  visible: z.coerce.boolean(),
  sortOrder: z.coerce.number().int().min(0)
});

export const operatingSignalSchema = z.object({
  title: z.string().min(2),
  subtitle: z.string().min(2),
  description: z.string().min(10),
  visible: z.coerce.boolean(),
  sortOrder: z.coerce.number().int().min(0)
});

export const credibilitySchema = z.object({
  title: z.string().min(2),
  body: z.string().min(5),
  visible: z.coerce.boolean(),
  sortOrder: z.coerce.number().int().min(0)
});

export const leadershipSchema = z.object({
  role: z.string().min(2),
  name: z.string().min(2),
  bio: z.string().min(10),
  avatarUrl: z.string().url().optional().nullable(),
  visible: z.coerce.boolean(),
  sortOrder: z.coerce.number().int().min(0)
});

export const networkLinkSchema = z.object({
  label: z.string().min(2),
  url: z.string().url(),
  description: z.string().optional().nullable(),
  visible: z.coerce.boolean(),
  sortOrder: z.coerce.number().int().min(0)
});

export const reorderSchema = z.object({
  ids: z.array(z.string().min(1)).min(1)
});
