"use client";

import Link from "next/link";
import { Search, Bell, Edit3, Eye, Download, ChevronRight } from "lucide-react";
import { useState } from "react";

interface TopBarProps {
  title?: string;
  breadcrumb?: Array<{ label: string; href?: string }>;
}

export default function TopBar({ title = "Workspace", breadcrumb }: TopBarProps) {
  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-12 bg-white border-b border-[#E5E7EB] flex items-center px-6 gap-4 sticky top-0 z-20">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[13px] mr-2">
        <span className="text-[#9CA3AF]">Acme Agency</span>
        <ChevronRight className="w-3 h-3 text-[#D1D5DB]" />
        <span className="font-semibold text-[#111827]">{title}</span>
        {breadcrumb?.map((b, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3 text-[#D1D5DB]" />
            {b.href ? (
              <Link href={b.href} className="text-[#6B7280] hover:text-[#111827] transition-colors">
                {b.label}
              </Link>
            ) : (
              <span className="font-semibold text-[#111827]">{b.label}</span>
            )}
          </span>
        ))}
      </div>

      {/* Search */}
      <div className="flex-1 max-w-[320px] relative">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search proposals, clients..."
          className="w-full h-8 pl-8 pr-10 rounded-lg border border-[#E5E7EB] text-[13px] text-[#111827] placeholder-[#9CA3AF] bg-[#F8FAFC] focus:bg-white transition-all"
        />
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-medium text-[#9CA3AF] bg-[#F1F5F9] px-1.5 py-0.5 rounded">
          ⌘K
        </span>
      </div>

      <div className="flex-1" />

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button onClick={() => typeof window !== 'undefined' && window.dispatchEvent(new Event('toggle-editor'))} className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-[#E5E7EB] text-[12px] font-medium text-[#475569] hover:bg-[#F8FAFC] transition-colors">
          <Edit3 className="w-3 h-3" />
          Editor
        </button>
        <button onClick={() => typeof window !== 'undefined' && window.dispatchEvent(new Event('toggle-preview'))} className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-[#E5E7EB] text-[12px] font-medium text-[#475569] hover:bg-[#F8FAFC] transition-colors">
          <Eye className="w-3 h-3" />
          Preview
        </button>
        <button onClick={() => typeof window !== 'undefined' && window.dispatchEvent(new Event('trigger-export'))} className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-[#E5E7EB] text-[12px] font-medium text-[#475569] hover:bg-[#F8FAFC] transition-colors">
          <Download className="w-3 h-3" />
          Export
        </button>
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-8 h-8 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-[#475569] hover:bg-[#F8FAFC] transition-colors"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#DC2626] rounded-full border border-white" />
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 top-10 w-72 bg-white rounded-xl shadow-lg border border-[#E5E7EB] overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-[#E5E7EB] flex items-center justify-between">
                <span className="text-[13px] font-semibold text-[#111827]">Notifications</span>
                <span className="text-[11px] text-[#7C3AED] font-medium cursor-pointer">Mark all as read</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                <div className="px-4 py-3 hover:bg-[#F8FAFC] border-b border-[#E5E7EB] transition-colors cursor-pointer">
                  <p className="text-[12px] font-medium text-[#111827]">New client view</p>
                  <p className="text-[11px] text-[#6B7280] mt-0.5">Acme Corp opened "Q3 Proposal"</p>
                  <p className="text-[10px] text-[#9CA3AF] mt-1">2 mins ago</p>
                </div>
                <div className="px-4 py-3 hover:bg-[#F8FAFC] transition-colors cursor-pointer">
                  <p className="text-[12px] font-medium text-[#111827]">Proposal signed</p>
                  <p className="text-[11px] text-[#6B7280] mt-0.5">Stark Industries accepted your terms</p>
                  <p className="text-[10px] text-[#9CA3AF] mt-1">1 hour ago</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="w-7 h-7 rounded-full bg-[#7C3AED] flex items-center justify-center text-white text-[11px] font-bold cursor-pointer">
          EV
        </div>
      </div>
    </header>
  );
}
