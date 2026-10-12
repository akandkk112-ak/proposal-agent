"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, CheckCircle2, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@proposalstudio.com");
  const [password, setPassword] = useState("demo1234");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Try demo@proposalstudio.com / demo1234");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#F1F3FF" }}>
      {/* Left Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[500px]">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-[#7C3AED] flex items-center justify-center shadow-lg shadow-purple-200">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="14,2 14,8 20,8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="16" y1="13" x2="8" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <line x1="16" y1="17" x2="8" y2="17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <polyline points="10,9 9,9 8,9" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <h1 className="text-[17px] font-bold text-[#111827] tracking-tight">Proposal Studio</h1>
              <p className="text-[11px] font-semibold text-[#7C3AED] tracking-widest uppercase">Enterprise</p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-[28px] font-bold text-[#111827] tracking-tight mb-2">
              Welcome back to Proposal Studio
            </h2>
            <p className="text-[14px] text-[#6B7280]">
              Sign in to manage and ship high-converting client proposals.
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              className="flex items-center justify-center gap-2 h-10 px-4 bg-white border border-[#E5E7EB] rounded-lg text-[14px] font-medium text-[#111827] hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 h-10 px-4 bg-white border border-[#E5E7EB] rounded-lg text-[14px] font-medium text-[#111827] hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all"
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[#E5E7EB]" />
            <span className="text-[11px] font-semibold text-[#9CA3AF] tracking-widest uppercase">
              Or continue with work email
            </span>
            <div className="flex-1 h-px bg-[#E5E7EB]" />
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-[13px] text-red-700">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[14px] font-medium text-[#111827] mb-1.5">
                Work email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-10 px-3 rounded-lg border border-[#E5E7EB] text-[14px] text-[#111827] placeholder-[#9CA3AF] bg-white transition-all"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[14px] font-medium text-[#111827]">Password</label>
                <Link href="#" className="text-[13px] font-medium text-[#7C3AED] hover:text-[#6D28D9] transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-10 px-3 pr-10 rounded-lg border border-[#E5E7EB] text-[14px] text-[#111827] placeholder-[#9CA3AF] bg-white transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-[#E5E7EB] text-[#7C3AED] accent-[#7C3AED]"
              />
              <label htmlFor="remember" className="text-[14px] text-[#6B7280]">
                Remember this device for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-60 text-white font-semibold text-[15px] rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-200"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing In...
                </>
              ) : (
                <>Sign In to Workspace →</>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-[13px] text-[#6B7280]">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[#7C3AED] font-medium hover:text-[#6D28D9] transition-colors">
              Start free trial
            </Link>
          </p>

          <p className="mt-4 text-center text-[11px] text-[#9CA3AF]">
            Demo: demo@proposalstudio.com / demo1234
          </p>
        </div>
      </div>

      {/* Right Panel - Product Preview */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 bg-white/60">
        {/* Stats Cards */}
        <div className="w-full max-w-[480px]">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-sm flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#EDE9FE] flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-[#7C3AED]" />
              </div>
              <div>
                <p className="text-[18px] font-bold text-[#111827]">$14.2M+</p>
                <p className="text-[11px] text-[#6B7280]">Proposals sent</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-sm flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-[#059669]" />
              </div>
              <div>
                <p className="text-[18px] font-bold text-[#111827]">99.4%</p>
                <p className="text-[11px] text-[#6B7280]">Delivery rate</p>
              </div>
            </div>
          </div>

          {/* Proposal Card Preview */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-semibold text-[#9CA3AF] tracking-widest uppercase mb-1">
                  Proposal #PR-2025-084
                </p>
                <h3 className="text-[17px] font-bold text-[#111827]">Design & Architecture Retainer</h3>
                <p className="text-[13px] text-[#6B7280] mt-0.5">Client: Studio Mono Global Inc.</p>
              </div>
              <span className="px-2.5 py-1 bg-[#ECFDF5] text-[#047857] text-[11px] font-semibold rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Signed & Approved
              </span>
            </div>

            {/* Pricing Table */}
            <div className="rounded-lg border border-[#E5E7EB] overflow-hidden mb-4">
              <div className="bg-[#F8FAFC] px-4 py-2 grid grid-cols-2">
                <span className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Milestone Scope</span>
                <span className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider text-right">Investment</span>
              </div>
              {[
                { label: "Phase 1: Design Systems Architecture", value: "$42,500.00" },
                { label: "Phase 2: Platform Engine Development", value: "$86,000.00" },
                { label: "Phase 3: Executive Handoff & Governance", value: "$20,000.00" },
              ].map((row, i) => (
                <div key={i} className="px-4 py-2.5 grid grid-cols-2 border-t border-[#E5E7EB]">
                  <span className="text-[13px] text-[#111827]">{row.label}</span>
                  <span className="text-[13px] text-[#111827] text-right font-medium">{row.value}</span>
                </div>
              ))}
              <div className="px-4 py-3 border-t border-[#E5E7EB] bg-white grid grid-cols-2">
                <span className="text-[14px] font-bold text-[#111827]">Total Contract Value</span>
                <span className="text-[17px] font-bold text-[#7C3AED] text-right">$148,500.00</span>
              </div>
            </div>

            {/* Signature */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#7C3AED] flex items-center justify-center text-white text-[13px] font-bold">
                MV
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[#111827]">Marcus Vance</p>
                <p className="text-[11px] text-[#6B7280]">Authorized Signature (Docusign Secured)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
