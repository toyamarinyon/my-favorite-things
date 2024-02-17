import { createId } from "@paralleldrive/cuid2";
import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { match } from "ts-pattern";
import {
	Input,
	literal,
	merge,
	object,
	omit,
	parse,
	string,
	union,
} from "valibot";
import { drizzle } from "~/db/drizzle";
import {
	BodyTypeSchema,
	favorites,
	insertFavoriteSchema,
} from "~/db/favorites";
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

const createImageFavoriteInputSchema = omit(
	merge([insertFavoriteSchema, object({ dataUrl: string() })]),
	["body", "bodyType"],
);
export const createFavorite = async (args: ActionFunctionArgs) => {
	const user = await findUserByActionFunctionArgs(args);
	const formData = await args.request.formData();
	const unsafeBodyType = formData.get("bodyType");
	const title = formData.get("title");
	const body = formData.get("body");
	const dataUrl = formData.get("dataUrl");
	const referenceUrl = formData.get("referenceUrl");
	const bodyType = parse(BodyTypeSchema, unsafeBodyType);
	const db = drizzle(args.context.env as Env);
	await match(bodyType)
		.with("image", async () => {
			const input = parse(createImageFavoriteInputSchema, {
				title,
				userId: user?.id,
				dataUrl,
				referenceUrl,
			});
			const [prefix, data] = input.dataUrl.split(",");
			const mimeType = prefix.match(/:(.*?);/)?.[1];

			const file = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));

			const env = args.context.env as Env;
			const bucket = env.BUCKET;
			const objectId = createId();
			await bucket.put(objectId, file, {
				httpMetadata: { contentType: mimeType },
			});
			const referenceTitle = await parsePageTitle(input.referenceUrl);
			await db.insert(favorites).values({
				...input,
				body: objectId,
				bodyType,
				referenceTitle,
			});
		})
		.otherwise(() => {});
};
