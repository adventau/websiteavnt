import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "@/lib/env";

const client =
  env.BUCKET_ENDPOINT && env.BUCKET_ACCESS_KEY_ID && env.BUCKET_SECRET_ACCESS_KEY && env.BUCKET_REGION
    ? new S3Client({
        endpoint: env.BUCKET_ENDPOINT,
        region: env.BUCKET_REGION,
        credentials: {
          accessKeyId: env.BUCKET_ACCESS_KEY_ID,
          secretAccessKey: env.BUCKET_SECRET_ACCESS_KEY
        },
        forcePathStyle: true
      })
    : null;

export async function GET(_: Request, context: { params: Promise<{ key: string[] }> }) {
  if (!client || !env.BUCKET_NAME) {
    return new Response("Bucket not configured", { status: 503 });
  }

  const { key: keyParts } = await context.params;
  const key = keyParts.join("/");
  const result = await client.send(
    new GetObjectCommand({
      Bucket: env.BUCKET_NAME,
      Key: key
    })
  );

  if (!result.Body) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(result.Body.transformToWebStream(), {
    headers: {
      "Content-Type": result.ContentType ?? "application/octet-stream",
      "Cache-Control": "public, max-age=600"
    }
  });
}
