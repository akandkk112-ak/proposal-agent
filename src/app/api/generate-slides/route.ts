import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || process.env.OPENROUTER_API_KEY || "",
  baseURL: process.env.DEEPSEEK_API_KEY ? "https://api.deepseek.com/v1" : "https://openrouter.ai/api/v1",
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!process.env.DEEPSEEK_API_KEY && !process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "API Key is missing." },
        { status: 500 }
      );
    }

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Using DeepSeek model if available
    const response = await openai.chat.completions.create({
      model: process.env.DEEPSEEK_API_KEY ? "deepseek-chat" : "google/gemma-4-26b-a4b-it:free",
      messages: [
        {
          role: "system",
          content: `You are an expert presentation designer. Generate a highly structured slide deck based on the user's prompt. 
          Return ONLY a raw JSON object (no markdown, no backticks) with a single 'slides' array. Each slide must have:
          - 'id': unique string
          - 'title': slide title
          - 'content': the main text for the slide. Use bullet points (\\n•) or paragraphs.
          - 'type': strictly one of 'cover', 'content', 'image-left', 'stats', or 'pricing'
          - 'bg': (Optional) Hex color code for background (e.g. #4F46E5)
          - 'color': (Optional) Hex color code for text (e.g. #FFFFFF)
          
          Generate exactly the number of slides the user requests. If they don't specify, generate 5 slides. Ensure the content is professional and highly detailed.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    let content = response.choices[0].message.content || '{"slides": []}';
    
    // Remove markdown code blocks if the model accidentally included them
    if (content.includes('```')) {
      content = content.replace(/```json/g, '').replace(/```/g, '').trim();
    }
    
    const parsedContent = JSON.parse(content);
    return NextResponse.json({ slides: parsedContent.slides });
  } catch (error: any) {
    console.error("AI Generation failed:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate slides. Please check your API key." },
      { status: 500 }
    );
  }
}
