import { getAuth } from "@clerk/remix/ssr.server";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { desc } from "drizzle-orm";
import { Favorite } from "~/components/favorite";
import { MainLayout } from "~/components/layout/main";
import { drizzle } from "~/db/drizzle";
import { favorites as favoritesSchema } from "~/db/schema";
import { findUserByClerkUserId } from "~/functions/users/findUser.server";

export const loader = async (args: LoaderFunctionArgs) => {
	const { userId } = await getAuth(args);
	if (!userId) {
		return redirect("/sign-in");
	}
	const user = await findUserByClerkUserId(userId, args.context);
	if (user == null) {
		return redirect("/onboarding");
	}

	const db = drizzle(args.context.env as Env);
	const dbFavorites = await db.query.favorites.findMany({
		where: (favorites, { eq }) => eq(favorites.userId, user.id),
		orderBy: [desc(favoritesSchema.createdAt)],
	});
	const favorites = dbFavorites.map(
		({ referenceUrl, referenceTitle, ...favorite }) => {
			const reference =
				referenceUrl != null
					? { url: referenceUrl, title: referenceTitle ?? referenceUrl }
					: null;
			return {
				...favorite,
				reference,
			};
		},
	);
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
					{/* <Favorite
            type="image"
            title="Relevence Onboarding UI"
            imageUrl="/images/1.jpeg"
          />
          <Favorite
            type="image"
            title="Fatih Akin at Death Stranding 2"
            imageUrl="/images/2.jpeg"
            references={[
              {
                title: "HIDEO_KOJIMA_EN on X",
                url: "https://twitter.com/HIDEO_KOJIMA_EN/status/1753687334347047107",
              },
            ]}
          />
          <Favorite
            title="スプラトゥーンがイカになった秘密"
            type="text"
            text="先に進めない状況のときに、阪口さんが、このゲームのキャラクターの
本来あるべき姿や機能などをまとめてくれたんです。
（中略）
その項目のひとつに「モチーフ」というのがあって、そこには
「インクを吐くことが納得いくモチーフ」という文章に続いて「イカ？」と書いてたんです。"
            references={[
              {
                title: "社長が訊く『Splatoon（スプラトゥーン）』",
                url: "https://www.nintendo.co.jp/wiiu/interview/agmj/vol1/index3.html",
              },
            ]}
          />
          <Favorite
            type="image"
            title="Y2K REMIXされたデザイン"
            imageUrl="/images/3.jpeg"
            references={[
              {
                title: "Poolsuite™",
                url: "https://poolsuite.net/",
              },
            ]}
          />
          <Favorite
            type="image"
            title="Minimalist Portfolio"
            imageUrl="/images/4.png"
            references={[
              {
                title: "Chris Yang",
                url: "https://ysm.dev/",
              },
            ]}
          />
          <Favorite
            type="image"
            title="Beautiful Flowchart"
            imageUrl="/images/5.png"
            references={[
              {
                title: "DanHollick on X",
                url: "https://twitter.com/DanHollick/status/1614970789199220738",
              },
            ]}
          /> */}
				</div>
			</div>
		</MainLayout>
	);
}
