import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const OPENAI_API_KEY = `${process.env.OPENAI_API_KEY}`;

export async function getChatResponse(
  model: string,
  context: string,
  question: string
) {
  const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const response = await openai.createChatCompletion({
    model,
    messages: [
      {
        role: "assistant",
        content: `Answer the question as truthfully as possible using the provided text, and if the answer is not contained within the text below, say "I don't know"

        Context:
        ${context.substring(0, 2000)}
        
        Q: ${question}
        A:`,
      },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });
  return response.data.choices
    .map((choice: any) => choice.message?.content)
    .join("\n\n");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { model, context, question } = req.body;
  const answer = await getChatResponse(model, context, question);
  res.status(200).json({ answer });
}
