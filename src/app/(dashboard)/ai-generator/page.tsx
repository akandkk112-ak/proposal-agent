"use client";

import { useState } from "react";
import { Sparkles, Download, FileText, Bot, Loader2, ArrowRight, LayoutTemplate, Layers, Paperclip, LayoutGrid, Zap, FileCode2, Edit3, Image as ImageIcon } from "lucide-react";

interface Slide {
  id: string;
  title: string;
  content: string;
  type: 'cover' | 'content' | 'pricing' | 'image-left' | 'stats';
  bg?: string;
  color?: string;
  image?: string;
}

export default function AIGeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [activeTab, setActiveTab] = useState("Agent");
  const [attachedImage, setAttachedImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isPrompt: boolean = true, slideIndex?: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isPrompt) {
          setAttachedImage(reader.result as string);
        } else if (slideIndex !== undefined) {
          const newSlides = [...slides];
          newSlides[slideIndex].image = reader.result as string;
          setSlides(newSlides);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setSlides([]);
    
    try {
      const response = await fetch('/api/generate-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      
      setSlides(data.slides || []);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to generate slides. Make sure your API key is set.");
    } finally {
      setIsGenerating(false);
    }
  };

  const exportPPTX = async () => {
    try {
      const pptxgen = (await import("pptxgenjs")).default;
      let pres = new pptxgen();

      // Define standard styling constants
      const THEME_COLOR = "4F46E5";
      const DARK_COLOR = "1E293B";
      const GRAY_COLOR = "475569";
      
      slides.forEach((slide, index) => {
        let presSlide = pres.addSlide();
        const slideNum = index + 1;
        
        // Add footer to all non-cover slides
        if (slide.type !== 'cover') {
          presSlide.addText("PROPOSAL STUDIO", { x: 0.5, y: 5.2, w: 2, fontSize: 10, color: "A0AEC0", bold: true });
          presSlide.addText(`${slideNum}`, { x: 9.0, y: 5.2, w: 0.5, fontSize: 10, color: "A0AEC0", align: "right" });
          presSlide.addShape(pres.ShapeType.line, { x: 0.5, y: 5.1, w: 9, h: 0, line: { color: "E2E8F0", width: 1 } });
        }

        if (slide.type === 'cover') {
          presSlide.background = { color: slide.bg?.replace("#", "") || THEME_COLOR };
          
          // Professional Cover Design
          presSlide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: 4, h: 5.625, fill: { color: DARK_COLOR } });
          presSlide.addText(slide.title, { x: 0.5, y: 2, w: 8, fontSize: 48, color: "FFFFFF", bold: true, fontFace: "Helvetica" });
          presSlide.addShape(pres.ShapeType.rect, { x: 0.5, y: 3.2, w: 1.5, h: 0.05, fill: { color: THEME_COLOR } });
          presSlide.addText(slide.content, { x: 0.5, y: 3.5, w: 6, fontSize: 18, color: "E2E8F0", fontFace: "Helvetica" });
          
        } else if (slide.type === 'image-left') {
          presSlide.background = { color: "FFFFFF" };
          
          if (slide.image) {
            presSlide.addImage({ data: slide.image, x: 0, y: 0, w: 4.5, h: 5.625 });
          } else {
            presSlide.addShape(pres.ShapeType.rect, { x: 0.5, y: 0.5, w: 3.5, h: 4.2, fill: { color: "F1F5F9" } });
            presSlide.addText("IMAGE PLACEHOLDER", { x: 0.5, y: 2.3, w: 3.5, fontSize: 14, color: "CBD5E1", align: "center", bold: true });
          }
          
          presSlide.addText(slide.title, { x: 4.5, y: 0.8, w: 5, fontSize: 32, color: DARK_COLOR, bold: true, fontFace: "Helvetica" });
          presSlide.addText(slide.content, { x: 4.5, y: 1.8, w: 5, fontSize: 16, color: GRAY_COLOR, fontFace: "Helvetica", leading: 1.5 });
          
        } else if (slide.type === 'pricing') {
          presSlide.background = { color: "FFFFFF" };
          
          presSlide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: 10, h: 1.5, fill: { color: "F8FAFC" } });
          presSlide.addText(slide.title, { x: 0.5, y: 0.5, w: 9, fontSize: 36, color: THEME_COLOR, bold: true, fontFace: "Helvetica" });
          
          const lines = slide.content.split('\\n');
          lines.forEach((line, i) => {
            const yPos = 2.0 + (i * 0.8);
            presSlide.addShape(pres.ShapeType.roundRect, { x: 0.5, y: yPos, w: 9, h: 0.6, fill: { color: "F8FAFC" }, line: { color: "E2E8F0", width: 1 } });
            presSlide.addText(line, { x: 0.8, y: yPos + 0.1, w: 8.4, fontSize: 18, color: DARK_COLOR, fontFace: "Helvetica", bold: true });
          });
          
        } else {
          presSlide.background = { color: "FFFFFF" };
          
          presSlide.addText(slide.title, { x: 0.5, y: 0.5, w: 9, fontSize: 36, color: DARK_COLOR, bold: true, fontFace: "Helvetica" });
          presSlide.addShape(pres.ShapeType.rect, { x: 0.5, y: 1.3, w: 1, h: 0.05, fill: { color: THEME_COLOR } });
          
          const textOptions = { x: 0.5, y: 1.6, w: 8.5, fontSize: 18, color: GRAY_COLOR, fontFace: "Helvetica", leading: 1.5 };
          if (slide.content.includes('•')) {
            presSlide.addText(slide.content.split('\\n').join('\\n\\n'), { ...textOptions, bullet: true });
          } else {
            presSlide.addText(slide.content.split('\\n').join('\\n'), textOptions);
          }
        }
      });

      pres.writeFile({ fileName: "Professional_AI_Pitch.pptx" });
    } catch (e) {
      console.error(e);
      alert("Failed to generate PPTX");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#F3F6FA] to-white font-sans relative">
      {/* Navbar (Internal to this page for the tool look) */}
      <div className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-8 z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#4F46E5] rounded flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-[#1E293B]">ProposalStudio<span className="text-[#4F46E5]">AI</span></span>
        </div>
        {slides.length > 0 && (
          <button 
            onClick={exportPPTX}
            className="flex items-center gap-2 h-10 px-5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg"
          >
            <Download className="w-4 h-4" /> Download PPTX
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center pt-32 pb-20 px-6">
        
        {/* Initial Prompt State */}
        {!isGenerating && slides.length === 0 && (
          <div className="max-w-4xl w-full flex flex-col items-center animate-fadeIn">
            <h1 className="text-[56px] font-bold text-[#1E293B] text-center leading-tight tracking-tight mb-4">
              AI Presentation Maker for <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#9333EA]">Ready-to-Show</span> Slides
            </h1>
            <p className="text-[#64748B] text-lg text-center max-w-2xl mb-12">
              An intuitive AI presentation creator that turns ideas, documents, URLs, and notes into polished, fully editable slides in minutes.
            </p>

            {/* Central Prompt Box */}
            <div className="w-full max-w-3xl bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#E2E8F0] p-3 transition-all focus-within:shadow-[0_8px_40px_rgb(79,70,229,0.15)] focus-within:border-[#4F46E5]">
              
              {/* Prompt Tabs */}
              <div className="flex items-center gap-1 mb-3 px-2 pt-1 border-b border-[#F1F5F9] pb-3">
                {["Agent", "Classic", "Flow", "Visual"].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      activeTab === tab ? "bg-[#F3F4F6] text-[#1E293B]" : "text-[#64748B] hover:bg-[#F8FAFC]"
                    }`}
                  >
                    {tab === "Agent" && <Bot className="w-4 h-4" />}
                    {tab === "Classic" && <FileText className="w-4 h-4" />}
                    {tab === "Flow" && <Layers className="w-4 h-4" />}
                    {tab === "Visual" && <ImageIcon className="w-4 h-4" />}
                    {tab}
                  </button>
                ))}
              </div>

              {/* Textarea */}
              <form onSubmit={handleGenerate} className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your topic or idea, or upload your files (doc, pdf, txt...)"
                  className="w-full h-32 px-4 py-2 resize-none outline-none text-lg text-[#1E293B] placeholder-[#94A3B8] bg-transparent"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleGenerate(e);
                    }
                  }}
                />
                
                {/* Footer Tools */}
                <div className="flex items-center justify-between px-2 pt-2">
                  <div className="flex items-center gap-4">
                    <div className="relative group/btn">
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, true)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <button type="button" className="p-2 text-[#94A3B8] group-hover/btn:bg-[#F1F5F9] rounded-full transition-colors relative" title="Attach file">
                        <Paperclip className="w-5 h-5" />
                        {attachedImage && <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>}
                      </button>
                    </div>
                    {attachedImage && (
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-[#E2E8F0]">
                        <img src={attachedImage} alt="Attached" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setAttachedImage(null)} className="absolute top-0 right-0 bg-black/50 text-white w-4 h-4 flex items-center justify-center text-[10px] hover:bg-black/70">✕</button>
                      </div>
                    )}
                    <button type="button" className="p-2 text-[#94A3B8] hover:bg-[#F1F5F9] rounded-full transition-colors" title="Templates">
                      <LayoutGrid className="w-5 h-5" />
                    </button>
                  </div>
                  <button 
                    type="submit"
                    disabled={!prompt.trim()}
                    className="w-10 h-10 rounded-full bg-[#4F46E5] text-white flex items-center justify-center hover:bg-[#4338CA] disabled:bg-[#CBD5E1] transition-colors"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
            
            <div className="mt-8 flex gap-4 text-sm text-[#64748B]">
              <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-[#F59E0B]" /> Instant Generation</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><FileCode2 className="w-4 h-4 text-[#3B82F6]" /> Editable PPTX</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><Edit3 className="w-4 h-4 text-[#10B981]" /> Auto-designed</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isGenerating && (
          <div className="flex flex-col items-center justify-center mt-20 animate-fadeIn">
            <div className="relative w-24 h-24 flex items-center justify-center mb-8">
              <div className="absolute inset-0 border-4 border-[#E2E8F0] rounded-full"></div>
              <div className="absolute inset-0 border-4 border-[#4F46E5] rounded-full border-t-transparent animate-spin"></div>
              <Sparkles className="w-8 h-8 text-[#4F46E5] animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-[#1E293B] mb-2">Crafting your presentation...</h2>
            <p className="text-[#64748B]">Applying layouts, typography, and generating content.</p>
          </div>
        )}

        {/* Generated Slides Grid */}
        {slides.length > 0 && (
          <div className="w-full max-w-6xl animate-fadeIn">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-[#1E293B]">Your Generated Presentation</h2>
              <p className="text-[#64748B]">{slides.length} Slides • Ready to download</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {slides.map((slide, idx) => (
                <div key={slide.id} className="group relative aspect-[16/9] rounded-xl overflow-hidden shadow-lg border border-[#E2E8F0] bg-white transition-transform hover:scale-[1.02]">
                  
                  {/* Slide Visuals */}
                  {slide.type === 'cover' ? (
                    <div className="absolute inset-0 p-10 flex flex-col justify-center" style={{ backgroundColor: slide.bg, color: slide.color }}>
                      <div className="w-12 h-1 bg-white mb-6 opacity-80"></div>
                      <div 
                        contentEditable suppressContentEditableWarning
                        onBlur={(e) => { const newSlides = [...slides]; newSlides[idx].title = e.currentTarget.textContent || ''; setSlides(newSlides); }}
                        className="text-4xl font-bold mb-4 leading-tight outline-none focus:ring-2 focus:ring-white/50 rounded"
                      >{slide.title}</div>
                      <div 
                        contentEditable suppressContentEditableWarning
                        onBlur={(e) => { const newSlides = [...slides]; newSlides[idx].content = e.currentTarget.textContent || ''; setSlides(newSlides); }}
                        className="text-lg opacity-90 outline-none focus:ring-2 focus:ring-white/50 rounded"
                      >{slide.content}</div>
                    </div>
                  ) : slide.type === 'image-left' ? (
                    <div className="absolute inset-0 flex">
                      <div className="w-1/3 bg-[#F1F5F9] flex items-center justify-center border-r border-[#E2E8F0] relative group/img overflow-hidden">
                        {slide.image ? (
                          <img src={slide.image} alt="Slide img" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-12 h-12 text-[#CBD5E1]" />
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, false, idx)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                          <span className="text-xs font-bold text-[#1E293B] bg-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                            <Paperclip className="w-3 h-3" /> Upload Image
                          </span>
                        </div>
                      </div>
                      <div className="w-2/3 p-10 flex flex-col justify-center bg-white">
                        <div 
                          contentEditable suppressContentEditableWarning
                          onBlur={(e) => { const newSlides = [...slides]; newSlides[idx].title = e.currentTarget.textContent || ''; setSlides(newSlides); }}
                          className="text-2xl font-bold text-[#1E293B] mb-4 outline-none focus:bg-gray-50 rounded"
                        >{slide.title}</div>
                        <div 
                          contentEditable suppressContentEditableWarning
                          onBlur={(e) => { const newSlides = [...slides]; newSlides[idx].content = e.currentTarget.textContent || ''; setSlides(newSlides); }}
                          className="text-sm text-[#475569] leading-relaxed outline-none focus:bg-gray-50 rounded min-h-[4rem]"
                        >{slide.content}</div>
                      </div>
                    </div>
                  ) : slide.type === 'pricing' ? (
                    <div className="absolute inset-0 p-10 flex flex-col justify-center bg-white">
                      <div 
                        contentEditable suppressContentEditableWarning
                        onBlur={(e) => { const newSlides = [...slides]; newSlides[idx].title = e.currentTarget.textContent || ''; setSlides(newSlides); }}
                        className="text-2xl font-bold text-[#4F46E5] mb-6 outline-none focus:bg-gray-50 rounded"
                      >{slide.title}</div>
                      <div className="space-y-4">
                        {slide.content.split('\\n').map((line, i) => (
                          <div 
                            key={i} 
                            contentEditable suppressContentEditableWarning
                            onBlur={(e) => { 
                              const lines = slide.content.split('\\n');
                              lines[i] = e.currentTarget.textContent || '';
                              const newSlides = [...slides]; 
                              newSlides[idx].content = lines.join('\\n'); 
                              setSlides(newSlides); 
                            }}
                            className="bg-[#F8FAFC] p-4 rounded-lg border border-[#E2E8F0] font-medium text-[#1E293B] outline-none focus:border-[#4F46E5]"
                          >
                            {line}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 p-10 flex flex-col justify-center bg-white">
                      <div 
                        contentEditable suppressContentEditableWarning
                        onBlur={(e) => { const newSlides = [...slides]; newSlides[idx].title = e.currentTarget.textContent || ''; setSlides(newSlides); }}
                        className="text-2xl font-bold text-[#1E293B] mb-6 outline-none focus:bg-gray-50 rounded"
                      >{slide.title}</div>
                      <div 
                        contentEditable suppressContentEditableWarning
                        onBlur={(e) => { const newSlides = [...slides]; newSlides[idx].content = e.currentTarget.textContent || ''; setSlides(newSlides); }}
                        className="space-y-3 text-[#475569] outline-none focus:bg-gray-50 rounded p-2 min-h-[10rem] whitespace-pre-wrap"
                      >
                        {slide.content}
                      </div>
                    </div>
                  )}

                  {/* Top-right Edit Hint Overlay (Hover) */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-[#4F46E5] text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                      <Edit3 className="w-3 h-3" /> Click text to edit
                    </span>
                  </div>
                  
                  {/* Slide Number */}
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-[#475569] shadow-sm border border-[#E2E8F0]">
                    {idx + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
