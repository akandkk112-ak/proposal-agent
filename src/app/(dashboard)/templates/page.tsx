"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Plus, Eye, ArrowRight, Star, TrendingUp, Clock, Check, Filter, X } from "lucide-react";

const CATEGORIES = ["All Templates", "PowerPoint", "Documents", "Pitch Decks", "Creative Agency"];

const TEMPLATES = [
  {
    id: "tpl-ppt-1",
    type: "ppt",
    name: "Modern SaaS Pitch Deck",
    category: "PowerPoint",
    description: "A high-conversion SaaS pitch deck template used by top startups.",
    tags: ["Pitch", "Startup", "Minimal"],
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    slidesCount: 12,
    theme: {
      name: "Modern SaaS",
      primaryColor: "#7C3AED",
      secondaryColor: "#4F46E5",
      backgroundColor: "#F8FAFC",
      textColor: "#0F172A",
      fontFamily: "Inter"
    }
  },
  {
    id: "tpl-ppt-2",
    type: "ppt",
    name: "Creative Agency Portfolio",
    category: "PowerPoint",
    description: "Bold and dark presentation template perfect for creative portfolios.",
    tags: ["Portfolio", "Bold", "Agency"],
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    slidesCount: 15,
    theme: {
      name: "Creative Dark",
      primaryColor: "#EC4899",
      secondaryColor: "#8B5CF6",
      backgroundColor: "#111827",
      textColor: "#F9FAFB",
      fontFamily: "Outfit"
    }
  },
  {
    id: "tpl-ppt-3",
    type: "ppt",
    name: "Corporate Strategy Plan",
    category: "PowerPoint",
    description: "Clean and professional strategy presentation for enterprise.",
    tags: ["Corporate", "Strategy", "Professional"],
    thumbnail: "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?w=800&q=80",
    slidesCount: 20,
    theme: {
      name: "Corporate Blue",
      primaryColor: "#2563EB",
      secondaryColor: "#3B82F6",
      backgroundColor: "#FFFFFF",
      textColor: "#1E293B",
      fontFamily: "Roboto"
    }
  },
  {
    id: "tpl-doc-1",
    type: "doc",
    name: "Enterprise Software Proposal",
    category: "Documents",
    description: "Standard web-based document proposal for enterprise software sales.",
    tags: ["Enterprise", "Software", "Contract"],
    thumbnail: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80",
    pages: 14,
  }
];

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState("All Templates");
  const [search, setSearch] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);
  
  const router = useRouter();

  const filtered = TEMPLATES.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory =
      activeCategory === "All Templates" ||
      (activeCategory === "PowerPoint" && t.category === "PowerPoint") ||
      (activeCategory === "Documents" && t.category === "Documents") ||
      (activeCategory === "Pitch Decks" && t.tags.includes("Pitch")) ||
      (activeCategory === "Creative Agency" && t.tags.includes("Agency"));
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 space-y-6 animate-fadeIn h-screen overflow-y-auto bg-[#F8FAFC]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded bg-[#EDE9FE] text-[#7C3AED]">Template Marketplace</span>
          </p>
          <h1 className="text-[28px] font-bold text-[#111827] tracking-tight">Studio Templates</h1>
          <p className="text-[14px] text-[#9CA3AF] mt-1">High-quality PowerPoint and Document templates ready to use and edit.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates..."
              className="h-9 pl-9 pr-4 w-64 rounded-lg border border-[#E5E7EB] text-[13px] bg-white focus:outline-none focus:border-[#7C3AED]"
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 flex-wrap pb-2 border-b border-[#E5E7EB]">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex items-center gap-1.5 h-8 px-4 rounded-full text-[13px] font-medium transition-all ${
              activeCategory === cat
                ? "bg-[#111827] text-white"
                : "bg-white border border-[#E5E7EB] text-[#475569] hover:bg-[#F1F5F9]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
        {filtered.map((template) => (
          <div key={template.id} className="group bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
            <div className="aspect-[16/10] bg-gray-100 relative overflow-hidden">
              <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute top-3 left-3">
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold shadow-sm backdrop-blur-md ${template.type === 'ppt' ? 'bg-[#FF6A00]/90 text-white' : 'bg-blue-600/90 text-white'}`}>
                  {template.type === 'ppt' ? 'POWERPOINT' : 'DOCUMENT'}
                </span>
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button 
                  onClick={() => setPreviewTemplate(template)}
                  className="px-4 py-2 bg-white text-[#111827] text-[12px] font-bold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Preview
                </button>
                <button 
                  onClick={() => {
                    if (template.type === 'ppt') {
                      const pres = {
                        id: "pres-" + Date.now(),
                        title: template.name,
                        theme: template.theme,
                        slides: [
                          {
                            id: "slide-1", layout: "cover", elements: [
                              { id: "e1", type: "heading", content: template.name },
                              { id: "e2", type: "subheading", content: template.description }
                            ]
                          },
                          {
                            id: "slide-2", layout: "title_content", elements: [
                              { id: "e3", type: "heading", content: "Agenda" },
                              { id: "e4", type: "bullet_list", items: ["Introduction", "Market Analysis", "Our Solution", "Pricing"] }
                            ]
                          }
                        ]
                      };
                      localStorage.setItem("current_presentation", JSON.stringify(pres));
                      router.push("/ppt-maker/editor");
                    } else {
                      router.push(`/proposals/new?template=${template.id}`);
                    }
                  }}
                  className="px-4 py-2 bg-[#7C3AED] text-white text-[12px] font-bold rounded-lg hover:bg-[#6D28D9] transition-colors"
                >
                  {template.type === 'ppt' ? 'Edit in PPT Maker' : 'Use Template'}
                </button>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-[15px] font-bold text-[#111827] mb-1.5">{template.name}</h3>
              <p className="text-[12px] text-[#6B7280] line-clamp-2 mb-4">{template.description}</p>
              <div className="mt-auto flex items-center justify-between">
                <div className="flex gap-1.5">
                  {template.tags.slice(0,2).map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-[#F1F5F9] text-[#475569] text-[10px] font-medium rounded-md">{tag}</span>
                  ))}
                </div>
                <span className="text-[11px] text-[#9CA3AF] font-medium">
                  {template.slidesCount ? `${template.slidesCount} Slides` : `${template.pages} Pages`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/80 backdrop-blur-sm flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-white w-full max-w-5xl h-[85vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl">
            <div className="h-16 border-b border-[#E5E7EB] flex items-center justify-between px-6">
              <div>
                <h3 className="text-[16px] font-bold text-[#111827]">{previewTemplate.name}</h3>
                <p className="text-[12px] text-[#6B7280]">{previewTemplate.category} Template</p>
              </div>
              <button onClick={() => setPreviewTemplate(null)} className="p-2 text-[#9CA3AF] hover:text-[#111827] bg-gray-50 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 bg-[#F8FAFC] overflow-y-auto p-8 flex justify-center">
              <div className="max-w-3xl w-full">
                <img src={previewTemplate.thumbnail} alt="Preview" className="w-full rounded-xl shadow-lg border border-[#E5E7EB]" />
              </div>
            </div>
            <div className="h-20 border-t border-[#E5E7EB] flex items-center justify-between px-8 bg-white">
              <p className="text-[13px] text-[#6B7280] max-w-xl">{previewTemplate.description}</p>
              <div className="flex gap-3">
                <button onClick={() => setPreviewTemplate(null)} className="px-6 h-10 rounded-xl text-[13px] font-medium text-[#475569] hover:bg-[#F1F5F9]">
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (previewTemplate.type === 'ppt') {
                      const pres = {
                        id: "pres-" + Date.now(),
                        title: previewTemplate.name,
                        theme: previewTemplate.theme,
                        slides: [
                          {
                            id: "slide-1", layout: "cover", elements: [
                              { id: "e1", type: "heading", content: previewTemplate.name },
                              { id: "e2", type: "subheading", content: previewTemplate.description }
                            ]
                          }
                        ]
                      };
                      localStorage.setItem("current_presentation", JSON.stringify(pres));
                      router.push("/ppt-maker/editor");
                    } else {
                      router.push(`/proposals/new?template=${previewTemplate.id}`);
                    }
                  }}
                  className="px-6 h-10 rounded-xl bg-[#111827] text-white text-[13px] font-bold hover:bg-[#374151] shadow-lg shadow-black/10"
                >
                  Use Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
