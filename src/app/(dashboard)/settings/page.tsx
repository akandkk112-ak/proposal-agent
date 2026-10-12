"use client";

import { useState } from "react";
import { Save, Check, Upload, Palette, FileText, PenLine, Building, ChevronDown } from "lucide-react";

const TABS = [
  { label: "Personal Profile", icon: Check },
  { label: "Branding & Identity", icon: Palette },
  { label: "Company Information", icon: Building },
  { label: "Colors & Typography", icon: Palette },
  { label: "PDF Export Settings", icon: FileText },
  { label: "Digital Signature", icon: PenLine },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Personal Profile");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({ name: "Demo User", image: "" });
  const [settings, setSettings] = useState({
    companyName: "Proposal Studio Inc.",
    legalName: "Proposal Studio Inc.",
    address: "580 Howard Street, Suite 400, San Francisco, CA 94105",
    taxId: "US-849201948",
    currency: "USD ($) - United States Dollar",
    language: "English (US) - Default",
    accentColor: "#7C3AED",
    secondaryColor: "#111827",
    fontFamily: "Inter (System Sans-serif)",
    pageFormat: "A4",
    includePageNumbers: true,
    includeConfidentiality: true,
    includeWatermark: true,
    executiveSignee: "Elena Vance [Product Director]",
    auditCertificate: true,
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      if (activeTab === "Personal Profile") {
        await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profile),
        });
      } else {
        await fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(settings),
        });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const update = (key: string, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1">Workspace Configuration · Active Profile</p>
          <h1 className="text-[28px] font-bold text-[#111827] tracking-tight">Workspace Settings</h1>
          <p className="text-[13px] text-[#9CA3AF] mt-0.5">Manage unified agency identity, legal registries, typography standards, high-fidelity PDF exports, and executive signature authentication.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[12px] text-[#059669] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
            Compliance Sync Active
          </div>
          <button className="h-8 px-3 rounded-lg border border-[#E5E7EB] text-[12px] font-medium text-[#475569] bg-white hover:bg-[#F8FAFC] transition-colors">
            Version Audit
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-[#E5E7EB] pb-0">
        {TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium border-b-2 -mb-px transition-all ${
              activeTab === tab.label
                ? "border-[#7C3AED] text-[#7C3AED]"
                : "border-transparent text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Settings Content */}
      <div className="space-y-6 max-w-[840px]">

        {activeTab === "Personal Profile" && (
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
            <h2 className="text-[17px] font-bold text-[#111827] mb-4">Account Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[12px] font-medium text-[#475569] mb-1.5 block">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  className="w-full h-9 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-3 text-[13px] text-[#111827] focus:border-[#7C3AED] focus:bg-white outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-[12px] font-medium text-[#475569] mb-1.5 block">Profile Image URL</label>
                <input
                  type="text"
                  value={profile.image}
                  onChange={(e) => setProfile((p) => ({ ...p, image: e.target.value }))}
                  className="w-full h-9 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-3 text-[13px] text-[#111827] focus:border-[#7C3AED] focus:bg-white outline-none transition-colors"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "Branding & Identity" && (
          <>
            {/* Brand Logo */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-[17px] font-bold text-[#111827] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-[#F1F5F9] flex items-center justify-center text-[12px] text-[#475569] font-bold">01</span>
                    Brand Logo & Visual Assets
                  </h2>
                  <p className="text-[12px] text-[#9CA3AF] mt-0.5">Visual tokens displayed across proposal covers, client portals, email headers, and legal document footprints.</p>
                </div>
                <span className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">SVG / PNG / WEBP</span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-5">
                <div className="border border-[#E5E7EB] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[12px] font-semibold text-[#111827]">Primary Company Logo</p>
                    <span className="text-[10px] text-[#9CA3AF]">512 × 512 px recommended</span>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-[#7C3AED] flex items-center justify-center flex-shrink-0">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <div>
                      <p className="text-[12px] font-medium text-[#111827]">proposal-studio-mark.svg</p>
                      <p className="text-[11px] text-[#9CA3AF] mb-3">184 KB · Vector Asset</p>
                      <div className="flex gap-2">
                        <div className="relative">
                          <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={() => alert("Logo uploaded successfully!")} />
                          <button className="h-7 px-3 rounded-lg border border-[#E5E7EB] text-[11px] font-medium text-[#475569] hover:bg-[#F8FAFC] flex items-center gap-1 pointer-events-none">
                            <Upload className="w-3 h-3" /> Change
                          </button>
                        </div>
                        <button className="h-7 px-3 rounded-lg border border-red-200 text-[11px] font-medium text-[#DC2626] hover:bg-[#FEF2F2]">Remove</button>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-[#9CA3AF] mt-3 pt-3 border-t border-[#F1F5F9]">Rendered automatically at 300 DPI vector scale in executive proposal title leaves and print stamps.</p>
                </div>
                <div className="space-y-3">
                  {[
                    { title: "Favicon & Tab Glyph", sub: "Used in client viewing micro-windows", action: "Replace" },
                    { title: "Dark Mode Watermark", sub: "Monochrome white knockout glyph", action: "Configure" },
                    { title: "Security Seal Badge", sub: "Embedded in proposal metadata blocks", action: "Enabled" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-[#E5E7EB]">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#F1F5F9] flex items-center justify-center">
                          {i === 0 ? "🔖" : i === 1 ? "🌙" : "🛡"}
                        </div>
                        <div>
                          <p className="text-[12px] font-semibold text-[#111827]">{item.title}</p>
                          <p className="text-[10px] text-[#9CA3AF]">{item.sub}</p>
                        </div>
                      </div>
                      {item.action === "Replace" ? (
                        <div className="relative">
                          <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={() => alert("Replaced successfully!")} />
                          <button className="h-7 px-2.5 rounded-lg border border-[#E5E7EB] text-[11px] font-medium text-[#475569] hover:bg-[#F8FAFC] pointer-events-none">{item.action}</button>
                        </div>
                      ) : (
                        <button onClick={() => alert("Action triggered!")} className="h-7 px-2.5 rounded-lg border border-[#E5E7EB] text-[11px] font-medium text-[#475569] hover:bg-[#F8FAFC]">{item.action}</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "Company Information" && (
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-[17px] font-bold text-[#111827] flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-[#F1F5F9] flex items-center justify-center text-[12px] text-[#475569] font-bold">02</span>
                Company & Legal Information
              </h2>
              <span className="flex items-center gap-1 text-[11px] font-medium text-[#9CA3AF] border border-[#E5E7EB] rounded-lg px-2 py-1">
                🔒 Encrypted Vault
              </span>
            </div>
            <p className="text-[12px] text-[#9CA3AF] mb-5">Injected dynamically into quote estimates, Master Service Agreements (MSAs), and statement of work variables.</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Legal Business Name <span className="text-[#9CA3AF] normal-case font-normal">SOW Header</span></label>
                <input value={settings.legalName} onChange={(e) => update("legalName", e.target.value)} className="w-full h-9 px-3 rounded-lg border border-[#E5E7EB] text-[13px] bg-white" />
                <p className="text-[10px] text-[#9CA3AF] mt-1">Must match your incorporated state registration exactly.</p>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Registration / Tax / VAT ID <span className="text-[#059669] normal-case font-normal text-[10px]">EIN Verified</span></label>
                <input value={settings.taxId} onChange={(e) => update("taxId", e.target.value)} className="w-full h-9 px-3 rounded-lg border border-[#E5E7EB] text-[13px] bg-white" />
              </div>
              <div className="col-span-2">
                <label className="block text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Primary Business Address</label>
                <input value={settings.address} onChange={(e) => update("address", e.target.value)} className="w-full h-9 px-3 rounded-lg border border-[#E5E7EB] text-[13px] bg-white" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Default Pricing Currency</label>
                <select value={settings.currency} onChange={(e) => update("currency", e.target.value)} className="w-full h-9 px-3 rounded-lg border border-[#E5E7EB] text-[13px] bg-white">
                  {[
                    "USD ($) - United States Dollar", 
                    "EUR (€) - Euro", 
                    "GBP (£) - British Pound",
                    "CAD ($) - Canadian Dollar",
                    "AUD ($) - Australian Dollar",
                    "INR (₹) - Indian Rupee",
                    "JPY (¥) - Japanese Yen",
                    "CNY (¥) - Chinese Yuan",
                    "BRL (R$) - Brazilian Real",
                    "ZAR (R) - South African Rand",
                    "MXN ($) - Mexican Peso",
                    "SGD ($) - Singapore Dollar",
                    "CHF (Fr) - Swiss Franc"
                  ].map((c) => (
                    <option key={c} value={c.split(' ')[0]}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Document Default Language</label>
                <select value={settings.language} onChange={(e) => update("language", e.target.value)} className="w-full h-9 px-3 rounded-lg border border-[#E5E7EB] text-[13px] bg-white">
                  <option>English (US) - Default</option>
                  <option>English (UK)</option>
                  <option>French</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Colors & Typography" && (
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-[17px] font-bold text-[#111827] flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-[#F1F5F9] flex items-center justify-center text-[12px] text-[#475569] font-bold">03</span>
                Brand Colors & Document Styling
              </h2>
              <span className="text-[11px] font-medium text-[#7C3AED] flex items-center gap-1">🎨 Inter Sans Matrix</span>
            </div>
            <p className="text-[12px] text-[#9CA3AF] mb-5">Global design system settings governing proposal covers, highlight accents, callouts, and table typography.</p>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="border border-[#E5E7EB] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[12px] font-semibold text-[#111827]">Primary Accent Color</p>
                  <span className="text-[10px] text-[#9CA3AF]">CTA & Badges</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl" style={{ backgroundColor: settings.accentColor }} />
                  <div>
                    <p className="text-[13px] font-bold text-[#111827]">{settings.accentColor}</p>
                    <p className="text-[10px] text-[#9CA3AF]">Violet 600 · Master Brand</p>
                  </div>
                  <button className="ml-auto h-7 px-2.5 rounded-lg border border-[#E5E7EB] text-[11px] font-medium text-[#475569] hover:bg-[#F8FAFC]">Pick</button>
                </div>
              </div>
              <div className="border border-[#E5E7EB] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[12px] font-semibold text-[#111827]">Secondary Accent Color</p>
                  <span className="text-[10px] text-[#9CA3AF]">Headers & Slate Rules</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#111827]" />
                  <div>
                    <p className="text-[13px] font-bold text-[#111827]">#111827</p>
                    <p className="text-[10px] text-[#9CA3AF]">Charcoal 900 · Text Core</p>
                  </div>
                  <button className="ml-auto h-7 px-2.5 rounded-lg border border-[#E5E7EB] text-[11px] font-medium text-[#475569] hover:bg-[#F8FAFC]">Pick</button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Document Font Family <span className="normal-case font-normal text-[#9CA3AF]">Executive Standard</span></label>
                <select className="w-full h-9 px-3 rounded-lg border border-[#E5E7EB] text-[13px] bg-white">
                  <option>Inter (System Sans-serif) - Clinical & Balanced</option>
                  <option>DM Sans</option>
                  <option>IBM Plex Sans</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Default Cover Layout</label>
                <div className="h-9 px-3 rounded-lg border border-[#E5E7EB] flex items-center justify-between cursor-pointer hover:bg-[#F8FAFC] transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#111827]" />
                    <span className="text-[13px] text-[#111827]">Minimalist Editorial</span>
                  </div>
                  <span className="text-[11px] text-[#9CA3AF]">Browse 8 Styles</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "PDF Export Settings" && (
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-[17px] font-bold text-[#111827] flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-[#F1F5F9] flex items-center justify-center text-[12px] text-[#475569] font-bold">04</span>
                PDF Export Settings
              </h2>
              <span className="px-2 py-0.5 bg-[#EDE9FE] text-[#7C3AED] text-[10px] font-bold rounded-full">Engine V4.2 Vector</span>
            </div>
            <p className="text-[12px] text-[#9CA3AF] mb-5">Engine configuration for generating vector-perfect client prints, download packets, and audit attachments.</p>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">Page Format</label>
                <div className="grid grid-cols-2 gap-2">
                  {["A4 Format", "US Letter"].map((fmt, i) => (
                    <button
                      key={fmt}
                      onClick={() => update("pageFormat", i === 0 ? "A4" : "Letter")}
                      className={`p-3 rounded-xl border-2 text-left transition-colors ${
                        (settings.pageFormat === "A4" && i === 0) || (settings.pageFormat === "Letter" && i === 1)
                          ? "border-[#7C3AED] bg-[#EDE9FE]"
                          : "border-[#E5E7EB] hover:border-[#C4B5FD]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[12px] font-semibold ${(settings.pageFormat === "A4" && i === 0) || (settings.pageFormat === "Letter" && i === 1) ? "text-[#7C3AED]" : "text-[#111827]"}`}>{fmt}</span>
                        {((settings.pageFormat === "A4" && i === 0) || (settings.pageFormat === "Letter" && i === 1)) && <Check className="w-3.5 h-3.5 text-[#7C3AED]" />}
                      </div>
                      <p className="text-[10px] text-[#9CA3AF]">{i === 0 ? "210 × 297 mm · International Standard" : "8.5 × 11 in · North America Corp"}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">Page Margins <span className="text-[#7C3AED] normal-case">Balanced (24mm)</span></label>
                <div className="p-3 rounded-xl border border-[#E5E7EB] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#F1F5F9] flex items-center justify-center">📐</div>
                    <div>
                      <p className="text-[12px] font-semibold text-[#111827]">Balanced Margins</p>
                      <p className="text-[10px] text-[#9CA3AF]">24mm Top/Bottom · 20mm Left/Right</p>
                    </div>
                  </div>
                  <button className="text-[11px] font-medium text-[#475569] hover:text-[#111827]">Custom</button>
                </div>
              </div>
            </div>
            <div className="mt-5">
              <label className="block text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">Header & Footer Structure</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Page Numbers", key: "includePageNumbers", sub: 'Dynamic "Page X of Y"' },
                  { label: "Confidentiality Note", key: "includeConfidentiality", sub: "Standard legal footer" },
                  { label: "Company Watermark", key: "includeWatermark", sub: "Faint 4% opacity crest" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3 rounded-xl border border-[#E5E7EB]">
                    <div>
                      <p className="text-[12px] font-semibold text-[#111827]">{item.label}</p>
                      <p className="text-[10px] text-[#9CA3AF]">{item.sub}</p>
                    </div>
                    <button
                      onClick={() => update(item.key, !settings[item.key as keyof typeof settings])}
                      className={`w-9 h-5 rounded-full transition-colors relative flex-shrink-0 ${settings[item.key as keyof typeof settings] ? "bg-[#7C3AED]" : "bg-[#E5E7EB]"}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings[item.key as keyof typeof settings] ? "translate-x-4" : "translate-x-0.5"}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "Digital Signature" && (
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-[17px] font-bold text-[#111827] flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-[#F1F5F9] flex items-center justify-center text-[12px] text-[#475569] font-bold">05</span>
                Digital Signature & Verification
              </h2>
              <span className="px-2 py-0.5 bg-[#ECFDF5] text-[#047857] text-[10px] font-bold rounded-full">eIDAS & eSign Compliant</span>
            </div>
            <p className="text-[12px] text-[#9CA3AF] mb-5">Cryptographically signed seals confirming authorized agency sign-off on accepted scopes and price schedules.</p>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">Executive Signee</label>
                <input value={settings.executiveSignee} onChange={(e) => update("executiveSignee", e.target.value)} className="w-full h-9 px-3 rounded-lg border border-[#E5E7EB] text-[13px] bg-white mb-1" />
                <p className="text-[10px] text-[#9CA3AF]">Authorized corporate officer for outbound MSA execution.</p>
                <div className="flex items-center justify-between mt-3 p-3 rounded-xl border border-[#E5E7EB]">
                  <div>
                    <p className="text-[12px] font-semibold text-[#111827]">Audit Certificate Appendix</p>
                    <p className="text-[10px] text-[#9CA3AF]">Enforce audit certificate on exported PDFs</p>
                  </div>
                  <button
                    onClick={() => update("auditCertificate", !settings.auditCertificate)}
                    className={`w-9 h-5 rounded-full transition-colors relative ${settings.auditCertificate ? "bg-[#7C3AED]" : "bg-[#E5E7EB]"}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.auditCertificate ? "translate-x-4" : "translate-x-0.5"}`} />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">Stored Executive Signature <span className="text-[#059669] normal-case font-normal text-[10px]">Active</span></label>
                <div className="h-28 rounded-xl border border-[#E5E7EB] flex items-center justify-center bg-[#F8FAFC] mb-2">
                  <div className="italic text-[28px] font-bold text-[#111827]" style={{ fontFamily: "Georgia, serif" }}>
                    Elena Vance
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 h-7 rounded-lg border border-[#E5E7EB] text-[11px] font-medium text-[#475569] hover:bg-[#F8FAFC]">Redraw</button>
                  <button className="flex-1 h-7 rounded-lg border border-[#E5E7EB] text-[11px] font-medium text-[#475569] hover:bg-[#F8FAFC] flex items-center justify-center gap-1">
                    <Upload className="w-3 h-3" /> Upload PNG
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Footer */}
      <div className="sticky bottom-0 bg-white border-t border-[#E5E7EB] py-3 px-6 flex items-center justify-between -mx-6">
        <span className="text-[12px] text-[#9CA3AF] flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-[#059669]" />
          All changes auto-staged for production deployment
        </span>
        <div className="flex gap-2">
          <button className="h-9 px-4 rounded-lg border border-[#E5E7EB] text-[13px] font-medium text-[#475569] hover:bg-[#F8FAFC] transition-colors">
            Discard
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="h-9 px-5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-60 text-white text-[13px] font-semibold transition-colors flex items-center gap-2"
          >
            {saved ? (
              <><Check className="w-4 h-4" /> Saved!</>
            ) : saving ? (
              <>Saving...</>
            ) : (
              <><Save className="w-4 h-4" /> Save Changes</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
