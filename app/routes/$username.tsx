import { LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { Favorite, transform } from "~/components/favorite";
import { MainLayout } from "~/components/layout/main";
import { drizzle } from "~/db/drizzle";
import { findFavoritesByUserId } from "~/functions/favorites/findFavoritesByUserId";

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
	const username = params.username;
	if (username == null) {
		return new Response("Not Found", { status: 404 });
	}
	const env = context.env as Env;
	const db = drizzle(env);
	const user = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.username, username),
	});
	if (user == null) {
		return new Response("Not Found", { status: 404 });
	}
	const dbFavorites = await findFavoritesByUserId(user.id, { env });
	const favorites = transform(dbFavorites);
	return json({ favorites });
};

export default function Index() {
	const data = useLoaderData<typeof loader>();
	return (
		<MainLayout>
			<div className="divide-y divide-slate-400">
				<div className="flex flex-wrap -mr-1">
					{data.favorites.map(
						({ title, id, objectId, reference, createdAt }) => (
							<Favorite
								key={id}
								type="image"
								title={title}
								imageUrl={`/favorites/${objectId}/image`}
								reference={reference}
								createdAt={createdAt}
							/>
						),
					)}
				</div>
			</div>
		</MainLayout>
	);
}
