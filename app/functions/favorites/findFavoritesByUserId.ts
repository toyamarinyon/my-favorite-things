import { desc } from "drizzle-orm";
import { drizzle } from "~/db/drizzle";
import { favorites } from "~/db/favorites";

type Context = {
	env: Env;
};
export const findFavoritesByUserId = async (
	userId: string,
	context: Context,
) => {
	const db = drizzle(context.env);
	return await db.query.favorites.findMany({
		where: (favorites, { eq }) => eq(favorites.userId, userId),
		orderBy: [desc(favorites.createdAt)],
	});
};
