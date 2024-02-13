import { createId } from "@paralleldrive/cuid2";
import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { merge, object, omit, parse, string } from "valibot";
import { drizzle } from "~/db/drizzle";
import { favorites, insertFavoriteSchema } from "~/db/favorites";
import { findUserByActionFunctionArgs } from "../helpers/findUserByActionFunctionArgs";

const parsePageTitle = async (url?: string | null | undefined) => {
	if (url == null) {
		return null;
	}
	const res = await fetch(url);
	if (res.status !== 200) {
		return null;
	}
	const text = await res.text();
	const title = text.match(/<title>(.*?)<\/title>/);
	if (title == null) {
		return null;
	}
	return title[1] as string;
};

const createFavoriteInputSchema = omit(
	merge([insertFavoriteSchema, object({ dataUrl: string() })]),
	["objectId"],
);
export const createFavorite = async (args: ActionFunctionArgs) => {
	const user = await findUserByActionFunctionArgs(args);
	const formData = await args.request.formData();
	const title = formData.get("title");
	const dataUrl = formData.get("dataUrl");
	const referenceUrl = formData.get("referenceUrl");

	const input = parse(createFavoriteInputSchema, {
		title,
		userId: user?.id,
		referenceUrl,
		dataUrl,
	});

	const [prefix, data] = input.dataUrl.split(",");
	const mimeType = prefix.match(/:(.*?);/)?.[1];

	const file = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));

	const env = args.context.env as Env;
	const bucket = env.BUCKET;
	const objectId = createId();
	await bucket.put(objectId, file, { httpMetadata: { contentType: mimeType } });

	const referenceTitle = await parsePageTitle(input.referenceUrl);

	const db = drizzle(env);
	await db.insert(favorites).values({
		...input,
		objectId,
		referenceTitle,
	});
};
