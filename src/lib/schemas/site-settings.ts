import { z } from "zod";

export const siteSettingsSchema = z.object({
  brandName: z.string().min(1),
  logoUrl: z.union([z.string().url(), z.string().startsWith("/")]).nullable().optional(),
  footerText: z.string().min(1),
  heroHeadline: z.string().min(1),
  heroSubheadline: z.string().min(1),
  aboutTitle: z.string().min(1),
  aboutBody: z.string().min(1),
  credibilityTitle: z.string().min(1),
  credibilitySubtitle: z.string().min(1),
  gamesTitle: z.string().min(1),
  gamesSubtitle: z.string().min(1),
  pledgeTitle: z.string().min(1),
  pledgeSubtitle: z.string().min(1),
  teamTitle: z.string().min(1),
  teamSubtitle: z.string().min(1),
  ctaTitle: z.string().min(1),
  ctaSubtitle: z.string().min(1)
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
