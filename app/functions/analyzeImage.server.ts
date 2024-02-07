import { ActionFunctionArgs, json } from "@remix-run/cloudflare";
import OpenAI from "openai";

export const analyzeImage = async ({
  request,
  context,
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const imageUrl = formData.get("imageUrl");
  if (imageUrl == null) {
    throw new Response("No image provided", { status: 400 });
  }
  const env = context.env as Env;
  const openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
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
              url: imageUrl as string,
            },
          },
        ],
      },
    ],
  });
  const analyzeResult = response.choices[0].message.content ?? "";
  return json({ analyzeResult });
};
