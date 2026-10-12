"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { TrendingUp, ArrowUpRight, Eye, Activity } from "lucide-react";
import Link from "next/link";

const FUNNEL_DATA = [
  { stage: "1. Proposals Dispatched", count: 0, pct: "0.0%", bar: 0 },
  { stage: "2. Delivered & Opened", count: 0, pct: "0.0%", bar: 0 },
  { stage: "3. Deep Read-Through", count: 0, pct: "0.0%", bar: 0 },
  { stage: "4. Pricing Matrix Scrutinized", count: 0, pct: "0.0%", bar: 0 },
  { stage: "5. Accepted & Legally E-Signed", count: 0, pct: "0.0%", bar: 0 },
];

const VOLUME_DATA = [
  { month: "Jan", won: 0, volume: 0 },
  { month: "Feb", won: 0, volume: 0 },
  { month: "Mar", won: 0, volume: 0 },
  { month: "Apr", won: 0, volume: 0 },
  { month: "May", won: 0, volume: 0 },
  { month: "Jun (Est)", won: 0, volume: 0 },
];

const SECTION_HEATMAP: any[] = [];

const WIN_LOSS = [
  { reason: "Scope Precision & Strategic Alignment", pct: 0, won: true },
  { reason: "Transparent ROI & Value Architecture", pct: 0, won: true },
  { reason: "Turnaround Velocity & Speed to Proposal Delivery", pct: 0, won: true },
  { reason: "Lost: Internal Client Reorganization", pct: 0, won: false },
  { reason: "Lost: Incumbent Renewal", pct: 0, won: false },
];

const TOP_TEMPLATES: any[] = [];

const TELEMETRY: any[] = [];

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1">Workspace Configuration · Telemetry & Conversion</p>
          <h1 className="text-[28px] font-bold text-[#111827] tracking-tight">Analytics & Proposal Intelligence</h1>
          <p className="text-[13px] text-[#9CA3AF] mt-0.5">Real-time telemetry on proposal interaction, document engagement, revenue conversion velocity, and win/loss pipeline metrics.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-9 px-3 rounded-lg border border-[#E5E7EB] text-[13px] font-medium text-[#475569] bg-white hover:bg-[#F8FAFC] transition-colors">
            📅 Last 30 days
          </button>
          <button className="h-9 px-3 rounded-lg border border-[#E5E7EB] text-[13px] font-medium text-[#475569] bg-white hover:bg-[#F8FAFC] transition-colors">
            All Enterprise Clients
          </button>
          <button className="h-9 px-3 rounded-lg border border-[#E5E7EB] text-[13px] font-medium text-[#475569] bg-white hover:bg-[#F8FAFC] transition-colors">
            ↓ Export BI
          </button>
          <button className="h-9 px-4 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-[13px] font-semibold transition-colors">
            📅 Schedule Report
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Conversion Rate", value: "0.0%", sub: "0 accepted out of 0 delivered", tag: "0.0%", tagColor: "text-[#059669] bg-[#ECFDF5]", detail: "No data available" },
          { label: "Total Pipeline Won", value: "$0", sub: "Avg contract: $0 / doc", tag: "0.0%", tagColor: "text-[#059669] bg-[#ECFDF5]", detail: "0 Closed Contracts" },
          { label: "Avg. Time to Close", value: "0 Days", sub: "Median viewing session: 0m 0s", tag: "0 days", tagColor: "text-[#047857] bg-[#ECFDF5]", detail: "No data available" },
          { label: "Client Engagement", value: "0", sub: "0 stakeholder shares / proposal", tag: "No data", tagColor: "text-[#7C3AED] bg-[#EDE9FE]", detail: "/100" },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">{kpi.label}</p>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${kpi.tagColor}`}>{kpi.tag}</span>
            </div>
            <p className="text-[24px] font-bold text-[#111827] leading-none mb-1">{kpi.value}</p>
            <p className="text-[11px] text-[#9CA3AF]">{kpi.sub}</p>
            <p className="text-[10px] text-[#9CA3AF] mt-1 pt-2 border-t border-[#F1F5F9]">{kpi.detail}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-5">
        {/* Funnel + Chart */}
        <div className="col-span-2 space-y-5">
          {/* Funnel */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[15px] font-semibold text-[#111827]">Proposal Funnel & Velocity</h3>
                <p className="text-[11px] text-[#9CA3AF]">Drop-off rates across interaction milestones (Total active batch: 142)</p>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-[#6B7280]">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#7C3AED]" /> Sent (Qty)</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#059669]" /> Won Revenue ($k)</span>
              </div>
            </div>
            <div className="space-y-2.5">
              {FUNNEL_DATA.map((row, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="flex items-center gap-2 text-[#475569]">
                      <span className="w-4 h-4 rounded bg-[#F1F5F9] flex items-center justify-center text-[10px] text-[#9CA3AF]">{i + 1}</span>
                      {row.stage.replace(`${i + 1}. `, "")}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-[#111827]">{row.count}</span>
                      <span className="text-[#9CA3AF] text-[11px] w-24 text-right">{row.pct}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${row.bar}%`,
                        backgroundColor: i === FUNNEL_DATA.length - 1 ? "#059669" : "#7C3AED",
                        opacity: 1 - i * 0.1,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Volume Chart */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[14px] font-semibold text-[#111827]">H1 Volume vs. Won Revenue Trajectory</h3>
                <p className="text-[11px] text-[#9CA3AF]">Target Yield: 65%</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={VOLUME_DATA} barGap={2} barSize={18}>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E5E7EB" }} />
                <Bar dataKey="volume" name="Volume" radius={[3, 3, 0, 0]} fill="#E2E8F0" />
                <Bar dataKey="won" name="Won" radius={[3, 3, 0, 0]}>
                  {VOLUME_DATA.map((_, i) => (
                    <Cell key={i} fill={i === VOLUME_DATA.length - 1 ? "#7C3AED" : "#059669"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Win/Loss */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[15px] font-semibold text-[#111827]">Win / Loss Telemetry Attribution</h3>
                <p className="text-[11px] text-[#9CA3AF]">Decision attribution from closed opportunities (N=118 reviewed) · 86 Won / 32 Lost</p>
              </div>
            </div>
            <div className="space-y-3">
              {WIN_LOSS.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${item.won ? "bg-[#059669]" : "bg-[#DC2626]"}`} />
                  <span className="flex-1 text-[12px] text-[#475569]">{item.reason}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${item.pct * 2.5}%`, backgroundColor: item.won ? "#059669" : "#DC2626" }}
                      />
                    </div>
                    <span className={`text-[11px] font-bold ${item.won ? "text-[#059669]" : "text-[#DC2626]"}`}>{item.pct}% {item.won ? "Won" : "Lost"}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
              <span className="text-[11px] text-[#9CA3AF]">Win-rate delta compared to legacy manual PDF proposals</span>
              <span className="text-[13px] font-bold text-[#059669]">+22.4% Net Lift</span>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Section Heatmap */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-[#111827]">Section Attention Heatmap</h3>
              <Eye className="w-4 h-4 text-[#9CA3AF]" />
            </div>
            <p className="text-[11px] text-[#9CA3AF] mb-4">Document dwell time & scrutiny depth</p>
            <div className="space-y-3">
              {SECTION_HEATMAP.map((section, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-[#111827]">{section.name}</span>
                    <span className="text-[11px] font-bold" style={{ color: section.color }}>{section.scrutiny}% Scrutiny</span>
                  </div>
                  <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${section.scrutiny}%`, backgroundColor: section.color }} />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#9CA3AF]">
                    <span>Avg Dwell: {section.dwell}</span>
                    <span className="text-right max-w-[120px]">{section.views}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-[#EDE9FE] border border-[#C4B5FD]">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-[#7C3AED]" />
                <span className="text-[10px] font-bold text-[#7C3AED] uppercase tracking-wider">Proposal AI Intelligence</span>
              </div>
              <p className="text-[11px] text-[#6B7280]">Proposals incorporating <strong>3-tier pricing packages</strong> close 28% faster than single-quote scopes. Clients return to pricing 3.4x before execution.</p>
            </div>
          </div>

          {/* Top Templates */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-[#111827]">Top Converting Frameworks</h3>
              <Link href="/templates" className="text-[11px] font-medium text-[#7C3AED] hover:underline">Manage Templates</Link>
            </div>
            <p className="text-[11px] text-[#9CA3AF] mb-3">Ranked by acceptance rate and total closed pipeline volume</p>
            <div className="space-y-3">
              {TOP_TEMPLATES.map((t, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-xs font-bold text-[#475569] flex-shrink-0">
                    {["A", "B", "E", "C"][i]}
                  </div>
                  <div className="flex-1">
                    <p className="text-[12px] font-semibold text-[#111827]">{t.name}</p>
                    <p className="text-[10px] text-[#9CA3AF]">{t.accepted} accepted / {t.sent} sent</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-bold text-[#111827]">${Math.round(t.value / 1000)}k</p>
                    <p className="text-[10px] text-[#059669] font-semibold">{t.winRate}% Win Rate</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/templates" className="flex items-center gap-1 mt-4 text-[12px] font-medium text-[#7C3AED] hover:underline">
              Explore all 16 template architectures <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Telemetry Feed */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
              <h3 className="text-[15px] font-semibold text-[#111827]">Real-time Telemetry & Document Feed</h3>
            </div>
            <p className="text-[11px] text-[#9CA3AF]">Live streaming logs of stakeholder reads, interactions, and sign-offs</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-7 px-3 rounded-lg border border-[#E5E7EB] text-[12px] text-[#475569] hover:bg-[#F8FAFC] transition-colors flex items-center gap-1">
              <Activity className="w-3 h-3" /> Pause Stream
            </button>
            <button className="h-7 px-3 rounded-lg border border-[#E5E7EB] text-[12px] text-[#475569] hover:bg-[#F8FAFC] transition-colors">
              ↓ Export Event Log
            </button>
          </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC]">
              {["Stakeholder / Client", "Proposal Document", "Telemetry Event", "Session Telemetry", "Timestamp"].map((h) => (
                <th key={h} className="px-5 py-2.5 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {TELEMETRY.map((row, i) => (
              <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="px-5 py-3.5">
                  <p className="text-[12px] font-semibold text-[#111827]">{row.client}</p>
                  <p className="text-[11px] text-[#9CA3AF]">{row.contact}</p>
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-[12px] font-medium text-[#111827]">{row.proposal}</p>
                  <p className="text-[11px] text-[#9CA3AF]">{row.ref}</p>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${row.eventColor}`}>{row.event}</span>
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-[11px] text-[#6B7280]">{row.device}</p>
                </td>
                <td className="px-5 py-3.5 text-[11px] text-[#9CA3AF]">{row.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-5 py-3 border-t border-[#F1F5F9] flex items-center justify-between">
          <p className="text-[12px] text-[#9CA3AF]">Showing 5 most recent events out of 429 recorded today</p>
          <div className="flex gap-1">
            <button className="h-7 px-3 rounded-lg border border-[#E5E7EB] text-[12px] text-[#475569] hover:bg-[#F8FAFC]">Previous</button>
            <button className="h-7 px-3 rounded-lg border border-[#E5E7EB] text-[12px] text-[#475569] hover:bg-[#F8FAFC]">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
