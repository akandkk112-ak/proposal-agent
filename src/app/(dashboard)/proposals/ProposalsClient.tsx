"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  FileText,
  Eye,
  Edit3,
  Trash2,
  Send,
} from "lucide-react";
import { formatCurrency, formatDate, getStatusStyles } from "@/lib/utils";

interface Client {
  id: string;
  name: string;
  company: string | null;
}

interface Proposal {
  id: string;
  title: string;
  status: string;
  totalAmount: number;
  currency: string;
  version: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  client: Client;
}

function StatusBadge({ status }: { status: string }) {
  const s = getStatusStyles(status);
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase ${s.bg} ${s.text}`}>
      <span className="w-1.5 h-1.5 rounded-full" style={{
        backgroundColor: status === "SIGNED" ? "#059669" : status === "UNDER_REVIEW" ? "#D97706" : status === "SENT" ? "#2563EB" : "#94A3B8"
      }} />
      {s.label}
    </span>
  );
}

const TABS = ["All", "Draft", "Sent", "In Review", "Signed", "Declined"];

export default function ProposalsClient({ proposals }: { proposals: Proposal[] }) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [sortBy, setSortBy] = useState("updated");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filtered = proposals.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.client.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.client.company || "").toLowerCase().includes(search.toLowerCase());

    const matchesTab =
      activeTab === "All" ||
      (activeTab === "Draft" && p.status === "DRAFT") ||
      (activeTab === "Sent" && p.status === "SENT") ||
      (activeTab === "In Review" && p.status === "UNDER_REVIEW") ||
      (activeTab === "Signed" && p.status === "SIGNED") ||
      (activeTab === "Declined" && p.status === "DECLINED");

    return matchesSearch && matchesTab;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "updated") return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    if (sortBy === "value") return b.totalAmount - a.totalAmount;
    if (sortBy === "title") return a.title.localeCompare(b.title);
    return 0;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this proposal?")) return;
    await fetch(`/api/proposals/${id}`, { method: "DELETE" });
    window.location.reload();
  };

  const tabCounts: Record<string, number> = {
    All: proposals.length,
    Draft: proposals.filter((p) => p.status === "DRAFT").length,
    Sent: proposals.filter((p) => p.status === "SENT").length,
    "In Review": proposals.filter((p) => p.status === "UNDER_REVIEW").length,
    Signed: proposals.filter((p) => p.status === "SIGNED").length,
    Declined: proposals.filter((p) => p.status === "DECLINED").length,
  };

  return (
    <div className="p-6 space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1">
            Document Workspace
          </p>
          <h1 className="text-[26px] font-bold text-[#111827] tracking-tight">Proposals</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/templates"
            className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[#E5E7EB] text-[13px] font-medium text-[#475569] hover:bg-white bg-white shadow-sm transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            From Template
          </Link>
          <Link
            href="/proposals/new"
            className="flex items-center gap-1.5 h-9 px-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-[13px] font-semibold rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            New Proposal
          </Link>
        </div>
      </div>

      {/* Tabs + Search */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 bg-[#F1F5F9] rounded-lg p-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-semibold transition-all ${
                activeTab === tab
                  ? "bg-white text-[#111827] shadow-sm"
                  : "text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              {tab}
              <span className={`text-[10px] font-bold ${activeTab === tab ? "text-[#7C3AED]" : "text-[#9CA3AF]"}`}>
                {tabCounts[tab]}
              </span>
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search proposals..."
            className="h-9 pl-9 pr-4 w-60 rounded-lg border border-[#E5E7EB] text-[13px] bg-white"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="h-9 px-3 rounded-lg border border-[#E5E7EB] text-[13px] text-[#475569] bg-white cursor-pointer"
        >
          <option value="updated">Sort: Last Updated</option>
          <option value="value">Sort: Highest Value</option>
          <option value="title">Sort: Title A-Z</option>
        </select>
        <button className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[#E5E7EB] text-[13px] font-medium text-[#475569] hover:bg-white bg-white transition-colors">
          <Filter className="w-3.5 h-3.5" /> Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 rounded-xl bg-[#F1F5F9] flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-[#9CA3AF]" />
            </div>
            <p className="text-[15px] font-semibold text-[#111827] mb-1">No proposals yet</p>
            <p className="text-[13px] text-[#9CA3AF] mb-4">Create your first proposal to get started.</p>
            <Link
              href="/proposals/new"
              className="flex items-center gap-1.5 h-9 px-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-[13px] font-semibold rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> New Proposal
            </Link>
          </div>
        ) : (
          <>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC]">
                  {["Proposal Name", "Client & Company", "Created", "Value", "Status", "Views", ""].map((h) => (
                    <th key={h} className="px-5 py-3 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {sorted.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F8FAFC] transition-colors group relative">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-5 rounded-full bg-[#7C3AED] opacity-30" />
                        <div>
                          <Link href={`/proposals/${p.id}`} className="text-[13px] font-semibold text-[#111827] hover:text-[#7C3AED] transition-colors">
                            {p.title}
                          </Link>
                          <p className="text-[11px] text-[#9CA3AF]">v{p.version} · Updated {formatDate(p.updatedAt)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="text-[13px] font-medium text-[#111827]">{p.client.name}</p>
                        {p.client.company && <p className="text-[11px] text-[#9CA3AF]">{p.client.company}</p>}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[12px] text-[#9CA3AF]">{formatDate(p.createdAt)}</td>
                    <td className="px-5 py-3.5 text-[13px] font-semibold text-[#111827] font-mono">
                      {p.totalAmount > 0 ? formatCurrency(p.totalAmount, p.currency) : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-5 py-3.5 text-[12px] text-[#9CA3AF]">{p.viewCount}</td>
                    <td className="px-5 py-3.5">
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenu(openMenu === p.id ? null : p.id)}
                          className="p-1.5 rounded-md hover:bg-[#F1F5F9] transition-colors text-[#9CA3AF] hover:text-[#475569]"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        {openMenu === p.id && (
                          <div className="absolute right-0 top-8 w-44 bg-white border border-[#E5E7EB] rounded-xl shadow-lg z-50 py-1.5 text-[13px]">
                            <Link href={`/proposals/${p.id}`} className="flex items-center gap-2 px-3 py-2 text-[#475569] hover:bg-[#F8FAFC] transition-colors" onClick={() => setOpenMenu(null)}>
                              <Edit3 className="w-3.5 h-3.5" /> Edit
                            </Link>
                            <Link href={`/proposals/${p.id}`} className="flex items-center gap-2 px-3 py-2 text-[#475569] hover:bg-[#F8FAFC] transition-colors" onClick={() => setOpenMenu(null)}>
                              <Eye className="w-3.5 h-3.5" /> Preview
                            </Link>
                            <button className="flex items-center gap-2 px-3 py-2 text-[#475569] hover:bg-[#F8FAFC] transition-colors w-full text-left" onClick={() => setOpenMenu(null)}>
                              <Send className="w-3.5 h-3.5" /> Send to Client
                            </button>
                            <div className="my-1 border-t border-[#F1F5F9]" />
                            <button onClick={() => { setOpenMenu(null); handleDelete(p.id); }} className="flex items-center gap-2 px-3 py-2 text-[#DC2626] hover:bg-[#FEF2F2] transition-colors w-full text-left">
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-3 border-t border-[#F1F5F9]">
              <p className="text-[12px] text-[#9CA3AF]">Showing {sorted.length} of {proposals.length} proposals</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
