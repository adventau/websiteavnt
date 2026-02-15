import { z } from "zod";

export const uploadSignSchema = z.object({
  filename: z.string().min(1),
  contentType: z.string().min(1),
  folder: z.string().optional().default("uploads")
});

export type UploadSignInput = z.infer<typeof uploadSignSchema>;
