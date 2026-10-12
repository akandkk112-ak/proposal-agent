"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FileText,
  LayoutTemplate,
  Users,
  BarChart3,
  Settings,
  Plus,
  HelpCircle,
  ChevronDown,
  LogOut,
  MoreHorizontal,
  Zap,
  Sparkles,
  Presentation,
} from "lucide-react";

interface NavRailProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FileText, label: "Proposals", href: "/proposals" },
  { icon: LayoutTemplate, label: "Templates", href: "/templates" },
  { icon: Presentation, label: "PPT Maker", href: "/ppt-maker" },
  { icon: Users, label: "Clients", href: "/clients" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function NavRail({ user }: NavRailProps) {
  const pathname = usePathname();
  const [workspaceOpen, setWorkspaceOpen] = useState(false);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <aside className="w-[196px] border-r border-[#E5E7EB] bg-[#F8FAFC] h-screen flex flex-col fixed left-0 top-0 z-30">
      {/* Logo + Workspace Switcher */}
      <div className="px-4 py-5 border-b border-[#E5E7EB]">
        <button
          onClick={() => setWorkspaceOpen(!workspaceOpen)}
          className="w-full flex items-center gap-2.5 group"
        >
          <div className="w-7 h-7 rounded-lg bg-[#7C3AED] flex items-center justify-center flex-shrink-0 shadow-sm shadow-purple-200">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-[13px] font-bold text-[#111827] truncate">Proposal Studio</p>
            <p className="text-[10px] text-[#6B7280] truncate">Acme Agency (Enterprise)</p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF] flex-shrink-0" />
        </button>
      </div>

      {/* New Proposal Button */}
      <div className="px-3 py-3">
        <Link
          href="/proposals/new"
          className="w-full flex items-center justify-center gap-1.5 h-9 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-[13px] font-semibold rounded-lg transition-colors shadow-sm shadow-purple-200"
        >
          <Plus className="w-3.5 h-3.5" />
          New Proposal
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all group ${
                isActive
                  ? "bg-[#EDE9FE] text-[#7C3AED]"
                  : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#111827]"
              }`}
            >
              <item.icon
                className={`w-4 h-4 flex-shrink-0 ${
                  isActive ? "text-[#7C3AED]" : "text-[#94A3B8] group-hover:text-[#475569]"
                }`}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Workspace Section */}
      <div className="px-3 pb-2 border-t border-[#E5E7EB] pt-3">
        <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider px-2 mb-2">
          Workspace
        </p>
        <div className="flex items-center justify-between px-2 mb-1">
          <div className="flex items-center gap-1.5">
            <Users className="w-3 h-3 text-[#9CA3AF]" />
            <span className="text-[12px] text-[#6B7280]">Team members</span>
          </div>
          <span className="text-[12px] font-semibold text-[#111827]">0</span>
        </div>
        <div className="px-2 mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[12px] text-[#6B7280]">Storage</span>
            <span className="text-[12px] text-[#6B7280]">0 / 10 GB</span>
          </div>
          <div className="h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
            <div className="h-full w-[0%] bg-[#7C3AED] rounded-full" />
          </div>
        </div>
        <Link
          href="/settings"
          className="flex items-center gap-1.5 px-2 py-1 text-[12px] text-[#6B7280] hover:text-[#7C3AED] transition-colors"
        >
          <HelpCircle className="w-3 h-3" />
          Help & API Docs
        </Link>
        <div className="flex items-center gap-2 px-2 mt-2 pt-2 border-t border-[#E5E7EB]">
          <Link href="/legal/terms" className="text-[9px] text-[#9CA3AF] hover:text-[#7C3AED]">Terms</Link>
          <span className="text-[9px] text-[#E5E7EB]">|</span>
          <Link href="/legal/privacy" className="text-[9px] text-[#9CA3AF] hover:text-[#7C3AED]">Privacy</Link>
          <span className="text-[9px] text-[#E5E7EB]">|</span>
          <Link href="/legal/cookies" className="text-[9px] text-[#9CA3AF] hover:text-[#7C3AED]">Cookies</Link>
        </div>
      </div>

      {/* User */}
      <div className="px-3 py-3 border-t border-[#E5E7EB] relative">
        <div 
          className="flex items-center gap-2.5 cursor-pointer hover:bg-[#F1F5F9] p-1.5 rounded-md transition-colors"
          onClick={(e) => {
            const menu = document.getElementById("profile-menu");
            if (menu) menu.classList.toggle("hidden");
          }}
        >
          <div className="w-7 h-7 rounded-full bg-[#7C3AED] flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-[#111827] truncate">
              {user?.name || "Demo User"}
            </p>
            <p className="text-[10px] text-[#6B7280] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] inline-block" />
              Online
            </p>
          </div>
          <MoreHorizontal className="w-3.5 h-3.5 text-[#9CA3AF]" />
        </div>

        {/* Dropdown Menu */}
        <div id="profile-menu" className="hidden absolute bottom-full left-0 mb-1 w-[196px] bg-white border border-[#E5E7EB] rounded-lg shadow-lg py-1 z-50">
          <Link href="/settings" className="block w-full text-left px-4 py-2 text-[12px] text-[#374151] hover:bg-[#F3F4F6]">
            Profile & Settings
          </Link>
          <button 
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="block w-full text-left px-4 py-2 text-[12px] text-[#374151] hover:bg-[#F3F4F6]"
          >
            Switch Account
          </button>
          <div className="h-px bg-[#E5E7EB] my-1" />
          <button 
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="block w-full text-left px-4 py-2 text-[12px] text-red-600 hover:bg-red-50 font-medium"
          >
            Log Out
          </button>
        </div>
      </div>
    </aside>
  );
}
