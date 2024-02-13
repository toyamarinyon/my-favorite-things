import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-valibot";
import {
	customAsync,
	merge,
	mergeAsync,
	minLength,
	object,
	objectAsync,
	string,
	stringAsync,
} from "valibot";
export const users = sqliteTable("users", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	username: text("username").notNull().unique(),
	clerkId: text("clerk_id").notNull().unique(),
	createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const insertUserSchema = merge([
	createInsertSchema(users),
	object({ username: string([minLength(1)]) }),
]);

export const prepareInsertUserSchema = (
	uniquenessValidation: (parsedUsername: string) => Promise<boolean>,
) =>
	mergeAsync([
		createInsertSchema(users),
		objectAsync({
			username: stringAsync([
				minLength(1),
				customAsync(
					uniquenessValidation,
					(issue) => `${issue.input} is already taken`,
				),
			]),
		}),
	]);
