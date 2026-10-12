"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push("/login?registered=true");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#F1F3FF" }}>
      <div className="w-full max-w-[440px] p-8">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#7C3AED] flex items-center justify-center shadow-lg shadow-purple-200">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="14,2 14,8 20,8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 className="text-[17px] font-bold text-[#111827]">Proposal Studio</h1>
            <p className="text-[11px] font-semibold text-[#7C3AED] tracking-widest uppercase">Enterprise</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm">
          <h2 className="text-[24px] font-bold text-[#111827] mb-1">Create your account</h2>
          <p className="text-[14px] text-[#6B7280] mb-6">Start your 14-day free trial. No credit card required.</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-[13px] text-red-700">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[14px] font-medium text-[#111827] mb-1.5">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full h-10 px-3 rounded-lg border border-[#E5E7EB] text-[14px] bg-white"
                placeholder="Elena Vance"
              />
            </div>
            <div>
              <label className="block text-[14px] font-medium text-[#111827] mb-1.5">Work email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-10 px-3 rounded-lg border border-[#E5E7EB] text-[14px] bg-white"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className="block text-[14px] font-medium text-[#111827] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full h-10 px-3 pr-10 rounded-lg border border-[#E5E7EB] text-[14px] bg-white"
                  placeholder="Min. 8 characters"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-60 text-white font-semibold rounded-lg transition-all"
            >
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>

          <p className="mt-4 text-center text-[13px] text-[#6B7280]">
            Already have an account?{" "}
            <Link href="/login" className="text-[#7C3AED] font-medium hover:text-[#6D28D9]">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
