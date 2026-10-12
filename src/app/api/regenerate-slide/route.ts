import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || "",
  baseURL: "https://openrouter.ai/api/v1",
});

const MODEL = "google/gemini-2.5-flash";

export async function POST(req: Request) {
  try {
    const { slide, action, prompt, theme, presentationContext } = await req.json();

    if (!slide || !action) {
      return NextResponse.json({ error: "Missing slide or action" }, { status: 400 });
    }

    const systemPrompt = `You are an expert presentation slide writer. You will receive a slide JSON object and an instruction.
Return ONLY a valid JSON object (no markdown, no backticks) representing the updated slide.
Keep the SAME id, layout, and element structure. Only modify the text content based on the instruction.
Do not add or remove elements. Do not change element types or IDs.`;

    const userMessage = `Instruction: ${prompt}
Presentation context: ${presentationContext || "business presentation"}
Theme: ${theme?.name || "Modern"}

Current slide JSON:
${JSON.stringify(slide, null, 2)}

Return the updated slide JSON with the same structure.`;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    let raw = response.choices[0]?.message?.content || '';
    raw = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();

    const firstBrace = raw.indexOf('{');
    const lastBrace = raw.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      raw = raw.slice(firstBrace, lastBrace + 1);
    }

    const updatedSlide = JSON.parse(raw);
    return NextResponse.json({ slide: updatedSlide });

  } catch (error: any) {
    console.error("Slide regeneration failed:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to regenerate slide." },
      { status: 500 }
    );
  }
}
