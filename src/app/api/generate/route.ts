import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { clientName, jobDescription, additionalDetails } = body;

  const prompt = `Write a professional business proposal for ${clientName || "a client"}.
Project: ${jobDescription || "Software development"}
Additional notes: ${additionalDetails || "Keep it professional"}

Please write a complete, detailed proposal with:
1. Executive Summary
2. Project Scope
3. Timeline
4. Investment / Pricing
5. Terms & Conditions`;

  try {
    if (process.env.OPENAI_API_KEY) {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 1000,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json({ proposal: data.choices[0].message.content });
      }
    }

    return NextResponse.json({
      proposal: `# Business Proposal\n\n## Executive Summary\nThank you for the opportunity to present this proposal for ${clientName || "your organization"}.\n\n## Project Scope\n${jobDescription}\n\n## Investment\nPlease contact us for a detailed quote.\n\n## Next Steps\nWe look forward to working with you.`,
    });
  } catch (error) {
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
