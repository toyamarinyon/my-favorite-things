import { AppLoadContext } from "@remix-run/cloudflare";
import { drizzle } from "~/db/drizzle";

export const findUserByClerkUserId = async (
  clerkUserId: string,
  context: AppLoadContext
) => {
  const db = drizzle(context.env as Env);
  return db.query.users.findFirst({
    where: (users, { eq }) => eq(users.clerkId, clerkUserId),
  });
};
