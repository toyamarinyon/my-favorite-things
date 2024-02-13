import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { drizzle } from "~/db/drizzle";
import { prepareInsertUserSchema, users } from "~/db/users";

import { getAuth } from "@clerk/remix/ssr.server";
import { parseAsync } from "valibot";

export const createUser = async (args: ActionFunctionArgs) => {
	const db = drizzle(args.context.env as Env);
	const { userId: clerkId } = await getAuth(args);
	const formData = await args.request.formData();
	const username = formData.get("username");
	const sameUsernameUser = async (parsedUsername: string) => {
		const result = await db.query.users.findFirst({
			where: (users, { eq }) => eq(users.username, parsedUsername),
		});
		return result == null;
	};
	const inputUserSchema = prepareInsertUserSchema(sameUsernameUser);
	const input = await parseAsync(inputUserSchema, {
		username,
		clerkId,
	});
	await db.insert(users).values({
		...input,
	});
};
