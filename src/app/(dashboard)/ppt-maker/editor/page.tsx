"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft, ChevronRight, Download, Save, Eye, Undo, Redo,
  Plus, Trash2, Copy, RefreshCw, LayoutGrid, Palette,
  Type, AlignLeft, AlignCenter, AlignRight, Bold, Italic,
  Image as ImageIcon, ArrowUp, ArrowDown, Loader2, Sparkles,
  FileDown, X, Check, ChevronDown, Wand2
} from "lucide-react";
import dynamic from "next/dynamic";
import { Presentation, Slide, SlideElement, BUILT_IN_THEMES, PresentationTheme } from "@/lib/presentation-types";

const SlideRenderer = dynamic(() => import("@/components/ppt/SlideRenderer"), { ssr: false });

const LAYOUT_LABELS: Record<string, string> = {
  cover: "Cover",
  section_divider: "Section Divider",
  title_content: "Title + Content",
  text_image: "Text + Image",
  image_text: "Image + Text",
  three_cards: "Three Cards",
  four_cards: "Four Cards",
  statistics: "Statistics",
  timeline: "Timeline",
  process: "Process Steps",
  comparison: "Comparison Table",
  pricing: "Pricing",
  quote: "Quote",
  case_study: "Case Study",
  full_image: "Full Image",
  key_benefits: "Key Benefits",
  cta: "Call to Action",
};

const AI_ACTIONS = [
  { label: "Regenerate slide", icon: RefreshCw, action: "regenerate" },
  { label: "Make shorter", icon: AlignLeft, action: "shorter" },
  { label: "Make more professional", icon: Type, action: "professional" },
  { label: "Make more persuasive", icon: Bold, action: "persuasive" },
  { label: "Expand content", icon: AlignRight, action: "expand" },
  { label: "Rewrite", icon: Italic, action: "rewrite" },
];

export default function PresentationEditorPage() {
  const router = useRouter();
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [rightPanel, setRightPanel] = useState<"ai" | "theme" | "layout">("ai");
  const [isExporting, setIsExporting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isAiWorking, setIsAiWorking] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [history, setHistory] = useState<Presentation[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    const data = localStorage.getItem("current_presentation");
    if (data) {
      const parsed = JSON.parse(data);
      setPresentation(parsed);
      setHistory([parsed]);
      setHistoryIndex(0);
    } else {
      router.push("/ppt-maker");
    }
  }, [router]);

  useEffect(() => {
    const handlePreview = () => setShowPreview(true);
    const handleExport = () => {
      const exportBtn = document.getElementById("ppt-export-btn");
      if (exportBtn) exportBtn.click();
    };

    window.addEventListener('toggle-preview', handlePreview);
    window.addEventListener('trigger-export', handleExport);
    return () => {
      window.removeEventListener('toggle-preview', handlePreview);
      window.removeEventListener('trigger-export', handleExport);
    }
  }, []);

  const pushHistory = useCallback((updated: Presentation) => {
    setHistory(prev => [...prev.slice(0, historyIndex + 1), updated]);
    setHistoryIndex(prev => prev + 1);
    localStorage.setItem("current_presentation", JSON.stringify(updated));
  }, [historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setPresentation(prev);
      setHistoryIndex(h => h - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setPresentation(next);
      setHistoryIndex(h => h + 1);
    }
  };

  const activeSlide = presentation?.slides[activeSlideIndex];

  // --- Slide Operations ---
  const duplicateSlide = () => {
    if (!presentation || !activeSlide) return;
    const newSlide = { ...activeSlide, id: `slide-${Date.now()}`, elements: activeSlide.elements.map(e => ({ ...e, id: `${e.id}-copy` })) };
    const newSlides = [...presentation.slides];
    newSlides.splice(activeSlideIndex + 1, 0, newSlide);
    const updated = { ...presentation, slides: newSlides, updatedAt: new Date().toISOString() };
    setPresentation(updated);
    pushHistory(updated);
    setActiveSlideIndex(activeSlideIndex + 1);
  };

  const deleteSlide = () => {
    if (!presentation || presentation.slides.length <= 1) return;
    const newSlides = presentation.slides.filter((_, i) => i !== activeSlideIndex);
    const updated = { ...presentation, slides: newSlides, updatedAt: new Date().toISOString() };
    setPresentation(updated);
    pushHistory(updated);
    setActiveSlideIndex(Math.max(0, activeSlideIndex - 1));
  };

  const moveSlide = (dir: "up" | "down") => {
    if (!presentation) return;
    const newSlides = [...presentation.slides];
    const target = dir === "up" ? activeSlideIndex - 1 : activeSlideIndex + 1;
    if (target < 0 || target >= newSlides.length) return;
    [newSlides[activeSlideIndex], newSlides[target]] = [newSlides[target], newSlides[activeSlideIndex]];
    const updated = { ...presentation, slides: newSlides, updatedAt: new Date().toISOString() };
    setPresentation(updated);
    pushHistory(updated);
    setActiveSlideIndex(target);
  };

  const addSlide = () => {
    if (!presentation) return;
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      layout: "title_content",
      title: "New Slide",
      elements: [
        { id: `el-${Date.now()}-1`, type: "heading", content: "New Slide Title" },
        { id: `el-${Date.now()}-2`, type: "bullet_list", items: ["Point one", "Point two", "Point three"] },
      ],
    };
    const newSlides = [...presentation.slides];
    newSlides.splice(activeSlideIndex + 1, 0, newSlide);
    const updated = { ...presentation, slides: newSlides, updatedAt: new Date().toISOString() };
    setPresentation(updated);
    pushHistory(updated);
    setActiveSlideIndex(activeSlideIndex + 1);
  };

  const changeLayout = (layout: string) => {
    if (!presentation || !activeSlide) return;
    const updated = {
      ...presentation,
      slides: presentation.slides.map((s, i) =>
        i === activeSlideIndex ? { ...s, layout: layout as any } : s
      ),
      updatedAt: new Date().toISOString(),
    };
    setPresentation(updated);
    pushHistory(updated);
  };

  const updateElement = (slideIndex: number, elementId: string, updates: Partial<SlideElement>) => {
    if (!presentation) return;
    const updated = {
      ...presentation,
      slides: presentation.slides.map((s, si) =>
        si === slideIndex
          ? { ...s, elements: s.elements.map(e => e.id === elementId ? { ...e, ...updates } : e) }
          : s
      ),
      updatedAt: new Date().toISOString(),
    };
    setPresentation(updated);
    pushHistory(updated);
  };

  const changeTheme = (key: string) => {
    if (!presentation) return;
    const updated = { ...presentation, theme: BUILT_IN_THEMES[key], updatedAt: new Date().toISOString() };
    setPresentation(updated);
    pushHistory(updated);
  };

  // --- AI Regeneration ---
  const handleAIAction = async (action: string) => {
    if (!presentation || !activeSlide || isAiWorking) return;
    setIsAiWorking(true);

    const actionPrompts: Record<string, string> = {
      regenerate: `Regenerate this slide completely. Layout: ${activeSlide.layout}. Keep the same topic.`,
      shorter: `Make the text content much shorter and more concise. Keep only the most important points.`,
      professional: `Rewrite all text to be more professional and business-appropriate.`,
      persuasive: `Rewrite all text to be more persuasive and compelling.`,
      expand: `Expand and add more detail to all text content.`,
      rewrite: `Completely rewrite all text content while keeping the same meaning and layout.`,
    };

    try {
      const res = await fetch("/api/regenerate-slide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slide: activeSlide,
          action,
          prompt: actionPrompts[action],
          theme: presentation.theme,
          presentationContext: presentation.prompt,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.slide) throw new Error(data.error);

      const updated = {
        ...presentation,
        slides: presentation.slides.map((s, i) => i === activeSlideIndex ? { ...data.slide, id: s.id } : s),
        updatedAt: new Date().toISOString(),
      };
      setPresentation(updated);
      pushHistory(updated);
    } catch (err) {
      console.error("AI action failed:", err);
    } finally {
      setIsAiWorking(false);
    }
  };

  // --- Export PPTX ---
  const exportPPTX = async () => {
    if (!presentation) return;
    setIsExporting(true);
    try {
      const pptxgen = (await import("pptxgenjs")).default;
      const pres = new pptxgen();
      pres.layout = "LAYOUT_16x9";

      const { theme, slides } = presentation;

      for (const slide of slides) {
        const s = pres.addSlide();
        const isCover = slide.layout === "cover";
        const isDivider = slide.layout === "section_divider";
        const isTextImage = slide.layout === "text_image";
        const isImageText = slide.layout === "image_text";

        // Background
        const bg = isCover || isDivider ? theme.primaryColor : theme.backgroundColor;
        s.background = { color: bg.replace("#", "") };

        // Determine Text Area bounds
        let startX = 0.5;
        let startY = 0.6;
        let textW = 9.0;

        if (isCover) { startY = 2.8; textW = 8.6; }
        if (isDivider) { startX = 1.0; startY = 2.2; textW = 8.0; }
        if (isTextImage) { startX = 0.5; textW = 5.0; startY = 1.2; }
        if (isImageText) { startX = 4.5; textW = 5.0; startY = 1.2; }

        let yPos = startY;
        const textColor = (isCover || isDivider) ? "FFFFFF" : theme.textColor.replace("#", "");
        const secColor = (isCover || isDivider) ? "F1F5F9" : theme.secondaryColor.replace("#", "");

        for (const el of slide.elements) {
          switch (el.type) {
            case "heading":
              s.addText(el.content || "", {
                x: startX, y: yPos, w: textW, h: isCover ? 1.5 : 1.0,
                fontSize: isCover ? 44 : 32, bold: true,
                color: textColor,
                fontFace: theme.fontFamily,
              });
              yPos += isCover ? 1.5 : 1.1;
              break;
            case "subheading":
              s.addText(el.content || "", {
                x: startX, y: yPos, w: textW, h: 0.6,
                fontSize: 18, bold: false,
                color: secColor,
                fontFace: theme.fontFamily,
              });
              yPos += 0.7;
              break;
            case "paragraph":
              s.addText(el.content || "", {
                x: startX, y: yPos, w: textW, h: 1.2,
                fontSize: 14, color: textColor,
                fontFace: theme.fontFamily, align: "left",
              });
              yPos += 1.3;
              break;
            case "bullet_list":
              (el.items || []).forEach((item, i) => {
                s.addText([{ text: "• " + item }], {
                  x: startX, y: yPos + i * 0.45, w: textW, h: 0.4,
                  fontSize: 14, color: textColor,
                  fontFace: theme.fontFamily,
                });
              });
              yPos += (el.items?.length || 0) * 0.45 + 0.3;
              break;
            case "statistic":
              s.addText(String(el.value || ""), {
                x: startX, y: yPos, w: textW, h: 1.2,
                fontSize: 48, bold: true, align: "center",
                color: (isCover || isDivider) ? "FFFFFF" : theme.primaryColor.replace("#", ""),
                fontFace: theme.fontFamily,
              });
              s.addText(el.label || "", {
                x: startX, y: yPos + 1.2, w: textW, h: 0.5,
                fontSize: 14, align: "center",
                color: textColor,
                fontFace: theme.fontFamily,
              });
              yPos += 2.0;
              break;
            case "quote":
              s.addText(`"${el.content}"`, {
                x: startX, y: yPos, w: textW, h: 1.5,
                fontSize: 24, italic: true, align: "center",
                color: textColor,
                fontFace: theme.fontFamily,
              });
              yPos += 1.7;
              break;
            case "image":
              const imgUrl = el.url || el.imageUrl;
              if (imgUrl) {
                let imgX = startX;
                let imgY = yPos;
                let imgW = textW;
                let imgH = 3;

                if (isTextImage) { imgX = 6.0; imgY = 0; imgW = 4.0; imgH = 5.625; }
                else if (isImageText) { imgX = 0; imgY = 0; imgW = 4.0; imgH = 5.625; }
                else if (isCover) { imgX = 6.0; imgY = 1.0; imgW = 3.5; imgH = 3.5; }

                s.addImage({
                  path: imgUrl,
                  x: imgX, y: imgY, w: imgW, h: imgH,
                  sizing: { type: 'cover' }
                });
                
                if (!isTextImage && !isImageText && !isCover) {
                  yPos += imgH + 0.3;
                }
              }
              break;
            case "card":
              (el.cards || []).forEach((card, i) => {
                const totalCards = el.cards?.length || 3;
                const cW = (textW / totalCards) - 0.2;
                const xPos = startX + (i * (textW / totalCards));
                s.addShape(pres.ShapeType.roundRect as any, {
                  x: xPos, y: yPos, w: cW, h: 2.0,
                  fill: { color: theme.backgroundColor.replace("#", "") },
                  line: { color: theme.primaryColor.replace("#", ""), width: 1 }
                });
                s.addText(card.title, {
                  x: xPos + 0.1, y: yPos + 0.1, w: cW - 0.2, h: 0.5,
                  fontSize: 14, bold: true, color: theme.primaryColor.replace("#", ""),
                  fontFace: theme.fontFamily,
                });
                s.addText(card.description, {
                  x: xPos + 0.1, y: yPos + 0.6, w: cW - 0.2, h: 1.3,
                  fontSize: 11, color: theme.textColor.replace("#", ""),
                  fontFace: theme.fontFamily,
                });
              });
              yPos += 2.3;
              break;
          }
        }

        // Slide number footer
        s.addText(`${slides.indexOf(slide) + 1}`, {
          x: 9.3, y: 5.2, w: 0.5, h: 0.3, fontSize: 10,
          color: textColor,
          fontFace: theme.fontFamily, align: "right",
        });
      }

      await pres.writeFile({ fileName: `${presentation.title || "Presentation"}.pptx` });
    } catch (err) {
      console.error("PPTX export failed:", err);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleSave = () => {
    if (presentation) {
      localStorage.setItem("current_presentation", JSON.stringify(presentation));
      const historyJson = localStorage.getItem("presentation_history");
      let hist = historyJson ? JSON.parse(historyJson) : [];
      const idx = hist.findIndex((p: any) => p.id === presentation.id);
      if (idx >= 0) hist[idx] = presentation;
      else hist.unshift(presentation);
      localStorage.setItem("presentation_history", JSON.stringify(hist));

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const selectedElement = activeSlide?.elements.find(e => e.id === selectedElementId);

  if (!presentation) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#7C3AED] animate-spin" />
      </div>
    );
  }

  const scale = 0.59; // Canvas scale: 960*0.59 ≈ 566px wide

  return (
    <div className="h-screen flex flex-col bg-[#F8FAFC] overflow-hidden">
      {/* ── Top Bar ── */}
      <div className="h-12 border-b border-[#E5E7EB] bg-white flex items-center px-4 gap-3 flex-shrink-0 z-20">
        <button onClick={() => router.push("/ppt-maker")} className="p-1.5 rounded-lg text-[#6B7280] hover:bg-[#F1F5F9] hover:text-[#111827] transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <input
          value={presentation.title || ""}
          onChange={(e) => setPresentation(p => p ? { ...p, title: e.target.value } : p)}
          className="text-[14px] font-semibold text-[#111827] bg-transparent outline-none border-b border-transparent focus:border-[#7C3AED] px-1 min-w-[180px]"
        />
        <div className="flex items-center gap-0.5 ml-2">
          <button onClick={undo} disabled={historyIndex <= 0} className="p-1.5 rounded-md text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F1F5F9] disabled:opacity-30 transition-colors">
            <Undo className="w-3.5 h-3.5" />
          </button>
          <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-1.5 rounded-md text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F1F5F9] disabled:opacity-30 transition-colors">
            <Redo className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-1.5 text-[12px] text-[#9CA3AF]">
          <span>{presentation.slides.length} slides</span>
          <span>·</span>
          <span>{presentation.theme?.name || "Modern"} theme</span>
        </div>

        {/* Global Export Target Button */}
        <button id="ppt-export-btn" onClick={exportPPTX} className="hidden" />

        <button onClick={() => setShowPreview(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-[#475569] bg-[#F8FAFC] border border-[#E5E7EB] hover:bg-[#F1F5F9] transition-colors">
          <Eye className="w-3.5 h-3.5" />
          Preview
        </button>
        <button onClick={handleSave} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${isSaved ? "text-green-700 bg-green-50 border border-green-200" : "text-[#475569] bg-[#F8FAFC] border border-[#E5E7EB] hover:bg-[#F1F5F9]"}`}>
          {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
          {isSaved ? "Saved!" : "Save"}
        </button>
        <button
          onClick={exportPPTX}
          disabled={isExporting}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[13px] font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] disabled:opacity-50 transition-colors shadow-sm shadow-purple-200"
        >
          {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          Export PPTX
        </button>
      </div>

      {/* ── Main Area ── */}
      <div className="flex flex-1 min-h-0">

        {/* ── LEFT: Slide Thumbnails ── */}
        <div className="w-44 border-r border-[#E5E7EB] bg-white flex-shrink-0 overflow-y-auto">
          <div className="p-2 space-y-1.5">
            {presentation.slides.map((slide, i) => (
              <div key={slide.id} className="relative group">
                <button
                  onClick={() => { setActiveSlideIndex(i); setSelectedElementId(null); }}
                  className={`w-full rounded-lg overflow-hidden transition-all ${
                    i === activeSlideIndex ? "ring-2 ring-[#7C3AED]" : "ring-1 ring-[#E5E7EB] hover:ring-[#DDD6FE]"
                  }`}
                >
                  <div className="bg-[#F8FAFC]" style={{ aspectRatio: "16/9", pointerEvents: "none" }}>
                    <SlideRenderer slide={slide} theme={presentation.theme} scale={0.155} isThumbnail />
                  </div>
                </button>
                <span className="absolute -left-0.5 top-1/2 -translate-y-1/2 text-[9px] text-[#9CA3AF] w-4 text-right">{i + 1}</span>
              </div>
            ))}
          </div>
          {/* Add Slide */}
          <div className="p-2 border-t border-[#E5E7EB] sticky bottom-0 bg-white">
            <button onClick={addSlide} className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-dashed border-[#DDD6FE] text-[#7C3AED] hover:bg-[#EDE9FE] transition-colors text-[12px] font-medium">
              <Plus className="w-3.5 h-3.5" />
              Add Slide
            </button>
          </div>
        </div>

        {/* ── CENTER: Canvas ── */}
        <div className="flex-1 flex flex-col items-center bg-[#F1F5F9] overflow-auto py-6 gap-3">

          {/* Slide Toolbar */}
          <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-xl px-3 py-1.5 shadow-sm text-[12px]">
            <button onClick={() => moveSlide("up")} disabled={activeSlideIndex === 0} className="p-1 rounded text-[#6B7280] hover:text-[#111827] hover:bg-[#F1F5F9] disabled:opacity-30 transition-colors" title="Move up">
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => moveSlide("down")} disabled={activeSlideIndex === (presentation?.slides.length ?? 0) - 1} className="p-1 rounded text-[#6B7280] hover:text-[#111827] hover:bg-[#F1F5F9] disabled:opacity-30 transition-colors" title="Move down">
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-[#E5E7EB]" />
            <button onClick={duplicateSlide} className="flex items-center gap-1 px-2 py-1 rounded text-[#6B7280] hover:text-[#111827] hover:bg-[#F1F5F9] transition-colors">
              <Copy className="w-3 h-3" />
              Duplicate
            </button>
            <button onClick={deleteSlide} disabled={presentation.slides.length <= 1} className="flex items-center gap-1 px-2 py-1 rounded text-[#DC2626] hover:bg-red-50 disabled:opacity-30 transition-colors">
              <Trash2 className="w-3 h-3" />
              Delete
            </button>
            <div className="w-px h-4 bg-[#E5E7EB]" />
            <span className="text-[#9CA3AF]">{activeSlideIndex + 1} / {presentation.slides.length}</span>
          </div>

          {/* Main Slide Canvas */}
          {activeSlide && (
            <div className="relative">
              <SlideRenderer
                slide={activeSlide}
                theme={presentation.theme}
                scale={scale}
                isSelected={false}
                onElementClick={(id) => setSelectedElementId(id)}
              />
            </div>
          )}

          {/* Navigation Arrows */}
          <div className="flex items-center gap-4 mt-2">
            <button onClick={() => setActiveSlideIndex(Math.max(0, activeSlideIndex - 1))} disabled={activeSlideIndex === 0} className="p-2 rounded-full bg-white border border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] disabled:opacity-30 shadow-sm transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[12px] text-[#6B7280] min-w-[80px] text-center">
              {LAYOUT_LABELS[activeSlide?.layout || ""] || activeSlide?.layout}
            </span>
            <button onClick={() => setActiveSlideIndex(Math.min(presentation.slides.length - 1, activeSlideIndex + 1))} disabled={activeSlideIndex === presentation.slides.length - 1} className="p-2 rounded-full bg-white border border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] disabled:opacity-30 shadow-sm transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── RIGHT: Panel ── */}
        <div className="w-64 border-l border-[#E5E7EB] bg-white flex-shrink-0 flex flex-col">
          {/* Panel Tabs */}
          <div className="flex border-b border-[#E5E7EB]">
            {[
              { key: "ai", label: "AI", icon: Sparkles },
              { key: "layout", label: "Layout", icon: LayoutGrid },
              { key: "theme", label: "Theme", icon: Palette },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setRightPanel(key as any)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[12px] font-medium border-b-2 transition-all ${
                  rightPanel === key
                    ? "border-[#7C3AED] text-[#7C3AED]"
                    : "border-transparent text-[#6B7280] hover:text-[#111827]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {/* AI Panel */}
            {rightPanel === "ai" && (
              <div className="space-y-3">
                <div>
                  <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">AI Actions</p>
                  <div className="space-y-1.5">
                    {AI_ACTIONS.map((action) => (
                      <button
                        key={action.action}
                        onClick={() => handleAIAction(action.action)}
                        disabled={isAiWorking}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-[#475569] hover:bg-[#EDE9FE] hover:text-[#7C3AED] disabled:opacity-40 transition-colors text-left"
                      >
                        {isAiWorking ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#7C3AED]" /> : <action.icon className="w-3.5 h-3.5 flex-shrink-0" />}
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Element Editor */}
                {selectedElement && (
                  <div className="border-t border-[#E5E7EB] pt-3 mt-3">
                    <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">Edit Element</p>
                    <p className="text-[10px] text-[#9CA3AF] mb-2 capitalize">{selectedElement.type}</p>
                    {selectedElement.content !== undefined && selectedElement.type !== "image" && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateElement(activeSlideIndex, selectedElement.id, { isBold: !(selectedElement.isBold ?? (selectedElement.type === 'heading' || selectedElement.type === 'subheading')) })}
                            className={`p-1.5 rounded border transition-colors ${selectedElement.isBold || (selectedElement.isBold !== false && (selectedElement.type === 'heading' || selectedElement.type === 'subheading')) ? 'bg-[#7C3AED] text-white border-[#7C3AED]' : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:bg-[#F1F5F9]'}`}
                            title="Bold"
                          >
                            <Bold className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => updateElement(activeSlideIndex, selectedElement.id, { isItalic: !selectedElement.isItalic })}
                            className={`p-1.5 rounded border transition-colors ${selectedElement.isItalic ? 'bg-[#7C3AED] text-white border-[#7C3AED]' : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:bg-[#F1F5F9]'}`}
                            title="Italic"
                          >
                            <Italic className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <textarea
                          value={selectedElement.content}
                          onChange={(e) => updateElement(activeSlideIndex, selectedElement.id, { content: e.target.value })}
                          className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-[12px] text-[#111827] resize-none outline-none focus:border-[#7C3AED] h-24"
                        />
                      </div>
                    )}
                    {selectedElement.items && (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 mb-2">
                          <button
                            onClick={() => updateElement(activeSlideIndex, selectedElement.id, { isBold: !selectedElement.isBold })}
                            className={`p-1.5 rounded border transition-colors ${selectedElement.isBold ? 'bg-[#7C3AED] text-white border-[#7C3AED]' : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:bg-[#F1F5F9]'}`}
                            title="Bold"
                          >
                            <Bold className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => updateElement(activeSlideIndex, selectedElement.id, { isItalic: !selectedElement.isItalic })}
                            className={`p-1.5 rounded border transition-colors ${selectedElement.isItalic ? 'bg-[#7C3AED] text-white border-[#7C3AED]' : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:bg-[#F1F5F9]'}`}
                            title="Italic"
                          >
                            <Italic className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {selectedElement.items.map((item, i) => (
                          <input
                            key={i}
                            value={item}
                            onChange={(e) => {
                              const items = [...(selectedElement.items || [])];
                              items[i] = e.target.value;
                              updateElement(activeSlideIndex, selectedElement.id, { items });
                            }}
                            className="w-full border border-[#E5E7EB] rounded-lg px-2 py-1.5 text-[12px] outline-none focus:border-[#7C3AED]"
                          />
                        ))}
                      </div>
                    )}
                    {selectedElement.type === "image" && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] text-[#9CA3AF] mb-1 block">Image URL</label>
                          <input
                            value={selectedElement.url || ""}
                            onChange={(e) => updateElement(activeSlideIndex, selectedElement.id, { url: e.target.value })}
                            className="w-full border border-[#E5E7EB] rounded-lg px-2 py-1.5 text-[12px] outline-none focus:border-[#7C3AED]"
                            placeholder="https://..."
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#9CA3AF] mb-1 block">Alt Text (or AI Prompt)</label>
                          <input
                            value={selectedElement.alt || ""}
                            onChange={(e) => updateElement(activeSlideIndex, selectedElement.id, { alt: e.target.value })}
                            className="w-full border border-[#E5E7EB] rounded-lg px-2 py-1.5 text-[12px] outline-none focus:border-[#7C3AED]"
                            placeholder="Describe image..."
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const prompt = selectedElement.alt || "professional presentation image";
                              const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=600&nologo=true`;
                              updateElement(activeSlideIndex, selectedElement.id, { url });
                            }}
                            className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 bg-[#EDE9FE] text-[#7C3AED] rounded-lg text-[11px] font-medium hover:bg-[#DDD6FE] transition-colors"
                          >
                            <Sparkles className="w-3.5 h-3.5" /> Generate
                          </button>
                          <label className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 bg-[#F1F5F9] text-[#475569] rounded-lg text-[11px] font-medium hover:bg-[#E2E8F0] transition-colors cursor-pointer">
                            <ImageIcon className="w-3.5 h-3.5" /> Upload
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (ev) => {
                                    updateElement(activeSlideIndex, selectedElement.id, { url: ev.target?.result as string });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Layout Panel */}
            {rightPanel === "layout" && (
              <div>
                <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">Change Layout</p>
                <div className="space-y-1">
                  {Object.entries(LAYOUT_LABELS).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => changeLayout(key)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-[12px] transition-all ${
                        activeSlide?.layout === key
                          ? "bg-[#EDE9FE] text-[#7C3AED] font-semibold"
                          : "text-[#475569] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      {activeSlide?.layout === key && <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#7C3AED] mr-2 mb-0.5" />}
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Theme Panel */}
            {rightPanel === "theme" && (
              <div>
                <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">Presentation Theme</p>
                <div className="space-y-2">
                  {Object.entries(BUILT_IN_THEMES).map(([key, t]) => (
                    <button
                      key={key}
                      onClick={() => changeTheme(key)}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-lg border transition-all ${
                        presentation.theme?.name === t.name
                          ? "border-[#7C3AED] bg-[#EDE9FE]"
                          : "border-[#E5E7EB] hover:border-[#DDD6FE]"
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg flex-shrink-0" style={{ backgroundColor: t.primaryColor }} />
                      <div className="flex-1 text-left">
                        <p className="text-[12px] font-semibold text-[#111827]">{t.name}</p>
                        <p className="text-[10px] text-[#9CA3AF]">{t.fontFamily}</p>
                      </div>
                      {presentation.theme?.name === t.name && (
                        <Check className="w-3.5 h-3.5 text-[#7C3AED] flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Fullscreen Preview Modal ── */}
      {showPreview && presentation && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
          <div className="flex items-center justify-between px-6 py-3">
            <span className="text-white font-semibold">{presentation.title}</span>
            <button onClick={() => setShowPreview(false)} className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center gap-4">
            <button
              onClick={() => setActiveSlideIndex(i => Math.max(0, i - 1))}
              disabled={activeSlideIndex === 0}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="shadow-2xl">
              <SlideRenderer
                slide={presentation.slides[activeSlideIndex]}
                theme={presentation.theme}
                scale={0.95}
              />
            </div>
            <button
              onClick={() => setActiveSlideIndex(i => Math.min(presentation.slides.length - 1, i + 1))}
              disabled={activeSlideIndex === presentation.slides.length - 1}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          <div className="flex justify-center gap-1.5 py-3">
            {presentation.slides.map((_, i) => (
              <button key={i} onClick={() => setActiveSlideIndex(i)} className={`h-1.5 rounded-full transition-all ${i === activeSlideIndex ? "w-6 bg-white" : "w-1.5 bg-white/40"}`} />
            ))}
          </div>
          <div className="text-center text-white/50 text-[12px] pb-3">
            {activeSlideIndex + 1} / {presentation.slides.length}
          </div>
        </div>
      )}
    </div>
  );
}
