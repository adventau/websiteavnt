import { ProjectStatus } from "@prisma/client";
import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(2),
  thumbnailUrl: z.string().url().optional().nullable(),
  description: z.string().min(10),
  status: z.nativeEnum(ProjectStatus),
  category: z.string().min(2),
  robloxLink: z.string().url().optional().nullable(),
  robloxPlaceId: z.string().regex(/^[0-9]+$/).optional().nullable(),
  visits: z.coerce.number().int().min(0),
  favorites: z.coerce.number().int().min(0),
  featured: z.coerce.boolean(),
  visible: z.coerce.boolean(),
  sortOrder: z.coerce.number().int().min(0)
});

export type ProjectInput = z.infer<typeof projectSchema>;
