import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-valibot";
import { merge, minLength, object, string } from "valibot";
import { users } from "./users";
/**
 * A favorite is a user's bookmark of a specific piece of content.
 * content: The content of the favorite. If the favorite is a picture, this will be the object id. If the favorite is a note, this will be the note content.
 */
export const favorites = sqliteTable("favorites", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	title: text("title").notNull(),
	body: text("body").notNull(),
	referenceUrl: text("reference_url"),
	referenceTitle: text("reference_title"),
	createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const insertFavoriteSchema = merge([
	createInsertSchema(favorites),
	object({ title: string([minLength(1)]) }),
]);
