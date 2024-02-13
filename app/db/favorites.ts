import { createId } from "@paralleldrive/cuid2";
import { blob, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-valibot";
import { merge, minLength, object, string } from "valibot";
import { users } from "./users";
export const favorites = sqliteTable("favorites", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	title: text("title").notNull(),
	objectId: text("object_id").notNull().unique(),
	referenceUrl: text("reference_url"),
	referenceTitle: text("reference_title"),
});

export const insertFavoriteSchema = merge([
	createInsertSchema(favorites),
	object({ title: string([minLength(1)]) }),
]);