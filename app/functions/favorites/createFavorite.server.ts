import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { findUserByActionFunctionArgs } from "../helpers/findUserByActionFunctionArgs";
import { favorites, insertFavoriteSchema } from "~/db/favorites";
import { merge, object, parse, string } from "valibot";
import { createId } from "@paralleldrive/cuid2";
import { drizzle } from "~/db/drizzle";

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

const createFavoriteInputSchema = merge([
  insertFavoriteSchema,
  object({ objectBase64: string() }),
]);
export const createFavorite = async (args: ActionFunctionArgs) => {
  const user = await findUserByActionFunctionArgs(args);
  const formData = await args.request.clone().formData();
  const title = formData.get("title");
  const objectBase64 = formData.get("objectBase64");
  const referenceUrl = formData.get("referenceUrl");

  const input = parse(createFavoriteInputSchema, {
    title,
    userId: user?.id,
    referenceUrl,
    objectBase64,
  });

  const file = Uint8Array.from(atob(input.objectBase64), (c) =>
    c.charCodeAt(0)
  );

  const env = args.context.env as Env;
  const bucket = env.BUCKET;
  const objectId = createId();
  bucket.put(objectId, file, { httpMetadata: { contentType: "image/png" } });

  const referenceTitle = await parsePageTitle(input.referenceUrl);

  const db = drizzle(env);
  await db.insert(favorites).values({
    ...input,
    objectId,
    referenceTitle,
  });
};
