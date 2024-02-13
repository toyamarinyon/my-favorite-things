import { LoaderFunctionArgs } from "@remix-run/cloudflare";

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
	const id = params.id;
	if (id == null) {
		return new Response("Not found", { status: 404 });
	}
	const env = context.env as Env;
	const object = await env.BUCKET.get(id);
	if (object == null) {
		return new Response("Not found", { status: 404 });
	}
	return new Response(object.body, { status: 200 });
};
