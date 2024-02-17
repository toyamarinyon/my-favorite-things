import { createId } from "@paralleldrive/cuid2";
import { ActionFunctionArgs } from "@remix-run/cloudflare";
import invariant from "tiny-invariant";
import { match } from "ts-pattern";
import { minLength, parse, string, transform } from "valibot";
import { drizzle } from "~/db/drizzle";
import { BodyTypeSchema, favorites } from "~/db/favorites";
import { findUserByActionFunctionArgs } from "../helpers/findUserByActionFunctionArgs";

const parsePageTitle = async (url?: string | null | undefined) => {
	if (url == null || url === "") {
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

export const createFavorite = async (args: ActionFunctionArgs) => {
	const env = args.context.env as Env;
	const user = await findUserByActionFunctionArgs(args);
	invariant(user, "User not found");
	const formData = await args.request.formData();
	const bodyType = parse(BodyTypeSchema, formData.get("bodyType"));
	const body = match(bodyType)
		.with("text", () => parse(string([minLength(1)]), formData.get("body")))
		.with("image", () => createId())
		.exhaustive();
	if (bodyType === "image") {
		const dataUrl = parse(string([minLength(1)]), formData.get("dataUrl"));
		const [prefix, data] = dataUrl.split(",");
		const mimeType = prefix.match(/:(.*?);/)?.[1];

		const file = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));

		const bucket = env.BUCKET;
		await bucket.put(body, file, {
			httpMetadata: { contentType: mimeType },
		});
	}
	const referenceUrl = parse(
		transform(string(), (input) => (input === "" ? null : input)),
		formData.get("referenceUrl"),
	);
	const referenceTitle = await parsePageTitle(referenceUrl);
	const db = drizzle(env);
	await db.insert(favorites).values({
		userId: user.id,
		title: parse(string([minLength(1)]), formData.get("title")),
		body,
		bodyType,
		referenceTitle,
		referenceUrl,
	});
};
