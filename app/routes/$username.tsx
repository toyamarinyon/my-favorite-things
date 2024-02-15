import { LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { Favorite, transform } from "~/components/favorite";
import { MainLayout } from "~/components/layout/main";
import { drizzle } from "~/db/drizzle";
import { findFavoritesByUserId } from "~/functions/favorites/findFavoritesByUserId";

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
	const username = params.username;
	invariant(username, "username is required");
	const env = context.env as Env;
	const db = drizzle(env);
	const user = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.username, username),
	});
	invariant(user, "user not found");
	const dbFavorites = await findFavoritesByUserId(user.id, { env });
	const favorites = transform(dbFavorites);
	return json({ favorites, username });
};

export default function Index() {
	const { username, favorites } = useLoaderData<typeof loader>();
	return (
		<MainLayout username={username}>
			<div className="divide-y divide-slate-400">
				<div className="flex flex-wrap -mr-1">
					{favorites.map(({ title, id, objectId, reference, createdAt }) => (
						<Favorite
							key={id}
							type="image"
							title={title}
							imageUrl={`/favorites/${objectId}/image`}
							reference={reference}
							createdAt={createdAt}
						/>
					))}
				</div>
			</div>
		</MainLayout>
	);
}
