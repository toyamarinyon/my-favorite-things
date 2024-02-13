/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/cloudflare" />
/// <reference types="@cloudflare/workers-types" />
interface Env {
  OPENAI_API_KEY: string;
  DB: D1Database;
  BUCKET: R2Bucket;
}
