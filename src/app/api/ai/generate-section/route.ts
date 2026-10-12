import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { field, context, promptOverride } = body;

  const { title, clientName, companyName, scopeTags, pricingItems, customHtml } = context || {};

  const totalValue = pricingItems?.reduce((sum: number, item: { amount: number }) => sum + item.amount, 0) || 0;

  let prompt = "";
  if (field === "executiveSummary") {
    prompt = `Write a professional executive summary for a proposal titled "${title || "Proposal"}" for ${companyName || "the client"} (contact: ${clientName || "Client"}).
Scope includes: ${scopeTags?.join(", ") || "various services"}.
Total investment: $${totalValue.toLocaleString()}.
Write 2-3 sentences that are compelling, strategic, and focused on client value. Be concise and professional.`;
  } else if (field === "executiveFocus") {
    prompt = `Write a brief executive focus paragraph for a ${scopeTags?.join(" & ") || "consulting"} proposal for ${companyName || "the client"}.
Mention the strategic objectives and key workstreams. 2-3 sentences only.`;
  } else if (field === "customHtml") {
    prompt = `You are an expert UI developer. Generate clean, modern, responsive HTML code (using inline CSS or Tailwind CSS utility classes if possible) for a proposal template based on this request: "${promptOverride || 'Create a modern professional email template'}".
Do NOT wrap the output in markdown code blocks like \`\`\`html. Output raw HTML only. Do not include <html> or <body> tags, just the content wrapper (e.g. <div style="...">).`;
  } else if (field === "makeResponsive") {
    prompt = `You are an expert UI developer. Take the following HTML code and rewrite it to be fully responsive for mobile, tablet, and desktop devices using CSS (inline or style tags with media queries). 
Preserve the exact same text, images, and core branding/layout structure. 
Return ONLY the raw HTML code without markdown fences like \`\`\`html.
Original HTML:
${customHtml}
`;
  } else {
    prompt = `Write a brief professional paragraph for a proposal section called "${field}". Be concise and compelling.`;
  }

  try {
    // Try OpenAI first
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
          max_tokens: (field === "customHtml" || field === "makeResponsive") ? 3000 : 200,
          temperature: 0.7,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content?.trim();
        if (text) return NextResponse.json({ text });
      }
    }

    // Fallback to OpenRouter
    if (process.env.OPENROUTER_API_KEY) {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://proposalstudio.app",
          "X-Title": "Proposal Studio",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          max_tokens: (field === "customHtml" || field === "makeResponsive") ? 3000 : 200,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content?.trim();
        if (text) return NextResponse.json({ text });
      }
    }

    // Fallback generated text
    const fallback = generateFallback(field, context);
    return NextResponse.json({ text: fallback });
  } catch (error) {
    console.error("AI generation error:", error);
    const fallback = generateFallback(field, context);
    return NextResponse.json({ text: fallback });
  }
}

function generateFallback(field: string, context: { title?: string; companyName?: string; clientName?: string; scopeTags?: string[]; pricingItems?: Array<{ amount: number }> }) {
  const { title, companyName, scopeTags, pricingItems } = context || {};
  const total = pricingItems?.reduce((s, i) => s + i.amount, 0) || 0;

  if (field === "executiveSummary") {
    return `${companyName || "Your organization"} has engaged Proposal Studio to deliver a comprehensive ${scopeTags?.slice(0, 2).join(" and ") || "strategy and execution"} initiative. This proposal outlines our proven methodology, milestone framework, and investment structure designed to drive measurable business outcomes. Our team brings deep expertise and a track record of delivering exceptional results for enterprise clients with similar needs and objectives.`;
  }
  if (field === "executiveFocus") {
    return `This engagement centers on delivering a high-precision ${scopeTags?.slice(0, 2).join(" and ") || "strategic"} solution across ${pricingItems?.length || 3} core workstreams. Our focus is on aligning tactical execution with long-term brand authority and measurable revenue impact.`;
  }
  if (field === "customHtml") {
    return `<div style="font-family: sans-serif; padding: 20px; background: #f4f4f4; border-radius: 8px;">
  <h2 style="color: #333;">Proposal Template</h2>
  <p>Here is your auto-generated template. Please replace this with actual content.</p>
</div>`;
  }
  return `This section covers the key aspects of the ${title || "project"} scope and strategic framework.`;
}
