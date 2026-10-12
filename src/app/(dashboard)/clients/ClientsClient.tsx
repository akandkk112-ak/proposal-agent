"use client";

import { useState } from "react";
import { Plus, Search, Filter, Download, ExternalLink, MoreHorizontal, CheckSquare, Square } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ClientProposal {
  id: string;
  status: string;
  totalAmount: number;
}

interface Client {
  id: string;
  name: string;
  email: string;
  company: string | null;
  website: string | null;
  industry: string | null;
  status: string;
  proposals: ClientProposal[];
  createdAt: Date;
}

const TABS = [
  { label: "All Clients", key: "ALL" },
  { label: "Active", key: "ACTIVE" },
  { label: "Prospects", key: "PROSPECT" },
  { label: "Inactive", key: "INACTIVE" },
];

const INDUSTRIES = ["All Industries", "Architecture", "Real Estate", "Agency", "Consulting", "Tech", "Enterprise Tech", "Healthcare", "Finance"];

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function getWinRate(proposals: ClientProposal[]): number {
  if (proposals.length === 0) return 0;
  const signed = proposals.filter((p) => p.status === "SIGNED").length;
  return Math.round((signed / proposals.length) * 100);
}

function getLTV(proposals: ClientProposal[]): number {
  return proposals.reduce((sum, p) => sum + p.totalAmount, 0);
}

const DEMO_CLIENTS: Client[] = [];

export default function ClientsClient({ clients }: { clients: Client[] }) {
  const allClients = clients.length > 0 ? clients : DEMO_CLIENTS;
  const [activeTab, setActiveTab] = useState("ALL");
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("All Industries");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClient, setNewClient] = useState({ name: "", email: "", company: "", website: "", industry: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const filtered = allClients.filter((c) => {
    const matchesTab = activeTab === "ALL" || c.status === activeTab;
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.company || "").toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchesIndustry = industry === "All Industries" || c.industry === industry;
    return matchesTab && matchesSearch && matchesIndustry;
  });

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClient),
      });
      setShowAddModal(false);
      window.location.reload();
    } finally {
      setSaving(false);
    }
  };

  const totalActiveAccounts = allClients.filter((c) => c.status === "ACTIVE").length;
  const totalPortfolioValue = allClients.reduce((sum, c) => sum + getLTV(c.proposals), 0);

  return (
    <div className="p-6 space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1">Portfolio Command</p>
          <h1 className="text-[28px] font-bold text-[#111827] tracking-tight">Clients</h1>
          <p className="text-[13px] text-[#9CA3AF] mt-0.5">Manage your client relationships, proposal history, and contract pipelines with real-time conversion telemetry.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[#E5E7EB] text-[13px] font-medium text-[#475569] hover:bg-white bg-white shadow-sm transition-colors">
            <Filter className="w-3.5 h-3.5" /> Filter by Industry
          </button>
          <button className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[#E5E7EB] text-[13px] font-medium text-[#475569] hover:bg-white bg-white shadow-sm transition-colors">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 h-9 px-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-[13px] font-semibold rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Add Client
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Active Accounts", value: totalActiveAccounts, sub: `↑ +4 this mo`, sub2: "Across 6 primary verticals", icon: "🏢" },
          { label: "Portfolio Value (LTV)", value: formatCurrency(totalPortfolioValue), sub: "↗ +12.8%", sub2: `${formatCurrency(totalPortfolioValue / Math.max(allClients.length, 1))} avg revenue per client`, icon: "💰" },
          { label: "Settlement Integrity", value: "94.2%", sub: "⊙ Optimal", sub2: "Payment within net-30 terms", icon: "🏛" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] flex items-center justify-center text-xl flex-shrink-0">{stat.icon}</div>
            <div>
              <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-[24px] font-bold text-[#111827] leading-none mb-1">{stat.value}
                {i === 0 && <span className="text-[13px] font-medium text-[#6B7280] ml-1">{stat.sub}</span>}
              </p>
              <p className="text-[11px] text-[#9CA3AF]">{stat.sub2}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Row */}
      <div className="flex items-center gap-3">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-[#F1F5F9] rounded-lg p-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setPage(1); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-semibold transition-all ${
                activeTab === tab.key ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              {tab.label}
              <span className="text-[10px] font-bold text-[#9CA3AF]">
                {tab.key === "ALL" ? allClients.length : allClients.filter((c) => c.status === tab.key).length}
              </span>
            </button>
          ))}
        </div>

        <div className="flex-1" />

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by client, company, or domain..."
            className="h-9 pl-9 pr-4 w-72 rounded-lg border border-[#E5E7EB] text-[13px] bg-white"
          />
        </div>
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="h-9 px-3 rounded-lg border border-[#E5E7EB] text-[13px] text-[#475569] bg-white"
        >
          {INDUSTRIES.map((ind) => (
            <option key={ind} value={ind}>{ind}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC]">
              <th className="w-10 px-4 py-3">
                <button className="text-[#9CA3AF] hover:text-[#111827]">
                  {selected.size === paginated.length && paginated.length > 0 ? (
                    <CheckSquare className="w-4 h-4" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              {["Client Name", "Company & Domain", "Industry", "Active Proposals", "Lifetime Value", "Win Rate"].map((h) => (
                <th key={h} className="px-4 py-3 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {paginated.map((client) => {
              const ltv = getLTV(client.proposals);
              const winRate = getWinRate(client.proposals);
              const active = client.proposals.filter((p) => p.status === "UNDER_REVIEW" || p.status === "SENT").length;
              const activeValue = client.proposals.filter((p) => p.status === "UNDER_REVIEW" || p.status === "SENT").reduce((s, p) => s + p.totalAmount, 0);

              return (
                <tr key={client.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-4 py-4">
                    <button onClick={() => toggleSelect(client.id)} className="text-[#9CA3AF] hover:text-[#111827]">
                      {selected.has(client.id) ? <CheckSquare className="w-4 h-4 text-[#7C3AED]" /> : <Square className="w-4 h-4" />}
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#7C3AED] flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
                        {getInitials(client.name)}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-[#111827]">{client.name}</p>
                        <p className="text-[11px] text-[#9CA3AF]">{client.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-[13px] font-medium text-[#111827]">{client.company || "—"}</p>
                      {client.website && (
                        <p className="text-[11px] text-[#9CA3AF] flex items-center gap-1">
                          <ExternalLink className="w-2.5 h-2.5" /> {client.website}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[11px] font-medium text-[#475569]">
                      {client.industry || "General"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-[12px] font-semibold text-[#111827]">
                      {active > 0 ? `${active} Active` : "0 Active"}
                    </p>
                    {activeValue > 0 && (
                      <p className="text-[11px] font-bold text-[#7C3AED]">{formatCurrency(activeValue)}</p>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-[14px] font-bold text-[#111827] font-mono">{formatCurrency(ltv)}</p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden min-w-[60px]">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${winRate}%`,
                            backgroundColor: winRate >= 80 ? "#059669" : winRate >= 60 ? "#7C3AED" : "#D97706",
                          }}
                        />
                      </div>
                      <span className="text-[12px] font-semibold text-[#111827] min-w-[32px]">{winRate}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-5 py-3 border-t border-[#F1F5F9] flex items-center justify-between">
          <p className="text-[12px] text-[#9CA3AF]">
            Showing {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} clients
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-7 px-3 rounded-lg border border-[#E5E7EB] text-[12px] text-[#475569] disabled:opacity-40 hover:bg-[#F8FAFC] transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-7 h-7 rounded-lg text-[12px] font-semibold transition-colors ${
                  page === p ? "bg-[#7C3AED] text-white" : "border border-[#E5E7EB] text-[#475569] hover:bg-[#F8FAFC]"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="h-7 px-3 rounded-lg border border-[#E5E7EB] text-[12px] text-[#475569] disabled:opacity-40 hover:bg-[#F8FAFC] transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#0F172A]/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl w-full max-w-[480px] p-6">
            <h2 className="text-[18px] font-bold text-[#111827] mb-4">Add New Client</h2>
            <form onSubmit={handleAddClient} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Full Name *</label>
                  <input required value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} className="w-full h-9 px-3 rounded-lg border border-[#E5E7EB] text-[13px] bg-white" placeholder="Sarah Jenkins" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Email *</label>
                  <input required type="email" value={newClient.email} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} className="w-full h-9 px-3 rounded-lg border border-[#E5E7EB] text-[13px] bg-white" placeholder="sarah@company.com" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Company</label>
                  <input value={newClient.company} onChange={(e) => setNewClient({ ...newClient, company: e.target.value })} className="w-full h-9 px-3 rounded-lg border border-[#E5E7EB] text-[13px] bg-white" placeholder="Acme Corp" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Website</label>
                  <input value={newClient.website} onChange={(e) => setNewClient({ ...newClient, website: e.target.value })} className="w-full h-9 px-3 rounded-lg border border-[#E5E7EB] text-[13px] bg-white" placeholder="acme.com" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Industry</label>
                  <select value={newClient.industry} onChange={(e) => setNewClient({ ...newClient, industry: e.target.value })} className="w-full h-9 px-3 rounded-lg border border-[#E5E7EB] text-[13px] bg-white">
                    <option value="">Select industry</option>
                    {INDUSTRIES.filter((i) => i !== "All Industries").map((ind) => <option key={ind} value={ind}>{ind}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1.5">Phone</label>
                  <input value={newClient.phone} onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })} className="w-full h-9 px-3 rounded-lg border border-[#E5E7EB] text-[13px] bg-white" placeholder="+1 (555) 000-0000" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="h-9 px-4 rounded-lg border border-[#E5E7EB] text-[13px] font-medium text-[#475569] hover:bg-[#F8FAFC] transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="h-9 px-4 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-[13px] font-semibold transition-colors disabled:opacity-60">
                  {saving ? "Adding..." : "Add Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
