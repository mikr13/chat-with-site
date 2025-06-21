import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, pageContent } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "Invalid messages array" }, { status: 400 });
    }

    const systemMessage = {
      role: "system" as const,
      content: `You are an AI assistant. You must answer questions using ONLY the information found in the following page content. Do NOT use any outside knowledge or make assumptions. If the answer is not present in the content, reply with "Sorry, I couldn't find that information in the provided page content." Here is the page content:\n${pageContent || "No page content provided."}`,
    };

    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: systemMessage.content,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}
