"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles, ChevronRight, Loader2, FileText, TrendingUp, Building2,
  Target, Briefcase, PieChart, Users, BookOpen, Presentation,
  Lightbulb, ArrowRight, Check, Upload, X, Image as ImageIcon
} from "lucide-react";
import { BUILT_IN_THEMES } from "@/lib/presentation-types";

const PRESENTATION_TYPES = [
  "Business Proposal", "Sales Deck", "Company Profile",
  "Pitch Deck", "Marketing Presentation", "Project Presentation",
  "Case Study", "Custom",
];

const TONES = ["Professional", "Corporate", "Minimal", "Premium", "Creative", "Modern"];
const VISUAL_STYLES = ["Minimal", "Corporate", "Editorial", "Modern SaaS", "Luxury", "Bold", "Clean"];
const SLIDE_COUNTS = [8, 10, 12, 15] as const;

const EXAMPLES = [
  { label: "Sales Proposal", icon: TrendingUp, prompt: "Create a compelling sales proposal for a B2B SaaS product targeting mid-market companies." },
  { label: "Company Profile", icon: Building2, prompt: "Create a professional company profile presentation for a managed office space company in Gurugram." },
  { label: "Investor Pitch", icon: Lightbulb, prompt: "Create an investor pitch deck for a fintech startup seeking Series A funding of $5M." },
  { label: "Marketing Strategy", icon: Target, prompt: "Create a comprehensive marketing strategy presentation for launching a new consumer product." },
  { label: "Business Proposal", icon: Briefcase, prompt: "Create a business proposal for IT outsourcing services targeting enterprise clients." },
  { label: "Project Proposal", icon: PieChart, prompt: "Create a project proposal for a digital transformation initiative for a manufacturing company." },
  { label: "Client Presentation", icon: Users, prompt: "Create a client presentation showcasing quarterly performance and future roadmap." },
  { label: "Case Study", icon: BookOpen, prompt: "Create a case study presentation showing how we helped a retail client increase sales by 40%." },
  { label: "Product Launch", icon: Presentation, prompt: "Create a product launch presentation for an AI-powered analytics platform." },
  { label: "Training", icon: FileText, prompt: "Create a training presentation on best practices for remote team management." },
];

const THEME_COLORS: Record<string, { bg: string; text: string; accent: string }> = {
  corporate: { bg: "#EFF6FF", text: "#1E3A5F", accent: "#2563EB" },
  minimal: { bg: "#F9FAFB", text: "#111827", accent: "#374151" },
  modern: { bg: "#EDE9FE", text: "#7C3AED", accent: "#A78BFA" },
  premium: { bg: "#FAF5FF", text: "#471E89", accent: "#DAAF46" },
  editorial: { bg: "#FFF1F2", text: "#0F172A", accent: "#E11D48" },
  startup: { bg: "#ECFDF5", text: "#059669", accent: "#10B981" },
  dark: { bg: "#1E293B", text: "#A78BFA", accent: "#60A5FA" },
  creative: { bg: "#FFFBEB", text: "#92400E", accent: "#F59E0B" },
};

const PROGRESS_STEPS = [
  "Analyzing your requirements...",
  "Planning presentation structure...",
  "Generating slide content...",
  "Applying design system...",
  "Finalizing presentation...",
];

export default function PPTMakerPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState("Business Proposal");
  const [slideCount, setSlideCount] = useState<number | "custom">(10);
  const [customSlideCount, setCustomSlideCount] = useState(12);
  const [tone, setTone] = useState("Professional");
  const [visualStyle, setVisualStyle] = useState("Modern SaaS");
  const [themeKey, setThemeKey] = useState("modern");
  const [customInstructions, setCustomInstructions] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [referenceFile, setReferenceFile] = useState<{name: string, type: string, base64: string} | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setReferenceFile({
        name: file.name,
        type: file.type,
        base64,
      });
      setError("");
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const hist = localStorage.getItem("presentation_history");
    if (hist) {
      setHistory(JSON.parse(hist));
    }
  }, []);

  const openHistory = (pres: any) => {
    localStorage.setItem("current_presentation", JSON.stringify(pres));
    router.push("/ppt-maker/editor");
  };

  const actualSlideCount = slideCount === "custom" ? customSlideCount : slideCount;

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please describe the presentation you want to create.");
      return;
    }
    setError("");
    setIsGenerating(true);
    setProgressStep(0);

    // Animate progress steps
    let step = 0;
    const interval = setInterval(() => {
      step = Math.min(step + 1, PROGRESS_STEPS.length - 1);
      setProgressStep(step);
    }, 1800);

    try {
      const res = await fetch("/api/generate-presentation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          type,
          slideCount: actualSlideCount,
          tone,
          visualStyle,
          themeKey,
          customInstructions,
          referenceFile,
        }),
      });

      clearInterval(interval);
      const data = await res.json();

      if (!res.ok || !data.slides) {
        throw new Error(data.error || "Failed to generate presentation. Please try again.");
      }

      // Store in localStorage and redirect to editor
      const presentationData = {
        id: `ppt-${Date.now()}`,
        ...data.presentation,
        slides: data.slides,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem("current_presentation", JSON.stringify(presentationData));
      
      const historyJson = localStorage.getItem("presentation_history");
      let hist = historyJson ? JSON.parse(historyJson) : [];
      hist.unshift(presentationData);
      localStorage.setItem("presentation_history", JSON.stringify(hist));

      router.push("/ppt-maker/editor");

    } catch (err: any) {
      clearInterval(interval);
      setError(err.message || "Something went wrong. Please try again.");
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-[#EDE9FE] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-[#7C3AED] animate-pulse" />
          </div>
          <h2 className="text-[22px] font-bold text-[#111827] mb-2">Generating Presentation</h2>
          <p className="text-[14px] text-[#6B7280] mb-8">{PROGRESS_STEPS[progressStep]}</p>
          <div className="w-full bg-[#E5E7EB] rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-[#7C3AED] rounded-full transition-all duration-700"
              style={{ width: `${((progressStep + 1) / PROGRESS_STEPS.length) * 100}%` }}
            />
          </div>
          <div className="mt-6 space-y-2">
            {PROGRESS_STEPS.map((step, i) => (
              <div key={i} className="flex items-center gap-2 text-[13px]">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  i < progressStep ? "bg-[#7C3AED]" : i === progressStep ? "bg-[#7C3AED] animate-pulse" : "bg-[#E5E7EB]"
                }`}>
                  {i < progressStep && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
                <span className={i <= progressStep ? "text-[#111827]" : "text-[#9CA3AF]"}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="border-b border-[#E5E7EB] bg-white px-8 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-[12px] text-[#9CA3AF] mb-1">
              <span>AI Generator</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#7C3AED] font-medium">PPT Maker</span>
            </div>
            <h1 className="text-[22px] font-bold text-[#111827]">AI Presentation Maker</h1>
            <p className="text-[13px] text-[#6B7280] mt-0.5">Describe your presentation and AI will generate a professional deck</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#EDE9FE] rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span className="text-[12px] font-semibold text-[#7C3AED]">AI-Powered</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8">
        <div className="grid grid-cols-3 gap-8">
          {/* LEFT: Main Form */}
          <div className="col-span-2 space-y-6">

            {/* Prompt Area */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
              <div className="px-5 pt-5 pb-3">
                <label className="block text-[13px] font-semibold text-[#111827] mb-3">
                  What do you want to present?
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => { setPrompt(e.target.value); setError(""); }}
                  placeholder="Describe the presentation you want to create..."
                  className="w-full h-36 text-[14px] text-[#111827] placeholder-[#9CA3AF] resize-none outline-none leading-relaxed"
                />
                {error && (
                  <p className="text-[12px] text-red-500 mt-2">{error}</p>
                )}
              </div>

              {/* Example suggestions and File Upload */}
              <div className="px-5 pb-4 border-t border-[#F1F5F9]">
                <div className="flex items-center justify-between mb-2.5 pt-3">
                  <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Examples & Assets</p>
                  <label htmlFor="reference-upload" className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E5E7EB] rounded-lg text-[12px] text-[#475569] cursor-pointer transition-colors font-medium">
                    <Upload className="w-3.5 h-3.5" />
                    Upload Reference (PDF, PPT, Image)
                  </label>
                  <input type="file" id="reference-upload" className="hidden" accept=".pdf,.ppt,.pptx,image/*" onChange={handleFileUpload} />
                </div>
                
                {referenceFile && (
                  <div className="mb-4 flex items-center justify-between p-3 bg-[#EDE9FE] rounded-lg border border-[#DDD6FE]">
                    <div className="flex items-center gap-2">
                      {referenceFile.type.startsWith('image/') ? <ImageIcon className="w-4 h-4 text-[#7C3AED]" /> : <FileText className="w-4 h-4 text-[#7C3AED]" />}
                      <span className="text-[13px] font-medium text-[#7C3AED]">{referenceFile.name}</span>
                    </div>
                    <button onClick={() => setReferenceFile(null)} className="p-1 hover:bg-[#DDD6FE] rounded transition-colors text-[#7C3AED]">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5">
                  {EXAMPLES.map((ex) => (
                    <button
                      key={ex.label}
                      onClick={() => setPrompt(ex.prompt)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8FAFC] hover:bg-[#EDE9FE] border border-[#E5E7EB] hover:border-[#DDD6FE] rounded-full text-[12px] text-[#475569] hover:text-[#7C3AED] transition-all"
                    >
                      <ex.icon className="w-3 h-3" />
                      {ex.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Controls Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Slides Count */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                <label className="block text-[12px] font-semibold text-[#475569] uppercase tracking-wider mb-3">
                  Number of Slides
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {SLIDE_COUNTS.map((n) => (
                    <button
                      key={n}
                      onClick={() => setSlideCount(n)}
                      className={`py-2.5 rounded-lg text-[13px] font-semibold transition-all ${
                        slideCount === n
                          ? "bg-[#7C3AED] text-white shadow-sm"
                          : "bg-[#F8FAFC] text-[#475569] hover:bg-[#EDE9FE] hover:text-[#7C3AED] border border-[#E5E7EB]"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setSlideCount("custom")}
                  className={`mt-2 w-full py-2 rounded-lg text-[13px] font-medium transition-all ${
                    slideCount === "custom"
                      ? "bg-[#7C3AED] text-white"
                      : "bg-[#F8FAFC] text-[#6B7280] border border-[#E5E7EB] hover:border-[#DDD6FE]"
                  }`}
                >
                  Custom
                </button>
                {slideCount === "custom" && (
                  <input
                    type="number"
                    min={4}
                    max={30}
                    value={customSlideCount}
                    onChange={(e) => setCustomSlideCount(Number(e.target.value))}
                    className="mt-2 w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-[14px] text-[#111827] outline-none focus:border-[#7C3AED]"
                    placeholder="e.g. 20"
                  />
                )}
              </div>

              {/* Presentation Type */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                <label className="block text-[12px] font-semibold text-[#475569] uppercase tracking-wider mb-3">
                  Presentation Type
                </label>
                <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                  {PRESENTATION_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-[13px] transition-all ${
                        type === t
                          ? "bg-[#EDE9FE] text-[#7C3AED] font-semibold"
                          : "text-[#475569] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      {type === t && <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#7C3AED] mr-2 mb-0.5" />}
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                <label className="block text-[12px] font-semibold text-[#475569] uppercase tracking-wider mb-3">
                  Tone
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TONES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`py-2 px-3 rounded-lg text-[12px] font-medium transition-all text-center ${
                        tone === t
                          ? "bg-[#7C3AED] text-white"
                          : "bg-[#F8FAFC] text-[#475569] border border-[#E5E7EB] hover:border-[#DDD6FE] hover:text-[#7C3AED]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visual Style */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                <label className="block text-[12px] font-semibold text-[#475569] uppercase tracking-wider mb-3">
                  Visual Style
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {VISUAL_STYLES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setVisualStyle(s)}
                      className={`py-2 px-3 rounded-lg text-[12px] font-medium transition-all text-center ${
                        visualStyle === s
                          ? "bg-[#7C3AED] text-white"
                          : "bg-[#F8FAFC] text-[#475569] border border-[#E5E7EB] hover:border-[#DDD6FE] hover:text-[#7C3AED]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Custom Instructions */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
              <label className="block text-[12px] font-semibold text-[#475569] uppercase tracking-wider mb-2">
                Custom Instructions (Optional)
              </label>
              <textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder='e.g. "Use minimal text, large visuals and a professional B2B style. Include case study on slide 8."'
                className="w-full h-20 text-[13px] text-[#111827] placeholder-[#9CA3AF] resize-none outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* RIGHT: Theme + CTA */}
          <div className="space-y-4">
            {/* Theme Picker */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
              <label className="block text-[12px] font-semibold text-[#475569] uppercase tracking-wider mb-3">
                Design Theme
              </label>
              <div className="space-y-2">
                {Object.entries(BUILT_IN_THEMES).map(([key, theme]) => {
                  const colors = THEME_COLORS[key];
                  return (
                    <button
                      key={key}
                      onClick={() => setThemeKey(key)}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-lg border transition-all ${
                        themeKey === key
                          ? "border-[#7C3AED] bg-[#EDE9FE]"
                          : "border-[#E5E7EB] hover:border-[#DDD6FE] hover:bg-[#FAFAFA]"
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex-shrink-0 border border-white/20"
                        style={{ backgroundColor: theme.primaryColor }}
                      />
                      <div className="flex-1 text-left">
                        <p className="text-[12px] font-semibold text-[#111827]">{theme.name}</p>
                        <p className="text-[10px] text-[#9CA3AF]">{theme.fontFamily}</p>
                      </div>
                      {themeKey === key && (
                        <Check className="w-3.5 h-3.5 text-[#7C3AED] flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generate CTA */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
              <div className="text-center mb-4">
                <p className="text-[13px] font-semibold text-[#111827] mb-1">Ready to generate</p>
                <p className="text-[12px] text-[#6B7280]">
                  {actualSlideCount} slides · {type} · {tone}
                </p>
              </div>
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim()}
                className="w-full h-11 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-40 disabled:cursor-not-allowed text-white text-[14px] font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm shadow-purple-200"
              >
                <Sparkles className="w-4 h-4" />
                Generate Presentation
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-[#9CA3AF] text-center mt-3">
                Powered by DeepSeek AI · Takes ~15 seconds
              </p>
            </div>

            {/* Theme Preview */}
            {themeKey && (
              <div
                className="rounded-xl overflow-hidden border border-[#E5E7EB]"
                style={{ backgroundColor: BUILT_IN_THEMES[themeKey].backgroundColor }}
              >
                <div
                  className="px-4 py-5"
                  style={{
                    backgroundColor: BUILT_IN_THEMES[themeKey].primaryColor,
                  }}
                >
                  <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">
                    {BUILT_IN_THEMES[themeKey].name} Theme
                  </p>
                  <p className="text-[16px] font-bold text-white leading-tight">
                    Your Presentation Title
                  </p>
                  <p className="text-[11px] text-white/70 mt-1">
                    Subtitle goes here
                  </p>
                </div>
                <div className="px-4 py-4">
                  <div className="space-y-2">
                    {["Key Point One", "Key Point Two", "Key Point Three"].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: BUILT_IN_THEMES[themeKey].secondaryColor }}
                        />
                        <span
                          className="text-[11px]"
                          style={{ color: BUILT_IN_THEMES[themeKey].textColor }}
                        >
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* History */}
            {history.length > 0 && (
              <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden mt-4">
                <div className="px-4 py-3 border-b border-[#E5E7EB] bg-[#F8FAFC]">
                  <h3 className="text-[13px] font-semibold text-[#111827]">Recent Presentations</h3>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {history.map((pres: any) => (
                    <button
                      key={pres.id}
                      onClick={() => openHistory(pres)}
                      className="w-full text-left px-4 py-3 border-b border-[#E5E7EB] hover:bg-[#F8FAFC] transition-colors last:border-0"
                    >
                      <p className="text-[13px] font-medium text-[#111827] truncate">{pres.title || "Untitled Presentation"}</p>
                      <p className="text-[11px] text-[#6B7280] mt-0.5">
                        {pres.slides?.length || 0} slides · {new Date(pres.createdAt).toLocaleDateString()}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
