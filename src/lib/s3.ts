// src/lib/s3.ts
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function getS3Client(): S3Client | null {
  const endpoint = process.env.BUCKET_ENDPOINT;
  const region = process.env.BUCKET_REGION;
  const accessKeyId = process.env.BUCKET_ACCESS_KEY_ID;
  const secretAccessKey = process.env.BUCKET_SECRET_ACCESS_KEY;

  if (!endpoint || !region || !accessKeyId || !secretAccessKey) return null;

  return new S3Client({
    endpoint,
    region,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true,
  });
}

export async function createPresignedUploadUrl(
  key: string,
  contentType: string
): Promise<string | null> {
  const client = getS3Client();
  const bucket = process.env.BUCKET_NAME;
  if (!client || !bucket) return null;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(client, command, { expiresIn: 3600 });
}

export async function getObject(
  key: string
): Promise<{ body: ReadableStream; contentType: string } | null> {
  const client = getS3Client();
  const bucket = process.env.BUCKET_NAME;
  if (!client || !bucket) return null;

  try {
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    const response = await client.send(command);
    if (!response.Body) return null;

    return {
      body: response.Body.transformToWebStream(),
      contentType: response.ContentType ?? "application/octet-stream",
    };
  } catch {
    return null;
  }
}

export function getBucketPublicUrl(key: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  return `${siteUrl}/api/public/assets/${key}`;
}
