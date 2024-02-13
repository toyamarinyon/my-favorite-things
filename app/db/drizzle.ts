import { drizzle as drizzleClient } from "drizzle-orm/d1";
import * as schema from "./schema";

export const drizzle = (env: Env) => drizzleClient(env.DB, { schema });
