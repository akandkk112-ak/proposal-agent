"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Send,
  Download,
  Share2,
  Plus,
  Minus,
  GripVertical,
  Tag,
  Calendar,
  DollarSign,
  FileText,
  ChevronDown,
  Loader2,
  Sparkles,
  X,
  Check,
  Upload,
  Copy,
  Monitor,
  Tablet,
  Smartphone,
  Wand2
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface PricingItem {
  id: string;
  name: string;
  description: string;
  amount: number;
}

interface ProposalContent {
  clientName: string;
  companyName: string;
  email: string;
  currency: string;
  scopeTags: string[];
  executiveFocus: string;
  pricingItems: PricingItem[];
  timeline: Array<{ phase: string; weeks: string; description: string }>;
  paymentTerms: string;
  executiveSummary: string;
  customHtml?: string;
  isPureHtml?: boolean;
}

const DEFAULT_CONTENT: ProposalContent = {
  clientName: "",
  companyName: "",
  email: "",
  currency: "USD",
  scopeTags: [],
  executiveFocus: "",
  pricingItems: [
    { id: "1", name: "Discovery & Strategic Architecture", description: "Audit, stakeholder workshops & positioning", amount: 18500 },
    { id: "2", name: "Core Visual Identity & Guidelines", description: "Logomark, typography scale, 80-page token handbook", amount: 32000 },
    { id: "3", name: "Interactive Web & Digital Platform", description: "Figma handoff, production design system, headless CMS", amount: 45000 },
  ],
  timeline: [
    { phase: "Phase 1", weeks: "Weeks 1-3", description: "Discovery & Stra..." },
    { phase: "Phase 2", weeks: "Weeks 4-7", description: "Identity & Tokens" },
    { phase: "Phase 3", weeks: "Weeks 8-10", description: "Digital Platform" },
  ],
  paymentTerms: "50% upfront deposit upon digital signature, 50% upon final handoff and asset repository transfer.",
  executiveSummary: "",
  customHtml: "",
  isPureHtml: false,
};

interface ProposalEditorProps {
  proposalId?: string;
  initialData?: {
    id: string;
    title: string;
    status: string;
    content: string;
    totalAmount: number;
    currency: string;
    version: number;
    clientId: string;
    client?: { name: string; company: string | null; email: string };
  };
  clients?: Array<{ id: string; name: string; company: string | null; email: string }>;
}

const SCOPE_TAGS = ["Strategy", "Visual Architecture", "Production Deliverables", "Branding", "Development", "Consulting", "Research"];
const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "INR", "JPY", "CNY", "BRL", "ZAR", "MXN", "SGD", "CHF"];

export default function ProposalEditor({ proposalId, initialData, clients = [] }: ProposalEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "Untitled Proposal");
  const [status, setStatus] = useState(initialData?.status || "DRAFT");
  const [selectedClientId, setSelectedClientId] = useState(initialData?.clientId || "");
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiField, setAiField] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [activePreviewPage, setActivePreviewPage] = useState(1);
  const [previewZoom, setPreviewZoom] = useState(100);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [viewMode, setViewMode] = useState<"split" | "preview">("split");
  
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

  // Send to Client Modal State
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendEmailTo, setSendEmailTo] = useState("");
  const [sendDate, setSendDate] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [content, setContent] = useState<ProposalContent>(() => {
    if (initialData?.content) {
      try {
        const parsed = JSON.parse(initialData.content);
        return { ...DEFAULT_CONTENT, ...parsed };
      } catch { return DEFAULT_CONTENT; }
    }
    return DEFAULT_CONTENT;
  });

  const totalAmount = content.pricingItems.reduce((sum, item) => sum + item.amount, 0);

  const updateContent = (updates: Partial<ProposalContent>) => {
    setContent((prev) => ({ ...prev, ...updates }));
  };

  useEffect(() => {
    const handleEditor = () => setViewMode("split");
    const handlePreview = () => setViewMode("preview");
    const handleExport = () => {
      // Create a local export function call or click the hidden export button
      const exportBtn = document.getElementById("export-pdf-btn");
      if (exportBtn) exportBtn.click();
    };

    window.addEventListener('toggle-editor', handleEditor);
    window.addEventListener('toggle-preview', handlePreview);
    window.addEventListener('trigger-export', handleExport);
    return () => {
      window.removeEventListener('toggle-editor', handleEditor);
      window.removeEventListener('toggle-preview', handlePreview);
      window.removeEventListener('trigger-export', handleExport);
    }
  }, []);

  const addPricingItem = () => {
    const newItem: PricingItem = {
      id: Date.now().toString(),
      name: "New Service",
      description: "Service description",
      amount: 0,
    };
    updateContent({ pricingItems: [...content.pricingItems, newItem] });
  };

  const updatePricingItem = (id: string, updates: Partial<PricingItem>) => {
    updateContent({
      pricingItems: content.pricingItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    });
  };

  const removePricingItem = (id: string) => {
    updateContent({ pricingItems: content.pricingItems.filter((item) => item.id !== id) });
  };

  const addTag = (tag: string) => {
    if (tag && !content.scopeTags.includes(tag)) {
      updateContent({ scopeTags: [...content.scopeTags, tag] });
    }
    setTagInput("");
    setShowTagSuggestions(false);
  };

  const removeTag = (tag: string) => {
    updateContent({ scopeTags: content.scopeTags.filter((t) => t !== tag) });
  };

  const handleSave = async (autoSave = false) => {
    if (!autoSave) setSaving(true);
    try {
      const body = {
        title,
        status,
        clientId: selectedClientId || undefined,
        content: JSON.stringify({ ...content }),
        totalAmount,
        currency: content.currency,
      };

      const url = proposalId ? `/api/proposals/${proposalId}` : "/api/proposals";
      const method = proposalId ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

      if (res.ok) {
        const data = await res.json();
        if (!proposalId && data.id) {
          router.replace(`/proposals/${data.id}`);
        }
        setLastSaved(new Date());
      }
    } finally {
      setSaving(false);
    }
  };

  const exportPDF = async () => {
    setIsExporting(true);
    try {
      const element = document.querySelector(".proposal-preview-content") as HTMLElement;
      if (!element) return;
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${title || "proposal"}.pdf`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  const generateWithAI = async (field: string) => {
    let promptOverride = undefined;
    if (field === "customHtml") {
      const input = window.prompt("What kind of HTML template do you want to generate? (e.g. 'Newsletter email', 'Receipt email')");
      if (!input) return;
      promptOverride = input;
    }
    
    setAiLoading(true);
    setAiField(field);
    try {
      const res = await fetch("/api/ai/generate-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          field,
          context: {
            title,
            clientName: content.clientName,
            companyName: content.companyName,
            scopeTags: content.scopeTags,
            pricingItems: content.pricingItems,
            customHtml: content.customHtml,
          },
          promptOverride,
        }),
      });
      const data = await res.json();
      if (data.text) {
        if (field === "executiveSummary") updateContent({ executiveSummary: data.text });
        if (field === "executiveFocus") updateContent({ executiveFocus: data.text });
        if (field === "customHtml" || field === "makeResponsive") updateContent({ customHtml: data.text });
      }
    } finally {
      setAiLoading(false);
      setAiField(null);
    }
  };

  const handleShare = () => {
    if (proposalId) {
      const url = `${window.location.origin}/proposals/share/${proposalId}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      alert(`Link copied to clipboard:\n${url}`);
      setTimeout(() => setCopied(false), 2000);
    } else {
      alert("Please save the proposal first to share it.");
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      // Create a print-specific CSS block dynamically to hide everything except the PDF container
      const style = document.createElement("style");
      style.innerHTML = `
        @media print {
          body * { visibility: hidden; }
          #pdf-export-container, #pdf-export-container * { visibility: visible; }
          #pdf-export-container { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%;
            margin: 0;
            padding: 20px;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `;
      document.head.appendChild(style);
      window.print();
      setTimeout(() => document.head.removeChild(style), 1000);
    } catch (e) {
      console.error(e);
      alert("Failed to export PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    // Simulate AI parsing document
    setTimeout(() => {
      updateContent({
        clientName: "Imported Contact",
        companyName: file.name.split('.')[0],
        executiveSummary: `This proposal was generated from ${file.name}. The AI has analyzed the contents and structured the strategic focus based on the imported requirements.`,
        scopeTags: ["Imported Scope", "AI Generated"],
      });
      setIsUploading(false);
    }, 1500);
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!proposalId) return;
    const interval = setInterval(() => handleSave(true), 30000);
    return () => clearInterval(interval);
  }, [proposalId, title, content, status]);

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  return (
    <div className="flex h-full">
      {/* Editor Panel */}
      {viewMode === "split" && (
      <div className="flex-1 overflow-y-auto border-r border-[#E5E7EB]">
        {/* Editor Toolbar */}
        <div className="sticky top-0 z-10 bg-white border-b border-[#E5E7EB] px-6 py-3 flex items-center gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-[15px] font-bold text-[#111827] bg-transparent border-none outline-none w-full"
              placeholder="Proposal title..."
            />
            <div className="flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1 text-[10px] font-semibold text-[#9CA3AF]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D1D5DB]" />
                {status === "DRAFT" ? "Draft" : status}
              </span>
              <span className="text-[10px] text-[#9CA3AF]">·</span>
              <span className="text-[10px] text-[#9CA3AF]">
                {lastSaved ? `Autosaved ${lastSaved.toLocaleTimeString()}` : "Not saved yet"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[12px] font-medium text-[#9CA3AF] border border-[#E5E7EB] rounded-lg px-2.5 py-1.5">
              v{initialData?.version || 1}.0
            </span>
            <button 
              onClick={handleShare}
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-[#E5E7EB] text-[12px] font-medium text-[#475569] hover:bg-[#F8FAFC] transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#059669]" /> : <Share2 className="w-3.5 h-3.5" />} 
              {copied ? "Copied!" : "Share Link"}
            </button>
            <button 
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-[#E5E7EB] text-[12px] font-medium text-[#475569] hover:bg-[#F8FAFC] transition-colors"
            >
              {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />} 
              {isExporting ? "Exporting..." : "Export PDF"}
            </button>
            <button
              onClick={() => setShowSendModal(true)}
              className="flex items-center gap-1.5 h-8 px-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-[12px] font-semibold rounded-lg transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              Send to Client
            </button>
          </div>
        </div>

        {/* Editor Body */}
        <div className="p-6 space-y-5">
          {/* Client & Organization */}
          <section className="bg-white rounded-xl border border-[#E5E7EB] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#EDE9FE] flex items-center justify-center">
                  <FileText className="w-3.5 h-3.5 text-[#7C3AED]" />
                </div>
                <h2 className="text-[14px] font-semibold text-[#111827]">Client & Organization</h2>
              </div>
              <span className="text-[11px] font-medium text-[#9CA3AF]">Metadata</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Client Lead Name</label>
                {clients.length > 0 ? (
                  <select
                    value={selectedClientId}
                    onChange={(e) => {
                      setSelectedClientId(e.target.value);
                      const c = clients.find((cl) => cl.id === e.target.value);
                      if (c) updateContent({ clientName: c.name, companyName: c.company || "", email: c.email });
                    }}
                    className="w-full h-9 px-3 rounded-lg border border-[#E5E7EB] text-[13px] text-[#111827] bg-white"
                  >
                    <option value="">Select a client</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={content.clientName}
                    onChange={(e) => updateContent({ clientName: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-[#E5E7EB] text-[13px] text-[#111827] bg-white"
                    placeholder="Sarah Jenkins"
                  />
                )}
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Company Name</label>
                <input
                  type="text"
                  value={content.companyName}
                  onChange={(e) => updateContent({ companyName: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg border border-[#E5E7EB] text-[13px] text-[#111827] bg-white"
                  placeholder="Nordic Living Group"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={content.email}
                  onChange={(e) => updateContent({ email: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg border border-[#E5E7EB] text-[13px] text-[#111827] bg-white"
                  placeholder="s.jenkins@company.co"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Currency</label>
                <select
                  value={content.currency}
                  onChange={(e) => updateContent({ currency: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg border border-[#E5E7EB] text-[13px] text-[#111827] bg-white"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>{c === "USD" ? "USD ($) - United Sta..." : c}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Scope of Work */}
          <section className="bg-white rounded-xl border border-[#E5E7EB] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#ECFDF5] flex items-center justify-center">
                  <Tag className="w-3.5 h-3.5 text-[#059669]" />
                </div>
                <h2 className="text-[14px] font-semibold text-[#111827]">Scope of Work</h2>
              </div>
              <button
                onClick={() => setShowTagSuggestions(!showTagSuggestions)}
                className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg border border-[#E5E7EB] text-[12px] text-[#7C3AED] font-medium hover:bg-[#EDE9FE] transition-colors"
              >
                <Plus className="w-3 h-3" /> Add Scope
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {content.scopeTags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#EDE9FE] text-[#7C3AED] text-[12px] font-medium"
                >
                  {tag}
                  <button onClick={() => removeTag(tag)} className="text-[#9CA3AF] hover:text-[#7C3AED]">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {showTagSuggestions && (
                <div className="w-full">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {SCOPE_TAGS.filter((t) => !content.scopeTags.includes(t)).map((tag) => (
                      <button
                        key={tag}
                        onClick={() => addTag(tag)}
                        className="px-2.5 py-1 rounded-lg bg-[#F1F5F9] text-[#475569] text-[12px] font-medium hover:bg-[#EDE9FE] hover:text-[#7C3AED] transition-colors"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Executive Focus */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[12px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Executive Focus</label>
                <button
                  onClick={() => generateWithAI("executiveFocus")}
                  disabled={aiLoading && aiField === "executiveFocus"}
                  className="flex items-center gap-1 text-[11px] font-medium text-[#7C3AED] hover:text-[#6D28D9] transition-colors disabled:opacity-50"
                >
                  {aiLoading && aiField === "executiveFocus" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  Generate with AI
                </button>
              </div>
              <textarea
                value={content.executiveFocus}
                onChange={(e) => updateContent({ executiveFocus: e.target.value })}
                rows={3}
                className="w-full px-3 py-2.5 rounded-lg border border-[#E5E7EB] text-[13px] text-[#111827] bg-white resize-none"
                placeholder="Describe the executive focus and strategic objective..."
              />
            </div>
          </section>

          {/* Investment & Pricing */}
          <section className="bg-white rounded-xl border border-[#E5E7EB] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#FEF3C7] flex items-center justify-center">
                  <DollarSign className="w-3.5 h-3.5 text-[#D97706]" />
                </div>
                <h2 className="text-[14px] font-semibold text-[#111827]">Investment & Pricing</h2>
              </div>
              <button
                onClick={addPricingItem}
                className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg border border-[#E5E7EB] text-[12px] text-[#7C3AED] font-medium hover:bg-[#EDE9FE] transition-colors"
              >
                <Plus className="w-3 h-3" /> Add Item
              </button>
            </div>
            <div className="space-y-2 mb-4">
              {content.pricingItems.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg border border-[#E5E7EB] hover:border-[#C4B5FD] transition-colors group">
                  <GripVertical className="w-4 h-4 text-[#D1D5DB] mt-2 flex-shrink-0 cursor-grab" />
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updatePricingItem(item.id, { name: e.target.value })}
                      className="text-[13px] font-semibold text-[#111827] bg-transparent border-none outline-none w-full mb-0.5"
                      placeholder="Service name"
                    />
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updatePricingItem(item.id, { description: e.target.value })}
                      className="text-[11px] text-[#6B7280] bg-transparent border-none outline-none w-full"
                      placeholder="Service description"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[13px] text-[#6B7280]">$</span>
                      <input
                        type="number"
                        value={item.amount}
                        onChange={(e) => updatePricingItem(item.id, { amount: parseFloat(e.target.value) || 0 })}
                        className="w-28 h-8 pl-6 pr-3 rounded-lg border border-[#E5E7EB] text-[13px] font-semibold text-[#111827] text-right bg-white"
                      />
                    </div>
                    <button
                      onClick={() => removePricingItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-[#9CA3AF] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-all"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* Summary */}
            <div className="border-t border-[#E5E7EB] pt-3 space-y-1.5">
              <div className="flex justify-between text-[13px] text-[#6B7280]">
                <span>Subtotal</span>
                <span className="font-mono">{formatCurrency(totalAmount, content.currency)}</span>
              </div>
              <div className="flex justify-between text-[13px] text-[#6B7280]">
                <span>Estimated Tax (0% B2B Cross-border)</span>
                <span className="font-mono">$0.00</span>
              </div>
              <div className="flex justify-between text-[15px] font-bold text-[#7C3AED] pt-1 border-t border-[#E5E7EB]">
                <span>Total Engagement</span>
                <span className="font-mono">{formatCurrency(totalAmount, content.currency)} {content.currency}</span>
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section className="bg-white rounded-xl border border-[#E5E7EB] p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-md bg-[#EFF6FF] flex items-center justify-center">
                <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
              </div>
              <h2 className="text-[14px] font-semibold text-[#111827]">Timeline & Milestones</h2>
              <span className="ml-auto text-[12px] text-[#9CA3AF]">10 Weeks Active</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {content.timeline.map((phase, i) => (
                <div key={i} className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E5E7EB]">
                  <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">{phase.phase}</p>
                  <input
                    type="text"
                    value={phase.weeks}
                    onChange={(e) => {
                      const timeline = [...content.timeline];
                      timeline[i] = { ...timeline[i], weeks: e.target.value };
                      updateContent({ timeline });
                    }}
                    className="text-[13px] font-bold text-[#111827] bg-transparent border-none outline-none w-full"
                  />
                  <input
                    type="text"
                    value={phase.description}
                    onChange={(e) => {
                      const timeline = [...content.timeline];
                      timeline[i] = { ...timeline[i], description: e.target.value };
                      updateContent({ timeline });
                    }}
                    className="text-[11px] text-[#6B7280] bg-transparent border-none outline-none w-full"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Executive Summary (AI Generated) */}
          <section className="bg-white rounded-xl border border-[#E5E7EB] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[14px] font-semibold text-[#111827]">Executive Summary</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input type="file" accept=".pdf,.docx,.txt" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" title="Import Document" />
                  <button
                    disabled={isUploading}
                    className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-[#E5E7EB] text-[12px] font-medium text-[#475569] hover:bg-[#F8FAFC] transition-colors"
                  >
                    {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    Import & Build
                  </button>
                </div>
                <button
                  onClick={() => generateWithAI("executiveSummary")}
                  disabled={aiLoading && aiField === "executiveSummary"}
                  className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-60 text-white text-[12px] font-medium transition-colors"
                >
                  {aiLoading && aiField === "executiveSummary" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  Generate with AI
                </button>
              </div>
            </div>
            <textarea
              value={content.executiveSummary}
              onChange={(e) => updateContent({ executiveSummary: e.target.value })}
              rows={5}
              className="w-full px-3 py-2.5 rounded-lg border border-[#E5E7EB] text-[13px] text-[#111827] bg-white resize-none"
              placeholder="Click 'Generate with AI' to create a compelling executive summary based on your proposal details..."
            />
          </section>

          {/* Payment Terms */}
          <section className="bg-white rounded-xl border border-[#E5E7EB] p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-md bg-[#F8FAFC] border border-[#E5E7EB] flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-[#6B7280]" />
              </div>
              <h2 className="text-[14px] font-semibold text-[#111827]">Payment Terms & Conditions</h2>
            </div>
            <textarea
              value={content.paymentTerms}
              onChange={(e) => updateContent({ paymentTerms: e.target.value })}
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-[#E5E7EB] text-[13px] text-[#111827] bg-white resize-none"
            />
          </section>

          {/* Custom HTML Code Block */}
          <section className="bg-white rounded-xl border border-[#E5E7EB] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#F1F5F9] flex items-center justify-center">
                  <span className="text-[#475569] font-bold text-[12px]">&lt;/&gt;</span>
                </div>
                <h2 className="text-[14px] font-semibold text-[#111827]">Custom HTML Layout</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => generateWithAI("makeResponsive")}
                  disabled={aiLoading || !content.customHtml}
                  className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#F8FAFC] border border-[#E5E7EB] text-[#475569] hover:bg-[#F1F5F9] text-[12px] font-medium transition-colors disabled:opacity-50"
                  title="Make HTML fully responsive for all devices"
                >
                  {aiLoading && aiField === "makeResponsive" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                  Make Responsive
                </button>
                <button
                  onClick={() => generateWithAI("customHtml")}
                  disabled={aiLoading && aiField === "customHtml"}
                  className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#EDE9FE] text-[#7C3AED] hover:bg-[#DDD6FE] text-[12px] font-medium transition-colors"
                >
                  {aiLoading && aiField === "customHtml" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  Generate Code
                </button>
              </div>
            </div>
            <textarea
              value={content.customHtml || ""}
              onChange={(e) => updateContent({ customHtml: e.target.value })}
              className="w-full h-32 text-[12px] font-mono text-[#374151] rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-3 focus:border-[#7C3AED] focus:bg-white transition-colors"
              placeholder="<!-- Paste your custom HTML, Figma embed, or layout code here -->"
            />
            <div className="flex items-center justify-between mt-3">
              <p className="text-[10px] text-[#9CA3AF]">Adding Custom HTML will replace the entire default proposal template.</p>
            </div>
          </section>

          {/* Save button */}
          <div className="flex justify-end">
            <button
              onClick={() => handleSave()}
              disabled={saving}
              className="flex items-center gap-2 h-10 px-6 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-60 text-white text-[14px] font-semibold rounded-lg transition-colors"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Saving..." : "Save Proposal"}
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Live Preview */}
      <div className={`${viewMode === "preview" ? "flex-1 w-full" : "w-[460px] flex-shrink-0"} bg-[#F1F3FF] flex flex-col relative overflow-hidden transition-all duration-300`}>
        <div className="px-4 py-3 border-b border-[#E5E7EB] bg-white flex items-center gap-3 z-10 relative shadow-sm">
          <span className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Live Simulation</span>
          
          {content.customHtml && (
            <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-md ml-2">
              <button onClick={() => setPreviewDevice("desktop")} className={`p-1.5 rounded ${previewDevice === "desktop" ? "bg-white shadow-sm text-[#7C3AED]" : "text-[#6B7280] hover:text-[#111827]"}`} title="Desktop">
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setPreviewDevice("tablet")} className={`p-1.5 rounded ${previewDevice === "tablet" ? "bg-white shadow-sm text-[#7C3AED]" : "text-[#6B7280] hover:text-[#111827]"}`} title="Tablet">
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setPreviewDevice("mobile")} className={`p-1.5 rounded ${previewDevice === "mobile" ? "bg-white shadow-sm text-[#7C3AED]" : "text-[#6B7280] hover:text-[#111827]"}`} title="Mobile">
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-1 ml-auto">
            <button onClick={() => setPreviewZoom(Math.max(25, previewZoom - 25))} className="w-6 h-6 rounded-md border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:bg-white">
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-[12px] font-medium text-[#111827] px-2">{previewZoom}%</span>
            <button onClick={() => setPreviewZoom(Math.min(200, previewZoom + 25))} className="w-6 h-6 rounded-md border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:bg-white">
              <Plus className="w-3 h-3" />
            </button>
            <button onClick={() => setPreviewZoom(100)} className="text-[11px] text-[#9CA3AF] ml-2 hover:text-[#111827]">Fit</button>
            <span className="text-[11px] text-[#9CA3AF] ml-2 border-l border-[#E5E7EB] pl-2">Page {activePreviewPage} of 3</span>
          </div>
        </div>

        {/* A4 Preview */}
        <div className="flex-1 overflow-auto p-6 relative">
          {content.customHtml ? (
            <div className="flex justify-center mx-auto" style={{
              width: previewDevice === "desktop" ? "1024px" : previewDevice === "tablet" ? "768px" : "375px",
              transform: `scale(${(previewDevice === "desktop" ? 0.42 : previewDevice === "tablet" ? 0.55 : 1) * (previewZoom / 100)})`,
              transformOrigin: "top center",
              backgroundColor: "white",
              minHeight: "100%",
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
            }}>
              <div 
                className="w-full h-full" 
                dangerouslySetInnerHTML={{ __html: content.customHtml || "" }}
              />
            </div>
          ) : (
            <div id="pdf-export-container" className="bg-white rounded-xl shadow-lg border border-[#E5E7EB] p-8 min-h-[800px] max-w-[380px] mx-auto text-[11px]" style={{ transform: `scale(${previewZoom / 100})`, transformOrigin: "top center" }}>
              {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="w-8 h-8 rounded-lg bg-[#7C3AED] flex items-center justify-center text-white text-xs font-bold mb-2">P</div>
                <p className="text-[11px] font-bold text-[#111827]">Acme Agency Studio</p>
                <p className="text-[9px] text-[#9CA3AF]">Stockholm • New York • London</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1">Prepared For</p>
                <p className="text-[13px] font-bold text-[#111827]">{content.companyName || "Client Company"}</p>
                <p className="text-[9px] text-[#6B7280]">Attn: {content.clientName || "Client Name"}</p>
                <p className="text-[9px] text-[#9CA3AF]">Date: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
              </div>
            </div>

            {/* Proposal Reference */}
            <div className="mb-4">
              <p className="text-[8px] font-semibold tracking-widest text-[#7C3AED] uppercase mb-1">
                Proposal Reference // AA-{new Date().getFullYear()}-{Math.floor(Math.random() * 900) + 100}
              </p>
              <h2 className="text-[20px] font-bold text-[#111827] leading-tight tracking-tight">{title}</h2>
            </div>

            {/* Executive Summary */}
            {content.executiveSummary && (
              <div className="mb-4">
                <p className="text-[8px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <span className="text-[#7C3AED]">01 //</span> Executive Summary
                </p>
                <p className="text-[10px] text-[#6B7280] leading-relaxed">{content.executiveSummary}</p>
              </div>
            )}

            {/* Scope */}
            {content.scopeTags.length > 0 && (
              <div className="mb-4">
                <p className="text-[8px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <span className="text-[#7C3AED]">02 //</span> Core Scope & Methodology
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {content.scopeTags.slice(0, 3).map((tag, i) => (
                    <div key={i} className="p-2 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC]">
                      <p className="text-[9px] font-bold text-[#111827]">{i + 1}. {tag}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing */}
            <div className="mb-4">
              <p className="text-[8px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <span className="text-[#7C3AED]">03 //</span> Commercial Investment
                <span className="ml-auto text-[7px]">All values in {content.currency}</span>
              </p>
              <div className="rounded-lg border border-[#E5E7EB] overflow-hidden">
                <div className="grid grid-cols-2 bg-[#F8FAFC] px-3 py-1.5">
                  <span className="text-[8px] font-semibold text-[#9CA3AF] uppercase">Description</span>
                  <span className="text-[8px] font-semibold text-[#9CA3AF] uppercase text-right">Fee ({content.currency})</span>
                </div>
                {content.pricingItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-2 px-3 py-2 border-t border-[#E5E7EB]">
                    <span className="text-[10px] text-[#111827]">{item.name}</span>
                    <span className="text-[10px] text-right font-medium">{formatCurrency(item.amount, content.currency)}</span>
                  </div>
                ))}
                <div className="grid grid-cols-2 px-3 py-2 border-t border-[#E5E7EB] bg-[#F8FAFC]">
                  <span className="text-[11px] font-bold text-[#111827]">Total Proposed Investment</span>
                  <span className="text-[13px] font-bold text-[#7C3AED] text-right">{formatCurrency(totalAmount, content.currency)}</span>
                </div>
              </div>
            </div>



            {/* Signature */}
            <div className="border-t border-[#E5E7EB] pt-4">
              <p className="text-[8px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3 flex items-center gap-1">
                <span className="text-[#7C3AED]">04 //</span> Acceptance & Digital Authorization
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-[#E5E7EB]">
                  <p className="text-[7px] font-semibold text-[#9CA3AF] uppercase mb-2">For Acme Agency</p>
                  <div className="italic text-[13px] font-bold text-[#111827] mb-1" style={{ fontFamily: "Georgia, serif" }}>
                    Elena Vance
                  </div>
                  <p className="text-[7px] text-[#6B7280]">Elena Vance, Product Director</p>
                </div>
                <div className="p-3 rounded-lg border border-[#E5E7EB]">
                  <p className="text-[7px] font-semibold text-[#9CA3AF] uppercase mb-2">Authorized Representative</p>
                  <button className="w-full h-6 rounded-md bg-[#7C3AED] text-white text-[8px] font-semibold flex items-center justify-center gap-1">
                    ✍ Sign Document
                  </button>
                  <p className="text-[7px] text-[#9CA3AF] mt-1">{content.clientName || "Client"} · Pending</p>
                </div>
              </div>
          </div>
        </div>
        )}
      </div>
    </div>

      {/* Hidden button for global export trigger */}
      <button id="export-pdf-btn" onClick={exportPDF} className="hidden" />

      {/* Send to Client Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6">
            <h3 className="text-[18px] font-bold text-[#111827] mb-1">Send to Client</h3>
            <p className="text-[12px] text-[#6B7280] mb-5">Share this proposal directly via email.</p>
            
            <div className="space-y-4">
              <div>
                <label className="text-[12px] font-semibold text-[#374151] mb-1.5 block">Client Email</label>
                <input 
                  type="email" 
                  value={sendEmailTo || content.email || ""}
                  onChange={(e) => setSendEmailTo(e.target.value)}
                  className="w-full h-10 px-3 border border-[#E5E7EB] rounded-lg text-[13px]" 
                  placeholder="client@example.com"
                />
              </div>
              
              <div>
                <label className="text-[12px] font-semibold text-[#374151] mb-1.5 block">Schedule Send (Optional)</label>
                <input 
                  type="datetime-local" 
                  value={sendDate}
                  onChange={(e) => setSendDate(e.target.value)}
                  className="w-full h-10 px-3 border border-[#E5E7EB] rounded-lg text-[13px]" 
                />
                <p className="text-[10px] text-[#9CA3AF] mt-1.5">Leave blank to send immediately.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-8">
              <button 
                onClick={() => setShowSendModal(false)}
                className="px-4 py-2 text-[13px] font-medium text-[#475569] hover:bg-[#F1F5F9] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setIsSending(true);
                  setTimeout(() => {
                    setIsSending(false);
                    setShowSendModal(false);
                    alert(sendDate ? `Scheduled to send on ${new Date(sendDate).toLocaleString()}` : "Email sent successfully!");
                  }, 1500);
                }}
                disabled={isSending}
                className="flex items-center gap-2 px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-[13px] font-semibold rounded-lg transition-colors disabled:opacity-70"
              >
                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {sendDate ? "Schedule Send" : "Send Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
