import { ActionFunctionArgs, json } from "@remix-run/cloudflare";
import { analyzeImage } from "~/functions/analyzeImage.server";

export const action = async ({ request, context }: ActionFunctionArgs) => {
	const formData = await request.formData();
	const imageUrl = formData.get("imageUrl");
	if (imageUrl == null) {
		throw new Response("No image provided", { status: 400 });
	}
	const env = context.env as Env;
	const analyze = await analyzeImage(imageUrl as string, {
		openaiApiKey: env.OPENAI_API_KEY,
	});
	return json({ analyze });
};
