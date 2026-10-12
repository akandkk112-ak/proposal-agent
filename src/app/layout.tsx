import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Proposal Studio",
    template: "%s | Proposal Studio",
  },
  description:
    "Create, manage, and send high-converting client proposals with AI-powered tools.",
  keywords: ["proposal", "SaaS", "client management", "PDF export"],
  authors: [{ name: "Proposal Studio" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-[#F8FAFC] text-[#111827]">
        {children}
      </body>
    </html>
  );
}
