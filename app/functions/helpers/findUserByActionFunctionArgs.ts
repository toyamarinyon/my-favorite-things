import { getAuth } from "@clerk/remix/ssr.server";
import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { drizzle } from "~/db/drizzle";

export const findUserByActionFunctionArgs = async (
	args: ActionFunctionArgs,
) => {
	const { userId: clerkUserId } = await getAuth(args);
	if (clerkUserId == null) {
		return undefined;
	}
	const db = drizzle(args.context.env as Env);
	return db.query.users.findFirst({
		where: (users, { eq }) => eq(users.clerkId, clerkUserId),
	});
};
