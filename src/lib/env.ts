import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  CLERK_SECRET_KEY: z.string().optional(),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional(),
  BUCKET_ENDPOINT: z.string().url().optional(),
  BUCKET_REGION: z.string().optional(),
  BUCKET_ACCESS_KEY_ID: z.string().optional(),
  BUCKET_SECRET_ACCESS_KEY: z.string().optional(),
  BUCKET_NAME: z.string().optional(),
  ADMIN_EMAILS: z.string().optional()
});

type Env = z.infer<typeof envSchema>;

const parsed = envSchema.safeParse(process.env);

export const env: Partial<Env> = parsed.success
  ? parsed.data
  : {
      DATABASE_URL: process.env.DATABASE_URL,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      BUCKET_ENDPOINT: process.env.BUCKET_ENDPOINT,
      BUCKET_REGION: process.env.BUCKET_REGION,
      BUCKET_ACCESS_KEY_ID: process.env.BUCKET_ACCESS_KEY_ID,
      BUCKET_SECRET_ACCESS_KEY: process.env.BUCKET_SECRET_ACCESS_KEY,
      BUCKET_NAME: process.env.BUCKET_NAME,
      ADMIN_EMAILS: process.env.ADMIN_EMAILS
    };

export function parseAdminEmails() {
  return (env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export function requiredEnv(name: keyof Env) {
  const value = env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}
