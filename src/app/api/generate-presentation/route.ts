import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { BUILT_IN_THEMES } from '@/lib/presentation-types';
import { parseOffice } from 'officeparser';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

// Use OpenAI if available (reliable), fallback to OpenRouter models
const useOpenAI = !!process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: useOpenAI
    ? process.env.OPENAI_API_KEY || ""
    : process.env.OPENROUTER_API_KEY || "",
  baseURL: useOpenAI
    ? "https://api.openai.com/v1"
    : "https://openrouter.ai/api/v1",
  defaultHeaders: useOpenAI ? {} : {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Proposal Studio PPT Maker",
  },
});

// Since we have a working OpenRouter key, try a good model
const MODELS_TO_TRY = useOpenAI
  ? ["gpt-4o-mini", "gpt-3.5-turbo"]
  : [
      "google/gemini-2.5-flash",
      "google/gemini-2.5-pro",
      "anthropic/claude-3-haiku",
      "meta-llama/llama-3-70b-instruct"
    ];



const SYSTEM_PROMPT = `You are an expert presentation architect. Given a presentation brief, generate a structured JSON presentation plan.

RULES:
- Return ONLY a valid JSON object, no markdown, no explanation, no backticks.
- Every slide must have an "id", "layout", "title", and "elements" array.
- Elements must match the layout type exactly (see below).
- "layout" must be exactly one of: cover, section_divider, title_content, text_image, image_text, three_cards, four_cards, statistics, timeline, process, comparison, pricing, quote, case_study, full_image, key_benefits, cta
- Generate exactly the requested number of slides.
- Content must be real, professional, tailored to the user's topic.
- No filler. No "Lorem ipsum". Every word must be meaningful.

LAYOUT RULES:
- cover: elements = [{type:"heading",content:"..."}, {type:"subheading",content:"..."}]
- section_divider: elements = [{type:"heading",content:"..."}, {type:"paragraph",content:"..."}]
- title_content: elements = [{type:"heading",content:"..."}, {type:"bullet_list",items:[...]}]
- text_image: elements = [{type:"heading",content:"..."}, {type:"paragraph",content:"..."}, {type:"image",alt:"..."}]
- image_text: same as text_image
- three_cards: elements = [{type:"heading",content:"..."}, {type:"card",cards:[{title:"...",description:"..."},{title:"...",description:"..."},{title:"...",description:"..."}]}]
- four_cards: elements = [{type:"heading",content:"..."}, {type:"card",cards:[4 objects]}]
- statistics: elements = [{type:"heading",content:"..."}, {type:"statistic",value:"...",label:"..."},...] (3-4 stats)
- timeline: elements = [{type:"heading",content:"..."}, {type:"bullet_list",items:[...]}]
- process: elements = [{type:"heading",content:"..."}, {type:"bullet_list",items:[...]}]
- comparison: elements = [{type:"heading",content:"..."}, {type:"table",headers:["Feature","Option A","Option B"],rows:[[...],[...],...]}]
- pricing: elements = [{type:"heading",content:"..."}, {type:"card",cards:[{title:"Plan Name",description:"Price + features"},...]}]
- quote: elements = [{type:"quote",content:"..."}, {type:"paragraph",content:"Author, Role"}]
- key_benefits: elements = [{type:"heading",content:"..."}, {type:"bullet_list",items:[...]}]
- cta: elements = [{type:"heading",content:"..."}, {type:"paragraph",content:"..."}, {type:"button",content:"..."}]

OUTPUT FORMAT:
{
  "presentation": {
    "title": "...",
    "subtitle": "...",
    "type": "...",
    "themeKey": "corporate"
  },
  "slides": [
    {
      "id": "slide-1",
      "layout": "cover",
      "title": "...",
      "elements": [...]
    }
  ]
}`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, type, slideCount, tone, visualStyle, customInstructions, themeKey, referenceFile } = body;

    if (!prompt && !referenceFile) {
      return NextResponse.json({ error: "Prompt or reference file is required" }, { status: 400 });
    }

    if (!process.env.OPENROUTER_API_KEY && !process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "No API key configured." }, { status: 500 });
    }

    const theme = BUILT_IN_THEMES[themeKey || 'modern'];
    const numSlides = typeof slideCount === 'number' ? slideCount : 10;

    let referenceText = "";
    let isImage = false;
    
    if (referenceFile && referenceFile.base64) {
      if (referenceFile.type.startsWith('image/')) {
        isImage = true;
      } else {
        // Parse PDF/PPT/Word
        try {
          const base64Data = referenceFile.base64.split(',')[1];
          const ext = referenceFile.name.split('.').pop() || 'pdf';
          const tempPath = join(tmpdir(), `ref-${Date.now()}.${ext}`);
          await writeFile(tempPath, Buffer.from(base64Data, 'base64'));
          
          referenceText = await parseOffice(tempPath);
          await unlink(tempPath).catch(console.error);
        } catch (err) {
          console.error("Error parsing document:", err);
          return NextResponse.json({ error: "Could not parse the uploaded document." }, { status: 400 });
        }
      }
    }

    let userMessageContent: any[] = [
      {
        type: 'text',
        text: `Create a ${numSlides}-slide ${type || 'business'} presentation.
Topic/Prompt: ${prompt || "Analyze the reference"}
Tone: ${tone || 'Professional'}
Visual Style: ${visualStyle || 'Modern SaaS'}
${customInstructions ? `Custom Instructions: ${customInstructions}` : ''}
${referenceText ? `\n--- REFERENCE DOCUMENT TEXT ---\n${referenceText.substring(0, 8000)}\n---------------------------\nUse the above reference material heavily when creating the slides.` : ''}
Theme: ${theme.name} (primary: ${theme.primaryColor})

Generate exactly ${numSlides} slides. Start with a cover slide, end with a CTA or summary slide. Make the content specific, detailed, and persuasive for this topic.`
      }
    ];

    if (isImage && referenceFile.base64) {
      userMessageContent.push({
        type: 'image_url',
        image_url: { url: referenceFile.base64 }
      });
    }

    // Model rotation: try each model until one succeeds
    let response: any = null;
    let lastError: any = null;
    for (const model of MODELS_TO_TRY) {
      try {
        console.log(`Trying model: ${model}`);
        response = await openai.chat.completions.create({
          model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: typeof userMessageContent === 'string' ? userMessageContent : (useOpenAI || model.includes('gemini') || model.includes('claude') || model.includes('llama') ? userMessageContent : userMessageContent[0].text) },
          ],
          temperature: 0.6,
          max_tokens: 4000,
        });
        if (response.choices?.[0]?.message?.content) {
          console.log(`Success with model: ${model}`);
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${model} failed: ${err?.message || err}`);
        // Continue to next model on 429 or 404
        if (err?.status === 429 || err?.status === 404 || err?.code === 429 || err?.code === 404) {
          continue;
        }
        throw err;
      }
    }

    if (!response?.choices?.[0]?.message?.content) {
      throw lastError || new Error("All free models are currently unavailable. Please try again in a few minutes.");
    }

    let raw = '';
    const choice = response.choices[0];
    raw = choice?.message?.content || '';


    // Strip markdown fences
    raw = raw.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();

    // Strategy 1: Find the outermost {...} block
    const firstBrace = raw.indexOf('{');
    const lastBrace = raw.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      raw = raw.slice(firstBrace, lastBrace + 1);
    }

    // Strategy 2: Try extracting just the slides array if outer wrapper missing
    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // Try to find a slides array directly
      const slidesMatch = raw.match(/"slides"\s*:\s*(\[[\s\S]*?\](?=\s*[,}]))/);
      if (slidesMatch) {
        try {
          const slidesArr = JSON.parse(slidesMatch[1]);
          parsed = { slides: slidesArr };
        } catch {
          // Could not parse
        }
      }
    }

    if (!parsed) {
      console.error("JSON parse failed. Raw output:", raw.slice(0, 800));
      return NextResponse.json(
        { error: "The AI returned an invalid response. Please try again with a different prompt." },
        { status: 500 }
      );
    }


    if (!parsed.slides || !Array.isArray(parsed.slides)) {
      return NextResponse.json(
        { error: "AI did not return a valid presentation structure. Please try again." },
        { status: 500 }
      );
    }

    const BUSINESS_IMAGES = [
      "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?w=800&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80"
    ];

    // Add IDs to elements if missing, and populate image URLs
    const slides = parsed.slides.map((slide: any, si: number) => ({
      ...slide,
      id: slide.id || `slide-${si + 1}`,
      elements: (slide.elements || []).map((el: any, ei: number) => {
        let elData = { ...el, id: el.id || `slide-${si + 1}-el-${ei + 1}` };
        if (el.type === "image" && !el.url && !el.imageUrl) {
          const randImg = BUSINESS_IMAGES[Math.floor(Math.random() * BUSINESS_IMAGES.length)];
          elData.url = randImg;
          elData.imageUrl = randImg;
        }
        return elData;
      }),
    }));

    return NextResponse.json({
      presentation: {
        ...parsed.presentation,
        theme,
        themeKey: themeKey || 'modern',
        prompt,
        type,
        slideCount: numSlides,
        tone,
        visualStyle,
      },
      slides,
    });

  } catch (error: any) {
    console.error("Presentation generation failed:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate presentation. Please try again." },
      { status: 500 }
    );
  }
}
