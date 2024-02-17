import { getAuth } from "@clerk/remix/ssr.server";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/cloudflare";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { LinkIcon } from "lucide-react";
import invariant from "tiny-invariant";
import { match } from "ts-pattern";
import { MainLayout } from "~/components/layout/main";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { drizzle } from "~/db/drizzle";
import { favorites } from "~/db/favorites";
import { findUserByClerkUserId } from "~/functions/users/findUser.server";

export const loader = async (args: LoaderFunctionArgs) => {
	const { userId } = await getAuth(args);
	const user = await findUserByClerkUserId(userId, args.context);
	const db = drizzle(args.context.env as Env);
	const favorite = await db.query.favorites.findFirst({
		where: (favorites, { eq }) => {
			invariant(args.params.id, "id is required");
			return eq(favorites.id, args.params.id);
		},
	});
	console.log({ userId });
	invariant(favorite, "favorite not found");
	return json({ favorite, canDelete: favorite.userId === user?.id });
};

export const action = async ({ params, context }: LoaderFunctionArgs) => {
	invariant(params.id, "id is required");
	const db = drizzle(context.env as Env);
	await db.delete(favorites).where(eq(favorites.id, params.id));
	return redirect("/");
};

export default function FavoritePage() {
	const {
		favorite: { title, bodyType, referenceUrl, body, referenceTitle },
		canDelete,
	} = useLoaderData<typeof loader>();
	const deleteFetcher = useFetcher();
	return (
		<MainLayout>
			<div className="">
				<div className="flex">
					<div className="flex-1">
						{match(bodyType)
							.with("image", () => (
								<img
									src={`/favorites/${body}/image`}
									className="w-full"
									alt="capture"
								/>
							))
							.with("text", () => (
								<div className="pl-4">
									<p className="border-l-2 pl-4 border-slate-500 mb-2">
										{body}
									</p>
								</div>
							))
							.exhaustive()}
					</div>
					<div className="px-4 flex-1">
						<h1>{title}</h1>
						{referenceUrl && (
							<a
								className="text-xs flex hover:underline items-center mt-1"
								href={referenceUrl}
							>
								<LinkIcon className="h-3 w-3 mr-1 -ml-1 flex-shrink-0" />
								<p className="text-ellipsis overflow-hidden">
									{referenceTitle || referenceUrl}
								</p>
							</a>
						)}
						{canDelete && (
							<div className="mt-2">
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button>Delete</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>
												Are you absolutely sure?
											</AlertDialogTitle>
											<AlertDialogDescription>
												This action cannot be undone. This will permanently
												delete this fav and remove data from our servers.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancel</AlertDialogCancel>
											<deleteFetcher.Form method="DELETE">
												<AlertDialogAction type="submit">
													Continue
												</AlertDialogAction>
											</deleteFetcher.Form>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</div>
						)}
					</div>
				</div>
			</div>
		</MainLayout>
	);
}
