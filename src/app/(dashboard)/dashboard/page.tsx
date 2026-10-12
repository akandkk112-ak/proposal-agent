"use client";

import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  FileText,
  BarChart3,
  PenLine,
  ArrowUpRight,
  Plus,
  Filter,
  ArrowUp,
  MoreHorizontal,
  Upload,
  Monitor,
  ChevronRight,
  Activity,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import { formatCurrency, getStatusStyles } from "@/lib/utils";

const CHART_DATA = [
  { month: "Jan", won: 0, sent: 0, target: 0 },
  { month: "Feb", won: 0, sent: 0, target: 0 },
  { month: "Mar", won: 0, sent: 0, target: 0 },
  { month: "Apr", won: 0, sent: 0, target: 0 },
  { month: "May", won: 0, sent: 0, target: 0 },
  { month: "Jun", won: 0, sent: 0, target: 0 },
];

const RECENT_PROPOSALS: any[] = [];

const LIVE_ACTIVITY: any[] = [];

function StatusBadge({ status }: { status: string }) {
  const s = getStatusStyles(status);
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase ${s.bg} ${s.text}`}>
      {status === "SIGNED" && <span className="w-1.5 h-1.5 rounded-full bg-[#059669] mr-1" />}
      {status === "UNDER_REVIEW" && <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] mr-1" />}
      {status === "SENT" && <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mr-1" />}
      {status === "DRAFT" && <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8] mr-1" />}
      {s.label}
    </span>
  );
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-3 shadow-lg text-[12px]">
        <p className="font-semibold text-[#111827] mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-[#6B7280]">
            {p.name}: <span className="font-semibold text-[#111827]">{formatCurrency(p.value)}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Activity className="w-3 h-3 text-[#059669]" />
            Executive Command
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
            Live Sync
          </p>
          <h1 className="text-[28px] font-bold text-[#111827] tracking-tight">Overview</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[#E5E7EB] text-[13px] font-medium text-[#475569] hover:bg-white transition-colors bg-white shadow-sm">
            📅 Last 30 days
          </button>
          <button className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[#E5E7EB] text-[13px] font-medium text-[#475569] hover:bg-white transition-colors bg-white shadow-sm">
            <Plus className="w-3.5 h-3.5 text-[#9CA3AF]" />
            Invite Client
          </button>
          <button className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[#E5E7EB] text-[13px] font-medium text-[#475569] hover:bg-white transition-colors bg-white shadow-sm">
            Export Report (PDF)
          </button>
          <Link
            href="/proposals/new"
            className="flex items-center gap-1.5 h-9 px-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-[13px] font-semibold rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Proposal
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: "Total Revenue",
            value: "$0",
            sub: "0 accepted · 0 viewed",
            change: "0.0%",
            changeLabel: "vs last mo ($0)",
            icon: <TrendingUp className="w-4 h-4 text-[#7C3AED]" />,
            iconBg: "bg-[#EDE9FE]",
          },
          {
            label: "Proposals Velocity",
            value: "0",
            valueUnit: "Sent",
            sub: "0 accepted · 0 viewed",
            icon: <FileText className="w-4 h-4 text-[#2563EB]" />,
            iconBg: "bg-[#EFF6FF]",
          },
          {
            label: "Active Portfolio",
            value: "0",
            valueUnit: "Enterprise",
            sub: "0 new onboarded this cycle",
            icon: <BarChart3 className="w-4 h-4 text-[#059669]" />,
            iconBg: "bg-[#ECFDF5]",
          },
          {
            label: "Pending Signatures",
            value: "0",
            valueUnit: "Awaiting",
            sub: "$0 in immediate pipeline",
            icon: <PenLine className="w-4 h-4 text-[#D97706]" />,
            iconBg: "bg-[#FEF3C7]",
          },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">{stat.label}</p>
              <div className={`w-7 h-7 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                {stat.icon}
              </div>
            </div>
            <div className="flex items-end gap-2 mb-1">
              <span className="text-[28px] font-bold text-[#111827] leading-none tracking-tight">
                {stat.value}
              </span>
              {stat.valueUnit && (
                <span className="text-[14px] font-semibold text-[#6B7280] mb-0.5">{stat.valueUnit}</span>
              )}
              {stat.change && (
                <span className="ml-auto flex items-center gap-1 px-1.5 py-0.5 bg-[#ECFDF5] text-[#059669] text-[11px] font-bold rounded-md">
                  <ArrowUp className="w-3 h-3" />
                  {stat.change}
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#9CA3AF]">{stat.sub || stat.changeLabel}</p>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Chart + Table */}
        <div className="col-span-2 space-y-5">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
                  <h3 className="text-[15px] font-semibold text-[#111827]">Revenue & Proposal Velocity</h3>
                </div>
                <p className="text-[12px] text-[#9CA3AF] mt-0.5">Monthly conversion performance vs projected baseline (Jan – Jun 2025)</p>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-[#6B7280]">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#7C3AED]" />Won ($)</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#E2E8F0]" />Sent Volume</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm border border-dashed border-[#9CA3AF]" />Target</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={CHART_DATA} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="wonGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="sentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E2E8F0" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#E2E8F0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v, i) => {
                    const values = CHART_DATA;
                    return i === values.length - 1 ? `${v} ($${Math.round(values[i].won / 1000)}k)` : `${v} ($${Math.round(values[i].won / 1000)}k)`;
                  }}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="sent" name="Sent" stroke="#D1D5DB" fill="url(#sentGrad)" strokeWidth={1.5} dot={false} />
                <Area type="monotone" dataKey="won" name="Won" stroke="#7C3AED" fill="url(#wonGrad)" strokeWidth={2} dot={{ fill: "#7C3AED", r: 3, strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Proposals Table */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-semibold text-[#111827]">Recent Proposals</h3>
                <p className="text-[12px] text-[#9CA3AF]">Active client contracts requiring executive oversight</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg border border-[#E5E7EB] text-[12px] text-[#475569] hover:bg-[#F8FAFC] transition-colors">
                  <Filter className="w-3 h-3" /> Filter
                </button>
                <button className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg border border-[#E5E7EB] text-[12px] text-[#475569] hover:bg-[#F8FAFC] transition-colors">
                  Sort
                </button>
              </div>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#E5E7EB]">
                  {["Proposal Name", "Client & Company", "Created", "Value", "Status", ""].map((h) => (
                    <th key={h} className="px-5 py-3 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {RECENT_PROPOSALS.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F8FAFC] transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-5 rounded-full bg-[#7C3AED] opacity-40" />
                        <Link href={`/proposals/${p.id}`} className="text-[13px] font-medium text-[#111827] hover:text-[#7C3AED] transition-colors">
                          {p.title}
                        </Link>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-[10px] font-bold text-[#475569]">
                          {p.clientIcon}
                        </div>
                        <span className="text-[13px] text-[#6B7280]">{p.client}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-[#9CA3AF]">{p.date}</td>
                    <td className="px-5 py-3.5 text-[13px] font-semibold text-[#111827] font-mono">
                      {formatCurrency(p.value)}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <button className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-[#F1F5F9] transition-all text-[#9CA3AF]">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-3 border-t border-[#F1F5F9] flex items-center justify-between">
              <p className="text-[12px] text-[#9CA3AF]">Showing 4 of 142 total enterprise proposals</p>
              <Link href="/proposals" className="text-[13px] font-medium text-[#7C3AED] hover:underline flex items-center gap-1">
                View All Proposals Archive <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-5">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-[#111827]">Quick Actions</h3>
              <span className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Fast Track</span>
            </div>
            <div className="space-y-2">
              {[
                { icon: <FileText className="w-4 h-4 text-[#7C3AED]" />, title: "New from Template", sub: "MSA, SOW, or Retainer pitch", href: "/templates" },
                { icon: <Upload className="w-4 h-4 text-[#2563EB]" />, title: "Upload Contract Doc", sub: "Parse PDF / Word with AI tags", href: "/proposals/new" },
                { icon: <Monitor className="w-4 h-4 text-[#059669]" />, title: "Client Presentation Mode", sub: "Distraction-free pitch canvas", href: "/proposals" },
              ].map((action, i) => (
                <Link
                  key={i}
                  href={action.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F8FAFC] border border-transparent hover:border-[#E5E7EB] transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#F8FAFC] border border-[#E5E7EB] flex items-center justify-center flex-shrink-0">
                    {action.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[#111827]">{action.title}</p>
                    <p className="text-[11px] text-[#9CA3AF]">{action.sub}</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#D1D5DB] group-hover:text-[#9CA3AF] transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Win Rate */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Conversion Efficiency</p>
              <span className="px-2 py-0.5 bg-[#ECFDF5] text-[#047857] text-[10px] font-bold rounded-full">Top 5% Agency</span>
            </div>
            <div className="flex items-center gap-4 mt-3">
              <div className="relative w-16 h-16 flex-shrink-0">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="26" fill="none" stroke="#F1F5F9" strokeWidth="6" />
                  <circle cx="32" cy="32" r="26" fill="none" stroke="#7C3AED" strokeWidth="6" strokeDasharray={`${2 * Math.PI * 26 * 0.682} ${2 * Math.PI * 26 * 0.318}`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[13px] font-bold text-[#111827]">68%</span>
                </div>
              </div>
              <div>
                <p className="text-[22px] font-bold text-[#111827] leading-none">68.2%</p>
                <p className="text-[12px] text-[#9CA3AF]">Win Rate</p>
                <p className="text-[11px] text-[#9CA3AF] mt-1">Benchmark is 44.5% across comparable enterprise design studios.</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between pt-3 border-t border-[#F1F5F9]">
              <span className="text-[12px] text-[#9CA3AF]">Avg. Sales Cycle</span>
              <span className="text-[13px] font-bold text-[#111827]">14.2 Days</span>
            </div>
          </div>

          {/* Live Activity */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
                <h3 className="text-[14px] font-semibold text-[#111827]">Live Activity Stream</h3>
              </div>
              <span className="text-[10px] text-[#9CA3AF]">Real-time</span>
            </div>
            <div className="space-y-4">
              {LIVE_ACTIVITY.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-[#111827]">{item.client}</p>
                    <p className="text-[11px] text-[#6B7280] leading-relaxed">{item.action}</p>
                  </div>
                  <span className="text-[10px] text-[#9CA3AF] flex-shrink-0 mt-0.5">{item.time}</span>
                </div>
              ))}
            </div>
            <Link href="/analytics" className="flex items-center justify-center gap-1.5 mt-4 pt-3 border-t border-[#F1F5F9] text-[12px] font-medium text-[#7C3AED] hover:underline transition-colors">
              View Full Audit Log <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
