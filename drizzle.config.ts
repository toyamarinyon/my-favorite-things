import type { Config } from "drizzle-kit";

export default {
  schema: "./app/db/schema.ts",
  out: "./migrations",
  driver: "d1",
} satisfies Config;
