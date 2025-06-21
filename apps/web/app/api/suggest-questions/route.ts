import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export async function POST(req: Request) {
  try {
    const { pageContent } = await req.json();

    if (!pageContent || pageContent.length < 100) {
      return Response.json(
        { error: "Invalid or too short content" },
        { status: 400 }
      );
    }

    const result = await generateText({
      model: openai('gpt-4o-mini'),
      system: "You are an assistant that suggests smart, relevant questions a user might ask about a webpage. ONLY use the information in the provided page content—do NOT use outside knowledge or make assumptions. Return exactly 4 concise, non-redundant questions, each on a new line, numbered 1-4. If there is not enough information, generate the best possible questions based strictly on the content.",
      prompt: `Here is the content of a webpage:\n${pageContent}\nBased ONLY on this content, suggest exactly 4 relevant, non-redundant questions a user might ask. Number them 1-4, each on its own line. Do not use any outside knowledge or make assumptions beyond the provided content.`,
    });

    const questions = result.text
      .split(/\n+/)
      .map((q) => q.replace(/^\d+\.\s*/, "").trim())
      .filter(Boolean)
      .slice(0, 4);

    return Response.json({ questions });
  } catch (error) {
    console.error("Question suggestion error:", error);
    return Response.json(
      { error: "Failed to generate questions" },
      { status: 500 }
    );
  }
}
