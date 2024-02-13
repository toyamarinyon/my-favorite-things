import { createId } from "@paralleldrive/cuid2";
import { text, blob, sqliteTable } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import { merge, minLength, object, string } from "valibot";
import { createInsertSchema } from "drizzle-valibot";
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
