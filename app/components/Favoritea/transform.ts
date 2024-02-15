import { favorites } from "~/db/favorites";

export const transform = (dbFavorites: (typeof favorites.$inferSelect)[]) =>
	dbFavorites.map(({ referenceUrl, referenceTitle, ...favorite }) => {
		const reference =
			referenceUrl != null
				? { url: referenceUrl, title: referenceTitle ?? referenceUrl }
				: null;
		return {
			...favorite,
			reference,
		};
	});
