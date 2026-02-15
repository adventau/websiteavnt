import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/lib/env";
import type { UploadSignInput } from "@/lib/schemas/upload";

const resolvedEndpoint = env.BUCKET_ENDPOINT
  ? env.BUCKET_ENDPOINT.startsWith("http://") || env.BUCKET_ENDPOINT.startsWith("https://")
    ? env.BUCKET_ENDPOINT
    : `https://${env.BUCKET_ENDPOINT}`
  : undefined;

const client =
  resolvedEndpoint && env.BUCKET_ACCESS_KEY_ID && env.BUCKET_SECRET_ACCESS_KEY && env.BUCKET_REGION
    ? new S3Client({
        endpoint: resolvedEndpoint,
        region: env.BUCKET_REGION,
        credentials: {
          accessKeyId: env.BUCKET_ACCESS_KEY_ID,
          secretAccessKey: env.BUCKET_SECRET_ACCESS_KEY
        },
        forcePathStyle: true
      })
    : null;

export async function createUploadSignature(input: UploadSignInput) {
  const missing = [
    !resolvedEndpoint && "BUCKET_ENDPOINT",
    !env.BUCKET_REGION && "BUCKET_REGION",
    !env.BUCKET_ACCESS_KEY_ID && "BUCKET_ACCESS_KEY_ID",
    !env.BUCKET_SECRET_ACCESS_KEY && "BUCKET_SECRET_ACCESS_KEY",
    !env.BUCKET_NAME && "BUCKET_NAME"
  ].filter(Boolean) as string[];

  if (!client || missing.length > 0) {
    throw new Error(
      `Bucket environment variables are not configured: ${missing.join(", ")}`
    );
  }

  const safeFilename = input.filename.replace(/[^a-zA-Z0-9-_.]/g, "-");
  const key = `${input.folder}/${Date.now()}-${safeFilename}`;

  const command = new PutObjectCommand({
    Bucket: env.BUCKET_NAME,
    Key: key,
    ContentType: input.contentType
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 60 });

  return {
    key,
    uploadUrl,
    publicPath: `/api/public/assets/${encodeURIComponent(key)}`
  };
}
