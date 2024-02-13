import OpenAI from "openai";

type VisionContext = {
	openaiApiKey: string;
};
export const analyzeImage = async (
	imageUrl: string,
	context: VisionContext,
) => {
	const openai = new OpenAI({
		apiKey: context.openaiApiKey,
	});
	const response = await openai.chat.completions.create({
		model: "gpt-4-vision-preview",
		messages: [
			{
				role: "user",
				content: [
					{
						type: "text",
						text: "Describe in 7 words the content, color, period, and other characteristics of this image.",
					},
					{
						type: "image_url",
						image_url: {
							url: imageUrl,
						},
					},
				],
			},
		],
	});

	return response.choices[0].message.content ?? "";
};
