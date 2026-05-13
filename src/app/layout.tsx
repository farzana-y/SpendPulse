import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpendPulse — Free AI Spend Audit",
  description:
    "Find out exactly where you're overspending on AI tools like Cursor, ChatGPT, Claude, and GitHub Copilot — and what to do about it.",
  openGraph: {
    title: "SpendPulse — Free AI Spend Audit",
    description:
      "Find out exactly where you're overspending on AI tools. Instant results, no login required.",
    url: "https://spend-pulse.vercel.app",
    siteName: "SpendPulse",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpendPulse — Free AI Spend Audit",
    description:
      "Find out exactly where you're overspending on AI tools. Instant results, no login required.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
